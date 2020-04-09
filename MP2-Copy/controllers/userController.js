const express = require('express');

var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res)=>{
    res.render("register",{
        layout:'',
    });
    console.log('Register');
});

router.post('/', (req, res)=>{
    insertUser(req, res);
});

function insertUser(req, res){
    var user = new User();
    user.email= req.body.em;
    user.username= req.body.un;
    user.password= req.body.pw;
    
    user.save((err, doc)=>{
        if(!err){
            res.render('feed', {
            username: req.body.un
        });
            console.log('User saved!');
        }else{
            console.log('Error saving user:' + err);
        }
    });
}

router.get('/login', (req, res)=>{
    res.render("login",{
        layout:''
    });
});

router.get('/feed', (req, res)=>{
    res.render("feed", {
        layout: ''
    });
});

function loginUser(req, res){
    var username = req.body.un
    var password = req.body.pw
    
    User.find({username:username, password:password}).then((doc)=>{
        console.log("user match")
        console.log(username)
        
        res.render('feed', {
            username
        });
        
        res.redirect('feed');
        
    }, (err)=>{
        res.send(err)
    });
}

router.post('/login', (req, res)=>{
    loginUser(req, res);
});

module.exports = router;

