import { useEffect } from 'react';

import { useAuth } from '../auth/useAuth';

export const ProfilePage = () => {
  const { user, logout, refreshProfile } = useAuth();

  useEffect(() => {
    refreshProfile().catch(() => {
      // El manejo de 401 y limpieza de sesión ocurre en el interceptor.
    });
  }, [refreshProfile]);

  return (
    <main>
      <h1>Perfil</h1>
      <p>
        <strong>Nombre:</strong> {user?.name}
      </p>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>

      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  );
};
