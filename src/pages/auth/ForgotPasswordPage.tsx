import { useState, type FormEvent } from 'react';

import { forgotPassword } from '../../api/auth';
import { validateEmail } from '../../auth/validation/forms';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailError = validateEmail(email);
    setError(emailError);
    setMessage(null);

    if (emailError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await forgotPassword({ email });
      setMessage(response.message || 'Revisa tu correo para continuar el proceso.');
    } catch {
      setMessage(null);
      setError('No fue posible procesar la solicitud. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Recuperar contraseña</h1>
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {error && <p role="alert">{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </form>
    </main>
  );
};
