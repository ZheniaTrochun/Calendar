
const mongoose = require('../libs/mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: '-'
  },

  date: {
    type: Date,
    required: true
  },

  duration: {
    type: Number,
    min: 0
  }
});
