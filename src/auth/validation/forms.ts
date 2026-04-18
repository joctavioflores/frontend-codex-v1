const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'El email es obligatorio.';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'Ingresa un email válido.';
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password.trim()) {
    return 'La contraseña es obligatoria.';
  }

  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres.';
  }

  return null;
};

export const validateResetToken = (token: string): string | null => {
  if (!token.trim()) {
    return 'El token de recuperación es obligatorio.';
  }

  return null;
};
