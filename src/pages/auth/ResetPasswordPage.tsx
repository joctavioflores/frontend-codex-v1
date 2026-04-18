import { useState, type FormEvent } from 'react';

import { resetPassword } from '../../api/auth';
import {
  validatePassword,
  validateResetToken,
} from '../../auth/validation/forms';

interface ResetFormErrors {
  token?: string;
  password?: string;
}

export const ResetPasswordPage = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ResetFormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ResetFormErrors = {
      token: validateResetToken(token) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };

    setErrors(nextErrors);
    setMessage(null);

    if (nextErrors.token || nextErrors.password) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({ token, password });
      setMessage(response.message || 'Contraseña actualizada correctamente.');
      setToken('');
      setPassword('');
    } catch {
      setMessage('No fue posible restablecer la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Restablecer contraseña</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="token">Token</label>
        <input
          id="token"
          name="token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        {errors.token && <p role="alert">{errors.token}</p>}

        <label htmlFor="password">Nueva contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {errors.password && <p role="alert">{errors.password}</p>}

        {message && <p>{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </main>
  );
};
