const jwt = require('jsonwebtoken');
var JWT_SECRET = 'Harryisagoodb$oy';

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and id to req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).send({error: "Please authenticate using a valid token1234"})
    }

    try{
        debugger
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
            res.status(401).send({error: "Please authenticate using a valid token"})
    }
   
};

module.exports = fetchuser;