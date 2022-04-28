const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

// Importing needed schemas
const AttendanceRecord = require('./schemas/AttendanceRecord');

const StaffMemberSchema = new Schema({
  gucId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
    default: '123456',
  },
  dayOff: {
    type: String,
    required: true,
    default: 'Saturday',
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  },
  salary: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['HR', 'Academic Member'],
  },
  role: {
    type: 'String',
    enum: ['Teaching Assistant', 'Course Instructor'],
  },
  leaveBalance: {
    type: Number,
    default: 0,
  },
  officeLocation: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',

  },
  attendanceRecords: [AttendanceRecord],
  is_deleted: {
    type: Boolean,
    default: false,
  },
  registeredDate: {
    type: Date,
    default: new Date()
  },
  lastLogIn: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('StaffMember', StaffMemberSchema);
