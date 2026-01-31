const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

// GET / - mostrar home con paginacion
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        const skip = (pageNum - 1) * limitNum;

        let filtro = {};
        if (query) {
            filtro = {
                $or: [
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
        }

        let ordenamiento = {};
        if (sort) {
            if (sort === 'asc') {
                ordenamiento = { price: 1 };
            } else if (sort === 'desc') {
                ordenamiento = { price: -1 };
            }
        }

        const totalProductos = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(totalProductos / limitNum);

        const productos = await Product.find(filtro)
            .sort(ordenamiento)
            .limit(limitNum)
            .skip(skip);

        const hasPrevPage = pageNum > 1;
        const hasNextPage = pageNum < totalPaginas;

        const prevLink = hasPrevPage ? `/?page=${pageNum - 1}&limit=${limitNum}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = hasNextPage ? `/?page=${pageNum + 1}&limit=${limitNum}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        res.render('home', {
            title: 'Tienda Deportiva',
            payload: productos,
            totalPages: totalPaginas,
            prevPage: hasPrevPage ? pageNum - 1 : null,
            nextPage: hasNextPage ? pageNum + 1 : null,
            page: pageNum,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            limit: limitNum,
            query: query || '',
            sortAsc: sort === 'asc',
            sortDesc: sort === 'desc'
        });
    } catch (error) {
        res.status(500).send('Error al cargar productos');
    }
});

// GET /product/:pid - mostrar detalle de un producto
router.get('/product/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await Product.findById(pid);

        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('product', {
            title: producto.title,
            producto: producto
        });
    } catch (error) {
        res.status(500).send('Error al cargar producto');
    }
});

// GET /cart/:cid - mostrar carrito
router.get('/cart/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = await Cart.findById(cid).populate('products.product');

        if (!carrito) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cart', {
            title: 'Mi Carrito',
            carrito: carrito
        });
    } catch (error) {
        res.status(500).send('Error al cargar carrito');
    }
});

// GET /realtimeproducts - mostrar vista de tiempo real
router.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', {
            title: 'Productos en Tiempo Real'
        });
    } catch (error) {
        res.status(500).send('Error al cargar la página');
    }
});

module.exports = router;
