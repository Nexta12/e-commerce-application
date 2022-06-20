const router = require("express").Router();
const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../routes/verifyToken");

// CREATE Order

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
  } catch (err) {
    res.status(500).json(err);
  }

  res.status(200).json(updatedOrder);
});

// DELETE Order
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been Deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER Orders
// here you find Order by the user's Id and not the cart's Id
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL Orders
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET Stats

// GET Monthly Income
router.get("/income", verifyTokenAndAdmin, async (req, res)=>{
  const date = new Date();  //Today's date
  const lastMonth = new Date (date.setMonth(date.getMonth() -1)) //last month date
  const previoustMonth = new Date (new Date().setMonth(lastMonth.getMonth() -1))  //previous month date


  try {
    
    const income = await Order.aggregate([
      {
        $match: {createdAt: {$gte: previoustMonth}}
      },
      {
        $project: {
          month: {$month: "$createdAt"},
          sales: "$amount"
        }
      },

      {
        $group: {
          _id: "$month",
          total: {$sum : "$sales"}
        }
      }
    ])

    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router;
