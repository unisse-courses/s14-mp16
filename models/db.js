const mongoose = require('mongoose'); 
const databaseURL = "mongodb+srv://simplixAdmin:admin1@simplix.zax3j.mongodb.net/SimplixDB?retryWrites=true&w=majority";

mongoose.connect(databaseURL,{ useNewUrlParser: true}, (err)=>{
    if(!err){
        console.log("Connect success")
    }else{
        console.log("Error connecting to db" + err)
    }
});

require('./user.model');
require('./post.model');