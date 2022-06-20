const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
       jwt.verify(token, "jwt_secret", (err, user)=>{
           if(err) res.status(403).json("Your Token is Invalid!");
        //    but token is valid, then assign req.user to be a valid user
              req.user = user
              next()
       });
    }else{
        return res.status(401).json("You're not Authenticated")
    }
}


const verifyTokenAndAuthorization = (req, res, next)=>{
    verifyToken(req, res, ()=>{
         if (req.user.id === req.params.id || req.user.isAdmin) {

            next()
         }else{
             res.status(403).json("You're not Authorized to perform the action")
         }
    })
}

const verifyTokenAndAdmin = (req, res, next)=>{
    verifyToken(req, res, ()=>{
         if (req.user.isAdmin) {

            next()
         }else{
             res.status(403).json("You're not Authorized to perform the action because you are not an admin")
         }
    })
}


module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};