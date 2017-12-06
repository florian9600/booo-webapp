'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  joined: Date,
  description: String,
  followers: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const User = mongoose.model('User', userSchema);
module.exports = User;
