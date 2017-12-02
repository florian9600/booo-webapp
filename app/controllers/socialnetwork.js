'use strict';

const Joi = require('joi');
const User = require('../models/user');

exports.timeline = {

  handler: function (request, reply) {
    reply.view('timeline', { title: 'Booo! Your timeline.' });
  },

};
