const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment:{
        type: String
    },
    date:{
        type: Date
    }
});

module.exports = mongoose.model('Comment', commentSchema);