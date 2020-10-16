const validate = require('./validator');
const errorHandler = require('./error-handler');
const corsHandler = require('./cors-handler');

module.exports = {
  validate: validate,
  errorHandler: errorHandler,
  corsHandler: corsHandler,
};