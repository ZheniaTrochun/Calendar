const mongoose = require('mongoose');
const config = require('../config');

// mongoose.connect('mongodb://localhost/calendar', { useMongoClient: true });
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

mongoose.Promise = global.Promise;

module.exports = mongoose;
