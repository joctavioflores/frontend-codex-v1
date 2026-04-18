import type { Product } from '../types/products';
import type {
  CreateQuotePayload,
  Quote,
  UpdateQuotePayload,
} from '../types/quotes';

export interface QuoteItemFormValues {
  productId: string;
  quantity: string;
}

export interface QuoteFormValues {
  customerName: string;
  customerEmail: string;
  notes: string;
  items: QuoteItemFormValues[];
}

export interface QuoteItemPreview {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  currency: string;
}

export interface QuoteFormErrors {
  customerName?: string;
  customerEmail?: string;
  notes?: string;
  items?: string;
  itemErrors: Array<{
    productId?: string;
    quantity?: string;
  }>;
}

export const DEFAULT_QUOTE_FORM_VALUES: QuoteFormValues = {
  customerName: '',
  customerEmail: '',
  notes: '',
  items: [{ productId: '', quantity: '1' }],
};

export const createDefaultQuoteFormValues = (): QuoteFormValues => {
  return {
    customerName: DEFAULT_QUOTE_FORM_VALUES.customerName,
    customerEmail: DEFAULT_QUOTE_FORM_VALUES.customerEmail,
    notes: DEFAULT_QUOTE_FORM_VALUES.notes,
    items: DEFAULT_QUOTE_FORM_VALUES.items.map((item) => ({ ...item })),
  };
};

const MAX_CUSTOMER_NAME_LENGTH = 120;
const MAX_NOTES_LENGTH = 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateCustomerName = (value: string): string | null => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 'El nombre del cliente es obligatorio.';
  }

  if (normalizedValue.length > MAX_CUSTOMER_NAME_LENGTH) {
    return `El nombre del cliente no puede exceder ${MAX_CUSTOMER_NAME_LENGTH} caracteres.`;
  }

  return null;
};

export const validateCustomerEmail = (value: string): string | null => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  if (!EMAIL_REGEX.test(normalizedValue)) {
    return 'El correo electrónico no es válido.';
  }

  return null;
};

export const validateNotes = (value: string): string | null => {
  if (value.trim().length > MAX_NOTES_LENGTH) {
    return `Las notas no pueden exceder ${MAX_NOTES_LENGTH} caracteres.`;
  }

  return null;
};

export const validateItemQuantity = (value: string): string | null => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 'La cantidad es obligatoria.';
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isInteger(parsedValue)) {
    return 'La cantidad debe ser un número entero.';
  }

  if (parsedValue <= 0) {
    return 'La cantidad debe ser mayor a cero.';
  }

  return null;
};

export const calculateQuotePreview = (
  values: QuoteFormValues,
  products: Product[],
): QuoteItemPreview[] => {
  return values.items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    const quantity = Number(item.quantity.trim());

    if (!product || !Number.isFinite(quantity) || quantity <= 0) {
      return [];
    }

    return [
      {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        subtotal: product.price * quantity,
        currency: product.currency,
      },
    ];
  });
};

export const calculateQuoteTotal = (items: QuoteItemPreview[]): number => {
  return items.reduce((accumulator, item) => accumulator + item.subtotal, 0);
};

export const validateQuoteForm = (
  values: QuoteFormValues,
  products: Product[],
): QuoteFormErrors => {
  const selectedProductIds = new Set<string>();
  let repeatedProductDetected = false;

  const itemErrors = values.items.map((item) => {
    const productId = item.productId.trim();
    const quantityError = validateItemQuantity(item.quantity) ?? undefined;
    const productExists = products.some((product) => product.id === productId);
    const productError = !productId
      ? 'El producto es obligatorio.'
      : !productExists
        ? 'Selecciona un producto válido.'
        : undefined;

    if (productId) {
      if (selectedProductIds.has(productId)) {
        repeatedProductDetected = true;
      }

      selectedProductIds.add(productId);
    }

    return {
      productId: productError,
      quantity: quantityError,
    };
  });

  const notesError = validateNotes(values.notes);

  return {
    customerName: validateCustomerName(values.customerName) ?? undefined,
    customerEmail: validateCustomerEmail(values.customerEmail) ?? undefined,
    ...(notesError ? { notes: notesError } : {}),
    ...(values.items.length === 0
      ? { items: 'Debes agregar al menos un producto.' }
      : repeatedProductDetected
        ? { items: 'No repitas el mismo producto en la cotización.' }
        : {}),
    itemErrors,
  };
};

export const hasQuoteFormErrors = (errors: QuoteFormErrors): boolean => {
  return Boolean(
    errors.customerName ||
      errors.customerEmail ||
      errors.notes ||
      errors.items ||
      errors.itemErrors.some((item) => item.productId || item.quantity),
  );
};

export const mapQuoteToFormValues = (quote: Quote): QuoteFormValues => {
  return {
    customerName: quote.customerName,
    customerEmail: quote.customerEmail ?? '',
    notes: quote.notes ?? '',
    items: quote.items.length
      ? quote.items.map((item) => ({
          productId: item.productId,
          quantity: String(item.quantity),
        }))
      : createDefaultQuoteFormValues().items,
  };
};

const buildPayload = (
  values: QuoteFormValues,
  products: Product[],
): CreateQuotePayload => {
  const previewItems = calculateQuotePreview(values, products);

  return {
    customerName: values.customerName.trim(),
    customerEmail: values.customerEmail.trim() || undefined,
    notes: values.notes.trim() || undefined,
    items: previewItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
    })),
  };
};

export const buildCreateQuotePayload = (
  values: QuoteFormValues,
  products: Product[],
): CreateQuotePayload => {
  return buildPayload(values, products);
};

export const buildUpdateQuotePayload = (
  values: QuoteFormValues,
  products: Product[],
): UpdateQuotePayload => {
  return buildPayload(values, products);
};
