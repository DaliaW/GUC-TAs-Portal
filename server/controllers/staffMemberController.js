const mongoose = require('mongoose');
const objectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;

const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Request = require('../models/Request');
const Notification = require('../models/Notification')

const validation = require('../helpers/validation');

const errorMsgs = {
    notFound: (name, id) => {
        return `There is no ${name} with this ${id}`;
    },
    notAssignedTo: (assignmentName, assignee) => {
        return `There are no ${assignmentName} assigned to this ${assignee}`;
    },
    notAssigned: (assignmentName, extraInfo) => {
        return `The ${assignmentName} is not assigned. ${extraInfo ? extraInfo : ''}`;
    },
    notAuthorized: (action) => {
        return `You are not authorized to ${action}`;
    },
    allAssigned: (assignmentName) => {
        return `All the ${assignmentName} are already assigned`;
    },
    alreadyAssigned: (assignmentName) => {
        return `The ${assignmentName} is already assigned`;
    },
};

async function locationHelper(officeLocation) {
    //check if room is found
    const refLocation = await Location.findOne({
        location: officeLocation,
        is_deleted: { $ne: true },
    }).populate('officeLocation');
    if (!refLocation) return { error: 'Sorry room not found' };
    else {
        //room capacity for offices
        const occupied = await StaffMember.find({
            officeLocation: refLocation._id,
            is_deleted: { $ne: true }
        });
        if (occupied.length >= refLocation.capacity)
            return { error: 'Sorry room capacity is full' };
        else if (refLocation.type != 'Office') {
            return { error: 'Sorry this is not an office' };
        } else {
            return refLocation;
        }
    }
}

async function facultyHelper(facultyCode) {
    //check if faculty is found
    const refFaculty = await Faculty.findOne({
        code: facultyCode,
    }).populate('faculty')
    if (!refFaculty) return { error: 'Sorry Faculty not found' };

    return refFaculty;
}

async function departmentHelper(relatedFaculty, depName) {
    //check if department is found
    const faculty = await (await Faculty.findOne({ code: relatedFaculty, is_deleted: { $ne: true } })).populate('faculty');

    const refDepartment = await Department.findOne({ faculty: faculty, name: depName, is_deleted: { $ne: true } }).populate('department')
    if (!refDepartment) return { error: 'Sorry Department not found' };

    return refDepartment;
}

async function updateInfoHelper(user) {
    let JOI_Result = await validation.updateSchema.validateAsync(user)

    const gucId = user.gucId;
    const name = user.name;
    const role = user.role;
    const gender = user.gender;

    const newStaff = await StaffMember.findOne({ gucId: gucId });
    if (!newStaff)
        return { error: 'No staff with this id' };

    else {
        if (name) {
            newStaff.name = name;
        }

        if (gender) {
            newStaff.gender = gender;
        }

        if (newStaff.type === 'Academic Member') {
            if (role) newStaff.role = role;
        }

        const updatedStaff = await newStaff.save();
        return { data: "Profile Updated Successfully" }
    }
}

