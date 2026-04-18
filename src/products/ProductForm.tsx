import { useEffect, useState, type FormEvent } from 'react';

import type { Product } from '../types/products';
import {
  buildCreateProductPayload,
  buildUpdateProductPayload,
  DEFAULT_PRODUCT_FORM_VALUES,
  hasProductFormErrors,
  mapProductToFormValues,
  validateProductDescription,
  validateProductForm,
  type ProductFormErrors,
  type ProductFormValues,
} from './validation';

interface ProductFormProps {
  formResetVersion: number;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (payload: ReturnType<typeof buildCreateProductPayload>) => Promise<void>;
  onUpdate: (
    productId: number,
    payload: ReturnType<typeof buildUpdateProductPayload>,
  ) => Promise<void>;
  productBeingEdited: Product | null;
}

export const ProductForm = ({
  formResetVersion,
  isSubmitting,
  onCancelEdit,
  onSubmit,
  onUpdate,
  productBeingEdited,
}: ProductFormProps) => {
  const [values, setValues] = useState<ProductFormValues>(DEFAULT_PRODUCT_FORM_VALUES);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  useEffect(() => {
    setValues(
      productBeingEdited
        ? mapProductToFormValues(productBeingEdited)
        : DEFAULT_PRODUCT_FORM_VALUES,
    );
    setErrors({});
  }, [formResetVersion, productBeingEdited]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateProductForm(values);
    setErrors(nextErrors);

    if (hasProductFormErrors(nextErrors)) {
      return;
    }

    if (productBeingEdited) {
      const initialValues = mapProductToFormValues(productBeingEdited);
      const payload = buildUpdateProductPayload(initialValues, values);

      await onUpdate(productBeingEdited.id, payload);
      return;
    }

    await onSubmit(buildCreateProductPayload(values));
  };

  const isEditing = Boolean(productBeingEdited);

  return (
    <section aria-labelledby="product-form-title">
      <h2 id="product-form-title">
        {isEditing ? 'Editar producto' : 'Nuevo producto'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="product-sku">SKU</label>
        <input
          id="product-sku"
          name="sku"
          type="text"
          value={values.sku}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, sku: event.target.value }));
          }}
        />
        {errors.sku && <p role="alert">{errors.sku}</p>}

        <label htmlFor="product-name">Nombre</label>
        <input
          id="product-name"
          name="name"
          type="text"
          value={values.name}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, name: event.target.value }));
          }}
        />
        {errors.name && <p role="alert">{errors.name}</p>}

        <label htmlFor="product-description">Descripción</label>
        <textarea
          id="product-description"
          name="description"
          rows={4}
          value={values.description}
          onChange={(event) => {
            const nextDescription = event.target.value;

            setValues((prev) => ({ ...prev, description: nextDescription }));
            setErrors((prev) => ({
              ...prev,
              description: validateProductDescription(nextDescription) ?? undefined,
            }));
          }}
        />
        {errors.description && <p role="alert">{errors.description}</p>}

        <label htmlFor="product-price">Precio</label>
        <input
          id="product-price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          value={values.price}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, price: event.target.value }));
          }}
        />
        {errors.price && <p role="alert">{errors.price}</p>}

        <label htmlFor="product-currency">Moneda</label>
        <input
          id="product-currency"
          name="currency"
          type="text"
          maxLength={3}
          value={values.currency}
          onChange={(event) => {
            setValues((prev) => ({ ...prev, currency: event.target.value.toUpperCase() }));
          }}
        />
        {errors.currency && <p role="alert">{errors.currency}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Guardando cambios...'
              : 'Creando producto...'
            : isEditing
              ? 'Guardar cambios'
              : 'Crear producto'}
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
