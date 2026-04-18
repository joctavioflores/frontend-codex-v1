import { describe, expect, it } from 'vitest';

import {
  buildCreateProductPayload,
  buildUpdateProductPayload,
  DEFAULT_PRODUCT_FORM_VALUES,
  hasProductFormErrors,
  mapProductToFormValues,
  validateProductCurrency,
  validateProductForm,
  validateProductPrice,
} from './validation';

describe('product validation', () => {
  it('acepta un formulario válido', () => {
    expect(
      validateProductForm({
        name: 'Laptop Pro',
        description: 'Equipo para desarrollo',
        price: '12999.99',
        currency: 'mxn',
      }),
    ).toEqual({
      name: undefined,
      price: undefined,
      currency: undefined,
    });
  });

  it('rechaza precio vacío', () => {
    expect(validateProductPrice('')).toBe('El precio es obligatorio.');
  });

  it('rechaza precio negativo', () => {
    expect(validateProductPrice('-5')).toBe('El precio no puede ser negativo.');
  });

  it('rechaza moneda con formato inválido', () => {
    expect(validateProductCurrency('peso')).toBe(
      'La moneda debe usar un código ISO de 3 letras.',
    );
  });

  it('detecta errores en un formulario incompleto', () => {
    expect(
      hasProductFormErrors(
        validateProductForm({
          ...DEFAULT_PRODUCT_FORM_VALUES,
          description: 'x'.repeat(10),
        }),
      ),
    ).toBe(true);
  });

  it('mapea producto a valores de formulario', () => {
    expect(
      mapProductToFormValues({
        id: 'p-1',
        name: 'Mouse',
        description: undefined,
        price: 299.5,
        currency: 'MXN',
      }),
    ).toEqual({
      name: 'Mouse',
      description: '',
      price: '299.5',
      currency: 'MXN',
    });
  });

  it('normaliza payload de creación', () => {
    expect(
      buildCreateProductPayload({
        name: '  Teclado  ',
        description: '  Mecánico  ',
        price: ' 1599 ',
        currency: ' usd ',
      }),
    ).toEqual({
      name: 'Teclado',
      description: 'Mecánico',
      price: 1599,
      currency: 'USD',
    });
  });

  it('incluye solo campos modificados en actualización', () => {
    expect(
      buildUpdateProductPayload(
        {
          name: 'Monitor',
          description: '',
          price: '200',
          currency: 'USD',
        },
        {
          name: 'Monitor',
          description: '27 pulgadas',
          price: '250',
          currency: 'USD',
        },
      ),
    ).toEqual({
      description: '27 pulgadas',
      price: 250,
    });
  });
});
