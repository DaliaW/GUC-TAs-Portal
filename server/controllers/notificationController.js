
const Notification = require('../models/Notification');
const StaffMember = require('../models/StaffMember');

//TODO: sort data reversly
exports.getNotifications = async function (req, res) {
    try {
        if (req.params.code === "all") {
            const result = await Notification.find();
            return res.send({ data: result });
        }
        else {
            const receiver = req.params.receiverId;
            const staff = await StaffMember.findOne({ gucId: receiver });
            if (!staff)
                return res.send({ error: "Sorry no staff with this Id" });

            const result = await Notification.find({ reciever: staff._id }).sort({ createdAt: 1 });
            return res.send({ data: result });
        }
    } catch (err) {
        console.log("~ err", err);
        return res.send({ error: err })
    }
}


exports.updateSeen = async function (req, res) {
    try {
        // const receiver = await Notification.findOne({ gucId: req.user.gucId });
        // if (!result)
        //     return res.send({ error: "Sorry no staff with this Id" });

        // receiver.is_seen = true;
        // receiver.save();
        // return res.send({ data: "seen updated successfully" });
    } catch (err) {
        console.log("~ err", err);
        return res.send({ error: err })
    }
}

exports.updateAll = async function (req, res) {
    try {
        const receiverNotifications = await StaffMember.findOne({ gucId: req.user.gucId });
        if (!receiverNotifications)
            return res.send({ error: "Sorry no staff with this Id" });

        const allNotifications = await Notification.find({});

        allNotifications.forEach((notif) => {
            notif.is_seen = true;
            notif.save();
        })

        return res.send({ data: "seen updated for all notifications successfully" });
    } catch (err) {
        console.log("~ err", err);
        return res.send({ error: err })
    }
}