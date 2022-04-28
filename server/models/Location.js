const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Tutorial Room', 'Lecture Hall', 'Lab', 'Office'],
  },
  location: {
    type: String,
    required: true,
    unique: true,
    validate: [
      // Validate that the location has:
      // 1- A letter form (A,B,C,D,G) .. building letter capitalized
      // 2- A number from 1 to 7
      // 3- A dot
      // 4- A number from 0 to 4 .. level number
      // 5- A number form 0 to 9 .. room number 1st digit
      // 6- A number from 1 to 9 .. room number 2nd digit
      (v) => /[ABCDGMN][1-7].[0-4][0-9][1-9]/g.test(v) || /^H[1-9]{1,}/g.test(v),
      'Invalid location format',
    ],
  },
  capacity: {
    type: Number,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Location', LocationSchema);
