const mongoose = require('mongoose'); 

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true}, (err)=>{
    if(!err){
        console.log("Connect success")
    }else{
        console.log("Error connecting to db" + err)
    }
});

require('./user.model');
require('./post.model');