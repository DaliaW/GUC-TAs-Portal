const express = require("express");
const router = express.Router();
const auth = require('../helpers/auth');
const locationController = require('../controllers/locationController');

//HR only
//TODO: return auth
router.get("/room/:num", locationController.getRoom) //"all"" gets all rooms or the room number 
router.post("/location", auth.HRAuth, locationController.createRoom);
router.put("/location", auth.HRAuth, locationController.updateRoom);
router.delete("/location", auth.HRAuth, locationController.deleteRoom);

// added this route to get the location and view it in the HOD view all staff table

module.exports = router;  