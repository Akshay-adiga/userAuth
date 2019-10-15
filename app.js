const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const auth = require('./lib/auth')

require('./config/passport')(passport)
require('dotenv').load()

app = express();

//Middlewares

app.use(bodyParser.json({ limit: '50MB',extended: true}));
app.use(expressValidator());
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(process.env.mongoDb, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true
  })


//Status Check
app.get('/',(req,res)=>{
    res.send('Api Running');    
});

//End Points
app.use(auth);
app.use("/api/v1/auth",require("./routes/user"));
app.use("/api/v1/courses",require("./routes/courses"));

const port = process.env.PORT || 8000;
app.listen(port)