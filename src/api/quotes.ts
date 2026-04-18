import { delete as remove, get, post, put, apiClient } from './client';
import type {
  CreateQuotePayload,
  Quote,
  UpdateQuotePayload,
} from '../types/quotes';

const QUOTES_ENDPOINT = '/quotes';

export const getQuotes = (): Promise<Quote[]> => {
  return get<Quote[]>(QUOTES_ENDPOINT);
};

export const createQuote = (payload: CreateQuotePayload): Promise<Quote> => {
  return post<Quote, CreateQuotePayload>(QUOTES_ENDPOINT, payload);
};

export const updateQuote = (
  id: string,
  payload: UpdateQuotePayload,
): Promise<Quote> => {
  return put<Quote, UpdateQuotePayload>(`${QUOTES_ENDPOINT}/${id}`, payload);
};

export const deleteQuote = (id: string): Promise<void> => {
  return remove<void>(`${QUOTES_ENDPOINT}/${id}`);
};

export const getQuotePdf = async (id: string): Promise<Blob> => {
  const { data } = await apiClient.get<Blob>(`${QUOTES_ENDPOINT}/${id}/pdf`, {
    responseType: 'blob',
  });

  return data;
};
