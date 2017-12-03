'use strict';

const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  text: String,
  date: Date,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
