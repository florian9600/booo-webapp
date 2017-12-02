'use strict';

const Joi = require('joi');

exports.main = {

  auth: false,
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Donations' });
  },

};