exports.getStaff = async function (req, res) {
    try {
        if (req.params.type === "all") {
            if (req.params.staff === "all") {
                const result = await StaffMember.find();
                return res.send({ data: result });
            } else {
                const gucId = req.params.staff;
                const result = await StaffMember.findOne({ gucId: gucId });
                if (result) return res.send({ data: result });
                else return res.send({ error: "Sorry, no user with that id in the GUC" });
            }
        } else {
            const type = req.params.type;
            if (req.params.staff === "all") {
                const result = await StaffMember.find({ type: type });
                return res.send({ data: result });
            } else {
                const gucId = req.params.staff;
                const result = await StaffMember.findOne({ type: type, gucId: gucId });
                if (result) return res.send({ data: result });
                else return res.send({ error: "Sorry, no user with that id with this type " });
            }
        }
    } catch (err) {
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.getAcademicMembers = async function (req, res) {
    try {
        if (req.params.role === "all") {
            //all academic members
            if (req.params.staff === "all") {
                const result = await StaffMember.find({ type: "Academic Member" });
                return res.send({ data: result });
            }
            // search in all academic members with a specific ID 
            else {
                const gucId = req.params.staff;
                //TODO: needs to be editted bs 5ayfa had ykoon est5dmha
                const result = await StaffMember.find({ type: "Academic Member", gucId: gucId });
                if (result) return res.send({ data: result });
                else return res.send({ error: "Sorry, no Academic Member with that id in the GUC" });
            }
        } else {
            const role = req.params.role;
            //all staff of type role
            if (req.params.staff === "all") {
                const result = await StaffMember.find({ role: role });
                return res.send({ data: result });
            }
            // staff of type role with a specific ID 
            else {
                const gucId = req.params.staff;
                const result = await StaffMember.find({ type: type, gucId: gucId });
                if (result) return res.send({ data: result });
                else return res.send({ error: "Sorry, no user with that id with this type " });
            }
        }
    } catch (err) {
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.registerStaff = async function (req, res) {
    try {
        if (req.body.type === 'HR') {
            req.body.role = undefined
            req.body.faculty = undefined
            req.body.department = undefined
            let JOI_Result = await validation.registerSchema.validateAsync(req.body)
        } else if (req.body.type === 'Academic Member')
            JOI_Result = await validation.registerACSchema.validateAsync(req.body)
        else {
            return res.send({
                error: 'Sorry, position of the staff is required',
            });
        }

        let {
            name,
            gender,
            email,
            salary,
            officeLocation,
            type,
            role,
            dayOff,
            faculty,
            department
        }
            = req.body;


        //check email is found and if he was deleted
        const foundMail = await StaffMember.findOne({ email: email });
        if (foundMail) {
            return res.send({
                error: 'Email is already registered to another staff',
            });
        }

        const locResult = await locationHelper(req.body.officeLocation);
        if (locResult.error) return res.send(locResult);
        else officeLocation = locResult;

        if (type === 'Academic Member') {
            if (!role)
                return res.send({
                    error: 'Sorry role must be one of [Course Instructor,Teaching Assistant]'
                });

            // faculty
            // const refFaculty = await Faculty.findOne({ _id: faculty }).populate('faculty')
            // if (!refFaculty) return { error: 'Sorry Faculty not found' };
            faculty = faculty.toUpperCase();
            const facultyResult = await facultyHelper(faculty);
            if (facultyResult.error) return res.send(facultyResult);
            else faculty = facultyResult;

            //department
            const departmentResult = await departmentHelper(faculty.code, department);
            if (departmentResult.error) return res.send(departmentResult);
            else department = departmentResult
        }
        else {
            dayOff = 'Saturday';
            role = undefined;
            faculty = undefined;
            department = undefined;
        }

        //setting the automatic Id
        const typeStaff = await StaffMember.find({ type: type });
        // const num = typeStaff.length + 1;
        const num = parseInt(typeStaff[typeStaff.length - 1].gucId.split("-")[1]) + 1

        var idRole = 'HR';
        if (type === 'Academic Member') {
            idRole = 'AC'
        }

        const temp = idRole + '-' + num;
        const gucId = temp;

        const attendanceRecord = [];
        const courses = [];
        const password = await bcrypt.hash('123456', 12);

        const newStaffMember = await StaffMember.create({
            gucId,
            name,
            gender,
            email,
            salary,
            officeLocation,
            type,
            role,
            dayOff,
            faculty,
            department,
            attendanceRecord,
            courses,
            password
        });

        return res.send({ data: newStaffMember });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.updateStaff = async function (req, res) {
    try {
        let JOI_Result = await validation.updateSchema.validateAsync(req.body)

        const gucId = req.body.gucId;
        const leaveBalance = req.body.leaveBalance;
        let faculty = req.body.faculty;
        const department = req.body.department;
        const salary = req.body.salary;

        if (!req.body.gucId) return res.send({ error: 'Please enter the GUC-ID ' });
        const newStaff = await StaffMember.findOne({ gucId: req.body.gucId });
        if (!newStaff)
            return res.send({ error: 'No staff with this id' });

        if (req.body.leaveBalance) newStaff.leaveBalance = leaveBalance;

        if (req.body.faculty && req.body.department && newStaff.type === 'Academic Member') {
            const oldDep = await Department.findOne({ _id: newStaff.department })
            if (oldDep) {
                oldDep.HOD = undefined;
                await oldDep.save();
            }
            faculty = faculty.toUpperCase();
            const facultyResult = await facultyHelper(faculty);
            if (facultyResult.error) return res.send(facultyResult);
            else newStaff.faculty = facultyResult;

            const departmentResult = await departmentHelper(faculty, department);
            if (departmentResult.error) return res.send(departmentResult);
            else newStaff.department = departmentResult;
        } else newStaff.faculty = undefined
        if (req.body.department && !req.body.faculty && newStaff.type === 'Academic Member')
            return res.send({ error: 'Sorry Please the new faculty is required' });
        if (req.body.faculty && !req.body.department && newStaff.type === 'Academic Member')
            return res.send({ error: 'Sorry Please the new department is required' });

        if (req.body.officeLocation) {
            const refLocation = await Location.findOne({ location: req.body.officeLocation }).populate('officeLocation');
            if (!refLocation) return { error: 'Sorry room not found' };

            const locResult = await locationHelper(req.body.officeLocation);
            if (locResult.error) return res.send(locResult);
            else newStaff.officeLocation = locResult;
        }

        if (req.body.salary) newStaff.salary = req.body.salary

        await newStaff.save();

        const user = req.body;
        const result = await updateInfoHelper(user);

        return res.send(result);
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.updateStaffDayOff = async function (req, res) {
    try {
        let JOI_Result = await validation.updateSchema.validateAsync(req.body)

        const gucId = req.body.gucId;
        const dayOff = req.body.dayOff;

        if (!req.body.gucId) return res.send({ error: 'Please enter the GUC-ID ' });
        const newStaff = await StaffMember.findOne({ gucId: req.body.gucId });
        if (!newStaff)
            return res.send({ error: 'No staff with this id' });
        if (newStaff.type === 'HR')
            return res.send({ error: 'Sorry days off for HR is Saturday' });

        // update day off based on the request result
        const requests = await Request.find({ type: 'Change DayOff' })

        let r;
        if (requests.length > 0) {
            r = requests[requests.length - 1]
            if (r.status === 'accepted') {
                newStaff.dayOff = r.newDayOff;

                const newNotification = new Notification({
                    reciever: r.sender,
                    message: `Your change day off request was changed successfully`
                });
                await newNotification.save()
                return res.send({ data: 'Day off changed successfully' });
            } else {
                const newNotification = new Notification({
                    reciever: r.sender,
                    message: `Your change day off request was not changed`
                });
                await newNotification.save()
                return res.send({ error: 'Sorry last request was not accepted' });
            }
        } else {
            const newNotification = new Notification({
                reciever: r.sender,
                message: `Your change day off request was not changed`
            });
            await newNotification.save()
            return res.send({ error: 'Sorry no change day off request was found' });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.deleteStaff = async function (req, res) {
    try {
        let JOI_Result = await validation.updateSchema.validateAsync(req.body)

        const gucId = req.body.gucId;

        if (!gucId) return res.send({ error: 'Please enter GUC-ID' });

        const staff = await StaffMember.findOne({ gucId: gucId });
        if (!staff)
            return res.send({ error: 'No staff with this ID' });

        // remove from HOD in any department
        const allDepartments = await Department.find();
        allDepartments.forEach(async (dep) => {
            if (dep.HOD == staff.id) {
                dep.HOD = undefined
                await dep.save();
            }
        });

        // remove from CC in any course and any slots assigned
        const allCourses = await Course.find();
        allCourses.forEach(async (course) => {
            //if CC of the course remove it 
            if (course.courseCoordinator == staff.id) {
                course.courseCoordinator = undefined
            }
            //looping through the slots if the course
            const allCourseSlots = course.slots;
            allCourseSlots.forEach(async (slot) => {
                //if staff was assigned to a slot .. remove it
                if (slot.isAssigned == staff.id) {
                    slot.isAssigned = null;
                }
            })

            //update course coverage
            const temp = (course.slots.filter((slot) => slot.isAssigned !== null).length);
            const length = course.slots.length

            if (length == 0)
                course.coverage = 0
            else
                course.coverage = (temp / length) * 100

            await course.save();
        });

        //when deleted .. location is removed so will not be occupied

        // const deletedStaff = await staff.save();
        await StaffMember.findOneAndDelete({ gucId: gucId })
        return res.send({ data: 'Staff deleted successfully' });

    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.signIn = async function (req, res) {
    try {
        const gucId = req.user.gucId;

        if (!gucId) return res.send({ error: 'Please enter GUC-ID' });

        const staff = await StaffMember.findOne({
            gucId: gucId,
            is_deleted: { $ne: true },
        });
        if (!staff)
            return res.send({ error: 'Staff not registered in the system' });
        else {
            const currentTime = new Date();
            if (currentTime.getDay() === 5)
                return res.send({ error: 'Sorry you cannot sign in on Friday' });

            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            let hours = currentTime.getHours() > 9 ? currentTime.getHours() : "0" + currentTime.getHours();
            let minutes = currentTime.getMinutes() > 9 ? currentTime.getMinutes() : "0" + currentTime.getMinutes();
            let seconds = currentTime.getSeconds() > 9 ? currentTime.getSeconds() : "0" + currentTime.getSeconds();

            let time = hours + ":" + minutes + ":" + seconds;

            let month = (currentTime.getMonth() + 1) > 9 ? (currentTime.getMonth() + 1) : "0" + (currentTime.getMonth() + 1)
            let day = currentTime.getDate() > 9 ? currentTime.getDate() : "0" + currentTime.getDate();

            if (currentTime.getHours() < 7)
                time = '07:00:00'
            if (currentTime.getHours() > 19)
                time = '19:00:00'

            const newAttendance = {
                day: days[currentTime.getDay()],
                date:
                    currentTime.getFullYear() +
                    '-' +
                    month +
                    '-' +
                    day,
                startTime: time,
                status: 'Present',
            };

            const attendanceRecord = staff.attendanceRecords;
            const result = await attendanceRecord.find(
                ({ date }) => date === newAttendance.date
            );

            attendanceRecord.push(newAttendance);
            staff.attendanceRecords = attendanceRecord;

            const updatedStaff = await staff.save();

            return res.send({ data: "Signed in Successfully" });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.signOut = async function (req, res) {
    try {
        const gucId = req.user.gucId;

        if (!gucId)
            return res.send({ error: "Please enter the GUC-ID" });

        const staff = await StaffMember.findOne({ gucId: gucId, is_deleted: { $ne: true } })
        if (!staff)
            return res.send({ error: "Staff not registered in the system" });
        else {
            const today = new Date();

            let hours = today.getHours() > 9 ? today.getHours() : "0" + today.getHours();
            let minutes = today.getMinutes() > 9 ? today.getMinutes() : "0" + v.getMinutes();
            let seconds = today.getSeconds() > 9 ? today.getSeconds() : "0" + today.getSeconds();

            let time = hours + ":" + minutes + ":" + seconds;


            let month = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1)
            let day = today.getDate() > 9 ? today.getDate() : "0" + today.getDate();


            const currentDate = today.getFullYear() + '-' + month + '-' + day;
            let currentTime = hours + ":" + minutes + ":" + seconds;

            if (today.getHours() < 7)
                time = '07:00:00'
            if (today.getHours() > 19)
                currentTime = '19:00:00'

            let found = false;

            const attendanceRecord = staff.attendanceRecords;
            if (attendanceRecord.length > 0 && attendanceRecord[attendanceRecord.length - 1].date === currentDate) {
                if (attendanceRecord[attendanceRecord.length - 1].startTime && !attendanceRecord[attendanceRecord.length - 1].endTime) {
                    attendanceRecord[attendanceRecord.length - 1].endTime = currentTime;
                    staff.attendanceRecords = attendanceRecord;
                    const updatedStaff = await staff.save();
                    return res.send({ data: updatedStaff.attendanceRecords });
                }
            }


            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            if (days[today.getDay()] === 'Friday') {
                return res.send({ error: 'Sorry you cannot sign out on Friday' });
            }

            const newRec = {
                day: days[today.getDay()],
                date: currentDate,
                status: 'Present',
                endTime: currentTime
            }

            attendanceRecord.push(newRec);
            staff.attendanceRecords = attendanceRecord;

            const updatedStaff = await staff.save();

            return res.send({ data: "Signed out Successfully" });
        }
    } catch (err) {
        if (err.isJoi) {
            return res.send({ error: err.details[0].message });
            return res.send({ error: err });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
};

exports.changePassword = async function (req, res) {
    try {
        let JOI_Result = await validation.changePasswordSchema.validateAsync(req.body)

        const user = req.user;
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;

        if (!newPassword)
            return res.send({ error: 'Please enter the new password' });
        if (!oldPassword)
            return res.send({ error: 'Please enter the old password' });

        const userToEdit = await StaffMember.findOne({ gucId: user.gucId });
        if (!userToEdit)
            return res.send({ error: 'No user' });

        //Checking if oldPassword matches the user password
        const check = await bcrypt.compare(oldPassword, userToEdit.password);
        if (check) {
            // const salt = await bcrypt.genSalt(12);
            userToEdit.password = await bcrypt.hash(newPassword, 12);
            const updatedStaff = await userToEdit.save();
            return res.send({ data: "Password changed successfully" });
        } else {
            return res.send({ error: 'wrong password' });
        }
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.updateProfile = async function (req, res) {
    try {
        let user = req.user;
        req.body.gucId = req.user.gucId;

        user = req.body;
        const result = await updateInfoHelper(user);

        return res.send(result);
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }

        console.log(err)
        return res.send({ error: err })
    }
}

exports.getProfile = async function (req, res) {
    try {
        const user = req.user;
        const staff = await StaffMember.findOne({ gucId: user.gucId });
        if (!staff)
            return res.send({ error: 'No user' });

        let newStaff = {
            gucId: staff.gucId,
            name: staff.name,
            email: staff.email,
            dayOff: staff.dayOff,
            gender: staff.gender,
            type: staff.type,
            salary: staff.salary,
            officeLocation: staff.officeLocation,
            registeredDate: staff.registeredDate
        }

        if (!staff.officeLocation)
            newStaff.officeLocation = 'N/A'


        if (staff.type === 'Academic Member') {
            newStaff.role = staff.role
            newStaff.courses = staff.courses
        }

        return res.send({ data: newStaff });
    } catch (err) {
        console.log(err)
        return res.send({ error: err })
    }
}

//Function 20: Update the salary of a staff member.
exports.updateSalary = async function (req, res) {
    try {
        //no need to check if it is the same person or not (answered on piazza "I know it does not make ay scence")
        let JOI_Result = await validation.updateSalarySchema.validateAsync(req.body)

        const { id, newSalary } = req.body;
        if (!id || !newSalary) {
            res.send({ error: "The id/salary should be specified" });
            return;
        }
        updatedStaff = await StaffMember.findOneAndUpdate({ gucId: id }, { salary: newSalary });
        if (!updatedStaff) {
            res.send({ error: `The ID: ${id} is not a staff member` });
            return;
        }
        attendanceRecordUpdated = await updatedStaff.save();
        res.send({ data: `Salary is updated successfully to ${newSalary}` });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.getSalary = async function (req, res) {
    try {
        const targetAc = await StaffMember.findOne({ gucId: req.params.gucId });

        // Case: ac not found
        if (!targetAc)
            return res.status(404).send({
                error: errorMsgs.notFound('academic member', `id ${req.params.gucId}`),
            });

        allStaff = await StaffMember.find();
        if (!allStaff) return res.send({ error: 'There no staff in the system yet' });
        const allMissing = await require('./attendanceController').getStaffMissingHoursDays(allStaff);

        const acIndex = allMissing.findIndex((staff) => staff.GUCID === targetAc.gucId);

        // Case: AC is not on the returned array (does not have any missings)
        if (acIndex === -1) return res.status(200).send({ salary: targetAc.salary });

        //Case: AC Exist => Get the salary
        // MissingDays ==> Salary -= (Salary / 60 ) * days
        // MissingHours ==> Salary -= (Salary / 180 ) * hours
        // MissingMinutes ==> Salary -= (Salary / 10800 ) * minutes
        const missingDays = allMissing[acIndex].MissingDays;
        const missingHours = allMissing[acIndex].MissingHours.split(' ')[0] > 2 ? allMissing[acIndex].MissingHours.split(' ')[0] : 0;
        const missingMinutes = missingHours > 2 ? allMissing[acIndex].MissingHours.split(' ')[2] : 0;
        const originalSalary = targetAc.salary;
        const newSalary = originalSalary - (originalSalary / 60) * missingDays - (originalSalary / 180) * missingHours - (originalSalary / 10800) * missingMinutes;

        return res.status(200).send({ salary: newSalary });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ JOI_validation_error: err.details[0].message });
        }
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
};

//Function 39: View their schedule. Schedule should show teaching activities and replacements if present. 
exports.viewMySchedule = async (req, res) => {
    try {
        const id = req.user.gucId;
        const staff = await StaffMember.findOne({ gucId: id });
        if (!staff) {
            res.send({ error: `There is no staff member with ID ${id}` })
            return;
        }
        if (staff.type !== 'Academic Member') {
            res.send({ error: 'You are not authorized to go this page' });
            return;
        }
        originalSlots = await this.viewOriginalSchedule(staff._id);
        repSlots = await viewReplacementSlots(staff._id);
        if (typeof (originalSlots) !== 'string' && typeof (repSlots) !== 'string') {
            res.json(originalSlots.concat(repSlots));
        } else if (typeof (originalSlots) !== 'string') {
            res.json(originalSlots);
        } else if (typeof (repSlots) !== 'string') {
            res.json(repSlots);
        } else {
            res.send(originalSlots + "\n" + repSlots);
        }
    } catch (err) {
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.viewOriginalSchedule = async function (objId) {
    try {
        const staff = await StaffMember.findOne({ _id: objId });
        if (!staff) {
            return `There is no staff member with ID ${objId}`;
        }
        const teachingCoursesObjIDs = staff.courses;
        teachingCourses = [];
        mySlots = [];
        for (i = 0; i < teachingCoursesObjIDs.length; i++) {
            const teachingCourse = await Course.findById(teachingCoursesObjIDs[i]);
            if (!teachingCourse) {
                return "You do not have the access to view any courses";
            }
            teachingCourses.push(teachingCourse);
        }
        //The original schedule
        for (j = 0; j < teachingCourses.length; j++) {
            courseSlots = teachingCourses[j].slots;
            for (i = 0; i < courseSlots.length; i++) {
                if (courseSlots[i].isAssigned && courseSlots[i].isAssigned.equals(objId)) {
                    locationRoom = await Location.findById(courseSlots[i].location);

                    slotAdded = {
                        day: courseSlots[i].day,
                        time: courseSlots[i].time.getHours() + ":" + courseSlots[i].time.getMinutes(),
                        location: locationRoom.location,
                        course: teachingCourses[j].name
                    }
                    mySlots.push(slotAdded);
                }
            }
        }
        return mySlots;
    } catch (err) {
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

async function viewReplacementSlots(staffObjId) {
    try {
        replacementReq = await Request.find({ type: 'Replacement Request', status: 'accepted', reciever: staffObjId }).lean();
        if (!replacementReq) {
            return 'There is no replacement requests that you accepted before';
        }
        today = new Date();
        todayYear = today.getFullYear();
        todayMonth = today.getMonth() + 1;
        todayDay = today.getDate();

        repSlots = [];
        for (i = 0; i < replacementReq.length; i++) {
            repYear = replacementReq[i].replacemntDate.getFullYear();
            repMonth = replacementReq[i].replacemntDate.getMonth() + 1;
            repDay = replacementReq[i].replacemntDate.getDate();

            //Check that the replacement date is not overdue
            if (repYear > todayYear || (repYear === todayYear && repMonth > todayMonth) || (repYear === todayYear && repMonth === todayMonth && repDay >= todayDay)) {
                repWeekDayNum = replacementReq[i].replacemntDate.getDay();
                repWeekDay = 'Sunday';
                switch (repWeekDayNum) {
                    case 1: repWeekDay = 'Monday'; break;
                    case 2: repWeekDay = 'Tuesday'; break;
                    case 3: repWeekDay = 'Wednesday'; break;
                    case 4: repWeekDay = 'Thursday'; break;
                    case 5: repWeekDay = 'Friday'; break;
                    case 6: repWeekDay = 'Saturday'; break;
                    default: repWeekDay = 'Sunday'; break;
                }
                repSlotAdded = {
                    day: repWeekDay,
                    time: replacementReq[i].replacemntDate,
                    location: replacementReq[i].location,
                    course: replacementReq[i].coursename
                }
                repSlots.push(repSlotAdded);
            }
        }
        return repSlots;
    } catch (err) {
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.updateLogin = async function (req, res) {
    try {
        let user = req.user;
        const staff = await StaffMember.findOne({ gucId: user.gucId })
        staff.lastLogIn = new Date();;
        const result = await staff.save();
        return res.send({ data: `updated lastLogin successfully ${result.lastLogin}` });

    } catch (err) {
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}

exports.viewStaffSchedule = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;

        const requester = await StaffMember.findOne({ gucId: user.gucId });
        if (requester.type !== 'Academic Member' && requester.role !== 'Course Instructor') {
            res.send({ error: 'You are not authorized to go this page' });
            return;
        }

        const staff = await StaffMember.findOne({ _id: id });
        if (!staff) {
            res.send({ error: `There is no staff member with ID ${id}` })
            return;
        }

        originalSlots = await this.viewOriginalSchedule(staff._id);
        if (typeof (originalSlots) !== 'string') {
            res.json(originalSlots);
        } else {
            res.send(originalSlots);
        }
    } catch (err) {
        console.log('~ err', err);
        res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
}