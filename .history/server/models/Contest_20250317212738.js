const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'Codechef']
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,  // in minutes
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);