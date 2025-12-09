# Tienda Deportiva - API Backend

Proyecto de API REST para gestionar productos y carritos de una tienda de articulos deportivos.

## Tecnologias
- Node.js
- Express

## Instalacion

```bash
npm install
```

## Como iniciar el servidor

```bash
npm start
```

El servidor va a correr en http://localhost:8080

## Endpoints

### Productos

- **GET** `/api/products` - Obtener todos los productos
- **GET** `/api/products/:pid` - Obtener un producto por ID
- **POST** `/api/products` - Crear un nuevo producto
- **PUT** `/api/products/:pid` - Actualizar un producto
- **DELETE** `/api/products/:pid` - Eliminar un producto

### Carritos

- **POST** `/api/carts` - Crear un nuevo carrito
- **GET** `/api/carts/:cid` - Obtener un carrito por ID
- **POST** `/api/carts/:cid/product/:pid` - Agregar producto al carrito

## Ejemplo para crear producto

```json
{
  "title": "Zapatillas Running",
  "description": "Zapatillas para correr",
  "code": "ZAP-009",
  "price": 49990,
  "stock": 10,
  "category": "running",
  "thumbnails": []
}
```

## Estructura del proyecto

```
├── src/
│   ├── managers/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/
│   │   ├── products.routes.js
│   │   └── carts.routes.js
│   └── app.js
├── data/
│   ├── products.json
│   └── carts.json
└── package.json
```
