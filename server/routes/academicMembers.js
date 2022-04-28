const express = require('express');
const router = express.Router();
const auth = require('../helpers/auth');

// Require Controllers
const { courseInstructorController } = require('./../controllers/academicMemberController');

// ==> Course Instructor Routes (Auth: Course Instructors Only) <== //
const courseInstructorBaseRoute = '/courseInstructor';

// Functionality: 29
router.get(`${courseInstructorBaseRoute}/courseCoverage`, auth.CIAuth, courseInstructorController.courseCoverage);

// Functionality: 30
router.get(`${courseInstructorBaseRoute}/slotsAssignment`, auth.CIAuth, courseInstructorController.slotsAssignment);

// Functionality: 31
router.get(`${courseInstructorBaseRoute}/staffMembers/:courseName`, auth.CIAuth, courseInstructorController.staffMembers);

// Functionality: 32
router.post(`${courseInstructorBaseRoute}/slotsAssignment`, auth.CIAuth, courseInstructorController.assignSlot);

// Functionality: 33
router.put(`${courseInstructorBaseRoute}/slotsAssignment`, auth.CIAuth, courseInstructorController.updateSlot);

// Functionality: 34
router.delete(`${courseInstructorBaseRoute}/slotsAssignment`, auth.CIAuth, courseInstructorController.deleteSlot);

// Functionality: 35
router.post(`${courseInstructorBaseRoute}/courseCoordinator`, auth.CIAuth, courseInstructorController.courseCoordinator);

module.exports = router;
