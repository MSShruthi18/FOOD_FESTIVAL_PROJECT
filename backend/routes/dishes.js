const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

// Get all dishes
router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('stallId');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create dish
router.post('/', async (req, res) => {
  const dish = new Dish(req.body);
  try {
    const newDish = await dish.save();
    res.status(201).json(newDish);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;