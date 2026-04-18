import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../types/products';

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  currency: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  currency?: string;
}

export const DEFAULT_PRODUCT_FORM_VALUES: ProductFormValues = {
  name: '',
  description: '',
  price: '',
  currency: '',
};

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

export const validateProductName = (value: string): string | null => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 'El nombre es obligatorio.';
  }

  if (normalizedValue.length > MAX_NAME_LENGTH) {
    return `El nombre no puede exceder ${MAX_NAME_LENGTH} caracteres.`;
  }

  return null;
};

export const validateProductDescription = (value: string): string | null => {
  if (value.trim().length > MAX_DESCRIPTION_LENGTH) {
    return `La descripción no puede exceder ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }

  return null;
};

export const validateProductPrice = (value: string): string | null => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 'El precio es obligatorio.';
  }

  const parsedValue = Number(normalizedValue);

  if (Number.isNaN(parsedValue)) {
    return 'El precio debe ser numérico.';
  }

  if (parsedValue < 0) {
    return 'El precio no puede ser negativo.';
  }

  return null;
};

export const validateProductCurrency = (value: string): string | null => {
  const normalizedValue = value.trim().toUpperCase();

  if (!normalizedValue) {
    return 'La moneda es obligatoria.';
  }

  if (!/^[A-Z]{3}$/.test(normalizedValue)) {
    return 'La moneda debe usar un código ISO de 3 letras.';
  }

  return null;
};

export const validateProductForm = (
  values: ProductFormValues,
): ProductFormErrors => {
  const descriptionError = validateProductDescription(values.description);

  return {
    name: validateProductName(values.name) ?? undefined,
    price: validateProductPrice(values.price) ?? undefined,
    currency: validateProductCurrency(values.currency) ?? undefined,
    ...(descriptionError ? { description: descriptionError } : {}),
  };
};

export const hasProductFormErrors = (errors: ProductFormErrors): boolean => {
  return Object.values(errors).some(Boolean);
};

export const mapProductToFormValues = (product: Product): ProductFormValues => {
  return {
    name: product.name,
    description: product.description ?? '',
    price: String(product.price),
    currency: product.currency,
  };
};

const buildBasePayload = (
  values: ProductFormValues,
): CreateProductPayload => {
  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    price: Number(values.price.trim()),
    currency: values.currency.trim().toUpperCase(),
  };
};

export const buildCreateProductPayload = (
  values: ProductFormValues,
): CreateProductPayload => {
  return buildBasePayload(values);
};

export const buildUpdateProductPayload = (
  initialValues: ProductFormValues,
  values: ProductFormValues,
): UpdateProductPayload => {
  const initialPayload = buildBasePayload(initialValues);
  const nextPayload = buildBasePayload(values);
  const payload: UpdateProductPayload = {};

  if (initialPayload.name !== nextPayload.name) {
    payload.name = nextPayload.name;
  }

  if (initialPayload.description !== nextPayload.description) {
    payload.description = nextPayload.description;
  }

  if (initialPayload.price !== nextPayload.price) {
    payload.price = nextPayload.price;
  }

  if (initialPayload.currency !== nextPayload.currency) {
    payload.currency = nextPayload.currency;
  }

  return payload;
};
