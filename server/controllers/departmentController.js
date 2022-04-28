const ObjectId = require('mongoose').Types.ObjectId;

const StaffMember = require('../models/StaffMember');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

const validation = require('../helpers/validation');

exports.getDepartment = async function (req, res) {
  try {
    if (req.params.faculty === 'all') {
      //get all departments of all faculties
      if (req.params.department === 'all') {
        const result = await Department.find({});
        return res.send({ data: result });
      }
      // search for a specific department under all faculties
      else {
        const result = await Department.findOne({ name: req.params.department });
        if (result) return res.send({ data: result });
        else return res.send({ error: "Sorry no department with this name" });
      }
    }
    else {
      const fac = await Faculty.findOne({ code: req.params.faculty })

      //get all departments of specific faculties
      if (req.params.department === 'all') {
        const result = await Department.find({ faculty: fac });
        return res.send({ data: result });
      }
      // search for a specific department under a specific faculty faculties
      else {
        const result = await Department.findOne({ faculty: fac, name: req.params.department });
        if (result) return res.send({ data: result });
        else return res.send({ error: "Sorry no department with this name under this faculty" });
      }
    }
  } catch (err) {
    console.log('~ err', err);
    return res.send({ error: err });
  }
}

exports.addDepartment = async function (req, res) {
  try {
    let JOI_Result = await validation.departmentSchema.validateAsync(req.body)

    let { facultyCode, depName, HOD } = req.body;

    facultyCode = facultyCode.toUpperCase();

    //all data entered
    if (!facultyCode || !depName)
      return res.send({ error: "Please department name, it is required" });

    //faculty found? 
    let facultyFound = await Faculty.findOne({ code: facultyCode });
    if (!facultyFound)
      return res.send({ error: "No faculty with this code" });

    facultyFound = await (await Faculty.findOne({ code: facultyCode })).populate('faculty');

    //faculty found? 
    const depFound = await Department.findOne({ faculty: facultyFound._id, name: depName })
    if (depFound)
      return res.send({ error: "Sorry there is another department with this name under the this faculty" });

    let staffMember;
    if (HOD) {
      // staff found? 
      staffMember = (await StaffMember.findOne({ gucId: HOD }));
      if (!staffMember)
        return res.send({ error: "No staff member with this ID" });

      staffMember = (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');

      //staff is not TA and not HR 
      if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
        return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

      if (!(staffMember.faculty.equals(facultyFound._id)))
        return res.send({ error: "Sorry Head of the department should be of the same faculty" });

      const depHOD = await Department.findOne({ HOD: staffMember._id })
      if (depHOD)
        return res.send({ error: "Sorry this staff is Head of another department" });
    } else {
      staffMember = undefined;
    }

    const newDep = {
      faculty: facultyFound,
      name: depName,
      HOD: staffMember,
      Courses: [],
    };

    const depCreated = await Department.create(newDep);
    return res.send({ data: depCreated });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    console.log('~ err', err);
    return res.send({ error: err });
  }
}

exports.updateDepartment = async function (req, res) {
  try {
    let JOI_Result = await validation.departmentSchema.validateAsync(req.body)

    let { facultyCode, depName, HOD, newFacultyCode } = req.body;
    facultyCode = facultyCode.toUpperCase();

    //all data entered
    if (!depName)
      return res.send({ error: "Please Department name is required" });
    if (!(HOD || newFacultyCode))
      return res.send({ error: "Please enter either new HOD or newFacultyCode" });

    //faculty found? 
    const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
    if (!facultyFound)
      return res.send({ error: "No faculty with this name" });

    const depFound = await Department.findOne({ faculty: facultyFound, name: depName }).populate('department');
    if (!depFound)
      return res.send({ error: "No department with this name under this faculty" });

    if (HOD) {// staff found? 
      if (HOD === "none") {
        depFound.HOD = undefined;
      }
      else {
        const staffMember = await (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');
        if (!staffMember)
          return res.send({ error: "No staff member with this ID" });

        //staff is not TA and not HR 
        if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
          return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

        //staff of the same faculty?
        if (!(staffMember.faculty.equals(facultyFound._id)))
          return res.send({ error: "Sorry Head of the department should be of the same faculty" });

        const dep = await Department.findOne({ HOD: staffMember._id, })
        if (dep) {
          if (dep.HOD != staffMember.id)
            return res.send({ error: "Sorry this staff is a HOD of another department" });
          else return res.send({ error: "This staff is already the HOD of this department" });
        }

        depFound.HOD = staffMember;
      }
    }

    if (newFacultyCode) {
      const newFacultyFound = await Faculty.findOne({ code: newFacultyCode });
      if (!newFacultyFound)
        return res.send({ error: "No faculty with this new name" });

      const depNewFound = await Department.findOne({ faculty: newFacultyFound, name: depName }).populate('department');
      if (depNewFound)
        return res.send({ error: "There is a department with this name under this faculty you want to change to" });

      depFound.faculty = newFacultyFound;
      depFound.HOD = undefined;
    }

    const updatedDep = await depFound.save();

    return res.send({ data: "Department Updated Successfully" });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    console.log('~ err', err);
    return res.send({ error: err });
  }
}

exports.deleteDepartment = async function (req, res) {
  try {
    let JOI_Result = await validation.departmentSchema.validateAsync(req.body)

    let facultyCode = req.body.facultyCode;
    const depName = req.body.depName;

    facultyCode = facultyCode.toUpperCase();

    if (!depName)
      return res.send({ error: "Please enter the Department name" });

    const facultyFound = await Faculty.findOne({ code: facultyCode });
    if (!facultyFound)
      return res.send({ error: "Sorry no faculty with this name" });

    let depFound = await Department.findOne({ faculty: facultyFound._id, name: depName });
    if (!depFound)
      return res.send({ error: "Sorry no department with this name" });


    const courses = await Course.find({ department: depFound._id })
    for (let i = 0; i < courses.length; i++) {
      courses[i].department = undefined;
      await courses[i].save();
    }

    depFound = await Department.findOneAndDelete({ faculty: facultyFound._id, name: depName });
    return res.send({ data: "Department deleted successfully" });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    console.log('~ err', err);
    return res.send({ error: err });
  }
}

// ============> HOD functionalities <=================

// to get the staff members of a certain department
exports.getAllStaffMembers = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    // case success
    const staffMembers = await StaffMember.find({
      type: { $in: ["Academic Member"] },
      department: departmentFound._id,
    });

    return res.status(200).send({
      data: staffMembers,
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    return res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

exports.getStaffMembersPerCourse = async (req, res) => {
  try {
    //let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    // if (!HOD._id.equals(departmentFound.HOD)) {
    //   return res.send({
    //     error: "Sorry, you don't have access to view this department",
    //   });
    // }

    if (req.params.course === "all") {
      // case success
      const staffMembers = await StaffMember.find({
        type: { $in: ["Academic Member"] },
        department: departmentFound._id,
      });
      return res.status(200).send({
        data: staffMembers,
      });
    } else {
      let courseFound = await Course.findOne({
        department: departmentFound,
        name: req.params.course,
      }).populate();
      // if no course found
      if (!courseFound) {
        return res
          .status(404)
          .send({
            message: `No course found with this name ${req.params.course} under your department`,
          });
      }

      // case success
      const staffMembers = await StaffMember.find({
        type: { $in: ["Academic Member"] },
        department: departmentFound._id,
        courses: courseFound,
      });

      return res.status(200).send({
        data: staffMembers,
      });
    }

  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    return res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
};

// view day off for all staff members of this department
exports.viewDayOff = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    const staffMembers = await StaffMember.find({
      type: { $in: ["Academic Member"] },
      department: departmentFound._id,
    });
    return res.status(200).send({
      data: staffMembers.map((staffMember) => {
        return {
          gucId: staffMember.gucId,
          name: staffMember.name,
          dayOff: staffMember.dayOff,
        };
      }),
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    return res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

exports.viewDayOffStaff = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    const staffMember = await StaffMember.findOne({
      type: { $in: ["Academic Member"] },
      gucId: req.params.idStaff,
      department: departmentFound._id,
    });

    // case no staff member found
    if (!staffMember) {
      return res.status(404).send({
        error: `No staff member found with this id under that course`,
      });
    }

    return res.status(200).send({
      data: { gucId: staffMember.gucId, name: staffMember.name, dayOff: staffMember.dayOff },
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    return res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

// view the course coverage of each course
exports.viewCourseCoverage = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    let courses = await Course.find({ department: departmentFound._id });

    // if no courses found for this department
    if (!courses) {
      return res.send({
        error: "No courses found for this department",
      });
    }

    return res.status(200).send({
      data: courses.map((course) => {
        return {
          course: course.name,
          coverage: course.coverage
        }
      }),
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

//////////
exports.assignInstructor = async (req, res) => {
  try {
    let instructorId = req.body.gucId;
    let courseName = req.body.name;
    let JOI_Result = await validation.departmentAssignmentSchema.validateAsync({ instructorId, courseName })

    if (!instructorId || !courseName)
      return res.send({ error: "Please enter all the details" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId, role: "Course Instructor" }).populate('HOD');
    // if there's no HOD found
    if (!HOD) {
      return res
        .status(404)
        .send({
          error: `No HOD found with this id`,
        });
    }

    let departmentFound = await Department.findOne({
      _id: req.user.department,
      faculty: req.user.faculty
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with that id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate();

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const course = await Course.findOne({
      department: departmentFound._id,
      name: courseName,
    }).populate();

    if (!course) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} in your department`,
      })
    }

    // case instructor doesn't have any courses assigned in this department
    if (instructor.courses.length === 0) {
      instructor.courses.push(course);
      await instructor.save();
    }

    // case he have already assigned courses
    else {
      let repeatedCourse = false;
      for (let i = 0; i < instructor.courses.length; i++) {
        // check that this course is not already assigned to this instructor
        if ((instructor.courses[i]).equals(course._id)) {
          repeatedCourse = true;
          break;
        }
      }

      if (repeatedCourse === true) {
        return res.send({
          error: `Sorry, this course is already assigned to instructor ${instructorId}`,
        })
      }
      else {
        instructor.courses.push(course);
        await instructor.save();
      }
    }

    return res.status(200).send({
      data: {
        error: `Course assigned to ${instructorId} successfully`,
        course: courseName,
        assigned_To: instructorId,
      }
    });

  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
}

exports.updateInstructor = async function (req, res) {
  try {
    let instructorId = req.body.gucId;
    let newCourseName = req.body.newName;
    let courseName = req.body.oldName;
    let JOI_Result = await validation.departmentAssignmentSchema.validateAsync({ instructorId, courseName, newCourseName })

    if (!instructorId || !newCourseName || !courseName)
      return res.send({ error: "Please enter all needed info" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
      faculty: req.user.faculty
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with this id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate('courses');

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const newCourse = await Course.findOne({
      department: departmentFound._id,
      name: newCourseName,
    });

    const oldCourse = await Course.findOne({
      department: departmentFound._id,
      name: courseName,
    });

    if (!newCourse || !oldCourse) {
      return res.send({
        error: `Sorry, there's no course with this name in your department`,
      })
    }

    for (let i = 0; i < instructor.courses.length; i++) {
      if ((instructor.courses[i]).equals(oldCourse._id)) {
        instructor.courses[i] = newCourse;

        const res = await instructor.save();
        const newInst = await StaffMember.findOneAndUpdate({
          gucId: instructorId,
          department: departmentFound._id,
          type: 'Academic Member',
          role: 'Course Instructor'
        }, { courses: instructor.courses });
        break;
      }
    }

    return res.status(200).send({
      data: {
        error: `Course assigned to ${instructorId} successfully`,
        course: newCourse,
        assigned_To: instructorId,
      }
    });

  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
}

exports.deleteInstructor = async function (req, res) {
  try {
    let instructorId = req.body.gucId;
    let courseName = req.body.name;
    let JOI_Result = await validation.departmentAssignmentSchema.validateAsync({ instructorId, courseName }) //departmentAssignmentSchema

    if (!instructorId || !courseName)
      return res.send({ error: "Please enter all the details" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with that id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate('courses');

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const course = await Course.findOne({
      department: departmentFound._id,
      name: courseName,
    }).populate();

    if (!course) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} in your department`,
      })
    }

    let deleteInstructor = false;

    // case instructor doesn't have any courses assigned in this department
    if (instructor.courses.length === 0) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} assigned to this instructor`,
      })
    }
    // case he have already assigned courses
    else {
      instructor.courses.forEach((item) => {
        // check if that course already have a coverage and if the coverage is zero, then safely delete the instructor from the course
        if (item.coverage === 0) {
          const InstructorIndex = instructor.courses.findIndex((el) => `${el._id}` === `${course._id}`)
          instructor.courses.splice(InstructorIndex, 1);
          deleteInstructor = true;
        }
      })
    }

    if (deleteInstructor) {
      await instructor.save();
      return res.status(200).send({
        data: {
          error: `Course deleted successfully`,
        }
      });
    } else {
      return res.send({
        error: `Sorry, can not delete a course with coverage ${course.coverage} for that instructor`,
      })
    }

  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
}


exports.viewTeachingAssignments = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate(
      "HOD"
    );
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate("department");
    // if there's no department found
    if (!departmentFound) {
      return res.status(404).send({
        error: `No department found with this id ${req.user.department}`,
      });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    const teachingAssigned = await StaffMember.find({
      department: departmentFound._id,
    }).populate("courses");

    if (!teachingAssigned) {
      return res.send({
        error: `sorry, we couldn't find what you are looking for`,
      });
    }

    const targetCourses = await Course.find({
      department: departmentFound._id,
    }).populate("slots");

    if (!targetCourses) {
      return res.send({
        error: `sorry, we couldn't find the courses that you are looking for`,
      });
    }

    if (req.params.course === "all")
      return res.status(200).send({
        data: teachingAssigned.map((staff) => {
          return {
            name: staff.name,
            gucId: staff.gucId,
            courses: staff.courses.map((course) => {
              return {
                courses_assigned: targetCourses
                  .filter((course) => course.slots !== null)
                  .map((targetCourse) => {
                    if (course.equals(targetCourse._id)) {
                      return {
                        course_name: targetCourse.name,
                        course_slots: targetCourse.slots,
                      };
                    }
                  }),
              };
            }),
          };
        }),
      });
    else {
      const courseToFind = await Course.findOne({
        name: req.params.course,
      }).populate({ path: "slots.isAssigned" })
        .populate({ path: "slots.location" });
      return res.status(200).send({
        data: {
          course: courseToFind.name,
          slots: courseToFind.slots
            .filter((slot) => slot.isAssigned !== null)
            .map((slot) => {
              return {
                Assigned_to: {
                  name: slot.isAssigned.name,
                  gucId: slot.isAssigned.gucId,
                },
                Day: slot.day,
                Location: slot.location.location,
                Time: `${slot.time.toLocaleString('en-EG').split(',')[1].trim() || slot.time.getHours() + ':' + slot.time.getMinutes()}`,
              };
            }),
        },
      });
    }
  } catch (err) {
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

// view the course coverage of each course
exports.viewCourses = async (req, res) => {
  try {
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }

    let courses = await Course.find({ department: departmentFound._id });

    // if no courses found for this department
    if (!courses) {
      return res.send({
        error: "No courses found for this department",
      });
    }

    return res.status(200).send({
      data: courses.map((course) => {
        return {
          course: course.name,
          id: course._id
        }
      }),
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};