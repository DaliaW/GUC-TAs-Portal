const ObjectId = require('mongoose').Types.ObjectId;

//const { request } = require('http');
// const { handleError } = require("../utils/handleError");
// required models

const Request = require('../models/Request');
const StaffMember = require('../models/StaffMember');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Notification = require('../models/Notification');
const Location = require('../models/Location');
const { request } = require('express');
//const { find } = require('../models/Request');
//const { appendFileSync } = require('fs');

//Added
const { populate } = require('./../models/StaffMember');
const validation = require('../helpers/validation');

exports.sendRequest = async function (req, res) {
  try {
    const type = req.body.type;
    //TODO: sender is logged in member from the header
    //  const sender=await StaffMember.findOne({gucID:req.user.gucID });
    const senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    // var sender= await StaffMember.findOne({gucID:senderId}). populate();
    //  senderID:req.user.gucID,
    //let send= await StaffMember.findOne({gucID:senderId }) .populate();
    if (!senderId) return res.send({ error: 'Error getting the sender' });

    if (!type) return res.send({ error: 'Please enter the type of your request' });

    if (type == 'Replacement Request') {
      const recieverId = req.body.recieverId;
      const location = req.body.location;
      const coursename = req.body.course;
      if (recieverId == sender.gucId) {
        return res.send({ error: "Sorry you can't send this Request" });
      }
      //const course=await Course.findOne({name:coursename})


      const date = new Date(Date.parse(req.body.replacementDate));

      if (!date) return res.send({ error: 'Please enter a valid date' });

      // const departmentt=senderInfo. !replacementdate
      if (!recieverId || !location || !coursename || !date) {
        return res.send({ error: 'Please enter all the missing fields' });
      }

      var rec = await StaffMember.findOne({ gucId: recieverId }).populate();
      if (!rec) {
        return res.send({ error: 'Please enter the correct receiver id' });
      }

      var recieverDepartment = rec.department._id;
      var senderdepartment = sender.department._id;
      if (!recieverDepartment.equals(senderdepartment)) {
        return res.send({ error: 'You are not at the same department' });
      }

      var f4 = false;

      var foundCourse = await Course.findOne({ name: coursename }).populate();
      if (!foundCourse) return res.send({ error: 'This course is not found' });

      var loc = await Location.findOne({ location: location });
      if (!loc) return res.send({ error: 'This location is not found' });

      for (i = 0; i < rec.courses.length; i++) {
        if (rec.courses[i]._id.equals(foundCourse._id)) {
          f4 = true;
        }
      }
      if (!f4) {
        return res.send({ error: 'This TA does not teach this course' });
      }

      var flag = false;
      const x1 = new Date(Date.now());
      if (date.getFullYear() == x1.getFullYear()) {
        if (date.getMonth() == x1.getMonth()) {
          if (date.getDate() > x1.getDate()) {
            flag = true; //Ican accept annual leave
          }
        }
        if (date.getMonth() > x1.getMonth()) {
          flag = true;
        }
      }
      if (date.getFullYear() > x1.getFullYear()) {
        flag = true;
      }
      if (!flag) {
        return res.send({ error: 'Sorry you cannot submit this request' });
      }
      if ((date.getHours() != 8 && date.getMinutes() == 15) || (date.getHours() != 10 && date.getMinutes() == 0) || (date.getHours() != 11 && date.getMinutes() == 45) || (date.getHours() != 13 && date.getMinutes() == 45) || (date.getHours() != 15 && date.getMinutes() == 45)) {
        return res.send({ error: 'Please Enter correct Slot Time' });
      }
      // if()
      var recordDay = date.getDay();
      if (recordDay == 5) {
        return res.send({ error: 'Sorry it is Friday ' });
      }
      const subject = type + ' with ' + rec.name + " ID: " + rec.gucId + ' for course ' + coursename + ' at ' + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
      const x = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":00"
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        replacemntDate: date,
        string: x,
        location: location,
        coursename: coursename,
        subject: subject,
      });
      await newRequest.save();
      const name = sender.name;
      const newNotificatin = new Notification({
        reciever: rec,
        message: name + ' ' + senderId + ' has send you a replacement Request',
      });
      await newNotificatin.save();
      //Notification.create(newNotificatin);
      return res.send({ data: newRequest });
    }

    if (type === 'Change DayOff') {
      //TODO to be changed
      const newDayOff = req.body.newDayOff;
      if (!newDayOff) return res.send({ error: 'Please enter all the missing fields' });

      var department = await Department.findOne({ _id: sender.department._id }).populate();
      if (!department) return res.status(400).send({ error: 'This department does not exist.' });
      if (!department.HOD === null) return res.status(400).send({ error: 'This department has no HOD yet.' });

      const recid = department.HOD;

      const rec = await StaffMember.findOne({ _id: recid });
      if (!rec)
        return res.status(400).send({ error: 'No Staff with this Id' });

      const currentDayOff = sender.dayOff;

      if (newDayOff !== 'Saturday' && newDayOff !== 'Sunday' && newDayOff !== 'Monday' && newDayOff !== 'Tuesday' && newDayOff !== 'Wednesday' && newDayOff !== 'Thursday')
        return res.status(400).send({ error: 'Please enter a valid day off' });
      if (currentDayOff === newDayOff) return res.status(400).send({ error: 'This is already your current day off' });

      const subject = type + ' Request from ' + currentDayOff + ' to ' + newDayOff;


      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        newDayOff: newDayOff,
        currentDayOff: currentDayOff,
        subject: subject,
        reason: req.body.reason,
      });

      if (!newRequest.reason) delete newRequest.reason;

      await newRequest.save();
      //const name=sender.name;
      // const newNotificatin = new Notification({
      //   reciever: rec,
      //   message:name+" "+senderId+" has send you a Change DayOff Request"

      // });
      // newNotificatin.save();
      return res.send({ data: newRequest });
    }

    if (type == 'Slot Request') {
      const coursename = req.body.course;

      const date = new Date(Date.parse(req.body.date));
      const locationType = req.body.locationType;
      if (!coursename || !date || !locationType) return res.send({ error: 'Please enter all the missing fields' });
      if (locationType !== 'Tutorial Room' && locationType !== 'Lecture Hall' && locationType !== 'Lab') return res.send({ error: 'Please enter a valid location type' });

      const course = await Course.findOne({ name: coursename });
      if (!course) return res.send({ error: 'This course is not found' });
      if (!date || `${date}` === 'Invalid Date') return res.send({ error: 'Please enter the correct date' });
      const rec = course.courseCoordinator;
      if (!rec) return res.send({ error: 'This course has no course coordinator yet' });

      var flag = false;
      const x1 = new Date(Date.now());

      if (date.getFullYear() == x1.getFullYear()) {
        if (date.getMonth() == x1.getMonth()) {
          if (date.getDate() > x1.getDate()) {
            flag = true; //Ican accept annual leave
          }
        }
        if (date.getMonth() > x1.getMonth()) {
          flag = true;
        }
      }
      if (date.getFullYear() > x1.getFullYear()) {
        flag = true;
      }
      if (!flag) {
        return res.send({ error: 'Sorry you cannot submit this request' });
      }
      //check for the time
      //console.log(date.get)
      if ((date.getHours() != 8 && date.getMinutes() == 15) || (date.getHours() != 10 && date.getMinutes() == 0) || (date.getHours() != 11 && date.getMinutes() == 45) || (date.getHours() != 13 && date.getMinutes() == 45) || (date.getHours() != 15 && date.getMinutes() == 45)) {
        return res.send({ error: 'Please Enter correct Slot Time' });
      }
      // if()
      var recordDay = date.getDay();
      if (recordDay == 5) {
        return res.send({ error: 'Sorry it is Friday ' });
      }
      var Day;
      switch (recordDay) {
        case 1:
          Day = 'Monday';
          break;
        case 2:
          Day = 'Tuesday';
          break;
        case 3:
          Day = 'Wednesday';
          break;
        case 4:
          Day = 'Thursday';
          break;
        case 5:
          Day = 'Friday';
          break;
        case 6:
          Day = 'Saturday';
          break;
        case 0:
          Day = 'Sunday';
          break;
      }

      var foundCourse = await Course.findOne({ name: coursename }).populate();

      var f2;
      for (i = 0; i < sender.courses.length; i++) {
        if (sender.courses[i]._id.equals(foundCourse._id)) {
          f2 = true;
        }
      }

      if (!f2) return res.status(400).send({ error: 'This academic member does not teach this course' });

      const subject = type + ' at ' + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); + ' of course ' + coursename;
      const newRequest = new Request({
        //TODO a4eel el sender
        sender: sender,
        reciever: rec,
        type: type,
        coursename: coursename,
        date: date,
        locationType: locationType,
        subject: subject,
      });
      await newRequest.save();
      return res.status(200).send({ data: newRequest });
    }

    if (type == 'Leave Request') {
      //const department =sender.department;
      var department = await Department.findOne({ _id: sender.department._id }).populate();

      if (!department) return res.send({ error: 'This department does not exist' });

      if (!department.HOD) return res.send({ error: 'This department does not have a HOD yet' });
      const recid = department.HOD._id;
      const rec = await StaffMember.findOne({ _id: recid });
      const leaveType = req.body.leaveType;
      if (!leaveType) return res.send({ error: 'Please enter leave type' });

      if (leaveType == 'Sick') {
        const SickDayDate = new Date(Date.parse(req.body.SickDayDate));
        var reason = req.body.reason || '';
        if (!SickDayDate || `${SickDayDate}` === 'Invalid Date') return res.send({ error: 'Please enter a valid date' });

        var flag = false;
        const x2 = new Date(Date.now());
        if (SickDayDate.getFullYear() == x2.getFullYear()) {
          if (SickDayDate.getMonth() == x2.getMonth()) {
            if (x2.getDate() - SickDayDate.getDate() <= 3 && x2.getDate() - SickDayDate.getDate() >= 0) {
              flag = true; //I can accept annual leave
            }
          }
          if (x2.getMonth() - SickDayDate.getMonth() == 1) {
            var daysInCurrentMonth = new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();

            if (daysInCurrentMonth - SickDayDate.getDate() + x2.getDate <= 3 && daysInCurrentMonth - SickDayDate.getDate() + x2.getDate >= 0) {
              flag = true;
            }
          }
        }
        if (x2.getFullYear() > SickDayDate.getUTCFullYear()) {
          if (SickDayDate.getMonth() == 11 && x2.getMonth() == 0) {
            var daysInCurrentMonth = new Date(SickDayDate.getFullYear(), SickDayDate.getMonth(), 0).getDate();
            if (daysInCurrentMonth - SickDayDate.getDate() + x2.getDate <= 3 && daysInCurrentMonth - SickDayDate.getDate() + x2.getDate >= 0) {
              flag = true;
            }
          } else flag = true;
        }
        if (!flag) return res.send({ error: 'Sorry you Cannot submit this Request' });

        const document = req.body.document;
        if (!document) return res.send({ error: 'Please enter all the required fields' });

        const subject = type + ' (' + leaveType + ') at ' + SickDayDate.getDate() + "/" + (SickDayDate.getMonth() + 1) + "/" + SickDayDate.getFullYear();

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          SickDayDate: SickDayDate,
          document: document,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }

      if (leaveType == 'Compensation') {


        const CompensationDate = new Date(Date.parse(req.body.CompensationDate)); //date
        const LeaveDate = new Date(Date.parse(req.body.LeaveDate));
        const reason = req.body.reason;

        //date
        if (!CompensationDate || !LeaveDate || !reason) return res.send({ error: 'Please enter all the missing fields' });

        var flag = false;

        if (LeaveDate.getFullYear() < CompensationDate.getFullYear()) {
          if (LeaveDate.getMonth() == 11 && CompensationDate.getMonth() == 0) {
            if (LeaveDate.getDate() > 11 && CompensationDate.getDate() < 10) {
              flag = true;
            }
          } else {
            flag = true;
          }
        } else {
          if (LeaveDate.getFullYear() == CompensationDate.getFullYear()) {
            if (LeaveDate.getMonth() == CompensationDate.getMonth()) {

              if (CompensationDate.getDate() > LeaveDate.getDate()) {
                flag = true;
              }
            }
            if (LeaveDate.getMonth() < CompensationDate.getMonth()) {
              if (LeaveDate.getDate() > 11 && CompensationDate.getDate() < 10) {
                flag = true;
              }
            }
          }
        }

        if (!flag) return res.send({ error: 'Please enter a valid compensation & leave date' });

        const AttendanceRecord = sender.attendanceRecords;

        var record;
        var recordDay;

        var recdate;
        var f3;
        for (i = 0; i < AttendanceRecord.length; i++) {
          record = AttendanceRecord[i].date;
          recdate = new Date(Date.parse(record));
          if (recdate == CompensationDate) {
            recordDay = recdate.getDay();
            // console.log(recordDay);
            f3 = true;
            break;
          }
        }
        if (!f3) return res.send({ error: 'Sorry you did not attend this Day' })

        var Day;
        switch (recordDay) {
          case 1:
            Day = 'Monday';
            break;
          case 2:
            Day = 'Tuesday';
            break;
          case 3:
            Day = 'Wednesday';
            break;
          case 4:
            Day = 'Thursday';
            break;
          case 5:
            Day = 'Friday';
            break;
          case 6:
            Day = 'Saturday';
            break;
          case 0:
            Day = 'Sunday';
            break;
        }

        if (Day != sender.dayOff) return res.send({ error: 'Please enter a valid compensation date' });

        // search in his requests that there is no compensation request on the same day
        var f1 = false;
        const request = await Request.findOne({ date: CompensationDate, sender: sender });
        if (request) {
          const leavetype = request.leaveType;
          if (leavetype && request.leavetype == 'Compensation') f1 = true;
        }

        if (f1) return res.send({
          error: 'Sorry you have submitted for with this compensation date before'
        });

        const subject = type + ' (' + leaveType + ') at ' + CompensationDate.getDate() + "/" + (CompensationDate.getMonth() + 1) + "/" + CompensationDate.getFullYear();
        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          CompensationDate: CompensationDate,
          LeaveDate: LeaveDate,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }

      if (leaveType == 'Annual') {
        var reason = req.body.reason || '';

        //should be submitted before targeted day
        const x = req.body.AnnualLeaveDate;
        const AnnualLeaveDate = new Date(Date.parse(x));
        const replacement = req.body.rep || [];

        if (!AnnualLeaveDate) return res.send({ error: 'Please enter all the required fields' });
        if (`${AnnualLeaveDate}` === 'Invalid Date') return res.send({ error: 'Please enter the date in the correct format' });

        // for (i = 0; i < replacement.length; i++) {
        //   var object = replacement[i];
        //   if (!object.id || !object.courseName) return res.status(400).send({ error: 'Please enter all data' });

        //   const rec = await StaffMember.findOne({ gucId: object.id }).populate();
        //   const course = await Course.findOne({ name: object.courseName }).populate();
        //   if ( !rec || !course) return res.send({ error: 'Please enter correct replacement data' }); 
        //   foundReplacementRequest = await Request.findOne(
        //     //a7ot status tany
        //     { type: 'Replacement Request', reciever: rec, status: 'accepted', sender: sender, replacemntDate: AnnualLeaveDate, coursename: object.courseName }
        //   );
        //   if (!foundReplacementRequest) {
        //     return res.send({ error: 'Sorry you cannot submit this request: it is not an accepted replacement' });
        //   }
        // }

        var flag = false;
        const x1 = new Date(Date.now());
        if (AnnualLeaveDate.getFullYear() == x1.getFullYear()) {
          if (AnnualLeaveDate.getMonth() == x1.getMonth()) {
            if (AnnualLeaveDate.getDate() > x1.getDate()) {
              flag = true; //Ican accept annual leave
            }
          }
          if (AnnualLeaveDate.getMonth() > x1.getMonth()) {
            flag = true;
          }
        }
        if (AnnualLeaveDate.getFullYear() > x1.getFullYear()) {
          flag = true;
        }
        if (!flag) {
          return res.send({ error: 'Sorry you cannot submit this request' });
        }
        var recordDay = AnnualLeaveDate.getDay();
        if (recordDay == 5) {
          return res.send({ error: 'Sorry it is Friday ' });
        }
        const subject = type + ' (' + leaveType + ') at ' + AnnualLeaveDate.getDate() + "/" + (AnnualLeaveDate.getMonth() + 1) + "/" + AnnualLeaveDate.getFullYear();

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          AnnualLeaveDate: AnnualLeaveDate,
          replacements: replacement,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }

      if (leaveType == 'Maternity') {
        if (sender.gender !== 'female') return res.send({ error: 'Sorry this type of request is only for females' });
        var reason = req.body.reason || '';
        const doc = req.body.document;
        const startDate = new Date(Date.parse(req.body.startDate));
        if (!doc || !startDate) return res.send({ error: 'Please enter all the missing fields' });
        if (`${startDate}` === 'Invalid Date') return res.send({ error: 'Please enter a valid date' });

        const subject = type + ' (' + leaveType + ') at ' + startDate.getDate() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getFullYear();

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          startDate: startDate,
          document: doc,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.send({ data: newRequest });
      }

      if (leaveType == 'Accidental') {

        var reason = req.body.reason || '';

        if (sender.leaveBalance === 0) return res.send({ error: 'Sorry you cannot because your balance is 0' });

        const AccidentDate = new Date(req.body.AccidentDate);
        if (!AccidentDate || `${AccidentDate}` === 'Invalid Date') return res.send({ error: 'Please enter a valid date' });

        const subject = type + ' (' + leaveType + ') at ' + AccidentDate.getDate() + "/" + (AccidentDate.getMonth() + 1) + "/" + AccidentDate.getFullYear();

        // add status and sender
        const Arr = await Request.find({ type: 'Leave Request', leavetype: 'Accidental', sender: sender, status: 'accepted' });
        //var lucky = await Request.filter({type:"Leave Request" ,leaveType:"Accidental"  });

        const numberOfDays = Arr.length;
        if (numberOfDays >= 6) return res.status(400).send({ error: 'Sorry you exceeded the Accidental Leaves limit which is 6' });

        const newRequest = new Request({
          //TODO a4eel el sender
          sender: sender,
          reciever: rec,
          type: type,
          leavetype: leaveType,
          AccidentDate: AccidentDate,
          reason: reason,
          subject: subject,
        });
        await newRequest.save();
        return res.status(200).send({ data: newRequest });
      } else {
        return res.status(400).send({ error: 'This leave type is not supported.' });
      }
    } else {
      return res.status(404).send({ error: 'This request type is not supported.' });
    }
  } catch (err) {
    // const NewRequest = await Request.post(senderID,recieverId,req.body);

    console.log('~ err', err);
    return res.status(500).send({ error: err });
  }
};

