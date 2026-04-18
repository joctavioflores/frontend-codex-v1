import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProducts } from '../api/products';
import {
  createQuote,
  deleteQuote,
  getQuotePdf,
  getQuotes,
  updateQuote,
} from '../api/quotes';
import { useAuth } from '../auth/useAuth';
import { QuoteForm } from '../quotes/QuoteForm';
import type { ApiErrorResponse } from '../types/api';
import type { Product } from '../types/products';
import type {
  CreateQuotePayload,
  Quote,
  UpdateQuotePayload,
} from '../types/quotes';

const PAGE_SIZE = 5;

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const maybeAxiosError = error as {
    response?: { data?: ApiErrorResponse };
  };

  return maybeAxiosError.response?.data?.message ?? fallbackMessage;
};

const formatAmount = (amount: number, currency: string): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

const buildPdfFilename = (quote: Quote): string => {
  return `cotizacion-${quote.id}.pdf`;
};

const openBlobInNewTab = (blob: Blob): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export const QuotesPage = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [quoteBeingEdited, setQuoteBeingEdited] = useState<Quote | null>(null);
  const [formResetVersion, setFormResetVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingQuoteId, setDeletingQuoteId] = useState<string | null>(null);
  const [pdfActionQuoteId, setPdfActionQuoteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(quotes.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedQuotes = quotes.slice(startIndex, startIndex + PAGE_SIZE);

  const loadData = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const [productsResponse, quotesResponse] = await Promise.all([
        getProducts(),
        getQuotes(),
      ]);
      setProducts(productsResponse);
      setQuotes(quotesResponse);
      setCurrentPage(1);
    } catch (error) {
      setFetchError(
        getErrorMessage(
          error,
          'No fue posible cargar los productos y cotizaciones.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData().catch(() => {
      // El error ya se maneja en loadData.
    });
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCreate = async (payload: CreateQuotePayload) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setActionError(null);

    try {
      const createdQuote = await createQuote(payload);
      setQuotes((prev) => [createdQuote, ...prev]);
      setCurrentPage(1);
      setFormResetVersion((prev) => prev + 1);
      setSuccessMessage('Cotización creada correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible crear la cotización.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    quoteId: string,
    payload: UpdateQuotePayload,
  ) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setActionError(null);

    try {
      const updatedQuote = await updateQuote(quoteId, payload);
      setQuotes((prev) =>
        prev.map((quote) => (quote.id === quoteId ? updatedQuote : quote)),
      );
      setQuoteBeingEdited(null);
      setSuccessMessage('Cotización actualizada correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible actualizar la cotización.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (quote: Quote) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar la cotización de "${quote.customerName}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingQuoteId(quote.id);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await deleteQuote(quote.id);
      setQuotes((prev) => prev.filter((item) => item.id !== quote.id));
      setQuoteBeingEdited((current) => (current?.id === quote.id ? null : current));
      setSuccessMessage('Cotización eliminada correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible eliminar la cotización.'),
      );
    } finally {
      setDeletingQuoteId(null);
    }
  };

  const handlePdfAction = async (quote: Quote, mode: 'view' | 'download') => {
    setPdfActionQuoteId(quote.id);
    setSuccessMessage(null);
    setActionError(null);

    try {
      const blob = await getQuotePdf(quote.id);

      if (mode === 'view') {
        openBlobInNewTab(blob);
        setSuccessMessage('PDF abierto en una nueva pestaña.');
      } else {
        downloadBlob(blob, buildPdfFilename(quote));
        setSuccessMessage('PDF descargado correctamente.');
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible obtener el PDF de la cotización.'),
      );
    } finally {
      setPdfActionQuoteId(null);
    }
  };

  return (
    <main>
      <header>
        <h1>Cotizaciones</h1>
        <p>
          Administra cotizaciones comerciales consumiendo `/quotes` y `/quotes/{'{id}'}/pdf`.
        </p>
        <nav aria-label="Navegación principal">
          <Link to="/profile">Perfil</Link>{' '}
          <Link to="/products">Productos</Link>{' '}
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      {!isLoading && !products.length && (
        <p role="alert">
          Necesitas productos registrados para crear cotizaciones.
        </p>
      )}

      <QuoteForm
        formResetVersion={formResetVersion}
        isSubmitting={isSubmitting}
        onCancelEdit={() => setQuoteBeingEdited(null)}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        products={products}
        quoteBeingEdited={quoteBeingEdited}
      />

      {successMessage && <p role="status">{successMessage}</p>}
      {actionError && <p role="alert">{actionError}</p>}

      <section aria-labelledby="quotes-list-title">
        <h2 id="quotes-list-title">Listado</h2>

        <button type="button" onClick={() => loadData()} disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Recargar'}
        </button>

        {isLoading && <p>Cargando cotizaciones...</p>}
        {fetchError && <p role="alert">{fetchError}</p>}

        {!isLoading && !fetchError && !paginatedQuotes.length && (
          <p>No hay cotizaciones registradas.</p>
        )}

        {!isLoading && !fetchError && paginatedQuotes.length > 0 && (
          <>
            <ul aria-label="Lista de cotizaciones">
              {paginatedQuotes.map((quote) => (
                <li key={quote.id}>
                  <article>
                    <h3>{quote.customerName}</h3>
                    <p>Correo: {quote.customerEmail || 'No especificado'}</p>
                    <p>Productos: {quote.items.length}</p>
                    <p>Total: {formatAmount(quote.total, quote.currency)}</p>
                    {quote.notes && <p>Notas: {quote.notes}</p>}
                    <p>ID: {quote.id}</p>

                    <button
                      type="button"
                      onClick={() => setQuoteBeingEdited(quote)}
                      disabled={
                        deletingQuoteId === quote.id ||
                        pdfActionQuoteId === quote.id ||
                        isSubmitting
                      }
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePdfAction(quote, 'view')}
                      disabled={pdfActionQuoteId === quote.id}
                    >
                      {pdfActionQuoteId === quote.id ? 'Procesando PDF...' : 'Ver PDF'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePdfAction(quote, 'download')}
                      disabled={pdfActionQuoteId === quote.id}
                    >
                      Descargar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(quote)}
                      disabled={deletingQuoteId === quote.id || pdfActionQuoteId === quote.id}
                    >
                      {deletingQuoteId === quote.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </article>
                </li>
              ))}
            </ul>

            <nav aria-label="Paginación de cotizaciones">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </nav>
          </>
        )}
      </section>
    </main>
  );
};
