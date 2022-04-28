const ObjectId = require('mongoose').Types.ObjectId;

const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Location = require('../models/Location');
const StaffMember = require('../models/StaffMember');

const validation = require('../helpers/validation');

async function locationHelper(officeLocation) {
    //check if room is found
    const refLocation = await Location.findOne({
        location: officeLocation,
        is_deleted: { $ne: true },
    }).populate('officeLocation');
    if (!refLocation) return { error: 'Sorry room not found' };
    else {
        if (refLocation.type == 'Office') {
            return { error: 'Sorry this is an office' };
        } else {
            return refLocation;
        }
    }
}

exports.getCourse = async function (req, res) {
    try {
        if (req.params.faculty.toUpperCase() === 'ALL'
            && req.params.department === 'all'
            && req.params.course === 'all'
        ) {
            const courses = await Course.find()
            return res.send({ data: courses });
        }
        //faculty found
        const facultyCode = req.params.faculty.toUpperCase();
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found? 
        const departmentName = req.params.department;
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName }).populate('department');
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found ?
        const course = req.params.course
        if (course === 'all') {
            const coursesFound = await Course.find({ department: depFound._id })
            return res.send({ data: coursesFound });
        }
        else {
            const courseFound = await Course.findOne({ department: depFound._id, courseName: course })
            if (!courseFound)
                return res.send({ error: "No course with this name" });

            return res.send({ data: courseFound });
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

exports.addCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let { facultyCode, departmentName, courseName } = req.body;

        facultyCode = facultyCode.toUpperCase();

        //all data entered
        if (!departmentName || !courseName || !facultyCode)
            return res.send({ error: "Please enter all details" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found in faculty ? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName }).populate('department');
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found in department?
        const courseFound = await Course.findOne({ department: depFound._id, name: courseName });
        if (courseFound)
            return res.send({ error: "There is another course with this name under this department" });

        const newCourse = {
            department: depFound,
            name: courseName,
            slots: [],
        };

        const courseCreated = await Course.create(newCourse);
        return res.send({ data: courseCreated });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

//TODO: not tested well
exports.updateCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let { facultyCode, departmentName, courseName, newDepartment, newName, newSlot } = req.body;

        facultyCode = facultyCode.toUpperCase();

        //all data entered
        if (!(newSlot || newDepartment))
            return res.send({ error: "Please enter newDepartment and/or newSlot" });

        //faculty found? 
        const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
        if (!facultyFound)
            return res.send({ error: "No faculty with this name" });

        //department found? 
        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName }).populate('department');
        if (!depFound)
            return res.send({ error: "No department with this name" });

        //course found ?
        const courseFound = await Course.findOne({ department: depFound._id, name: courseName });
        if (!courseFound)
            return res.send({ error: "No course with this name" });

        if (newDepartment) {
            const newDepFound = await Department.findOne({ faculty: facultyFound._id, name: newDepartment }).populate('department');
            if (!newDepFound)
                return res.send({ error: "No department with this new name under this faculty" });

            const foundCourse = await Course.findOne({ department: newDepFound, name: courseFound.name }).populate('department');
            if (foundCourse)
                return res.send({ error: "There is another course with the same name under this department" });


            const course = await Course.findOne({ name: courseName })
            courseFound.department = newDepFound;
        }
        if (newName) {
            const nameFound = await Course.findOne({ department: newDepFound, name: courseName });
            if (nameFound)
                return res.send({ error: "Sorry there is another course with this name" });

            courseFound.name = newName;
        }
        if (newSlot.day) {
            if (!newSlot.day || !newSlot.time || !newSlot.location)
                return res.send({ error: 'Please enter all details needed to add a slot' });

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const foundDay = days.find(d => d === newSlot.day)
            if (!foundDay)
                return res.send({ error: 'Sorry day should be one of: ' + days });


            const timings = ['8:15', '10:00', '11:45', '13:45', '15:45', '15:45']
            const foundTime = timings.find(t => t === newSlot.time)
            if (!foundTime)
                return res.send({ error: 'Sorry time should be one of: ' + timings });

            newSlot.time = new Date(`April 23, 2020 ${newSlot.time}:00`);

            const locResult = await locationHelper(newSlot.location.toUpperCase());

            if (locResult.error) return res.send(locResult);
            else newSlot.location = locResult;

            courseFound.slots.push(newSlot);
        }

        const updatedCourse = await courseFound.save();
        return res.send({ data: "Course Updated Successfully" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

exports.deleteCourse = async function (req, res) {
    try {
        let JOI_Result = await validation.courseSchema.validateAsync(req.body)

        let facultyCode = req.body.facultyCode;
        const departmentName = req.body.departmentName;
        const courseName = req.body.courseName;

        facultyCode = facultyCode.toUpperCase();

        if (!courseName || !departmentName || !facultyCode)
            return res.send({ error: "Please enter all details" });

        const facultyFound = await Faculty.findOne({ code: facultyCode });
        if (!facultyFound)
            return res.send({ error: "Sorry no faculty with this name" });

        const depFound = await Department.findOne({ faculty: facultyFound._id, name: departmentName });
        if (!depFound)
            return res.send({ error: "Sorry no department with this name" });

        const courseFound = await Course.findOne({ department: depFound._id, name: courseName });
        if (!courseFound)
            return res.send({ error: "Sorry no course with this name" });

        await Course.findOneAndDelete({ department: depFound._id, name: courseName });
        return res.send({ data: "Course deleted successfully" });
    } catch (err) {
        if (err.isJoi) {
            console.log(' JOI validation error: ', err);
            return res.send({ error: err.details[0].message });
        }
        console.log('~ err', err);
        return res.send({ error: err });
    }
}

//Additional routes (used for frontend)
exports.viewCoursesCC = async function (req, res) {
    try {
        const id = req.user.gucId;
        const staff = await StaffMember.findOne({ gucId: id });
        const courses = await Course.find({ courseCoordinator: staff._id });
        courseNames = courses.map((course) => {
            return course.name;
        })
        res.send({ data: courseNames });
    } catch (e) {
        console.log('~ err', e);
        res.status(500).send({ error: `Internal Server Error: ${e}` });
    }
}