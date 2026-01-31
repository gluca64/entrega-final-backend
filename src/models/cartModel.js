const mongoose = require('mongoose');

// esquema para los carritos
const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
}, { timestamps: true });

// crear modelo
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
