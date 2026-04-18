import type {
  QuoteCreate,
  QuoteItemCreate,
  QuoteRead,
  QuoteStatus,
  QuoteUpdate,
} from '../../generated/backend/openapi.types';
import type {
  CreateQuotePayload,
  Quote,
  QuoteItem,
  UpdateQuotePayload,
} from '../../types/quotes';

const parseDecimal = (value: string): number => {
  return Number(value);
};

const DEFAULT_QUOTE_CURRENCY = 'MXN';

const fromQuoteItemRead = (item: QuoteRead['items'][number]): QuoteItem => {
  return {
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: parseDecimal(item.unit_price),
    subtotal: parseDecimal(item.subtotal),
  };
};

const toQuoteItemCreate = (
  item: CreateQuotePayload['items'][number],
): QuoteItemCreate => {
  return {
    product_id: item.productId,
    quantity: item.quantity,
  };
};

export const fromQuoteRead = (quote: QuoteRead): Quote => {
  return {
    id: quote.id,
    folio: quote.folio,
    customerName: quote.customer_name,
    customerEmail: quote.customer_email,
    notes: quote.notes ?? undefined,
    status: quote.status ?? 'draft',
    total: parseDecimal(quote.total),
    currency: DEFAULT_QUOTE_CURRENCY,
    items: quote.items.map(fromQuoteItemRead),
  };
};

const normalizeStatus = (status?: QuoteStatus): QuoteStatus => {
  return status ?? 'draft';
};

export const toCreateQuoteRequest = (
  payload: CreateQuotePayload,
): QuoteCreate => {
  return {
    customer_name: payload.customerName.trim(),
    customer_email: payload.customerEmail.trim(),
    notes: payload.notes?.trim() || null,
    status: normalizeStatus(payload.status),
    items: payload.items.map(toQuoteItemCreate),
  };
};

export const toUpdateQuoteRequest = (
  payload: UpdateQuotePayload,
): QuoteUpdate => {
  return {
    customer_name: payload.customerName.trim(),
    customer_email: payload.customerEmail.trim(),
    notes: payload.notes?.trim() || null,
    status: normalizeStatus(payload.status),
    items: payload.items.map(toQuoteItemCreate),
  };
};
