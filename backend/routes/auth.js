const express = require('express');
const {default: mongoose} = require("mongoose");
const User = require('../models/User');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Harryisagood$boy";

const fetchuser = require('../middleware/fetchuser');



//ROUTE 1 : Create a User using : POST "/api/auth/createuser"   Dosen't require Auth    No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters long').isLength({min:5})
],async(req,res)=> {
    let success = false;
    
//If there are errors, return Bad request and the errors
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({success,errors: errors.array() });
}

//check whether the user with this email exists already
try{
    let user = await User.findOne({email: req.body.email});
if(user){
   return res.status(400).json({
    success:false,
    error: {
    field: "email",
    message: "A user with this email already exists."
}
}) 
}


const salt = await bcrypt.genSalt(10);
const secPass = await bcrypt.hash(req.body.password,salt)

//Create a new user
user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email
    
})
const data = {
    user:{
        id: user.id
    }
}
const authtoken = jwt.sign(data, JWT_SECRET);
// console.log(jwtData);

// res.json(user)
success = true;
res.json({success,authtoken});
//catch errors
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal server error");
}


// .then(user => res.json(user))
// .catch(err => {console.log(err)
// res.json({error: 'Please enter a unique value for email',message: err.message})})

//  res.send(req.body);

  
})

//ROUTE 2 : Authenticate a User using: POST ""/api/auth/login"  No login required
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
],async(req,res)=> {
    let success = false;

    //If there are errors, return Bad request and the errors
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
}
const {email,password} = req.body;
try{
   let user = await User.findOne({email});
    if(!user){
        // success = false
        return res.status(400).json({error: { field: "email", message: "Invalid email" } });

    }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            success = false
            return res.status(400).json({error: { field: "password", message: "Invalid password" }});   
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        // success=true;
        res.json({success: true,authtoken});

}catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}

});

//ROUTE 3: Get loggedin User Details using POST "/api/auth/getuser". login required
router.post('/getuser',fetchuser, async(req,res)=> {

try{
   const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send({user});
}catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})
module.exports = router;