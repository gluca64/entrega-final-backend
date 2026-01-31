const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// POST / - crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const nuevoCarrito = new Cart({
            products: []
        });

        await nuevoCarrito.save();
        res.status(201).json({ status: 'success', cart: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /:cid - obtener carrito con populate de productos
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        
        const carrito = await Cart.findById(cid).populate('products.product');
        
        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        res.json({ status: 'success', cart: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST /:cid/product/:pid - agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        
        // verificar que el producto exista
        const producto = await Product.findById(pid);
        if (!producto) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // buscar el carrito
        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // verificar si el producto ya esta en el carrito
        const productoEnCarrito = carrito.products.find(p => p.product.toString() === pid);

        if (productoEnCarrito) {
            // si existe, aumentar cantidad
            productoEnCarrito.quantity += 1;
        } else {
            // si no existe, agregarlo
            carrito.products.push({
                product: pid,
                quantity: 1
            });
        }

        await carrito.save();
        const carritoActualizado = await Cart.findById(cid).populate('products.product');
        
        res.json({ status: 'success', cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:cid/products/:pid - eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // eliminar el producto
        carrito.products = carrito.products.filter(p => p.product.toString() !== pid);
        await carrito.save();

        const carritoActualizado = await Cart.findById(cid).populate('products.product');
        res.json({ status: 'success', cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /:cid - actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'products debe ser un arreglo' });
        }

        const carrito = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate('products.product');

        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', cart: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /:cid/products/:pid - actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ status: 'error', message: 'quantity debe ser un número positivo' });
        }

        const carrito = await Cart.findById(cid);
        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productoEnCarrito = carrito.products.find(p => p.product.toString() === pid);
        if (!productoEnCarrito) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        productoEnCarrito.quantity = quantity;
        await carrito.save();

        const carritoActualizado = await Cart.findById(cid).populate('products.product');
        res.json({ status: 'success', cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:cid - eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const carrito = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });

        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Carrito vaciado', cart: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
