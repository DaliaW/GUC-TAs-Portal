var express = require("express");
var router = express.Router();
const auth = require('../helpers/auth');

const staffMemberController = require('../controllers/staffMemberController');

//HR 
router.post("/staff", auth.HRAuth, staffMemberController.registerStaff);
router.put("/staff", auth.HRAuth, staffMemberController.updateStaff);
router.delete("/staff", auth.HRAuth, staffMemberController.deleteStaff);
router.get('/salary/:gucId', staffMemberController.getSalary);
router.put('/updateSalary', auth.HRAuth, staffMemberController.updateSalary);

//academic member
router.get('/viewMySchedule', auth.AcademicMemberAuth, staffMemberController.viewMySchedule);

//HOD and CC 
router.get('/viewStaffSchedule/:id', auth.CIAuth, staffMemberController.viewStaffSchedule);

//all users
router.post("/signIn", staffMemberController.signIn);
router.post("/signOut", staffMemberController.signOut);

router.put("/lastLogin", staffMemberController.updateLogin);
router.put("/changePassword", staffMemberController.changePassword);

router.put("/profile", staffMemberController.updateProfile);
router.get("/profile", staffMemberController.getProfile);

router.get("/AC/:role/:staff", staffMemberController.getAcademicMembers);
router.get("/:type/:staff", staffMemberController.getStaff);




module.exports = router;  