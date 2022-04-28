const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const Department = require('.models/StaffMember');
//const Replacements = require('./schemas/replacment');
const RequestSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'StaffMember',
      required: true,
    },

    reciever: {
      type: Schema.Types.ObjectId,
      ref: 'StaffMember',
      required: true,
    },
    date: {
      type: Date,
      default: new Date(Date.now()),
    },
    status: {
      type: String,

      enum: ['accepted', 'rejected', 'pending'],
      default: 'pending',
    },
    type: {
      type: String,
      required: true,
      enum: ['Replacement Request', 'Slot Request', 'Change DayOff', 'Leave Request'],
    },
    subject: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    //TODO: edit if needed el location based 3ala el slot bt-assigned ezay
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model('Request', RequestSchema);
