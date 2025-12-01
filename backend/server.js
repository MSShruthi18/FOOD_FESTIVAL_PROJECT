const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --------------------------
// MongoDB Connection (Mongoose 9+)
// --------------------------
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodFestival';

mongoose
  .connect(MONGO_URI) // no options needed in Mongoose 9+
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

// --------------------------
// Routes
// --------------------------
app.use('/api/stalls', require('./routes/stalls'));
app.use('/api/dishes', require('./routes/dishes'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/queries', require('./routes/queries'));

// --------------------------
// Start Server
// --------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
