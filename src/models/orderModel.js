const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    items: [require('./orderItemModel')],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentInfo: {
      method: String,
      transactionId: String
    },
    shippingAddress: {
      street: String,
      city: String,
      zip: String,
      country: String
    }
  }, {
    timestamps: true
  });
  
  module.exports = mongoose.model('Order', orderSchema);
  