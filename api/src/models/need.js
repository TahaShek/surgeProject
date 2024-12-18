const mongoose = require('mongoose');

const needSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  typeOfHelp: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved'],
    default: 'Reported',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

needSchema.index({ location: '2dsphere' }); 

const Need = mongoose.model('Need', needSchema);

module.exports = Need;
