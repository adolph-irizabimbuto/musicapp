const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User Model
const User = require('../models/User')

// Login Pge 
router.get('/login', (req, res) => res.render('login'));

// Register Page 
router.get('/register', (req, res) => res.render('register'));

// Register Handle

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'please fill in all the fields'})
    }

    // Check passwords match 

    if(password != password2){
        errors.push({msg: 'password do not match'})
    }

    // check password length 
    if(password.length < 6){
        errors.push({msg: 'password needs to be atleast 6 charecters!!'})
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation Passes
        User.findOne({ email: email})
        .then(user => {
            if(user) {
            // user exists
            errors.push({msg: 'email is already registered'})
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
            } else {
            const newUser = new User({
                name,
                email,
                password
            });

            // Hash Password 
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                 if(err) throw err;
                 //Set password to hashed
                 newUser.password = hash;
                 // save User
                 newUser.save()
                    .then(user => {
                        req.flash('success_msg', 'You are now registered, you can now Login');
                        res.redirect('/users/login')
                    })

                    .catch(err => console.log(err));
            }))
          
        }
        });

    }
});

//Login Handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout handle

router.get('/logout', (req,res) =>{
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login')
})

module.exports = router;