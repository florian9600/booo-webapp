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
      reply.redirect('/');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
