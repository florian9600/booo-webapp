const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String,
  date: Date,
});

const Post = mongoose.model('Post', donationSchema);
module.exports = Post;
