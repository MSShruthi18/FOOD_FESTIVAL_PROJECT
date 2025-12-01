const express = require('express');
const router = express.Router();
const Stall = require('../models/Stall');
const Dish = require('../models/Dish');
const Visitor = require('../models/Visitor');

// Query 1: Highest food sales
router.get('/highest-sales', async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ sales: -1 });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 2: Dishes rated above 9
router.get('/top-rated-dishes', async (req, res) => {
  try {
    const dishes = await Dish.find({ rating: { $gt: 9 } }).populate('stallId');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 3: Visitors who purchased from more than 5 stalls
router.get('/multi-stall-visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find({ stallsVisited: { $gt: 5 } });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 4: Contests won by same stall
router.get('/multi-contest-winners', async (req, res) => {
  try {
    const stalls = await Stall.find({ 
      $expr: { $gt: [{ $size: "$contests" }, 1] }
    });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 5: Average price per stall
router.get('/average-price', async (req, res) => {
  try {
    const result = await Dish.aggregate([
      {
        $group: {
          _id: '$stallId',
          avgPrice: { $avg: '$price' }
        }
      },
      {
        $lookup: {
          from: 'stalls',
          localField: '_id',
          foreignField: '_id',
          as: 'stall'
        }
      },
      { $unwind: '$stall' }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 6: Dishes sold by multiple stalls
router.get('/multi-stall-dishes', async (req, res) => {
  try {
    const dishes = await Dish.find({
      $expr: { $gt: [{ $size: "$soldBy" }, 1] }
    }).populate('stallId');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 7: Most popular dish
router.get('/most-popular-dish', async (req, res) => {
  try {
    const dish = await Dish.findOne().sort({ rating: -1 }).populate('stallId');
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 8: Visitors who rated more than 10 dishes
router.get('/super-raters', async (req, res) => {
  try {
    const visitors = await Visitor.find({ dishesRated: { $gt: 10 } });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 9: Stalls with food and live demos
router.get('/demo-stalls', async (req, res) => {
  try {
    const stalls = await Stall.find({ liveDemo: true });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 10: Stalls that participated in all contests
router.get('/all-contest-participants', async (req, res) => {
  try {
    const stalls = await Stall.find({ 
      $expr: { $eq: [{ $size: "$contests" }, 3] }
    });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 11: Most common cuisine type
router.get('/most-common-cuisine', async (req, res) => {
  try {
    const result = await Stall.aggregate([
      { $group: { _id: '$cuisine', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Query 12: Top 3 best-selling stalls
router.get('/top-3-selling', async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ sales: -1 }).limit(3);
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;