const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    date:{
        type: Date
    },
    image:{
        data: Buffer,
        contentType: String,
    },
    caption:{
        type: String
    },
    title:{
        type: String
    },
    likes:{
        type: Number
    }
});

module.exports = mongoose.model('Post', postSchema);
