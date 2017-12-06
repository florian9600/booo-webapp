'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Post = require('../models/post');

exports.timeline = {

  handler: function (request, reply) {
    reply.redirect('/user/' + request.auth.credentials.loggedInUser);
  },
};

exports.user = {
  handler: function (request, reply) {
    User.findOne({ _id: request.params.user }).populate('posts').then(foundUser => {
      foundUser.posts.sort((a, b) => {return b.date - a.date});
      foundUser.posts.forEach(post => {
        post.name = foundUser.firstName + ' ' + foundUser.lastName;
        post.dateAsString = post.date.getDate() + '/' + (post.date.getMonth() + 1) + '/' +  post.date.getFullYear();
        post.deletable = request.params.user === request.auth.credentials.loggedInUser;
      });
      foundUser.joinedYear = foundUser.joined.getFullYear();
      User.findOne({ _id: request.auth.credentials.loggedInUser }).then(loggedInUser => {
        foundUser.yourself = loggedInUser._id.toString() === foundUser._id.toString();
        foundUser.isFollowing = loggedInUser.following.indexOf(foundUser._id.toString()) !== -1;
        reply.view('timeline', { title: 'Booo! Timeline.', user: foundUser });
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.submitPost = {

  validate: {

    payload: {
      text: Joi.string().max(140).required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('timeline', {
        title: 'Posting error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },

  handler: function (request, reply) {
    User.findOne({ _id: request.auth.credentials.loggedInUser }).populate('posts').then(foundUser => {
      request.payload.date = new Date().getTime();
      const post = new Post(request.payload);

      post.save().then(newPost => {
        foundUser.posts.push(newPost);
        foundUser.save();
        reply.redirect('/timeline');
      }).catch(err => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.deletePost = {
  handler: function (request, reply) {
    User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
      let i = foundUser.posts.indexOf(request.params.post);
      if (i !== -1) {
        foundUser.posts.splice(i, 1);
      }

      foundUser.save();
      Post.findOne({ _id: request.params.post }).then(foundPost => {
        foundPost.remove();
        reply.redirect('/timeline');
      }).catch(err => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.searchForUsers = {
  validate: {

    payload: {
      input: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('timeline', {
        title: 'Searching error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const input = request.payload.input;
    const regularEx = new RegExp(input, 'i');
    User.findOne({ _id: request.auth.credentials.loggedInUser }).then(loggedInUser => {
      User.find({ $or: [{ firstName: regularEx }, { lastName: regularEx }] }).then(usersFound => {
        usersFound.forEach(user => {
          user.joinedYear = user.joined.getFullYear();
          user.yourself = loggedInUser._id.toString() === user._id.toString();
          user.isFollowing = loggedInUser.following.indexOf(user._id.toString()) !== -1;
        });
        reply.view('search', { title: 'Search result', input: input, usersFound: usersFound });
      });
    });
  },
};

exports.follow = {
  handler: function (request, reply) {
    User.findOne({ _id: request.params.user }).then(foundUser => {
      foundUser.followers += 1;
      foundUser.save();
      User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundFollowingUser => {
        foundFollowingUser.following.push(foundUser);
        foundFollowingUser.save();
        reply.redirect('/user/' + request.params.user);
      }).catch(err => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};

exports.unfollow = {
  handler: function (request, reply) {
    User.findOne({ _id: request.auth.credentials.loggedInUser }).then(foundUser => {
      let i = foundUser.following.indexOf(request.params.user);
      if (i !== -1) {
        foundUser.following.splice(i, 1);
      }

      foundUser.save();
      User.findOne({ _id: request.params.user }).then(foundFollowedUser => {
        foundFollowedUser.followers -= 1;
        foundFollowedUser.save();
        reply.redirect('/timeline');
      }).catch(err => {
        reply.redirect('/');
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },
};
