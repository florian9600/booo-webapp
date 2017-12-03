'use strict';

const Joi = require('joi');
const User = require('../models/user');
const Post = require('../models/post');

exports.timeline = {

  handler: function (request, reply) {
    User.findOne({ email: request.auth.credentials.loggedInUser }).populate('posts').then(foundUser => {
      foundUser.posts.sort((a, b) => {return b.date - a.date});
      foundUser.posts.forEach(post => {
        post.name = foundUser.firstName + ' ' + foundUser.lastName;
        post.dateAsString = post.date.getDate() + '/' + (post.date.getMonth() + 1) + '/' +  post.date.getFullYear();
      });
      reply.view('timeline', { title: 'Booo! Your timeline.', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.submitPost = {

  validate: {

    payload: {
      text: Joi.string().required(),
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
    User.findOne({ email: request.auth.credentials.loggedInUser }).populate('posts').then(foundUser => {
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
