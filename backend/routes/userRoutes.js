const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const auth = require("./auth.js");



router.get("/", auth,async (req, res) => {
    
    try {
        const user = await User.findOne({ _id:req.userId });
        if(!user){
            res.status(400).json({
                status:"Failed"
            })
        }
        res.status(201).json({
            name:user.name,
            email:user.email,
            status:"Success"
        })
        
    } catch (error) {
        res.status(400).json({
                status:"Failed",
                message:error.message
            })
        
    }
})

router.post("/register", async (req, res) => {

    const {
        name, email,
        password,confirmPassword
    } = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                status: "Failed",
                message: "Account already exists"
            })
        }
        const Hash_Password = async () => {
            const hash = await bcrypt.hash(password, saltRounds);
            return hash
        }
        const hashed_password = await Hash_Password()
        const new_User = {
            name: name,
            email: email,
            password: hashed_password
        };
        
        const response = await User.create(new_User);
        res.status(201).json({
            status: "Success",
            message: "Register Successfully",
        })
    } catch (err) {
          console.error("Register Error:", err);
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})

router.post("/login", async (req, res) => {
     let user;
    try {
        const { email, password } = req.body;
        user = await User.findOne({ email: email });
       
        
        // if(!user){
        //     user = await User.findOne({ phone: contact });
        // }
        if (!user) {
            return res.status(404).json({
                status: "Failed",
                message: "Account not found, Please Register"
            })
        }
        const response = await bcrypt.compare(password, user.password);
        if (response) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'abdul@123', { expiresIn: '1h' });

            return res.json({
                status: "Success",
                token: token,
                name: user.name
            })
        } else {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid credentials"
            })
        }
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})



// router.patch('/update-profile', auth, async (req, res) => {
//   const { email, oldPassword, newPassword } = req.body;
//   const userId = req.userId;

//   try {
    
//     const user = await User.findById(userId);

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Old password is incorrect.' });
//     }

//     const isSamePassword = await bcrypt.compare(newPassword, user.password);
//     if (isSamePassword) {
//       return res.status(400).json({ message: 'New password must be different from old password.' });
//     }

//     user.email = email;
//     user.password = await bcrypt.hash(newPassword, 10);

//     await user.save();

//     res.json({ message: 'Profile updated successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });

module.exports = router;