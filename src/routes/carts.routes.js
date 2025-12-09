const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');

const cartManager = new CartManager();

// POST / - crear nuevo carrito
router.post('/', (req, res) => {
    try {
        const nuevoCarrito = cartManager.createCart();
        res.status(201).json({ status: 'success', cart: nuevoCarrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /:cid - obtener productos de un carrito
router.get('/:cid', (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const carrito = cartManager.getCartById(id);
        
        if (!carrito) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        res.json({ status: 'success', cart: carrito });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST /:cid/product/:pid - agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        
        const carritoActualizado = cartManager.addProductToCart(cartId, productId);
        
        if (!carritoActualizado) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        res.json({ status: 'success', cart: carritoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
