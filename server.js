const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();

//require users.js
const users = require("./router/api/users");

//require profiles.js
const profiles = require("./router/api/profiles");

//config mongoose
const db = require("./config/keys").mongooseURL;

//use body-parser 中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//connect to mongoose
mongoose.connect(db,{ useNewUrlParser: true })
    .then(() =>console.log("MongooseDB Connected"))
    .catch(err =>console.log(err));

// passport init
app.use(passport.initialize());


require('./config/passport')(passport);


//use routes
app.use("/api/users",users);
app.use("/api/profiles",profiles);

// app.get("/",(req,res) => {
//     res.send("Hello World!");
// });

const port = process.env.PORT || 5000;

app.listen(port,() =>{
    console.log(`Server running on port ${port}`);
});