// exports.viewmyReequestsById= async function (req, res) {
//   try{
//   console.log("hereee");
//   var  senderId=req.user.gucId;
//   var sender= await StaffMember.find({gucId:senderId}).populate();
//   //var date=new Date(Date.parse(req.params.date))
//   var ObjectId=req.params.id;
//   console.log("hereee"+ObjectId);
//   var searchQuery = await Request.findOne({ObjectId:ObjectId}).populate()
//   console.log(searchQuery);
//   return res.send({data: searchQuery  });
//   }
//     catch (err) {
//         console.log(err)
//         return res.send({ error: err })
//     }

// }
exports.chechRep = async function (req, res) {
  try {
    const id = req.body.id;
    const courseName = req.body.courseName;
    const senderid = req.user.gucId;
    const dat = req.body.date



    const sender = await StaffMember.findOne({ gucId: senderid }).populate();
    const rec = await StaffMember.findOne({ gucId: id }).populate();
    const course = await Course.findOne({ name: courseName }).populate();
    if (!rec || !course) return res.send({ error: 'Please enter correct replacement data' });


    foundReplacementRequest = await Request.findOne(
      //a7ot status tany
      { type: 'Replacement Request', reciever: rec, sender: sender, coursename: courseName, string: dat, status: 'accepted' }
    );
    console.log(foundReplacementRequest);
    if (!foundReplacementRequest) {
      return res.send({ error: 'Sorry you cannot submit this request: it is not an accepted replacement' });
    }

    return res.send("success")

  }
  catch (err) {
    console.log('~ err', err);
    return res.status(500).send({ error: err });
  }
};
exports.AcceptOrRejectRep = async function (req, res) {
  try {
    const Requestid = req.params.id;

    var NewRequest = await Request.findOne({ _id: Requestid }).populate();
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }
    var id = req.user.gucId;
    var objId = req.user._id;
    var staff = await StaffMember.findOne({ gucId: id }).populate();
    var accepted = false;

    const AcceptOrReject = req.body.AcceptOrReject;
    if (!AcceptOrReject) {
      return res.send({ error: 'please enter AcceptOrReject ' });
    }

    if (req.body.AcceptOrReject === 'accepted') {
      console.log("hnaa")
      var date = NewRequest.replacemntDate;
      const teachingCoursesObjIDs = staff.courses;
      var flag = false;
      teachingCourses = [];

      for (i = 0; i < teachingCoursesObjIDs.length; i++) {
        const teachingCourse = await Course.findById(teachingCoursesObjIDs[i]);
        if (!teachingCourse) {
          return res.send({ error: 'You do not have the access to view any courses' });
        }
        teachingCourses.push(teachingCourse);
      }
      //The original schedule
      for (j = 0; j < teachingCourses.length; j++) {
        courseSlots = teachingCourses[j].slots;
        for (i = 0; i < courseSlots.length; i++) {
          if (courseSlots[i].isAssigned && courseSlots[i].isAssigned.equals(objId)) {
            if (courseSlots[i].time.getDay() == date.getDay() && courseSlots[i].time.getHours() == date.getHours() && courseSlots[i].time.getMinutes() == date.getMinutes()) {
              flag = true; /// a3ml reject
            }
          }
        }
      }
      if (flag) {
        return res.send({ data: 'you cannot accept this request, you do not have this free slot in your Schedule' });
      } else {
        accepted = true;
      }
    }
    else {
      if (AcceptOrReject === 'rejected') {
        accepted = false;
      } else {
        return res.send({ error: 'enter accepted or rejected please' });
      }
    }

    if (accepted) {
      var senderId = NewRequest.sender._id;

      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      NewRequest.status = 'accepted';
      //update the schedule of the Reciever

      //notification

      const newNotificatin = new Notification({
        reciever: sender,
        message: 'your ' + NewRequest.subject + ' was Accepted.',
      });
      await newNotificatin.save();
      await NewRequest.save();
      await sender.save();
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: 'your ' + NewRequest.subject + ' was Rejected.',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
    }

    return res.send({ data: NewRequest.status });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};

