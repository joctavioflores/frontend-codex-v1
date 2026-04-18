import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../api/products';
import { useAuth } from '../auth/useAuth';
import { ProductForm } from '../products/ProductForm';
import type {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from '../types/products';
import type { ApiErrorResponse } from '../types/api';

const PAGE_SIZE = 5;

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const maybeAxiosError = error as {
    response?: { data?: ApiErrorResponse };
  };

  return maybeAxiosError.response?.data?.message ?? fallbackMessage;
};

export const ProductsPage = () => {
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [productBeingEdited, setProductBeingEdited] = useState<Product | null>(null);
  const [formResetVersion, setFormResetVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(startIndex, startIndex + PAGE_SIZE);

  const loadProducts = async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const response = await getProducts();
      setProducts(response);
      setCurrentPage(1);
    } catch (error) {
      setFetchError(
        getErrorMessage(error, 'No fue posible cargar los productos.'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts().catch(() => {
      // El error ya se maneja en loadProducts.
    });
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleCreate = async (payload: CreateProductPayload) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    setActionError(null);

    try {
      const createdProduct = await createProduct(payload);
      setProducts((prev) => [createdProduct, ...prev]);
      setCurrentPage(1);
      setFormResetVersion((prev) => prev + 1);
      setSuccessMessage('Producto creado correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible crear el producto.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    productId: number,
    payload: UpdateProductPayload,
  ) => {
    if (!Object.keys(payload).length) {
      setSuccessMessage('No hay cambios para guardar.');
      setActionError(null);
      setProductBeingEdited(null);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    setActionError(null);

    try {
      const updatedProduct = await updateProduct(productId, payload);
      setProducts((prev) =>
        prev.map((product) => (product.id === productId ? updatedProduct : product)),
      );
      setProductBeingEdited(null);
      setSuccessMessage('Producto actualizado correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible actualizar el producto.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `¿Deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    setSuccessMessage(null);
    setActionError(null);

    try {
      await deleteProduct(product.id);
      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      setProductBeingEdited((current) =>
        current?.id === product.id ? null : current,
      );
      setSuccessMessage('Producto eliminado correctamente.');
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'No fue posible eliminar el producto.'),
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <main>
      <header>
        <h1>Productos</h1>
        <p>Administra el catálogo consumiendo el endpoint `/api/v1/products`.</p>
        <nav aria-label="Navegación principal">
          <Link to="/profile">Perfil</Link>{' '}
          <Link to="/quotes">Cotizaciones</Link>{' '}
          <button type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </nav>
      </header>

      <ProductForm
        formResetVersion={formResetVersion}
        isSubmitting={isSubmitting}
        onCancelEdit={() => setProductBeingEdited(null)}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        productBeingEdited={productBeingEdited}
      />

      {successMessage && <p role="status">{successMessage}</p>}
      {actionError && <p role="alert">{actionError}</p>}

      <section aria-labelledby="products-list-title">
        <h2 id="products-list-title">Listado</h2>

        <button type="button" onClick={() => loadProducts()} disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Recargar'}
        </button>

        {isLoading && <p>Cargando productos...</p>}
        {fetchError && <p role="alert">{fetchError}</p>}

        {!isLoading && !fetchError && !paginatedProducts.length && (
          <p>No hay productos registrados.</p>
        )}

        {!isLoading && !fetchError && paginatedProducts.length > 0 && (
          <>
            <ul aria-label="Lista de productos">
              {paginatedProducts.map((product) => (
                <li key={product.id}>
                  <article>
                    <h3>{product.name}</h3>
                    <p>SKU: {product.sku}</p>
                    <p>{product.description || 'Sin descripción'}</p>
                    <p>
                      Precio: {product.price} {product.currency}
                    </p>
                    <p>ID: {product.id}</p>

                    <button
                      type="button"
                      onClick={() => setProductBeingEdited(product)}
                      disabled={deletingProductId === product.id || isSubmitting}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      disabled={deletingProductId === product.id}
                    >
                      {deletingProductId === product.id
                        ? 'Eliminando...'
                        : 'Eliminar'}
                    </button>
                  </article>
                </li>
              ))}
            </ul>

            <nav aria-label="Paginación de productos">
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
