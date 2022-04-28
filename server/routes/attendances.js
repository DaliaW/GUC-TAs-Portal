const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');

const attendanceController = require('../controllers/attendanceController');

router.get('/viewAttendance/:month1/:month2', attendanceController.viewAttendance);
router.get('/viewMissingDays', attendanceController.viewMissingDays);
router.get('/viewHours', attendanceController.viewMissingHours);

//hr
router.put('/addMissingSignInOut', auth.HRAuth, attendanceController.addMissingSignInOut);
router.get('/viewStaffAttendance', auth.HRAuth, attendanceController.viewAttendanceHR);
router.get('/viewStaffMissing', auth.HRAuth, attendanceController.viewStaffWithMissingHoursDays);

module.exports = router;  