import { delete as remove, get, post } from './client';
import type { CreateQuotePayload, Quote } from '../types/quotes';

const QUOTES_ENDPOINT = '/quotes';

export const getQuotes = (): Promise<Quote[]> => {
  return get<Quote[]>(QUOTES_ENDPOINT);
};

export const createQuote = (payload: CreateQuotePayload): Promise<Quote> => {
  return post<Quote, CreateQuotePayload>(QUOTES_ENDPOINT, payload);
};

export const deleteQuote = (id: string): Promise<void> => {
  return remove<void>(`${QUOTES_ENDPOINT}/${id}`);
};
