
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const config = require('../../config');
const dbUrl = `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.name}`;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (err) => {
  console.log(`Connection Error: ${err}`);
});
db.once('open', () => {
  console.log(`Connected to MongoDB at ${dbUrl}`);
});