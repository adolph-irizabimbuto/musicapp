const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');




const app = express();

 //Passport Config
 require('./config/passport')(passport);

 require
// DB CONFIG

const db = require('./config/keys').MongoURI;


// connect to Mongo

mongoose.connect(db ,{ usenewUrlParser: true })
    .then(() => console.log('mongodb connected...'))
    .catch(err => console.log(err));

    // EJS

app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body Parser

app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport Middleware

app.use(passport.initialize());
app.use(passport.session());

//  COnnect Flash
app.use(flash());

//Glabal Vars

app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error.msg');
    res.locals.error = req.flash('error');
    next();
});



// ROutes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));






const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));
