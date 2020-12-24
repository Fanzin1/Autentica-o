//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    user: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/register", function(req, res){
    res.render("register.ejs");
});

app.post("/register", function(req, res){
    const user = req.body.username;
    const password = md5(req.body.password);

    const newUser = new User({
        user: user,
        password: password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render("secrets");
        }
    });
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({user: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })
});



app.listen(3000, function () {
    console.log("Server listen on port 3000");
});