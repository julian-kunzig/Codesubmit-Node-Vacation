
var userRoutes = require('./users');
var requestRoutes = require('./requests');

module.exports = (app) => {
  userRoutes(app);
  requestRoutes(app);
};
