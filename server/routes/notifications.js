const express = require("express");
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.put("/notification/updateAll", notificationController.updateAll);
router.put("/notification/update", notificationController.updateSeen);
router.get("/:receiverId", notificationController.getNotifications);

module.exports = router;  