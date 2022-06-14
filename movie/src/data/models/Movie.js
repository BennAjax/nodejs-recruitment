const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: [true, 'User is required'],
    },
    title: { type: String, required: [true, 'Title is required'] },
    released: { type: Date, required: [true, 'Released Date is required'] },
    genre: { type: String, required: [true, 'Genre is required'] },
    director: { type: String, required: [true, 'Director is required'] },
  },
  {
    timestamps: true,
  }
);

MovieSchema.index({ userId: 1 });

module.exports = mongoose.model('Movie', MovieSchema);
