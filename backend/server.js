const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Test each route individually with error handling
try {
  const queryRoutes = require("./routes/queryRoutes");
  console.log("✅ queryRoutes loaded:", typeof queryRoutes);
  app.use("/api/queries", queryRoutes);
} catch (err) {
  console.log("❌ Error loading queryRoutes:", err.message);
}

try {
  const stallRoutes = require('./routes/stalls');
  console.log("✅ stallRoutes loaded:", typeof stallRoutes);
  app.use('/api/stalls', stallRoutes);
} catch (err) {
  console.log("❌ Error loading stallRoutes:", err.message);
}

try {
  const dishRoutes = require('./routes/dishes');
  console.log("✅ dishRoutes loaded:", typeof dishRoutes);
  app.use('/api/dishes', dishRoutes);
} catch (err) {
  console.log("❌ Error loading dishRoutes:", err.message);
}

try {
  const visitorRoutes = require('./routes/visitors');
  console.log("✅ visitorRoutes loaded:", typeof visitorRoutes);
  app.use('/api/visitors', visitorRoutes);
} catch (err) {
  console.log("❌ Error loading visitorRoutes:", err.message);
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodFestival';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));