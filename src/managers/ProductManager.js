const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../../data/products.json');
        this.products = [];
        this.init();
    }

    // metodo para inicializar y cargar los productos desde el archivo
    init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path, 'utf-8');
                this.products = JSON.parse(data);
            } else {
                // si no existe el archivo lo creo vacio
                this.products = [];
                this.guardarArchivo();
            }
        } catch (error) {
            console.log('Error al cargar productos:', error);
            this.products = [];
        }
    }

    // guarda los productos en el archivo json
    guardarArchivo() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log('Error al guardar:', error);
        }
    }

    // obtener todos los productos
    getProducts() {
        return this.products;
    }

    // obtener producto por id
    getProductById(id) {
        const producto = this.products.find(p => p.id === id);
        return producto;
    }

    // agregar nuevo producto
    addProduct(productData) {
        // validar que vengan todos los campos
        const { title, description, code, price, stock, category, thumbnails } = productData;
        
        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new Error('Faltan campos obligatorios');
        }

        // revisar que no se repita el code
        const existe = this.products.find(p => p.code === code);
        if (existe) {
            throw new Error('El codigo ya existe');
        }

        // generar id automatico
        let nuevoId;
        if (this.products.length === 0) {
            nuevoId = 1;
        } else {
            // busco el id mas alto y le sumo 1
            const ids = this.products.map(p => p.id);
            nuevoId = Math.max(...ids) + 1;
        }

        // crear el nuevo producto
        const nuevoProducto = {
            id: nuevoId,
            title,
            description,
            code,
            price,
            status: productData.status !== undefined ? productData.status : true,
            stock,
            category,
            thumbnails: thumbnails || []
        };

        this.products.push(nuevoProducto);
        this.guardarArchivo();
        
        return nuevoProducto;
    }

    // actualizar producto
    updateProduct(id, datosActualizar) {
        const index = this.products.findIndex(p => p.id === id);
        
        if (index === -1) {
            return null;
        }

        // no dejar actualizar el id
        if (datosActualizar.id) {
            delete datosActualizar.id;
        }

        // actualizo el producto
        this.products[index] = {
            ...this.products[index],
            ...datosActualizar
        };

        this.guardarArchivo();
        return this.products[index];
    }

    // eliminar producto
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        
        if (index === -1) {
            return false;
        }

        this.products.splice(index, 1);
        this.guardarArchivo();
        return true;
    }
}

module.exports = ProductManager;
