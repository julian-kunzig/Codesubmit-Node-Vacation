const { omit } = require('lodash');

const { User } = require('../models');
const { errorMaker } = require('./utils');

/**
 * Get the User Overview
 * 
 * @param {object} payload user id 
 */
const getUsers = (payload) => {
  let query = payload.userId ? { _id: payload.userId } : {};

  return User.find(query)
    .then(docs => docs.map(doc => doc.toObject()))
}

/**
 * Register the User.
 * 
 * @param {object} payload user name, user email 
 */
const registerUser = (payload) => {
  return User.count({ email: payload.email })
    .then(count => {
      if (count > 0) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'User email already exists'));
      }
    })

    .then(() => {
      return new User(payload).save()
        .then(doc => omit(doc.toObject()))
    })
};

module.exports = {
  getUsers: getUsers,
  registerUser: registerUser,
};
