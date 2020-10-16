const { filter } = require('bluebird');
const { omit } = require('lodash');
const moment = require('moment');
const { eventNames } = require('../../server');

const { Request } = require('../models');
const { User } = require('../models');
const { errorMaker } = require('./utils');

/**
 * List of requests filtered by status for user
 * 
 * @param {object} payload user id and filter by status
 */
const getRequestsByUser = (payload) => {
  let filterPayload = {};
  if ( payload.filter ) {
    filterPayload.status = payload.filter;
  }
  return User.findOne({ _id: payload.userId })
    .then(doc => {
      if ( ! doc ) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'You are not permitted.'));
      }
      if ( doc.role == 'employee' ) {
        filterPayload = {
          author: payload.userId
        };
      }
      return Request.find(filterPayload)
        .then(docs => docs.map(doc => doc.toObject()))
    })
  
};

/**
 * Get the remaining vacations
 * 
 * @param {object} payload user id
 */
const getRemainByUser = (payload) => {
  const filterPayload = {
    author: payload.userId,
    vacation_start_date: {
      $gte: moment().startOf('year'),
      $lte: moment().endOf('year')
    },
    status: 'approve'
  }

  return Request.find(filterPayload)
    .then(docs => {
      let remainingDays = 0;
      docs.forEach(doc => {
        if (doc.vacation_start_date < moment()) {
          if (doc.vacation_end_date < moment()) {
            remainingDays += moment(doc.vacation_end_date).diff(doc.vacation_start_date, 'days');
          } else {
            remainingDays += moment().diff(moment(doc.vacation_start_date), 'days');
          }
        }
      })
      return { remainingDays };
    })
};

/**
 * Register the request
 * 
 * @param {object} payload author email, vacation start date and vacation end date
 */
const registerRequestByUser = (payload) => {
  return User.findOne({ email: payload.email })
    .then(user => {
      if ( ! user ) {
        return Promise.reject(errorMaker('BAD_REQUEST', 'You are not employee.'));
      }
      return getRemainByUser({ userId: user._id })
        .then(doc => {
          if ( doc.remainingDays >= process.env.VACATION_LIMITATION ) {
            return Promise.reject(errorMaker('BAD_REQUEST', 'Your requests were limited.'));
          }
        })
        .then(() => {
          payload.author = user._id;
          payload.status = 'pending';

          return new Request(payload).save()
            .then(doc => omit(doc.toObject()))
        })
    })
};

/**
 * Approve or reject the request by manager
 * 
 * @param {object} payload request id, request status and request manager id
 */
const updateRequest = (payload) => {
  return User.findOne({ _id: payload.resolved_by, role: 'employer' })
    .then(user => {
      if ( ! user ) {
        return Promise.reject(errorMaker('BAD_PERMISSION', 'You are not employer'));
      }

      let updatePayload = omit(payload, ['id']);

      return Request.findOneAndUpdate({ _id: payload.id }, updatePayload, {
        new: true
      })
        .then(request => {
          if ( ! request ) {
            return Promise.reject(errorMaker('UNPROCESSABLE_ENTITY', 'Request does not exists'));
          }
          return request.save().then(result => result.toObject());
        })
    })
};

/**
 * Get the overlapped Requests.
 * 
 * @param {object} payload user id
 */
const getOverlapRequest = (payload) => {
  return User.findOne({ _id: payload.userId, role: 'employer' })
    .then(user => {
      if ( ! user ) {
        return Promise.reject(errorMaker('BAD_PERMISSION', 'You are not employer'));
      }
      const filterPayload = {
        vacation_start_date: { $lte: moment(Number(payload.endDate)) },
        vacation_end_date: { $gte: moment(Number(payload.startDate)) }
      };

      return Request.find(filterPayload)
        .then(docs => docs.map(doc => doc.toObject()))
    })
};

module.exports = {
  getRequestsByUser: getRequestsByUser,
  getRemainByUser: getRemainByUser,
  registerRequestByUser: registerRequestByUser,
  updateRequest: updateRequest,
  getOverlapRequest: getOverlapRequest
};
