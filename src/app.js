const express = require('express');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');

const app = express();
const PORT = 8080;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Tienda Deportiva - Servidor funcionando!');
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
