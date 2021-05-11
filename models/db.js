const databaseURL = "mongodb+srv://simplixAdmin:admin1@simplix.zax3j.mongodb.net/SimplixDB?retryWrites=true&w=majority";

const mongoose = require('mongoose');
const { dbURL } = require('../config');

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(dbURL, options);

module.exports = mongoose;

require('./user.model');
require('./post.model');