import { useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/useAuth';
import {
  validateEmail,
  validatePassword,
} from '../../auth/validation/forms';

interface LoginFormState {
  email: string;
  password: string;
  rememberSession: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ??
    '/profile';

  const [form, setForm] = useState<LoginFormState>({
    email: '',
    password: '',
    rememberSession: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    return !validateEmail(form.email) && !validatePassword(form.password);
  }, [form.email, form.password]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginFormErrors = {
      email: validateEmail(form.email) ?? undefined,
      password: validatePassword(form.password) ?? undefined,
    };

    setErrors(nextErrors);
    setSubmitError(null);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch {
      setSubmitError('No fue posible iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, email: event.target.value }));
          }}
        />
        {errors.email && <p role="alert">{errors.email}</p>}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, password: event.target.value }));
          }}
        />
        {errors.password && <p role="alert">{errors.password}</p>}

        <label htmlFor="rememberSession">
          <input
            id="rememberSession"
            name="rememberSession"
            type="checkbox"
            checked={form.rememberSession}
            onChange={(event) => {
              setForm((prev) => ({ ...prev, rememberSession: event.target.checked }));
            }}
          />
          Mantener sesión
        </label>

        {submitError && <p role="alert">{submitError}</p>}

        <button type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
    </main>
  );
};
