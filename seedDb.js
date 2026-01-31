const mongoose = require('mongoose');
const Product = require('./src/models/productModel');

const conectar = async () => {
    try {
        await mongoose.connect('mongodb+srv://gldonaggio:Shi6mime@cluster0.njmncrt.mongodb.net/tiendadeportiva?retryWrites=true&w=majority', {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('Conectado a MongoDB Atlas');
        
        // limpiar la coleccion de productos
        await Product.deleteMany({});
        console.log('✓ Productos anteriores eliminados');
        
        // productos a agregar
        const productos = [
            {
                title: "Zapatillas Nike Running Negras",
                description: "Zapatillas deportivas de alta calidad para correr, con suela de amortiguación",
                code: "ZAP-NIKE-001",
                price: 89990,
                stock: 15,
                category: "running",
                status: true,
                thumbnails: []
            },
            {
                title: "Pelota de Fútbol Profesional",
                description: "Pelota de fútbol de tamaño oficial, cuero sintético, perfecta para entrenamientos",
                code: "PELOTA-FUT-001",
                price: 34990,
                stock: 25,
                category: "futbol",
                status: true,
                thumbnails: []
            },
            {
                title: "Raqueta de Tenis Wilson",
                description: "Raqueta de tenis profesional con marco de aluminio reforzado",
                code: "RAQ-WILSON-001",
                price: 129990,
                stock: 8,
                category: "tenis",
                status: true,
                thumbnails: []
            },
            {
                title: "Guantes de Boxeo Everlast",
                description: "Guantes de boxeo de entrenamiento, acolchados y cómodos",
                code: "GUANTES-BOX-001",
                price: 44990,
                stock: 20,
                category: "boxeo",
                status: true,
                thumbnails: []
            },
            {
                title: "Bicicleta Mountain Bike",
                description: "Bicicleta de montaña con 21 velocidades, suspensión frontal",
                code: "BICI-MTB-001",
                price: 299990,
                stock: 5,
                category: "ciclismo",
                status: true,
                thumbnails: []
            },
            {
                title: "Pesas Ajustables 10kg",
                description: "Juego de pesas ajustables, ideales para entrenamiento en casa",
                code: "PESAS-10-001",
                price: 79990,
                stock: 12,
                category: "fitness",
                status: true,
                thumbnails: []
            },
            {
                title: "Camiseta Deportiva Adidas",
                description: "Camiseta transpirable para cualquier deporte, material técnico",
                code: "CAMISETA-ADIDAS-001",
                price: 24990,
                stock: 30,
                category: "ropa",
                status: true,
                thumbnails: []
            },
            {
                title: "Colchoneta Yoga Azul",
                description: "Colchoneta de yoga antideslizante, espesor 5mm",
                code: "COLCH-YOGA-001",
                price: 19990,
                stock: 18,
                category: "yoga",
                status: true,
                thumbnails: []
            },
            {
                title: "Mochila Deportiva Negra",
                description: "Mochila resistente con múltiples compartimentos",
                code: "MOCHILA-SPORT-001",
                price: 54990,
                stock: 22,
                category: "accesorios",
                status: true,
                thumbnails: []
            },
            {
                title: "Botella de Agua Térmica",
                description: "Botella aislante que mantiene la temperatura por 24 horas",
                code: "BOTELLA-TERMO-001",
                price: 29990,
                stock: 40,
                category: "accesorios",
                status: true,
                thumbnails: []
            }
        ];
        
        // insertar los productos
        await Product.insertMany(productos);
        console.log('✓ 10 productos agregados exitosamente');
        
        // mostrar resumen
        const total = await Product.countDocuments();
        console.log(`✓ Total de productos en BD: ${total}`);
        
        mongoose.connection.close();
        console.log('✓ Conexión cerrada');
        process.exit(0);
    } catch (err) {
        console.log('Error:', err.message);
        process.exit(1);
    }
};

conectar();
