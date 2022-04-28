const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");
// required models
const staffMember = require('../models/StaffMember');
const courses = require('../models/Course');
const locations = require('../models/Location');
const validation = require('../helpers/validation');

exports.addCourseSlot = async (req, res) => {
    try {
        const { course, day, time, location } = req.body;
        const id = req.user.gucId;
        const validCourse = await validation.validateCourse.validateAsync({ course });
        const validSlot = await validation.validateSlotCC.validateAsync({ day, time, location })
        if (!course || !day || !time || !location) {
            res.send({ error: "You should specify all the data" });
            return;
        }

        const staff = await staffMember.findOne({ gucId: id });
        if (!staff) {
            res.send({ error: "There is no staff with this ID: " + id });
            return;
        }
        if (staff.type !== 'Academic Member') {
            res.send({ error: 'You are not authorized to go this page' })
            return;
        }
        const teachingCourse = await courses.findOne({ name: course });
        if (!teachingCourse) {
            res.send({ error: 'There is no course with this name: ' + course })
            return;
        }
        //check if the ID staff entered is the course coordinator for the entered course
        if (!teachingCourse.courseCoordinator || !(teachingCourse.courseCoordinator.equals(staff._id))) {
            res.send({ error: "You are not authorized to go to this page" });
            return;
        }
        teachingCourseSlots = teachingCourse.slots;
        //Check that the day is not Friday
        if (day === "Friday") {
            res.send({ error: "You cannot add a day on Friday" });
            return;
        }
        //Check that time is not before the first slot and not after the fifth slot
        if (parseInt(time.substring(0, 2)) < 8 || (parseInt(time.substring(0, 2)) == 8 && parseInt(time.substring(3, 5)) < 15) ||
            (parseInt(time.substring(0, 2)) > 16) || (parseInt(time.substring(0, 2)) == 16 && parseInt(time.substring(3, 5)) > 45)) {
            res.send({ error: "You cannot add a slot that is before the first slot or after the fifth slot" });
            return;
        }

        //Check that the location does exist
        locationAdded = await locations.findOne({ location: location });
        if (!locationAdded) {
            res.send({ error: `The location ${location} does not exist in the campus` });
            return;
        }
        if (locationAdded.type === 'Office') {
            res.send({ error: `You are not allowed to add in a location of type ${locationAdded.type}` });
            return;
        }

        d = new Date();
        d.setHours(parseInt(time.substring(0, 2)));
        d.setMinutes(parseInt(time.substring(3, 5)));
        teachingCourseSlots.push({
            day: day,
            time: d,
            location: locationAdded._id,
            isAssigned: null
        });
        assignedCourseCount = 0;
        teachingCourseSlots.forEach(slot => {
            if (slot.isAssigned) assignedCourseCount += 1
        });

        courseCoverage = teachingCourseSlots.length == 0 ? 0 : Math.round((assignedCourseCount / teachingCourseSlots.length) * 100 * 100) / 100;
        teachingCourse.slots = teachingCourseSlots;
        teachingCourse.coverage = courseCoverage;
        updatedSlots = await courses.findOneAndUpdate({ name: course }, { slots: teachingCourseSlots, coverage: courseCoverage });
        courseSlotsUpdated = await updatedSlots.save();
        res.send({ data: "The slot is added successfully" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ errorJ: err.details[0].message });
        }
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.removeCourseSlot = async (req, res) => {
    try {
        const id = req.user.gucId;
        const { course, day, time, location } = req.body;
        const validCourse = await validation.validateCourse.validateAsync({ course });
        const validSlot = await validation.validateSlotCC.validateAsync({ day, time, location })
        if (!course || !day || !time || !location) {
            res.send({ error: "You should specify all the data" });
            return;
        }

        const staff = await staffMember.findOne({ gucId: id });
        if (!staff) {
            res.send({error:"There is no staff with this ID: " + id});
            return;
        }
        if (staff.type !== 'Academic Member') {
            res.send({ error: 'You are not authorized to go this page' })
            return;
        }
        const teachingCourse = await courses.findOne({ name: course });
        if (!teachingCourse) {
            res.send({ error: 'There is no course with this name: ' + course });
            return;
        }
        if (!teachingCourse.courseCoordinator || !(teachingCourse.courseCoordinator.equals(staff._id))) {
            res.send({ error: "You are not authorized to go to this page" });
            return;
        }
        teachingCourseSlots = teachingCourse.slots;
        if (!teachingCourseSlots) {
            res.send({ error: 'There is no slots assigned to the course "' + course + '" yet' })
            return;
        }

        //Check that the day is not Friday
        if (day === "Friday") {
            res.send({ error: "You cannot remove a day on Friday" });
            return;
        }
        //Check that time is not before the first slot and not after the fifth slot
        if (parseInt(time.substring(0, 2)) < 8 || (parseInt(time.substring(0, 2)) == 8 && parseInt(time.substring(3, 5)) < 15) ||
            (parseInt(time.substring(0, 2)) > 16) || (parseInt(time.substring(0, 2)) == 16 && parseInt(time.substring(3, 5)) > 45)) {
            res.send({ error: "You cannot remove a slot that is before the first slot or after the fifth slot" });
            return;
        }

        //Check that the location does exist
        locationDeleted = await locations.findOne({ location: location });
        if (!locationDeleted) {
            res.send({ error: `The location ${location} does not exist in the campus` });
            return;
        }
        if (locationDeleted.type === 'Office') {
            res.send({ error: `You are not allowed to add a location of type ${locationDeleted.type}` });
            return;
        }
        slotFound = false;
        assignedCourseCount = 0;
        for (i = 0; i < teachingCourseSlots.length; i++) {
            if (teachingCourseSlots[i].isAssigned) assignedCourseCount++;
            if (day === teachingCourseSlots[i].day && locationDeleted.equals(teachingCourseSlots[i].location) &&
                parseInt(time.substring(0, 2)) === teachingCourseSlots[i].time.getHours() &&
                parseInt(time.substring(3, 5)) === teachingCourseSlots[i].time.getMinutes()) {
                if (teachingCourseSlots[i].isAssigned) {
                    res.send({ error: 'You are not able to remove an assigned slot of location: ' + location + ' ,on: ' + day + ', at: ' + time })
                    return;
                } else {
                    teachingCourseSlots.splice(i, 1);
                    slotFound = true;
                }
            }
        }
        if (!slotFound) {
            res.send({ error: 'There is no slot on location: ' + location + ' ,on: ' + day + ', at: ' + time + ' for the course: ' + course })
            return;
        } else {
            courseCoverage = teachingCourseSlots.length == 0 ? 0 : (assignedCourseCount / teachingCourseSlots.length) * 100;
            updatedSlots = await courses.findOneAndUpdate({ name: course }, { slots: teachingCourseSlots, coverage: courseCoverage });
            courseSlotsUpdated = await updatedSlots.save();
            res.send({data:"The slot is deleted sucessfully"});
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ errorJ: err.details[0].message });
        }
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.updateCourseSlot = async (req, res) => {
    try {
        const id = req.user.gucId;
        const { course, dayOld, timeOld, locationOld, dayNew, timeNew, locationNew } = req.body;
        const validCourse = await validation.validateCourse.validateAsync({ course });
        const validOldSlot = await validation.validateSlotCC.validateAsync({ day: dayOld, time: timeOld, location: locationOld })
        const validNewSlot = await validation.validateSlotCC.validateAsync({ day: dayNew, time: timeNew, location: locationNew })

        if (!course || !dayOld || !timeOld || !locationOld || !dayNew || !timeNew || !locationNew) {
            res.send({ error: "You should specify all the data" });
        }

        const staff = await staffMember.findOne({ gucId: id });
        if (!staff) {
            res.send({error:"There is no staff with this ID: " + id});
            return;
        }
        const teachingCourse = await courses.findOne({ name: course });
        if (!teachingCourse) {
            res.send({ error: 'There is no course with this name: ' + course });
            return;
        }
        if (!teachingCourse.courseCoordinator || !(teachingCourse.courseCoordinator.equals(staff._id))) {
            res.send({ error: "You are not authorized to go to this page" });
            return;
        }
        teachingCourseSlots = teachingCourse.slots;
        if (!teachingCourseSlots) {
            res.send({ error: 'There is no slots assigned to the course "' + course + '" yet' });
            return;
        }

        //Check that the day is not Friday
        if (dayOld === "Friday" || dayNew === "Friday") {
            res.send({ error: "You cannot update a day on Friday" });
            return;
        }
        //Check that time is not before the first slot and not after the fifth slot
        if (parseInt(timeOld.substring(0, 2)) < 8 || (parseInt(timeOld.substring(0, 2)) == 8 && parseInt(timeOld.substring(3, 5)) < 15) ||
            (parseInt(timeOld.substring(0, 2)) > 16) || (parseInt(timeOld.substring(0, 2)) == 16 && parseInt(timeOld.substring(3, 5)) > 45)) {
            res.send({ error: "You cannot update a slot that is before the first slot or after the fifth slot" });
            return;
        }
        if (parseInt(timeNew.substring(0, 2)) < 8 || (parseInt(timeNew.substring(0, 2)) == 8 && parseInt(timeNew.substring(3, 5)) < 15) ||
            (parseInt(timeNew.substring(0, 2)) > 16) || (parseInt(timeNew.substring(0, 2)) == 16 && parseInt(timeNew.substring(3, 5)) > 45)) {
            res.send({ error: "You cannot update a slot that is before the first slot or after the fifth slot" });
            return;
        }

        //Check that the location does exist
        locationDeleted = await locations.findOne({ location: locationOld });
        if (!locationDeleted) {
            res.send({ error: `The location ${locationOld} does not exist in the campus` });
            return;
        }

        if (locationDeleted.type === 'Office') {
            res.send({ error: `You are not allowed to add a location of type ${locationDeleted.type}` });
            return;
        }

        locationAdded = await locations.findOne({ location: locationNew });
        if (!locationAdded) {
            res.send({ error: `The location ${locationNew} does not exist in the campus` });
            return;
        }

        if (locationAdded.type === 'Office') {
            res.send({ error: `You are not allowed to add a location of type ${locationAdded.type}` });
            return;
        }

        slotFound = false;
        assignedCourseCount = 0;
        for (i = 0; i < teachingCourseSlots.length; i++) {
            if (dayOld === teachingCourseSlots[i].day && locationDeleted.equals(teachingCourseSlots[i].location) &&
                parseInt(timeOld.substring(0, 2)) === teachingCourseSlots[i].time.getHours() &&
                parseInt(timeOld.substring(3, 5)) === teachingCourseSlots[i].time.getMinutes()) {

                if (teachingCourseSlots[i].isAssigned) {
                    res.send({ error: 'You are not able to update an assigned slot of location: ' + locationOld + ' ,on: ' + dayOld + ', at: ' + timeOld })
                    return;
                } else {
                    teachingCourseSlots.splice(i, 1);
                    slotFound = true;
                }
            }
        }
        if (!slotFound) {
            res.send({ error: 'There is no slot on location: ' + locationOld + ' ,on: ' + dayOld + ', at: ' + timeOld + ' for the course: ' + course })
            return;
        } else {
            d = new Date();
            d.setHours(parseInt(timeNew.substring(0, 2)));
            d.setMinutes(parseInt(timeNew.substring(3, 5)));

            teachingCourseSlots.push({
                day: dayNew,
                time: d,
                location: locationAdded._id,
                isAssigned: null
            });
            updatedSlots = await courses.findOneAndUpdate({ name: course }, { slots: teachingCourseSlots });
            courseSlotsUpdated = await updatedSlots.save();
            res.send({data: "The slot is updated successfully"});
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ errorJ: err.details[0].message });
        }
        console.log('~ err', err);
        res.status(500).send({ errorJ: `Internal Server Error: ${err}` });
    }
}