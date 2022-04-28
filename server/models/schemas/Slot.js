const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  day: {
    type: String,
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  },
  time: {
    type: Date,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
  isAssigned: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
    default: null,
    //   'The slot can be assigned only to an academic member',
  },
});

module.exports = SlotSchema;
