import {
  createQuoteApiV1QuotesPost,
  deleteQuoteApiV1QuotesQuoteIdDelete,
  getQuotePdfApiV1QuotesQuoteIdPdfGet,
  listQuotesApiV1QuotesGet,
  updateQuoteApiV1QuotesQuoteIdPut,
} from '../generated/backend/openapi.client';
import type {
  CreateQuotePayload,
  Quote,
  UpdateQuotePayload,
} from '../types/quotes';
import {
  fromQuoteRead,
  toCreateQuoteRequest,
  toUpdateQuoteRequest,
} from './adapters/quotes';

export const getQuotes = async (): Promise<Quote[]> => {
  const response = await listQuotesApiV1QuotesGet();
  return response.map(fromQuoteRead);
};

export const createQuote = async (payload: CreateQuotePayload): Promise<Quote> => {
  const response = await createQuoteApiV1QuotesPost(
    toCreateQuoteRequest(payload),
  );
  return fromQuoteRead(response);
};

export const updateQuote = async (
  id: number,
  payload: UpdateQuotePayload,
): Promise<Quote> => {
  const response = await updateQuoteApiV1QuotesQuoteIdPut(
    id,
    toUpdateQuoteRequest(payload),
  );
  return fromQuoteRead(response);
};

export const deleteQuote = (id: number): Promise<void> => {
  return deleteQuoteApiV1QuotesQuoteIdDelete(id);
};

export const getQuotePdf = (id: number): Promise<Blob> => {
  return getQuotePdfApiV1QuotesQuoteIdPdfGet(id);
};
