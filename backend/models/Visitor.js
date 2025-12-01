const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stallsVisited: { type: Number, default: 0 },
  dishesRated: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);