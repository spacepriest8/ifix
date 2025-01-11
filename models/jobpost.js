const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Ensure the title is provided
      trim: true,     // Remove unnecessary spaces
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Washing', 'Cleaning', 'Errands', 'Home Help Out', 'Occasion Help'], // Predefined categories
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Initially no service provider assigned
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed'], // Job workflow states
      default: 'pending',
    },
  },
  {
    timestamps: true, // Include createdAt and updatedAt
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
