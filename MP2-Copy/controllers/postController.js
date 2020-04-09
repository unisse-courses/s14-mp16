const express = require('express');

var router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

router.get('/', (req, res)=>{
    res.render("new_post",{
        layout:''
    });
});

router.post('/new_post', (req, res)=>{
    createPost(req, res);
});

function createPost(req, res){
    var post = new Post();
    post.title = req.body.titl;
    post.caption = req.body.cap;
    post.image = req.body.img;
    
    post.save((err, doc)=>{
        if(!err){
            res.redirect('feed');
            console.log('Post created!');
        }else{
            console.log('Failed to create post: '+ err);
        }
    });
}

module.exports = router;