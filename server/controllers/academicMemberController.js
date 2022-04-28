// const { handleError } = require("../utils/handleError");
const mongoose = require('mongoose');
// required models
const StaffMember = require('./../models/StaffMember');

const validation = require('../helpers/validation');
const Department = require('./../models/Department');
const Location = require('./../models/Location');
const Faculty = require('./../models/Faculty');
const Course = require('./../models/Course');

const { populate } = require('./../models/StaffMember');

// General Error  errors
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

const checkRequiredFields = (req, fields) => {
  const keyMyObj = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
      if (Array.isArray(obj[el])) {
        return res;
      } else if (typeof obj[el] === 'object' && obj[el] !== null) {
        return [...res, ...keyMyObj(obj[el], prefix + el + '.')];
      }
      return [...res, prefix + el];
    }, []);

  const keys = keyMyObj(req.body);
  return fields.filter((field) => {
    return !keys.includes(field);
  });
};

// Course Instructor Controller
const courseInstructorController = {
  // ==> Functionality 29 <== //
  async courseCoverage(req, res) {
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      }).populate('courses');

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not teach any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          error: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // Case: success
      return res.status(200).send({
        data: instructor.courses.map((course) => {
          return {
            course_name: course.name,
            course_coverage: course.coverage,
          };
        }),
      });
    } catch (err) {
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 30 <== //
  async slotsAssignment(req, res) {
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });


      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          error: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // Case: success
      return res.status(200).send({
        data: instructor.courses.map((course) => {
          return {
            course_name: course.name,
            course_slots: course.slots
              // Get the slots of the current instructor
              // .filter((slot) => slot.isAssigned && `${slot.isAssigned._id}` === `${instructor._id}`)
              // Map them to only send back the day, time, location
              .map(({ day, time, location, isAssigned }) => {
                return {
                  day: day,
                  time: `${time.toLocaleString('en-EG').split(',')[1].trim() || time.getHours() + ':' + time.getMinutes()}`,
                  location: location ? location['location'] : 'No location is assigned yet',
                  assignedTo: isAssigned === null ? 'None' : { name: isAssigned.name, id: isAssigned.gucId },
                };
              }),
          };
        }),
      });
    } catch (err) {
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 31 <== //
  async staffMembers(req, res) {
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      // if (instructor.courses.length === 0)
      //   return res.status(200).send({
      //     error: errorMsgs.notAssignedTo('courses', 'instructor'),
      //   });

      let staff = [];
      if (req.params.courseName === 'all') {
        // Case: staff per department
        staff = await StaffMember.find({
          faculty: instructor.faculty,
          department: instructor.department,
        })
          .populate('officeLocation')
          .populate({
            path: 'courses',
            populate: { path: 'slots.location' },
          })
          .populate({
            path: 'courses',
            populate: { path: 'slots.isAssigned' },
          });
      } else {
        // Case: staff per course in department
        const courseFound = await Course.findOne({
          department: instructor.department,
          name: req.params.courseName,
        });

        // Case: course not found
        if (!courseFound) {
          return res.send({
            error: errorMsgs.notFound('course', req.params.courseName),
          });
        }

        staff = await StaffMember.find({
          department: instructor.department,
          courses: courseFound,
        })
          .populate('officeLocation')
          .populate({
            path: 'courses',
            populate: { path: 'slots.location' },
          })
          .populate({
            path: 'courses',
            populate: { path: 'slots.isAssigned' },
          });
      }
      return res.status(200).send(
        staff.length === 0
          ? { data: errorMsgs.notAssignedTo('staff', 'course') }
          : {
            data: staff.map((member) => {
              return {
                gucId: member.gucId,
                name: member.name,
                email: member.email,
                dayOff: member.dayOff,
                courses: member.courses.map(({ name }) => name),
                officeLocation: member.officeLocation.location,
                gender: member.gender,
              };
            }),
          }
      );
    } catch (err) {
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 32 <== //
  async assignSlot(req, res) {
    try {
      const missingFields = checkRequiredFields(req, ['courseName', 'slot.day', 'slot.time']);
      if (missingFields.length > 0) return res.status(400).send(`Please enter these fields: ${missingFields}`);
      await validation.ACSchema.withSlot.validateAsync(req.body);

      // * Get instructor
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });


      // Case: instructor not found
      if (!instructor)
        return res.send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          error: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // * Get Course
      const course = await Course.findOne({
        name: req.body.courseName,
      })
        .populate('courseCoordinator')
        .populate('slots.isAssigned');

      // Case: course not found
      if (!course)
        return res.send({
          error: errorMsgs.notFound('course', `name (${req.body.courseName})`),
        });

      const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

      // Case: this courseInstructor does not have this course
      if (instructorCourse.length === 0)
        return res.send({
          error: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
        });

      const notAssignedSlots = course.slots.filter(({ isAssigned }) => isAssigned === null);

      // Case: all the slots are assigned
      if (notAssignedSlots.length === 0)
        return res.status(200).send({
          error: errorMsgs.allAssigned('slots'),
        });

      const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
        const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
        const hours = parseInt(slotTime[0].split(":")[0]);
        slotTime[0] = hours < 10 ? `0${slotTime[0]}` : slotTime[0];
        const targetTime = req.body.slot.time.split(' ');
        targetTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
      });

      // Case: target slot is not found
      if (targetSlotIndex === -1)
        return res.status(200).send({
          error: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
        });

      // * Get AC
      const targetAC = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        department: instructor.department,
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: AC not found
      if (!targetAC)
        return res.send({
          error: errorMsgs.notFound('academic member', `id ${req.body.gucId}`),
        });

      // Case: current slot is already assigned to anothre TA
      if (course.slots[targetSlotIndex].isAssigned !== null) {
        return res.status(200).send({
          error: errorMsgs.alreadyAssigned('original slot'),
        });
      }

      // Case instructor has a slot in that time
      const acSlots = [];
      targetAC.courses.map(({ slots }) => {
        const mySlots = slots.filter(({ isAssigned }) => isAssigned !== null && `${isAssigned._id}` === `${targetAC._id}`);
        return mySlots.map(({ day, time }) => {
          const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Will have an array with this ['11:45:00', 'AM']
          acSlots.push({ day: day, time: slotTime });
          return { day: day, time: slotTime };
        });
      });

      const currentSlotIndex = acSlots.findIndex(({ day, time }) => {
        const slotTime = time;
        const currentTime = req.body.slot.time.split(' ');
        currentTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === currentTime[0] && slotTime[1] === currentTime[1];
      });

      if (currentSlotIndex !== -1) return res.status(400).send({ error: 'There is a conflit in timing', slotIndex: currentSlotIndex });

      // * Case: everything passed
      // Assign the course slot to this TA
      course.slots[targetSlotIndex].isAssigned = targetAC;
      course.coverage = (course.slots.filter((slot) => slot.isAssigned !== null).length / course.slots.length) * 100;
      await course.save();

      // Push the course to the AC's courses
      await StaffMember.updateOne(
        { _id: targetAC._id },
        {
          $push: {
            courses: course,
          },
        }
      );
      return res.status(200).send({
        data: {
          course: course.name,
          assignedTo: targetAC.name,
          slot: req.body.slot,
        },
      });
    } catch (err) {
      if (err.isJoi) {
        console.log(' JOI validation error: ', err);
        return res.status(400).send(
          err['details'].map((err) => {
            return {
              path: err.path.join('.'),
              message: err.message,
            };
          })
        );
        // return res.send({ JOI_validation_error: err });
      }
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 33 <== //
  async updateSlot(req, res) {
    try {
      const missingFields = checkRequiredFields(req, ['courseName', 'gucId', 'slot.day', 'slot.time']);
      if (missingFields.length > 0) return res.status(400).send(`Please enter these fields: ${missingFields}`);
      await validation.ACSchema.withSlot.validateAsync(req.body);

      // * Get instructor
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // * Get AC
      const targetAC = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        department: instructor.department,
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: AC not found
      if (!targetAC)
        return res.send({
          error: errorMsgs.notFound('Academic Member', `id ${req.body.gucId}`),
        });

      // * Get Course
      const course = await Course.findOne({
        name: req.body.courseName,
        department: targetAC.department
      })
        .populate('courseCoordinator')
        .populate('slots.isAssigned');

      // Case: course not found
      if (!course)
        return res.send({
          error: errorMsgs.notFound('course', `name (${req.body.courseName})`),
        });

      const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

      // Case: this courseInstructor does not have this course
      if (instructorCourse.length === 0)
        return res.send({
          error: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
        });

      const currentSlotIndex = course.slots.findIndex(({ day, time }) => {
        const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
        const hours = parseInt(slotTime[0].split(":")[0]);
        slotTime[0] = hours < 10 ? `0${slotTime[0]}` : slotTime[0];
        const currentTime = req.body.slot.time.split(' ');
        currentTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === currentTime[0] && slotTime[1] === currentTime[1];
      });

      // Case: current slot is not found
      if (currentSlotIndex === -1)
        return res.status(200).send({
          error: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
        });

      // Case: assign the currentSlot to target AC
      if (!req.body.newSlot) {
        if (course.slots[currentSlotIndex].isAssigned === null) return res.send({ error: errorMsgs.notAssigned('current slot', 'You can use the "assign slot" route to assign it') });

        const currAC = course.slots[currentSlotIndex].isAssigned;
        course.slots[currentSlotIndex].isAssigned = targetAC;
        await course.save();

        // if target ta does not have this course, add it to the targetAC's courses
        const newCourse = targetAC.courses.findIndex((el) => `${el._id}` === `${course._id}`) === -1;

        if (newCourse)
          await StaffMember.updateOne(
            { _id: targetAC._id },
            {
              $push: {
                courses: course,
              },
            }
          );

        // if current ta does not have another slots in this course, remove it from the currAC's courses
        const stillHaveSlots = course.slots.filter((slot) => slot.isAssigned !== null && slot.isAssigned._id === currAC._id).length > 0;

        if (!stillHaveSlots) {
          const courseIndex = currAC.courses.findIndex((el) => `${el._id}` === `${course._id}`);
          currAC.courses.splice(courseIndex, 1);
          await currAC.save();
        }

        return res.status(200).send({
          data: {
            course: course.name,
            oldAC: currAC.name,
            newAC: targetAC.name,
            slot: req.body.slot,
          },
        });
      }
      // Case: assign the newSlot (targetSlot) to target TA
      else {
        const missingFields = checkRequiredFields(req, ['courseName', 'gucId', 'slot.day', 'slot.time', 'newSlot.day', 'newSlot.time']);
        if (missingFields.length > 0) return res.status(400).send(`Please enter these fields: ${missingFields}`);

        const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
          const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
          const targetTime = req.body.newSlot.time.split(' ');
          targetTime[0] += ':00';
          return day.toLowerCase() === req.body.newSlot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
        });

        // Case: target slot is not found
        if (targetSlotIndex === -1)
          return res.send({
            error: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
          });

        // If currentSlot is assigned to this TA, check that the new slot is available. Remove from oldSlot. Assign to the newSlot
        if (course.slots[currentSlotIndex].isAssigned !== null && `${course.slots[currentSlotIndex].isAssigned._id}` === `${targetAC._id}`) {
          // Case: want to assign the TA to a new slot and remove the old assignment
          if (course.slots[targetSlotIndex].isAssigned === null) {
            course.slots[currentSlotIndex].isAssigned = null;
            course.slots[targetSlotIndex].isAssigned = targetAC;
            course.coverage = (course.slots.filter((slot) => slot.isAssigned !== null).length / course.slots.length) * 100;
            await course.save();

            return res.status(200).send({
              data: {
                course: course.name,
                assignedTo: targetAC.name,
                oldSlot: req.body.slot,
                newSlot: req.body.newSlot,
              },
            });
          }
          // Case: the target slot is already assigned to another TA
          else return res.status(400).send({ error: errorMsgs.alreadyAssigned('new slot') });
        } else {
          const maleTa = course.slots[currentSlotIndex].isAssigned.gender === 'male';
          return res.status(400).send({
            error: `${errorMsgs.alreadyAssigned('current slot')} to another TA. Please enter ${maleTa ? 'his' : 'her'} ID to re-assign ${maleTa ? 'him' : 'her'}.`,
          });
        }
      }
    } catch (err) {
      if (err.isJoi) {
        console.log(' JOI validation error: ', err);
        return res.status(400).send(
          err['details'].map((err) => {
            return {
              path: err.path.join('.'),
              message: err.message,
            };
          })
        );
      }
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 34 <== //
  async deleteSlot(req, res) {
    try {
      const missingFields = checkRequiredFields(req, ['courseName', 'gucId', 'slot.day', 'slot.time']);
      if (missingFields.length > 0) return res.status(400).send(`Please enter these fields: ${missingFields}`);
      await validation.ACSchema.withSlot.validateAsync(req.body);

      // * Get instructor
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // * Get AC
      const targetAC = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        department: instructor.department,
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: AC not found
      if (!targetAC)
        return res.send({
          error: errorMsgs.notFound('academic member', `id ${req.body.gucId}`),
        });

      // * Get Course
      const course = await Course.findOne({
        name: req.body.courseName,
      })
        .populate('courseCoordinator')
        .populate('slots.isAssigned');

      // Case: course not found
      if (!course)
        return res.send({
          error: errorMsgs.notFound('course', `name (${req.body.courseName})`),
        });

      const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

      // Case: this courseInstructor does not have this course
      if (instructorCourse.length === 0)
        return res.send({
          error: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
        });

      // * Checking the slot cases
      const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
        const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
        const hours = parseInt(slotTime[0].split(":")[0]);
        slotTime[0] = hours < 10 ? `0${slotTime[0]}` : slotTime[0];
        const targetTime = req.body.slot.time.split(' ');
        targetTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
      });

      // Case: target slot is not found
      if (targetSlotIndex === -1)
        return res.status(200).send({
          error: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
        });

      // Case: target slot is not assigned
      if (course.slots[targetSlotIndex].isAssigned === null)
        return res.status(200).send({
          error: errorMsgs.notAssigned('target slot'),
        });

      // * ALl passed
      // Remove the slot assignment
      course.slots[targetSlotIndex].isAssigned = null;
      course.coverage = (course.slots.filter((slot) => slot.isAssigned !== null).length / course.slots.length) * 100;
      await course.save();

      // If the TA is not assigned to any slots, remove the course from targetAC's array
      const stillHaveSlots = course.slots.filter((slot) => slot.isAssigned !== null && `${slot.isAssigned._id}` === `${targetAC._id}`).length > 0;

      if (!stillHaveSlots) {
        const courseIndex = targetAC.courses.findIndex((el) => `${el._id}` === `${course._id}`);
        targetAC.courses.splice(courseIndex, 1);
        await targetAC.save();
      }

      return res.status(200).send({
        data: {
          course: req.body.courseName,
          slot: req.body.slot,
          assignedTo: null,
        },
      });
    } catch (err) {
      if (err.isJoi) {
        console.log(' JOI validation error: ', err);
        return res.status(400).send(
          err['details'].map((err) => {
            return {
              path: err.path.join('.'),
              message: err.message,
            };
          })
        );
      }
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 35 <== //
  async courseCoordinator(req, res) {
    try {
      await validation.ACSchema.withoutSlot.validateAsync(req.body);
      // * Get Course Instructor
      const instructor = await StaffMember.findOne({
        gucId: req.user.gucId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.send({
          error: errorMsgs.notFound('instructor', `id ${req.user.gucId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          error: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // Case: instructor is not assigned to this courses
      const insIsAssigned = instructor.courses.findIndex(({ name }) => name.toLowerCase() === req.body.courseName.toLowerCase()) !== -1;
      if (!insIsAssigned) return res.send({ error: errorMsgs.notAuthorized('assign this Academic Member') });

      // * Get AC
      const targetAC = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        role: 'Teaching Assistant',
        department: instructor.department,
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: AC not found
      if (!targetAC)
        return res.send({
          error: errorMsgs.notFound('Teaching Assistant', `id ${req.body.gucId}`),
        });

      let course = await Course.findOne({ name: req.body.courseName, department: instructor.department });

      // Case: course not found
      if (!course)
        return res.send({
          error: errorMsgs.notFound('course', `id ${req.body.courseName}`),
        });

      // Case: course is already assigned
      if (course.courseCoordinator)
        return res.send({
          error: errorMsgs.alreadyAssigned('course coordinator'),
        });

      // Case: success
      course.courseCoordinator = targetAC;
      await course.save();

      return res.status(200).send({
        data: {
          courseName: course.name,
          courseCoordinator: course.courseCoordinator.name,
        },
      });
    } catch (err) {
      if (err.isJoi) {
        console.log(' JOI validation error: ', err);
        return res.send(
          err['details'].map((err) => {
            return {
              path: err.path.join('.'),
              message: err.message,
            };
          })
        );
      }
      return res.status(500).send({ error: `Internal Server Error: ${err}` });
    }
  },
};

module.exports.courseInstructorController = courseInstructorController;