exports.AcceptOrRejectChangeDay = async function (req, res) {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    if (!HOD)
      return res.status(404).send({
        error: 'Sorry no staff with this ID',
      });
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

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

    const Requestid = req.params.id;

    var NewRequest = await Request.findOne({ _id: Requestid }).populate();
    console.log(NewRequest);
    var accepted = req.body.accept_or_reject_request;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates

      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();

      console.log(sender)

      sender.dayOff = NewRequest.newDayOff;
      await sender.save();
      await NewRequest.save();

      //notification
      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your Change day off Request was Accepted.',
      });
      await newNotificatin.save();

      return res.send({ data: NewRequest });
    } else {
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      // updates
      NewRequest.status = 'rejected';
      NewRequest.comment = req.body.comment;
      await NewRequest.save();

      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your ' + NewRequest.subject + 'was Rejected.',
      });
      await newNotificatin.save();
      return res.send({ data: NewRequest });
    }
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};

exports.AcceptOrRejectSlot = async function (req, res) {
  try {
    const Requestid = req.params.id;
    var NewRequest = await Request.findOne({ _id: Requestid, reciever: req.user }).populate();
    var accepted = false;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates
      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      // update the schedule of the sender hereee

      await sender.save();
      await NewRequest.save();
      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your Slot Request at' + NewRequest.date + ' was Accepted.',
      });
      await newNotificatin.save();
    } else {
      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your ' + NewRequest.subject + ' was Rejected.',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      await NewRequest.save();
    }
    return res.send({ data: NewRequest });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.AcceptOrRejectLeave = async function (req, res) {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    if (!HOD)
      return res.status(404).send({
        error: 'Sorry no staff with this ID',
      });
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

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

    const Requestid = req.params.id;
    const reciever1 = await StaffMember.findOne({ _id: req.user.id })
    console.log(req.user.id);
    var NewRequest = await Request.findOne({ _id: Requestid, reciever: reciever1 }).populate();
    var accepted = req.body.accept_or_reject_request;
    if (!NewRequest) {
      return res.send({ error: 'there is no request with this id' });
    }

    if (accepted) {
      // updates
      NewRequest.status = 'accepted';
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      //update leave balance of the sender

      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your' + NewRequest.subject + ' was Accepted.',
      });
      await newNotificatin.save();
      if (NewRequest.leaveType == 'Sick') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.SickDayDate.getDay(),
          date: NewRequest.SickDayDate.getFullYear() + '-' + (NewRequest.SickDayDate.getMonth() + 1) + '-' + NewRequest.SickDayDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Sick Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Compensation') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.LeaveDate.getDay(),
          date: NewRequest.LeaveDate.getFullYear() + '-' + (NewRequest.LeaveDate.getMonth() + 1) + '-' + NewRequest.LeaveDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Compensation Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Annual') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.AnnualLeaveDate.getDay(),
          date: NewRequest.AnnualLeaveDate.getFullYear() + '-' + (NewRequest.AnnualLeaveDate.getMonth() + 1) + '-' + NewRequest.AnnualLeaveDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Annual Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Maternity') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.startDate.getDay(),
          date: NewRequest.startDate.getFullYear() + '-' + (NewRequest.startDate.getMonth() + 1) + '-' + NewRequest.startDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Maternity Leave',
        };
        attendanceRecord.push(newAttendance);
      }
      if (NewRequest.leaveType == 'Accidental') {
        const attendanceRecord = staff.attendanceRecords;

        const newAttendance = {
          day: NewRequest.AccidentDate.getDay(),
          date: NewRequest.AccidentDate.getFullYear() + '-' + (NewRequest.AccidentDate.getMonth() + 1) + '-' + NewRequest.AccidentDate.getDate(),
          // startTime:
          //     currentTime.getHours() +
          //     ':' +
          //     currentTime.getMinutes() +
          //     ':' +
          //     currentTime.getSeconds(),
          status: 'Absent',
          absentsatisfied: true,
          absentStatus: 'Accidental Leave',
        };
        attendanceRecord.push(newAttendance);
      }

      await sender.save();
      await NewRequest.save();
    } else {
      var senderId = NewRequest.sender._id;
      var sender = await StaffMember.findOne({ _id: senderId }).populate();
      console.log("here");
      console.log(sender)
      const newNotificatin = new Notification({
        reciever: sender,
        message: 'Your ' + NewRequest.subject + ' was Rejected.',
      });
      await newNotificatin.save();
      // updates
      NewRequest.status = 'rejected';
      NewRequest.comment = req.body.comment;
      await NewRequest.save();
    }
    return res.send({ data: NewRequest });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.CancelRequest = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId });

    var id = req.params.id;
    var searchQuery = await Request.findOne({ _id: id, sender: sender }).populate();
    if (!searchQuery) {
      return res.send({ error: 'there is no such a request' });
    }
    //  console.log(searchQuery.sender+"ayaaa");
    //   console.log(sender);
    // if(!(sender._id==searchQuery.sender)){
    //    return res.send({error:" Soryy you cannot "})
    // //el mafrood el case deh mosta7eel t7sl kda kda

    // }
    if (!(searchQuery.status == 'pending')) {
      return res.send({ error: 'Sorry you cannot cancel this request' });
    }
    await Request.deleteOne({ _id: id });
    return res.send({ data: 'Request deleted successfully' });

  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewmyReequestsByStatus = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    if (req.params.status != 'pending' && req.params.status != 'accepted' && req.params.status != 'rejected') {
      return res.send({ data: 'there is no such a status' });
    }
    var searchQuery = await Request.find({ sender: sender, status: req.params.status }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewmyReequestsByType = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();

    if (req.params.type != 'Replacement Request' && req.params.type != 'Slot Request' && req.params.type != 'Change DayOff' && req.params.type != 'Leave Request') {
      return res.send({ data: 'there is no such a type' });
    }
    var searchQuery = await Request.find({ sender: sender, type: req.params.type }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewRecievedReplacementRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();
    ////if(!req.params){

    var searchQuery = await Request.find({ reciever: rec, type: 'Replacement Request' }).populate();

    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewRecievedRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();
    if (req.params.type != 'Change DayOff' && req.params.type != 'Leave Request') {
      return res.send({ error: error });
    }
    var searchQuery = await Request.find({ reciever: rec, type: req.params.type }).populate();
    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewSlotRequest = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId });
    var searchQuery = await Request.find({ reciever: rec._id, type: 'Slot Request' }).populate('sender');
    return res.send({ data: searchQuery });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};
