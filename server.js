
const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');

const { errorHandler, corsHandler } = require('./app/middleware');

const port = process.env.PORT || 8080; 

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(corsHandler);

require('./app/routes')(app);
require('./app/models/db');

app.use(errorHandler);

app.listen(port);
console.log(`========== Server is running on port ${port} ==========`);


exports = module.exports = app;