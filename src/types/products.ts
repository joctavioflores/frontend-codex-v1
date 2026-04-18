export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
}

export interface CreateProductPayload {
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
}

export interface UpdateProductPayload {
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
}
