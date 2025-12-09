const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../../data/carts.json');
        this.carts = [];
        this.init();
    }

    // cargar carritos del archivo
    init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                this.carts = [];
                this.guardarArchivo();
            }
        } catch (error) {
            console.log('Error al cargar carritos:', error);
            this.carts = [];
        }
    }

    // guardar en el archivo
    guardarArchivo() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log('Error al guardar carrito:', error);
        }
    }

    // crear nuevo carrito
    createCart() {
        // generar id
        let nuevoId;
        if (this.carts.length === 0) {
            nuevoId = 1;
        } else {
            const ids = this.carts.map(c => c.id);
            nuevoId = Math.max(...ids) + 1;
        }

        const nuevoCarrito = {
            id: nuevoId,
            products: []
        };

        this.carts.push(nuevoCarrito);
        this.guardarArchivo();

        return nuevoCarrito;
    }

    // obtener carrito por id
    getCartById(id) {
        const carrito = this.carts.find(c => c.id === id);
        return carrito;
    }

    // agregar producto al carrito
    addProductToCart(cartId, productId) {
        const carritoIndex = this.carts.findIndex(c => c.id === cartId);
        
        if (carritoIndex === -1) {
            return null;
        }

        // buscar si el producto ya esta en el carrito
        const productoEnCarrito = this.carts[carritoIndex].products.find(
            p => p.product === productId
        );

        if (productoEnCarrito) {
            // si ya existe sumar 1 a la cantidad
            productoEnCarrito.quantity += 1;
        } else {
            // si no existe agregarlo con cantidad 1
            this.carts[carritoIndex].products.push({
                product: productId,
                quantity: 1
            });
        }

        this.guardarArchivo();
        return this.carts[carritoIndex];
    }
}

module.exports = CartManager;
