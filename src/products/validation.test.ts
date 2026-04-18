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
  validateProductSku,
} from './validation';

describe('product validation', () => {
  it('acepta un formulario válido', () => {
    expect(
      validateProductForm({
        name: 'Laptop Pro',
        description: 'Equipo para desarrollo',
        sku: 'LP-001',
        price: '12999.99',
        currency: 'mxn',
      }),
    ).toEqual({
      sku: undefined,
      name: undefined,
      price: undefined,
      currency: undefined,
    });
  });

  it('rechaza sku vacío', () => {
    expect(validateProductSku('')).toBe('El SKU es obligatorio.');
  });

  it('rechaza precio vacío', () => {
    expect(validateProductPrice('')).toBe('El precio es obligatorio.');
  });

  it('rechaza precio negativo', () => {
    expect(validateProductPrice('-5')).toBe('El precio no puede ser negativo.');
  });

  it('rechaza moneda con formato inválido', () => {
    expect(validateProductCurrency('peso')).toBe(
      'La moneda debe usar un código de 3 a 8 letras.',
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
        id: 1,
        sku: 'MSE-001',
        name: 'Mouse',
        description: undefined,
        price: 299.5,
        currency: 'MXN',
      }),
    ).toEqual({
      sku: 'MSE-001',
      name: 'Mouse',
      description: '',
      price: '299.5',
      currency: 'MXN',
    });
  });

  it('normaliza payload de creación', () => {
    expect(
      buildCreateProductPayload({
        sku: '  SKU-1  ',
        name: '  Teclado  ',
        description: '  Mecánico  ',
        price: ' 1599 ',
        currency: ' usd ',
      }),
    ).toEqual({
      sku: 'SKU-1',
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
          sku: 'MON-001',
          name: 'Monitor',
          description: '',
          price: '200',
          currency: 'USD',
        },
        {
          sku: 'MON-002',
          name: 'Monitor',
          description: '27 pulgadas',
          price: '250',
          currency: 'USD',
        },
      ),
    ).toEqual({
      sku: 'MON-002',
      description: '27 pulgadas',
      price: 250,
    });
  });
});
