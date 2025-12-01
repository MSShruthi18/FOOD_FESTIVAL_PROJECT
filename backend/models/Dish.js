const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stall', required: true },
  price: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  soldBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stall' }]
}, { timestamps: true });

module.exports = mongoose.model('Dish', dishSchema);