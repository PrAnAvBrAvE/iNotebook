const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator'); // Import `body` and `validationResult`
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')
 
const JWT_SECRET = 'Pranavisagoodb$oy'

// Route 1: Create a user using: POST "/api/auth/createuser", No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        // check whether the user email already exists or not
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success, error: "Sorry a user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password,salt) 
        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });

        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET)

        // Send the created user as a response
        // res.json(user);
        success = true;
        res.json({success, authtoken})

    } catch (error) {
        // Log the error and send a generic server error response
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
})

// Route 2:  Authenticate a User using: POST "/api/auth/login", No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists(),
], async (req, res) => {

    let success = false;
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }

    const {email, password} = req.body;

    try {
        let user = await User.findOne({email})
        if(!user){
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if(!passwordCompare){
            success = false;
            return res.status(400).json({success, error: "Please try to login with correct credentials"})
        }

        const data ={
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({success, authtoken})

    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
    }

})

// Route 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser , async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user); 
    } catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;