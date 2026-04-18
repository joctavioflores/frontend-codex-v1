import { useEffect, useState, type FormEvent } from 'react';

import type { Product } from '../types/products';
import type { Quote } from '../types/quotes';
import {
  buildCreateQuotePayload,
  buildUpdateQuotePayload,
  calculateQuotePreview,
  calculateQuoteTotal,
  createDefaultQuoteFormValues,
  hasQuoteFormErrors,
  mapQuoteToFormValues,
  validateCustomerEmail,
  validateCustomerName,
  validateItemQuantity,
  validateNotes,
  validateQuoteForm,
  type QuoteFormErrors,
  type QuoteFormValues,
} from './validation';

interface QuoteFormProps {
  formResetVersion: number;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (payload: ReturnType<typeof buildCreateQuotePayload>) => Promise<void>;
  onUpdate: (
    quoteId: string,
    payload: ReturnType<typeof buildUpdateQuotePayload>,
  ) => Promise<void>;
  products: Product[];
  quoteBeingEdited: Quote | null;
}

export const QuoteForm = ({
  formResetVersion,
  isSubmitting,
  onCancelEdit,
  onSubmit,
  onUpdate,
  products,
  quoteBeingEdited,
}: QuoteFormProps) => {
  const [values, setValues] = useState<QuoteFormValues>(createDefaultQuoteFormValues);
  const [errors, setErrors] = useState<QuoteFormErrors>({ itemErrors: [] });

  useEffect(() => {
    setValues(
      quoteBeingEdited
        ? mapQuoteToFormValues(quoteBeingEdited)
        : createDefaultQuoteFormValues(),
    );
    setErrors({ itemErrors: [] });
  }, [formResetVersion, quoteBeingEdited]);

  const previewItems = calculateQuotePreview(values, products);
  const total = calculateQuoteTotal(previewItems);
  const currency = previewItems[0]?.currency ?? products[0]?.currency ?? 'MXN';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateQuoteForm(values, products);
    setErrors(nextErrors);

    if (hasQuoteFormErrors(nextErrors)) {
      return;
    }

    if (quoteBeingEdited) {
      await onUpdate(quoteBeingEdited.id, buildUpdateQuotePayload(values, products));
      return;
    }

    await onSubmit(buildCreateQuotePayload(values, products));
  };

  const isEditing = Boolean(quoteBeingEdited);

  return (
    <section aria-labelledby="quote-form-title">
      <h2 id="quote-form-title">
        {isEditing ? 'Editar cotización' : 'Nueva cotización'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="quote-customer-name">Cliente</label>
        <input
          id="quote-customer-name"
          name="customerName"
          type="text"
          value={values.customerName}
          onChange={(event) => {
            const nextValue = event.target.value;

            setValues((prev) => ({ ...prev, customerName: nextValue }));
            setErrors((prev) => ({
              ...prev,
              customerName: validateCustomerName(nextValue) ?? undefined,
            }));
          }}
        />
        {errors.customerName && <p role="alert">{errors.customerName}</p>}

        <label htmlFor="quote-customer-email">Correo electrónico</label>
        <input
          id="quote-customer-email"
          name="customerEmail"
          type="email"
          value={values.customerEmail}
          onChange={(event) => {
            const nextValue = event.target.value;

            setValues((prev) => ({ ...prev, customerEmail: nextValue }));
            setErrors((prev) => ({
              ...prev,
              customerEmail: validateCustomerEmail(nextValue) ?? undefined,
            }));
          }}
        />
        {errors.customerEmail && <p role="alert">{errors.customerEmail}</p>}

        <label htmlFor="quote-notes">Notas</label>
        <textarea
          id="quote-notes"
          name="notes"
          rows={4}
          value={values.notes}
          onChange={(event) => {
            const nextValue = event.target.value;

            setValues((prev) => ({ ...prev, notes: nextValue }));
            setErrors((prev) => ({
              ...prev,
              notes: validateNotes(nextValue) ?? undefined,
            }));
          }}
        />
        {errors.notes && <p role="alert">{errors.notes}</p>}

        <fieldset>
          <legend>Productos</legend>
          {errors.items && <p role="alert">{errors.items}</p>}

          {values.items.map((item, index) => {
            const itemError = errors.itemErrors[index] ?? {};
            const previewItem = previewItems.find(
              (candidate) => candidate.productId === item.productId,
            );

            return (
              <div key={`${index}-${item.productId || 'empty'}`}>
                <label htmlFor={`quote-item-product-${index}`}>Producto</label>
                <select
                  id={`quote-item-product-${index}`}
                  value={item.productId}
                  onChange={(event) => {
                    const nextProductId = event.target.value;

                    setValues((prev) => ({
                      ...prev,
                      items: prev.items.map((currentItem, currentIndex) =>
                        currentIndex === index
                          ? { ...currentItem, productId: nextProductId }
                          : currentItem,
                      ),
                    }));
                  }}
                >
                  <option value="">Selecciona un producto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.price} {product.currency})
                    </option>
                  ))}
                </select>
                {itemError.productId && <p role="alert">{itemError.productId}</p>}

                <label htmlFor={`quote-item-quantity-${index}`}>Cantidad</label>
                <input
                  id={`quote-item-quantity-${index}`}
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity}
                  onChange={(event) => {
                    const nextValue = event.target.value;

                    setValues((prev) => ({
                      ...prev,
                      items: prev.items.map((currentItem, currentIndex) =>
                        currentIndex === index
                          ? { ...currentItem, quantity: nextValue }
                          : currentItem,
                      ),
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      itemErrors: prev.itemErrors.map((currentError, currentIndex) =>
                        currentIndex === index
                          ? {
                              ...currentError,
                              quantity: validateItemQuantity(nextValue) ?? undefined,
                            }
                          : currentError,
                      ),
                    }));
                  }}
                />
                {itemError.quantity && <p role="alert">{itemError.quantity}</p>}

                <button
                  type="button"
                  onClick={() => {
                    setValues((prev) => ({
                      ...prev,
                      items:
                        prev.items.length === 1
                          ? prev.items
                          : prev.items.filter((_, currentIndex) => currentIndex !== index),
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      itemErrors: prev.itemErrors.filter(
                        (_, currentIndex) => currentIndex !== index,
                      ),
                    }));
                  }}
                  disabled={values.items.length === 1}
                >
                  Eliminar producto
                </button>

                {previewItem && (
                  <p>
                    Subtotal: {previewItem.subtotal.toFixed(2)} {previewItem.currency}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setValues((prev) => ({
                ...prev,
                items: [...prev.items, { productId: '', quantity: '1' }],
              }));
              setErrors((prev) => ({
                ...prev,
                itemErrors: [...prev.itemErrors, {}],
              }));
            }}
          >
            Agregar producto
          </button>
        </fieldset>

        <section aria-labelledby="quote-preview-title">
          <h3 id="quote-preview-title">Previsualización</h3>

          {!previewItems.length && <p>Selecciona productos válidos para ver el total.</p>}

          {previewItems.length > 0 && (
            <>
              <ul aria-label="Previsualización de partidas">
                {previewItems.map((item) => (
                  <li key={item.productId}>
                    {item.productName}: {item.quantity} x {item.unitPrice.toFixed(2)}{' '}
                    {item.currency} = {item.subtotal.toFixed(2)} {item.currency}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total:</strong> {total.toFixed(2)} {currency}
              </p>
            </>
          )}
        </section>

        <button type="submit" disabled={isSubmitting || !products.length}>
          {isSubmitting
            ? isEditing
              ? 'Guardando cambios...'
              : 'Creando cotización...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear cotización'}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancelEdit} disabled={isSubmitting}>
            Cancelar edición
          </button>
        )}
      </form>
    </section>
  );
};
