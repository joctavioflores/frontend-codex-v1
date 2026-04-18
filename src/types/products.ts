export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  currency: string;
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
}
