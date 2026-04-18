import type { Product } from './products';

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  product?: Product;
}

export interface Quote {
  id: string;
  customerName: string;
  customerEmail?: string;
  notes?: string;
  items: QuoteItem[];
  subtotal: number;
  total: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuotePayload {
  customerName: string;
  customerEmail?: string;
  notes?: string;
  items: QuoteItem[];
}

export interface UpdateQuotePayload {
  customerName: string;
  customerEmail?: string;
  notes?: string;
  items: QuoteItem[];
}
