const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceRecordSchema = new Schema({
  day: {
    type: String,
    required: true,
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Annual Leave', 'Accidental Leave', 'Sick Leave', 'Maternity Leave', 'Compensation Leave'],
  },
  absentsatisfied: {
    type: Boolean,
    default: false,
  },
  absentStatus: {
    type: String,
    enum: [null, 'None', 'Annual Leave', 'Accidental Leave', 'Sick Leave', 'Maternity Leave', 'Compensation Leave'],
    default: 'None'
  },
  description: {
    type: String,
  },
});

module.exports = AttendanceRecordSchema;
