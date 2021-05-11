const mongoose = require("mongoose");
const Comment = require("./comment");

console.log(mongoose.models);
var postSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  title: {
    type: String,
  },
  caption: {
    type: String,
  },
  likes: {
    type: Number,
  },
  comments: {
    type: [
      {
        comment: String,
        author: {
          type: {
            username: {
              type: String,
            },
            fullname: {
              type: String,
            },
          },
        },
        date: { type: Date, default: Date.now.toISOString },
      },
    ],
  },
  author: {
    type: {
      username: {
        type: String,
      },
      fullname: {
        type: String,
      },
    },
  },
});

module.exports = mongoose.model("Post", postSchema);
