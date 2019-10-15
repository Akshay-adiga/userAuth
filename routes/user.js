const express = require("express")
const router = express.Router()
// const mongoose = require('mongoose');
const User = require('../models/User')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req,res)=>{
    req.checkBody("name", "Name Cannot be Blank").notEmpty();
    req.checkBody("email", "Email Cannot be Blank").notEmpty();
    req.checkBody("password", "Password Cannot be Blank").notEmpty();
    var errors = req.validationErrors();
    if (errors){
        return res.status(400).send({success: false, error: errors});
    }
    const existing_user = await User.find({"email":req.body.email}).lean()
    if(existing_user.length){
        return res.status(400).send({success: false, error: "User with this email id aleady exist"});
    }
    if(req.body.password.length < 8) {
        return res.status(400).send({success: false, error: "Password must be of minimun 8 character"});
    }
    const user = new User({
        // _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    bcrypt.genSalt(10,(err,salt) => bcrypt.hash(user.password,salt,(err,hash) => {
        if(err) throw err;
        user.password = hash;
        user.save().then(rs=>{
            res.status(200).send(rs);
        })
        .catch(er=>{
            res.status(400).send(er);
        })
    }))
})

router.post("/login",async (req,res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(400).send(info);
        }
        req.logIn(user, (err) => {
          if (err) { 
              return next(err);
            }
            const token = jwt.sign(user._doc, "testPasww221", {
                // expiresIn: 864000 // expires in 15 minuts
            });
          return res.status(200).send({token:token});
        });
      })(req, res, next);
})
router.put('/update', (req,res) => {
    
})
module.exports = router;
