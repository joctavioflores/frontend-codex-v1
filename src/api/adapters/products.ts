import type {
  ProductCreate,
  ProductRead,
  ProductUpdate,
} from '../../generated/backend/openapi.types';
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../../types/products';

const parseDecimal = (value: string): number => {
  return Number(value);
};

export const fromProductRead = (product: ProductRead): Product => {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description ?? undefined,
    price: parseDecimal(product.price),
    currency: product.currency ?? 'MXN',
  };
};

export const toCreateProductRequest = (
  payload: CreateProductPayload,
): ProductCreate => {
  return {
    sku: payload.sku.trim(),
    name: payload.name.trim(),
    description: payload.description?.trim() || null,
    price: payload.price,
    currency: payload.currency.trim().toUpperCase(),
  };
};

export const toUpdateProductRequest = (
  payload: UpdateProductPayload,
): ProductUpdate => {
  const request: ProductUpdate = {};

  if (payload.sku !== undefined) {
    request.sku = payload.sku.trim();
  }

  if (payload.name !== undefined) {
    request.name = payload.name.trim();
  }

  if (payload.description !== undefined) {
    request.description = payload.description.trim() || null;
  }

  if (payload.price !== undefined) {
    request.price = payload.price;
  }

  if (payload.currency !== undefined) {
    request.currency = payload.currency.trim().toUpperCase();
  }

  return request;
};
