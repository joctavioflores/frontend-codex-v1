import { describe, expect, it } from 'vitest';

import {
  fromForgotPasswordResponse,
  fromTokenResponse,
  fromUserRead,
  toResetPasswordRequest,
} from './auth';
import {
  fromProductRead,
  toCreateProductRequest,
  toUpdateProductRequest,
} from './products';
import { fromQuoteRead, toCreateQuoteRequest } from './quotes';

describe('api adapters', () => {
  it('mapea respuestas de autenticación al dominio del frontend', () => {
    expect(
      fromTokenResponse({
        access_token: 'token-123',
        token_type: 'bearer',
      }),
    ).toEqual({
      accessToken: 'token-123',
      tokenType: 'bearer',
    });

    expect(
      fromUserRead({
        id: 10,
        email: 'admin@example.com',
        full_name: 'Admin User',
        is_active: true,
      }),
    ).toEqual({
      id: 10,
      email: 'admin@example.com',
      name: 'Admin User',
      isActive: true,
    });

    expect(
      fromForgotPasswordResponse({
        message: 'ok',
        reset_token: 'reset-123',
      }),
    ).toEqual({
      message: 'ok',
      resetToken: 'reset-123',
    });

    expect(
      toResetPasswordRequest({
        token: 'reset-123',
        password: 'new-password',
      }),
    ).toEqual({
      token: 'reset-123',
      new_password: 'new-password',
    });
  });

  it('mapea productos entre backend y dominio', () => {
    expect(
      fromProductRead({
        id: 5,
        sku: 'SKU-5',
        name: 'Monitor',
        description: null,
        price: '1999.90',
        currency: 'MXN',
      }),
    ).toEqual({
      id: 5,
      sku: 'SKU-5',
      name: 'Monitor',
      description: undefined,
      price: 1999.9,
      currency: 'MXN',
    });

    expect(
      toCreateProductRequest({
        sku: ' sku-1 ',
        name: ' Producto ',
        description: ' Detalle ',
        price: 100,
        currency: ' usd ',
      }),
    ).toEqual({
      sku: 'sku-1',
      name: 'Producto',
      description: 'Detalle',
      price: 100,
      currency: 'USD',
    });

    expect(
      toUpdateProductRequest({
        sku: ' sku-2 ',
        currency: ' mxn ',
      }),
    ).toEqual({
      sku: 'sku-2',
      currency: 'MXN',
    });
  });

  it('mapea cotizaciones entre backend y dominio', () => {
    expect(
      fromQuoteRead({
        id: 7,
        folio: 'COT-0007',
        customer_name: 'Acme',
        customer_email: 'compras@acme.com',
        notes: null,
        status: 'sent',
        total: '2500.00',
        items: [
          {
            id: 1,
            product_id: 2,
            product_name: 'Mouse',
            quantity: 5,
            unit_price: '500.00',
            subtotal: '2500.00',
          },
        ],
      }),
    ).toEqual({
      id: 7,
      folio: 'COT-0007',
      customerName: 'Acme',
      customerEmail: 'compras@acme.com',
      notes: undefined,
      status: 'sent',
      total: 2500,
      currency: 'MXN',
      items: [
        {
          id: 1,
          productId: 2,
          productName: 'Mouse',
          quantity: 5,
          unitPrice: 500,
          subtotal: 2500,
        },
      ],
    });

    expect(
      toCreateQuoteRequest({
        customerName: ' Acme ',
        customerEmail: ' compras@acme.com ',
        notes: ' Entrega inmediata ',
        items: [
          {
            productId: 2,
            quantity: 3,
          },
        ],
      }),
    ).toEqual({
      customer_name: 'Acme',
      customer_email: 'compras@acme.com',
      notes: 'Entrega inmediata',
      status: 'draft',
      items: [
        {
          product_id: 2,
          quantity: 3,
        },
      ],
    });
  });
});
