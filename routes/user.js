const router = require('express').Router()
const User = require('../models/User')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../routes/verifyToken");


// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if(req.body.password){
    req.body.password= CryptoJS.AES.encrypt(req.body.password, 'Ammazzing_Secrete').toString()
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, {new: true})
  } catch (err) {
    res.status(500).json(err)
  }

  res.status(200).json(updatedUser)

});

// DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json("User has been Deleted...")
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{
  try {
    const user = await User.findById(req.params.id);

    //  don't send password along to the user
    const { password, ...others } = user._doc;

    //  if everything is ok, then return the user
    res.status(200).json(others);

  } catch (err) {
    res.status(500).json(err)
  }
})


// GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    const query = req.query.new
  try {
  
    const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();

    //  if everything is ok, then return the user
    res.status(200).json(users);

  } catch (err) {
    res.status(500).json(err)
  }
})


// GET  USER STATS
// In this, we plan to return total number of users within last month till now

router.get("/stats", verifyTokenAndAdmin, async (req, res)=>{
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
   try {
        // getting Month statistic
        const data = await User.aggregate([
          {$match: {createdAt: {$gte: lastYear}}},
          // take month numbers now
          {
            $project:{
              month: {$month: "$createdAt"},
            }
          },
          {
            $group:{
              _id: "$month",
              total: {$sum: 1}  //sum 1 will sum every registered user
            }
          }

        ])
       res.status(200).json(data)

   } catch (err) {
     res.status(500).json(err)
   }
})


module.exports = router