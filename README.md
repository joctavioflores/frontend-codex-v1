# Frontend CRUD de Productos

## Contexto
Este repositorio contiene una base mínima de frontend en React + TypeScript con autenticación y cliente HTTP. En esta sesión se integró un CRUD de productos consumiendo el endpoint `/products`.

## Cambios implementados
- Se agregó la pantalla protegida `ProductsPage` en `src/pages/ProductsPage.tsx`.
- Se integró una lista responsive con paginación cliente de 5 elementos por página.
- Se agregó formulario reutilizable para crear y editar productos en `src/products/ProductForm.tsx`.
- Se incorporó confirmación explícita antes de eliminar productos.
- Se manejan estados de carga, error y éxito para lectura y mutaciones.
- Se reutilizaron los tipos existentes de `src/types/products.ts` para mantener alineación con backend.
- Se agregó validación de formulario en `src/products/validation.ts` con pruebas unitarias en `src/products/validation.test.ts`.
- Se actualizó el ruteo autenticado para exponer `/products` como ruta principal.

## Supuestos técnicos
- `GET /products` responde `Product[]`.
- `POST /products` responde el `Product` creado.
- `PUT /products/:id` responde el `Product` actualizado.
- `DELETE /products/:id` responde sin body relevante.

## Validación
- Se dejaron pruebas unitarias para la lógica pura de validación y mapeo.
- No fue posible ejecutar pruebas en este workspace porque la carpeta actual no contiene `package.json` ni configuración de build/test.

## Próximas actualizaciones
Este `README.md` se seguirá complementando con cada cambio adicional solicitado en esta sesión.
