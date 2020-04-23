const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    date:{
        type: Date
    },
    image:{
        data: Buffer,
        contentType: String,
    },
    title:{
        type: String
    },
     caption:{
        type: String
    },
    likes:{
        type: Number
    },
    comments:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Post', postSchema);
