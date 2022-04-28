const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');

const slotController = require('../controllers/slotController');

//CC only
router.post('/courseSlot', auth.CCAuth, slotController.addCourseSlot);
router.delete('/courseSlot', auth.CCAuth, slotController.removeCourseSlot);
router.put('/courseSlot', auth.CCAuth, slotController.updateCourseSlot);

module.exports = router;  