# Tienda Deportiva - API Backend (Entrega Final)

Proyecto de API REST profesional para gestionar productos y carritos de una tienda de artículos deportivos con MongoDB, paginación, filtros y websockets en tiempo real.

## Tecnologias
- Node.js
- Express
- MongoDB + Mongoose
- Handlebars (motor de plantillas)
- Socket.io (websockets)

## Instalacion

```bash
npm install
```

## Requisitos previos
- MongoDB corriendo en `mongodb://localhost:27017`
- Node.js v14 o superior

## Como iniciar el servidor

```bash
npm start
```

El servidor va a correr en http://localhost:8080

## Endpoints

### Productos (con paginación y filtros)

- **GET** `/api/products` - Obtener productos con paginación
  - Query params: `limit` (default 10), `page` (default 1), `sort` (asc/desc), `query` (filtro por categoría)
  - Ejemplo: `/api/products?page=1&limit=5&sort=asc&query=running`
  
- **GET** `/api/products/:pid` - Obtener un producto por ID

- **POST** `/api/products` - Crear un nuevo producto

- **PUT** `/api/products/:pid` - Actualizar un producto

- **DELETE** `/api/products/:pid` - Eliminar un producto

### Carritos

- **POST** `/api/carts` - Crear un nuevo carrito

- **GET** `/api/carts/:cid` - Obtener un carrito (con populate de productos)

- **POST** `/api/carts/:cid/product/:pid` - Agregar producto al carrito

- **PUT** `/api/carts/:cid/products/:pid` - Actualizar cantidad de un producto

- **DELETE** `/api/carts/:cid/products/:pid` - Eliminar un producto del carrito

- **PUT** `/api/carts/:cid` - Actualizar todos los productos del carrito

- **DELETE** `/api/carts/:cid` - Vaciar el carrito

## Vistas (Handlebars)

- **GET** `/` - Home con lista de productos y paginación
  - Filtros por categoría, ordenamiento por precio
  - Links a detalles del producto

- **GET** `/product/:pid` - Detalle de un producto
  - Información completa y botón para agregar al carrito

- **GET** `/cart/:cid` - Vista del carrito
  - Tabla de productos, actualizar cantidad, eliminar items
  - Total del carrito

- **GET** `/realtimeproducts` - Panel de tiempo real con websockets
  - Agregar/eliminar productos en tiempo real

## Ejemplo para crear producto

```json
{
  "title": "Zapatillas Running",
  "description": "Zapatillas para correr",
  "code": "ZAP-009",
  "price": 49990,
  "stock": 10,
  "category": "running"
}
```

## Respuesta GET /api/products

```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?page=2&limit=10"
}
```

## Estructura del proyecto

```
├── src/
│   ├── models/
│   │   ├── productModel.js
│   │   └── cartModel.js
│   ├── managers/
│   │   └── socketManager.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   ├── carts.routes.js
│   │   └── views.routes.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── home.handlebars
│   │   ├── product.handlebars
│   │   ├── cart.handlebars
│   │   └── realTimeProducts.handlebars
│   ├── public/
│   │   └── js/
│   │       └── realtime.js
│   └── app.js
├── data/
├── package.json
└── README.md
```

## Características

✅ **Paginación profesional** - Control de límite, página, con links directos
✅ **Filtros dinámicos** - Buscar por categoría
✅ **Ordenamiento** - Ascendente/descendente por precio
✅ **Populate de MongoDB** - Productos completos en carritos
✅ **Websockets** - Actualizaciones en tiempo real
✅ **Vistas dinámicas** - Handlebars con datos desde BD
✅ **Carrito persistente** - Con LocalStorage en navegador

