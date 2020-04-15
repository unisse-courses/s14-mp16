const express = require('express');

var fs = require('fs');
var router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('Post');

router.get('/', (req, res)=>{
    res.render("new_post",{
        
    });
});


router.post('/', (req, res)=>{
    createPost(req, res);
});

function createPost(req, res){
    var post = new Post();
    post.title = req.body.titl;
    post.caption = req.body.cap;
    post.image.data = fs.readFileSync(req.body.img);
    post.image.contentType = 'image/png';
    //post.author = req.session.user;
    
    post.save((err, doc)=>{
        if(!err){
            res.redirect('feed');
            console.log('Post saved on the db!');
        }else{
            console.log('Failed to create post: '+ err);
            req.flash(err, 'Could not create post. Please try again.');
            res.redirect('new_post');
        }
    });
};

function getPosts(req, res){
    Post.find({}).sort({date: 1}).exec(function(err, result) {
        var postObjects = [];
        
        result.forEach(function(doc) {
            postObjects.push(doc.toObject());
        });
        
        res.render('feed', {postModel: postObjects});
    });
};

router.get('/feed', (req, res)=>{
    getPosts(req, res);
})

module.exports = router;