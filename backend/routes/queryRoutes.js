const express = require("express");
const router = express.Router();

const Stall = require("../models/Stall");
const Dish = require("../models/Dish");
const Visitor = require("../models/Visitor");

// QUERY 1: Highest Sales Stall
router.get("/query1", async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ sales: -1 });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 2: Rating > 9 dishes
router.get("/query2", async (req, res) => {
  try {
    const dishes = await Dish.find({ rating: { $gt: 9 } });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 3: Visitors with >5 stalls visited
router.get("/query3", async (req, res) => {
  try {
    const visitors = await Visitor.find({ stallsVisited: { $gt: 5 } });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 4: Contest >1
router.get("/query4", async (req, res) => {
  try {
    const stalls = await Stall.find();
    const result = stalls.filter(s => s.contests.length > 1);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// QUERY 5: Average Price Per Stall
router.get("/query5", async (req, res) => {
  try {
    const result = await Dish.aggregate([
      {
        $match: { 
          stallId: { $exists: true, $ne: null },
          price: { $exists: true, $ne: null, $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$stallId",
          averagePrice: { $avg: "$price" },
          dishCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "stalls",  // Collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "stallDetails"
        }
      },
      {
        $unwind: {
          path: "$stallDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          stallId: "$_id",
          stallName: "$stallDetails.name",
          cuisine: "$stallDetails.cuisine",
          averagePrice: { $round: ["$averagePrice", 2] },
          dishCount: 1
        }
      },
      {
        $sort: { averagePrice: -1 }
      }
    ]);
    
    console.log("Query 5 Result:", result); // Debug log
    res.json(result);
  } catch (error) {
    console.error("Query 5 Error:", error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
});
// QUERY 6: Dishes sold by multiple stalls
router.get("/query6", async (req, res) => {
  try {
    const dishes = await Dish.find({
      "soldBy.1": { $exists: true }
    });
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 7: Most popular dish
router.get("/query7", async (req, res) => {
  try {
    const dish = await Dish.findOne().sort({ rating: -1 });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 8: Visitors rating >10
router.get("/query8", async (req, res) => {
  try {
    const visitors = await Visitor.find({ dishesRated: { $gt: 10 } });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 9: Live Demo Stalls
router.get("/query9", async (req, res) => {
  try {
    const stalls = await Stall.find({ liveDemo: true });
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 10: All Contest Participants (exact 3 contests)
router.get("/query10", async (req, res) => {
  try {
    const stalls = await Stall.find({contests:{$size:3}});
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 11: Most Common Cuisine
router.get("/query11", async (req, res) => {
  try {
    const result = await Stall.aggregate([
      { $group: { _id: "$cuisine", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// QUERY 12: Top 3 Selling Stalls
router.get("/query12", async (req, res) => {
  try {
    const stalls = await Stall.find().sort({ sales: -1 }).limit(3);
    res.json(stalls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;