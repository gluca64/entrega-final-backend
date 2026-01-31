const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

let io = null;

function setIO(socketIO) {
    io = socketIO;
}

// GET / - obtener productos con paginacion, filtros y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        
        const limitNum = parseInt(limit);
        const pageNum = parseInt(page);
        // calcular cuantos documentos saltar segun la pagina
        const skip = (pageNum - 1) * limitNum;

        // armar filtro dinamico
        let filtro = {};
        if (query) {
            // buscar en categoria con regex para no ser exacto
            filtro = {
                $or: [
                    { category: { $regex: query, $options: 'i' } },
                    { status: query === 'available' ? true : query === 'unavailable' ? false : undefined }
                ]
            };
            // limpiar undefined del filtro
            if (filtro.$or[1].status === undefined) {
                filtro = { category: { $regex: query, $options: 'i' } };
            }
        }

        // ordenamiento por precio
        let ordenamiento = {};
        if (sort) {
            if (sort === 'asc') {
                ordenamiento = { price: 1 };
            } else if (sort === 'desc') {
                ordenamiento = { price: -1 };
            }
        }

        // contar total para saber cuantas paginas hay
        const totalProductos = await Product.countDocuments(filtro);
        const totalPaginas = Math.ceil(totalProductos / limitNum);

        const productos = await Product.find(filtro)
            .sort(ordenamiento)
            .limit(limitNum)
            .skip(skip);

        // validar si hay pagina anterior y siguiente
        const hasPrevPage = pageNum > 1;
        const hasNextPage = pageNum < totalPaginas;

        // armar los links para navegar entre paginas
        const prevLink = hasPrevPage ? `/api/products?page=${pageNum - 1}&limit=${limitNum}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;
        const nextLink = hasNextPage ? `/api/products?page=${pageNum + 1}&limit=${limitNum}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null;

        res.json({
            status: 'success',
            payload: productos,
            totalPages: totalPaginas,
            prevPage: hasPrevPage ? pageNum - 1 : null,
            nextPage: hasNextPage ? pageNum + 1 : null,
            page: pageNum,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// GET /:pid - obtener un producto por id
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await Product.findById(pid);

        if (!producto) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', product: producto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// POST / - crear nuevo producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, status, thumbnails } = req.body;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        // revisar que no exista el codigo
        const existe = await Product.findOne({ code });
        if (existe) {
            return res.status(400).json({ status: 'error', message: 'El codigo ya existe' });
        }

        const nuevoProducto = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            status: status !== undefined ? status : true,
            thumbnails: thumbnails || []
        });

        await nuevoProducto.save();

        // emitir por websocket
        if (io) {
            io.emit('nuevoProducto', nuevoProducto);
            io.emit('productsLoad', await Product.find());
        }

        res.status(201).json({ status: 'success', product: nuevoProducto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// PUT /:pid - actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        
        // no permitir actualizar el _id
        if (req.body._id) {
            delete req.body._id;
        }

        const productoActualizado = await Product.findByIdAndUpdate(pid, req.body, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // emitir cambio
        if (io) {
            io.emit('productsLoad', await Product.find());
        }

        res.json({ status: 'success', product: productoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// DELETE /:pid - eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const resultado = await Product.findByIdAndDelete(pid);

        if (!resultado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        // emitir cambio
        if (io) {
            io.emit('productoEliminado', pid);
            io.emit('productsLoad', await Product.find());
        }

        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
module.exports.setIO = setIO;
