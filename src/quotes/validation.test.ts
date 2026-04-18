import { describe, expect, it } from 'vitest';

import type { Product } from '../types/products';
import {
  buildCreateQuotePayload,
  calculateQuotePreview,
  calculateQuoteTotal,
  DEFAULT_QUOTE_FORM_VALUES,
  hasQuoteFormErrors,
  mapQuoteToFormValues,
  validateCustomerEmail,
  validateQuoteForm,
} from './validation';

const products: Product[] = [
  {
    id: 1,
    sku: 'LAP-001',
    name: 'Laptop',
    description: 'Equipo portátil',
    price: 15000,
    currency: 'MXN',
  },
  {
    id: 2,
    sku: 'MOU-001',
    name: 'Mouse',
    description: 'Accesorio',
    price: 500,
    currency: 'MXN',
  },
];

describe('quote validation', () => {
  it('calcula subtotales y total para la previsualización', () => {
    const preview = calculateQuotePreview(
      {
        customerName: 'Acme',
        customerEmail: 'compras@acme.com',
        notes: '',
        items: [
          { productId: '1', quantity: '2' },
          { productId: '2', quantity: '3' },
        ],
      },
      products,
    );

    expect(preview).toEqual([
      {
        productId: 1,
        productName: 'Laptop',
        quantity: 2,
        unitPrice: 15000,
        subtotal: 30000,
        currency: 'MXN',
      },
      {
        productId: 2,
        productName: 'Mouse',
        quantity: 3,
        unitPrice: 500,
        subtotal: 1500,
        currency: 'MXN',
      },
    ]);
    expect(calculateQuoteTotal(preview)).toBe(31500);
  });

  it('rechaza correo con formato inválido', () => {
    expect(validateCustomerEmail('cliente@')).toBe(
      'El correo electrónico no es válido.',
    );
  });

  it('detecta productos repetidos', () => {
    expect(
      validateQuoteForm(
        {
          customerName: 'Acme',
          customerEmail: 'compras@acme.com',
          notes: '',
          items: [
            { productId: '1', quantity: '1' },
            { productId: '1', quantity: '2' },
          ],
        },
        products,
      ).items,
    ).toBe('No repitas el mismo producto en la cotización.');
  });

  it('detecta errores en un formulario incompleto', () => {
    expect(
      hasQuoteFormErrors(validateQuoteForm(DEFAULT_QUOTE_FORM_VALUES, products)),
    ).toBe(true);
  });

  it('normaliza payload de creación usando precios actuales del catálogo', () => {
    expect(
      buildCreateQuotePayload(
        {
          customerName: '  Acme Corp  ',
          customerEmail: '  compras@acme.com  ',
          notes: '  Entrega en 48 horas  ',
          items: [
            { productId: '1', quantity: '2' },
            { productId: '2', quantity: '1' },
          ],
        },
        products,
      ),
    ).toEqual({
      customerName: 'Acme Corp',
      customerEmail: 'compras@acme.com',
      notes: 'Entrega en 48 horas',
      status: 'draft',
      items: [
        {
          productId: 1,
          quantity: 2,
        },
        {
          productId: 2,
          quantity: 1,
        },
      ],
    });
  });

  it('mapea la cotización a valores de formulario', () => {
    expect(
      mapQuoteToFormValues({
        id: 1,
        folio: 'COT-0001',
        customerName: 'Acme',
        customerEmail: 'compras@acme.com',
        notes: undefined,
        status: 'draft',
        currency: 'MXN',
        total: 1000,
        items: [
          {
            id: 5,
            productId: 2,
            productName: 'Mouse',
            quantity: 2,
            unitPrice: 500,
            subtotal: 1000,
          },
        ],
      }),
    ).toEqual({
      customerName: 'Acme',
      customerEmail: 'compras@acme.com',
      notes: '',
      items: [{ productId: '2', quantity: '2' }],
    });
  });
});
