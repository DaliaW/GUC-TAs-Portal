const Location = require('../models/Location');

const validation = require('../helpers/validation');
const StaffMember = require('../models/StaffMember');

exports.getRoom = async function (req, res) {
    try {
        // let JOI_Result = await validation.getRoomSchema.validateAsync({ params: req.params.num })

        if (req.params.num === "all") {
            const result = await Location.find();
            return res.send({ data: result });
        }
        else {
            const loc = req.params.num.toUpperCase();
            const result = await Location.findOne({ location: loc });
            if (result)
                return res.send({ data: result });
            else
                return res.send({ error: "Sorry no room with this location" });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log("~ err", err);
        return res.send({ error: err })
    }
}

exports.createRoom = async function (req, res) {
    try {
        let JOI_Result = await validation.createRoomSchema.validateAsync(req.body)

        const { type, location, capacity } = req.body;

        //both are entered
        if (!type || !location || !capacity)
            return res.send({ error: "Missing details" })

        if (capacity <= 0)
            return res.send({ error: "Sorry capacity cannot be zero or less" })

        const roomFound = await Location.findOne({ location: location });
        if (roomFound)
            return res.send({ error: "Sorry there is already a room with that location" })

        const newRoom = await Location.create(req.body);
        return res.send({ data: newRoom })
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log("~ err", err);
        return res.send({ error: err })
    }
};

exports.updateRoom = async function (req, res) {
    try {
        let JOI_Result = await validation.roomSchema.validateAsync(req.body)
        const type = req.body.type;
        const location = req.body.location;
        const newLocation = req.body.newLocation;
        const capacity = req.body.capacity;

        if (!location)
            return res.send({ error: "Please enter the location of the room to be updated" })

        const newRoom = await Location.findOne({ location: location });
        if (!newRoom)
            return res.send({ error: "No room with this location" })
        else {
            if (type)
                newRoom.type = type;
            if (capacity)
                newRoom.capacity = capacity;
            if (newLocation) {
                const newLocationRoom = await Location.findOne({ location: newLocation });
                if (newLocationRoom)
                    return res.send({ error: "Sorry, there is another room with this location" })

                newRoom.location = newLocation;
            }

            const updatedRoom = await newRoom.save();
            return res.send({ data: "Location Updated Successfully" })
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log("~ err", err);
        return res.send({ error: err })
    }
}

exports.deleteRoom = async function (req, res) {
    try {
        let JOI_Result = await validation.roomSchema.validateAsync(req.body)
        const location = req.body.location;

        if (!location)
            return res.send({ error: "Location of the room to be deleted is required" })

        const room = await Location.findOne({ location: location });
        if (!room)
            return res.send({ error: "No room with this location is found" })

        if (room.type === 'Office') {
            const staffMembers = await StaffMember.find();
            staffMembers.forEach(async (member) => {
                if (member.officeLocation._id == room.id) {
                    member.officeLocation = undefined
                    await member.save();
                }
            });
        }

        const deleted = await Location.findOneAndDelete({ location: location });
        return res.send({ data: "Room deleted successfully" })

    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log("~ err", err);
        return res.send({ error: err })
    }
}