const express = require('express');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');
const socketHandlers = require('./managers/socketManager');

const app = express();
const PORT = 8080;

// conectar a mongodb atlas
mongoose.connect('mongodb+srv://gldonaggio:Shi6mime@cluster0.njmncrt.mongodb.net/tiendadeportiva?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
    })
    .catch(err => {
        console.log('Error conectar a MongoDB:', err.message);
    });

// configurar handlebars con helpers
app.engine('handlebars', engine({
    helpers: {
        multiply: (a, b) => a * b,
        calcularTotal: (productos) => {
            let total = 0;
            if (productos) {
                productos.forEach(p => {
                    if (p.product) {
                        total += p.product.price * p.quantity;
                    }
                });
            }
            return total;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

// configurar socket.io
const io = require('socket.io')(server);

// pasar io a las rutas de productos
productsRouter.setIO(io);

// inicializar manejador de websockets
socketHandlers(io);

module.exports = { app, io };
