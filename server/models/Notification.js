const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  reciever: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  is_seen: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
