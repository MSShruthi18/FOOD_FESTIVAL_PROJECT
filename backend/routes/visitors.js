const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create visitor
router.post('/', async (req, res) => {
  const visitor = new Visitor(req.body);
  try {
    const newVisitor = await visitor.save();
    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;