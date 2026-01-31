const mongoose = require('mongoose');

// esquema para los carritos
const cartSchema = new mongoose.Schema({
    products: [
        {
            // referencia al modelo Product para usar populate
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

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