exports.viewNotification = async function (req, res) {
  try {
    var recId = req.user.gucId;
    var rec = await StaffMember.findOne({ gucId: recId }).populate();

    var searchQuery = await Notification.find({ reciever: rec }).populate(); //or something
    return res.send({
      data: searchQuery.map((Notification) => {
        return {
          Notification: Notification.message,
        };
      }),
    });
  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};


exports.getDayOff = async function (req, res) {
  try {
    const senderId = req.user.gucId;
    var sender = await StaffMember.findOne({ gucId: senderId }).populate();
    return res.send({ data: sender.dayOff });
  }
  catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
}

exports.viewRequestA = async (req, res) => {
  try {

    let request = await Request.findOne({ _id: req.params.id });



    console.log(request);

    // if no request found
    if (!request) {
      return res.send({
        error: "No request is found with this id",
      });
    }

    return res.status(200).send({
      data: { request }
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};






exports.getCourses = async function (req, res) {
  try {
    const senderId = req.user.gucId;

    var instructor = await StaffMember.findOne({ gucId: senderId }).populate('courses');

    if (instructor) {
      var courseNames = instructor.courses.map((course) => course.name);

      return res.send({ data: courseNames });
    }
    else
      return res.send({ error: "this staff has no courses" });
  }
  catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
}



exports.viewmyRequests = async function (req, res) {
  try {
    var senderId = req.user.gucId;
    const sender = await StaffMember.findOne({ gucId: senderId }).populate();
    ////if(!req.params){


    var searchQuery = await Request.find({ sender: sender }).populate(); //or something


    console.log(searchQuery)
    return res.send({ data: searchQuery });

  } catch (err) {
    console.log(err);
    return res.send({ error: err });
  }
};

// Function 37: Accept/reject “slot linking” requests from academic members linked to his/her course.
// Note that once a “slot linking” request is accepted, it should be automatically added to the sender’s schedule.
exports.slotLinkingReqResponse = async (req, res) => {
  try {
    const id = req.user.gucId;
    const { reqNumber, status } = req.body;
    if (!reqNumber || !status) {
      res.send({ error: 'You should specify all the data' });
      return;
    }
    const slotLinkingValid = await validation.validateSlotLinking.validateAsync(req.body);
    course = '';
    const staff = await StaffMember.findOne({ gucId: id });
    if (!staff) {
      res.send({ error: `There is no staff member with ID: ${id}` });
      return;
    }
    if (staff.type !== 'Academic Member') {
      res.send({ error: 'You are not authorized to go this page' });
      return;
    }

    slotRequests = await Request.find({ reciever: staff._id, type: 'Slot Request' }).lean();
    if (!slotRequests) {
      res.send({ error: 'There is no slot-linking requests yet.' });
      return;
    }
    if (reqNumber > slotRequests.length) {
      res.send({ error: 'You must specify a correct slot request number' });
      return;
    }
    const courseCC = await Course.findOne({ name: slotRequests[reqNumber - 1].coursename });
    // console.log(courseCC);
    if (!courseCC.courseCoordinator.equals(staff._id)) {
      res.send({ error: 'You are not authorized to go to this page.' });
      return;
    }
    if (slotRequests[reqNumber - 1].status !== 'pending') {
      res.status(200).send({ error: `You have already responded to this request with ${slotRequests[reqNumber - 1].status}` });
      return;
    }
    slotRequests[reqNumber - 1].status = status;

    if (status === 'accepted') {
      courseSlots = courseCC.slots;
      slotDate = slotRequests[reqNumber - 1].date;
      slotTimeHrs = slotDate.getHours();
      slotTimeMin = slotDate.getMinutes();
      slotDayNum = slotDate.getDay();
      slotDay = 'Sunday';
      switch (slotDayNum) {
        case 1:
          slotDay = 'Monday';
          break;
        case 2:
          slotDay = 'Tuesday';
          break;
        case 3:
          slotDay = 'Wednesday';
          break;
        case 4:
          slotDay = 'Thursday';
          break;
        case 5:
          slotDay = 'Friday';
          break;
        case 6:
          slotDay = 'Saturday';
          break;
        default:
          slotDay = 'Sunday';
          break;
      }
      slotLocation = await Location.find({ type: slotRequests[reqNumber - 1].locationType });
      if (!slotLocation) {
        res.send({ error: `The slot location ${slotRequests[reqNumber - 1].locationType} does not exist` });
        return;
      }
      assignedCourses = 0;
      slotFound = false;
      for (i = 0; i < courseSlots.length; i++) {
        for (j = 0; j < slotLocation.length; j++) {
          if (
            courseSlots[i].day === slotDay &&
            courseSlots[i].time.getHours() === slotTimeHrs &&
            courseSlots[i].time.getMinutes() === slotTimeMin &&
            courseSlots[i].location.equals(slotLocation[j]._id) &&
            !courseSlots[i].isAssigned
          ) {
            courseSlots[i].isAssigned = slotRequests[reqNumber - 1].sender;
            slotFound = true;
          }
          if (courseSlots[i].isAssigned) {
            assignedCourses++;
          }
        }
      }
      if (slotFound) {
        courseCoverage = (assignedCourses / courseSlots.length) * 100;
        const updatedCourses = await Course.findOneAndUpdate({ name: slotRequests[reqNumber - 1].coursename }, { slots: courseSlots, coverage: courseCoverage });
        const saveCourses = await updatedCourses.save();
      } else {
        slotRequests[reqNumber - 1].status = 'rejected';
      }
    }
    const updatedRequests = await Request.findOneAndUpdate({ _id: slotRequests[reqNumber - 1]._id }, { status: slotRequests[reqNumber - 1].status });
    const savedReq = await updatedRequests.save();
    const newNotification = new Notification({
      reciever: slotRequests[reqNumber - 1].sender,
      message: `Your ${slotRequests[reqNumber - 1].subject} was ${status}`,
    });
    await newNotification.save();
    res.status(200).send({ data: `The slot-linking request is ${slotRequests[reqNumber - 1].status} successfully` });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    console.log('~ err', err);
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};

exports.viewRequest = async (req, res) => {
  try {

    let request = await Request.findOne({ _id: req.params.id });

    let sender = await StaffMember.findOne({ _id: request.sender });

    let receiver = await StaffMember.findOne({ _id: request.reciever });

    console.log(request);

    // if no request found
    if (!request) {
      return res.send({
        error: "No request is found with this id",
      });
    }

    return res.status(200).send({
      data: {
        sender: sender.name,
        senderId: sender.gucId,
        reciever: receiver.name,
        recieverId: receiver.gucId,
        requestData: request,
      }
    });
  } catch (err) {
    if (err.isJoi) {
      console.log(' JOI validation error: ', err);
      return res.send({ error: err.details[0].message });
    }
    res.status(500).send({ error: `Internal Server Error: ${err}` });
  }
};