const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  displayName: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },  
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String
  },
  orgId: {
    type: String
  },  
  date: {
    type: Date,
    default: Date.now
  }
}, {
    collection: 'users'
  });

module.exports = mongoose.model('User', User);