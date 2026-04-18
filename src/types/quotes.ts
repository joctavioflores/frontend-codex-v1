export interface Quote {
  id: string;
  author: string;
  text: string;
}

export interface CreateQuotePayload {
  author: string;
  text: string;
}
