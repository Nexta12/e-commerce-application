const router = require('express').Router()
const stripe = require('stripe')(process.env.STRIPE_KEY)


router.post("/payment", (req, res)=>{
    stripe.charges.create({
        source: req.body.tokenId, //token from stripe token
        amount:req.body.amount,
        currency: "aed",
    }, (stripeErr, stripeRes)=>{
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes)
        }
    })
})

module.exports = router