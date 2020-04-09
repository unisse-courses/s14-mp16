const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: 'This field is required'
    },
    email:{
        type: String,
        required: 'This field is required'
    },
    password:{
        type: String,
        required: 'This field is required'
    }
});

module.exports = mongoose.model('User', userSchema); 