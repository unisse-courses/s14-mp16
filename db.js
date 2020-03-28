const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    image: {
        type: Buffer,
    }
});

var postSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId
    },
    date: {
        type: Date,
    },
    image: Buffer,
    comments: {
        user: mongoose.Schema.Types.ObjectId,
        comment: String
    }
});

var User = mongoose.model("User", userSchema);
var Post = mongoose.model("Post", postSchema);

module.exports = {
    User,
    Post
}