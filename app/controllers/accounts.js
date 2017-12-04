'use strict';

const Joi = require('joi');
const User = require('../models/user');

exports.main = {

  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Booo! Scary social network.' });
  },

};

exports.signup = {

  auth: false,
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Booo!' });
  },

};

exports.register = {
  auth: false,
  validate: {

    payload: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('signup', {
        title: 'Sign up error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.login = {

  auth: false,
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Booo!' });
  },

};

exports.authenticate = {
  auth: false,
  validate: {

    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      reply.view('login', {
        title: 'Authenticate error',
        errors: error.data.details,
      }).code(400);
    },

    options: {
      abortEarly: false,
    },
  },
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: foundUser._id,
        });
        reply.redirect('/timeline');
      } else {
        reply.redirect('/login');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {

  auth: false,
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },

};
