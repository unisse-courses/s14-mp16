const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment:{
        type: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);