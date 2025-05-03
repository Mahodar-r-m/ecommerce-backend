const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: String,
  brand: String,
  stock: {
    type: Number,
    required: true
  },
  images: [String],
}, {
  timestamps: true
});

// Create a text index on the 'name' and 'description' fields of the Product schema.
// This allows efficient full-text search queries on these fields using MongoDB's $text operator.
// Note: A collection can have only one text index, so include all searchable fields here.
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
