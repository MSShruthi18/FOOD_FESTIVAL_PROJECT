const mongoose = require('mongoose');

const stallSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  sales: { type: Number, default: 0 },
  liveDemo: { type: Boolean, default: false },
  contests: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Stall', stallSchema);