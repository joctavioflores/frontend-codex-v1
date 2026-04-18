import { describe, expect, it } from 'vitest';

import {
  validateEmail,
  validatePassword,
  validateResetToken,
} from './forms';

describe('auth form validations', () => {
  it('acepta un email válido', () => {
    expect(validateEmail('usuario@correo.com')).toBeNull();
  });

  it('rechaza un email vacío', () => {
    expect(validateEmail('')).toBe('El email es obligatorio.');
  });

  it('rechaza un password corto', () => {
    expect(validatePassword('1234567')).toBe(
      'La contraseña debe tener al menos 8 caracteres.',
    );
  });

  it('acepta un token de reseteo no vacío', () => {
    expect(validateResetToken('reset-token')).toBeNull();
  });

  it('rechaza un token vacío', () => {
    expect(validateResetToken('  ')).toBe(
      'El token de recuperación es obligatorio.',
    );
  });
});
