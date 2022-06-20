const router = require("express").Router();
const User = require('../models/User')
const CryptoJS = require('crypto-js') 
const jwt = require('jsonwebtoken')



// REGISTER
router.post("/register", async (req, res)=>{
   
    const newUser = new User({
        username: req.body.username,
        email:req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, 'Ammazzing_Secrete').toString(),
    });
   try {
       const savedUser = await newUser.save();
        res.status(201).json(savedUser)
   } catch (err) {
       console.log(err)
   }
})

// LOGIN

router.post('/login', async (req, res)=>{

    try {
         const user = await User.findOne({username: req.body.username})

         !user && res.status(401).json("User Name not found") //if no user then send wrong credentials

         const accessToken = jwt.sign({
             id: user._id, isAdmin: user.isAdmin
         }, 'jwt_secret', {expiresIn: '3d'})

         const hashedPass = CryptoJS.AES.decrypt(user.password, 'Ammazzing_Secrete' )
         const Originalpassword = hashedPass.toString(CryptoJS.enc.Utf8)

        Originalpassword !== req.body.password &&
          res.status(401).json("Wrong Password"); //&& then

        //  don't send password along to the user
        const {password, ...others } = user._doc

        //  if everything is ok, then return the user
         res.status(200).json({...others, accessToken})

    } catch (err) {
        res.status(500).json(err)
    }
   
})

module.exports = router;
