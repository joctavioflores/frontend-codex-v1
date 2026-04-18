export interface QuoteItem {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected';

export interface Quote {
  id: number;
  folio: string;
  customerName: string;
  customerEmail: string;
  notes?: string;
  status: QuoteStatus;
  items: QuoteItem[];
  total: number;
  currency: string;
}

export interface CreateQuotePayload {
  customerName: string;
  customerEmail: string;
  notes?: string;
  status?: QuoteStatus;
  items: Array<Pick<QuoteItem, 'productId' | 'quantity'>>;
}

export interface UpdateQuotePayload {
  customerName: string;
  customerEmail: string;
  notes?: string;
  status?: QuoteStatus;
  items: Array<Pick<QuoteItem, 'productId' | 'quantity'>>;
}
