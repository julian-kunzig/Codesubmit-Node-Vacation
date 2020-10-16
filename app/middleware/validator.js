
const Joi = require('joi');

module.exports = (schemaObject) => {
  return (req, res, next) => {
    const payload = Object.assign({}, req.params || {}, req.query || {}, req.body || {});

    Joi.validate(payload, Joi.object().keys(schemaObject), (err, result) => next(err));
  };
};