import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearAccessToken,
  getAccessToken,
  getMyProfile,
  initializeAccessToken,
  login,
  setAccessToken,
  type LoginPayload,
} from '../api/auth';
import type { AuthState, AuthUser } from '../types/auth';

interface LoginInput extends LoginPayload {
  rememberSession: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginInput) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  token: null,
  user: null,
};

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>(defaultAuthState);

  const bootstrapSession = useCallback(async () => {
    const token = initializeAccessToken();

    if (!token) {
      setState({ ...defaultAuthState, isLoading: false });
      return;
    }

    try {
      const user = await getMyProfile();
      setState({
        isAuthenticated: true,
        isLoading: false,
        token,
        user,
      });
    } catch {
      clearAccessToken();
      setState({ ...defaultAuthState, isLoading: false });
    }
  }, []);

  useEffect(() => {
    bootstrapSession().catch(() => {
      setState({ ...defaultAuthState, isLoading: false });
    });

    const handleUnauthorized = () => {
      clearAccessToken();
      setState({ ...defaultAuthState, isLoading: false });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [bootstrapSession]);

  const loginUser = useCallback(async ({ rememberSession, ...payload }: LoginInput) => {
    const response = await login(payload);
    const token = response.accessToken;

    if (!token) {
      throw new Error('No se recibió token de acceso.');
    }

    setAccessToken(token, rememberSession);

    const user = await getMyProfile();

    setState({
      isAuthenticated: true,
      isLoading: false,
      token,
      user,
    });
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      user: null,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      logout();
      return;
    }

    const user: AuthUser = await getMyProfile();
    setState({
      isAuthenticated: true,
      isLoading: false,
      token,
      user,
    });
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: loginUser,
      logout,
      refreshProfile,
    }),
    [loginUser, logout, refreshProfile, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
