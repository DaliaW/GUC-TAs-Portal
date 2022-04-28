
const StaffMember = require('../models/StaffMember');
const Location = require('../models/Location');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

const bcrypt = require('bcryptjs');


//seeding the database
exports.seedDB = async function () {

    //locations 
    //Office --> A
    //Tutorial Room --> B
    //Lab --> C
    //Halls --> H
    const locations = [
        {
            type: 'Office',
            location: 'A1.001',
            capacity: 10,
        },
        {
            type: 'Office',
            location: 'A1.002',
            capacity: 10,
        },
        //limited office capacity
        {
            type: 'Office',
            location: 'A1.003',
            capacity: 2,
        },
        {
            type: 'Tutorial Room',
            location: 'B1.001',
            capacity: 20,
        },
        {
            type: 'Tutorial Room',
            location: 'B1.002',
            capacity: 20,
        },
        {
            type: 'Tutorial Room',
            location: 'B1.003',
            capacity: 20,
        },
        {
            type: 'Lab',
            location: 'C1.001',
            capacity: 15,
        },
        {
            type: 'Lab',
            location: 'C1.002',
            capacity: 15,
        },
        {
            type: 'Lab',
            location: 'C1.003',
            capacity: 15,
        },
        {
            type: 'Lecture Hall',
            location: 'H1',
            capacity: 150,
        },
        {
            type: 'Lecture Hall',
            location: 'H2',
            capacity: 150,
        },
        {
            type: 'Lecture Hall',
            location: 'H3',
            capacity: 150,
        },
    ]

    await Location.insertMany(locations);
    console.log('Seeded locations successfully');

    //Faculties 
    const faculties = [
        {
            code: 'ENG',
            name: 'Engineering'
        },
        {
            code: 'PHARM',
            name: 'Pharmacy'
        },
        {
            code: 'LAW',
            name: 'Law'
        },
        {
            code: 'ARCH',
            name: 'Architecture'
        },
        {
            code: 'MNGT',
            name: 'Management'
        },
    ]

    await Faculty.insertMany(faculties);
    console.log('Seeded faculties successfully');

    //departments
    const facENG = await Faculty.findOne({ code: 'ENG' });
    const facPHARM = await Faculty.findOne({ code: 'PHARM' });
    const facMNGT = await Faculty.findOne({ code: 'MNGT' });

    const departments = [
        //engineering
        {
            faculty: facENG,
            name: 'MET'
        },
        {
            faculty: facENG,
            name: 'IET'
        },
        {
            faculty: facENG,
            name: 'Mechatronics'
        },

        //pharmacy 
        {
            faculty: facPHARM,
            name: 'Pharmacy'
        },
        {
            faculty: facPHARM,
            name: 'Biotechnology'
        },

        //MNGT
        {
            faculty: facMNGT,
            name: 'Management'
        },
        {
            faculty: facMNGT,
            name: 'Business'
        },
        {
            faculty: facMNGT,
            name: 'Business Informatics'
        },
    ]

    await Department.insertMany(departments);
    console.log('Seeded departments successfully');

    //courses
    const depMET = await Department.findOne({ name: 'MET' });
    const depBI = await Department.findOne({ name: 'Business Informatics' });
    const courseLoc1 = await Location.findOne({ location: 'B1.001' });
    const courseLoc2 = await Location.findOne({ location: 'B1.002' });

    const courses = [
        {
            department: depMET,
            name: 'Computer Science 1',
            slots: [
                {
                    day: 'Saturday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Saturday',
                    time: new Date('2020-12-12T10:00:00'),
                    location: courseLoc2,
                },
                {
                    day: 'Sunday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Monday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc2,
                }
            ]
        },
        {
            department: depMET,
            name: 'Computer Science 3',
            slots: [
                {
                    day: 'Saturday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Sunday',
                    time: new Date('2020-12-12T10:00:00'),
                    location: courseLoc2,
                },
            ]
        },
        {
            department: depMET,
            name: 'Advanced Computer Lab',
            slots: [
                {
                    day: 'Thursday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Wednesday',
                    time: new Date('2020-12-12T10:00:00'),
                    location: courseLoc2,
                },
                {
                    day: 'Wednesday',
                    time: new Date('2020-12-12T11:45:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Tuesday',
                    time: new Date('2020-12-12T13:45:00'),
                    location: courseLoc2,
                },
            ]
        },
        {
            department: depBI,
            name: 'Computer Science 1',
            slots: [
                {
                    day: 'Wednesday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Saturday',
                    time: new Date('2020-12-12T10:00:00'),
                    location: courseLoc2,
                },
                {
                    day: 'Sunday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                },
                {
                    day: 'Monday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc1,
                }
            ]
        },
        {
            department: depBI,
            name: 'Computer Science 3',
            slots: [
                {
                    day: 'Saturday',
                    time: new Date('2020-12-12T08:15:00'),
                    location: courseLoc2,
                },
                {
                    day: 'Sunday',
                    time: new Date('2020-12-12T10:00:00'),
                    location: courseLoc1,
                },
            ]
        },
    ]

    await Course.insertMany(courses);
    console.log('Seeded courses successfully');

    //staff members 
    const office1 = await Location.findOne({ location: 'A1.001', });
    const office2 = await Location.findOne({ location: 'A1.002', });
    const office3 = await Location.findOne({ location: 'A1.003', });

    //hr
    const hr = [
        //no attendance records
        // Office office3 should be full
        {
            gucId: 'HR-1',
            name: 'Mohammed',
            gender: 'male',
            email: 'mohammed@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office3,
            type: 'HR',
            attendanceRecords: [],
        },
        //1 attendance record 
        // from 8:00 to 16:24 --> no missing/extra hours
        {
            gucId: 'HR-2',
            name: 'Ahmed',
            gender: 'male',
            email: 'ahmed@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office3,
            type: 'HR',
            attendanceRecords: [
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '16:24:00',
                    status: 'Present'
                }
            ],
        },
        //1 attendance record 
        // from 8:00 to 18:24 --> 2 extra hours
        {
            gucId: 'HR-3',
            name: 'Youssef',
            gender: 'male',
            email: 'youssef@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office2,
            type: 'HR',
            attendanceRecords: [
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '18:24:00',
                    status: 'Present'
                }
            ],
        },
        // from 8:00 to 12:20 --> 4:04 missing hours
        {
            gucId: 'HR-4',
            name: 'Adam',
            gender: 'male',
            email: 'adam@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office2,
            type: 'HR',
            attendanceRecords: [
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '12:20:00',
                    status: 'Present'
                }
            ],
        },
    ]

    await StaffMember.insertMany(hr);
    console.log('Seeded HR successfully');

    //Course instructors
    const cs1EngCourse = await Course.findOne({ department: depMET._id, name: 'Computer Science 1' })
    const cs3EngCourse = await Course.findOne({ department: depMET._id, name: 'Computer Science 3' })
    const cs1BICourse = await Course.findOne({ department: depBI._id, name: 'Computer Science 1' })
    const cs3BICourse = await Course.findOne({ department: depBI._id, name: 'Computer Science 3' })

    const CI = [
        //no attendance record
        {
            gucId: 'AC-1',
            name: 'Mohammed',
            gender: 'male',
            email: 'mohammed.abdelfattah@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office3,
            type: 'Academic Member',
            role: 'Course Instructor',
            dayOff: 'Monday',
            attendanceRecords: [],
            faculty: facENG,
            department: depMET,
            courses: [
                cs1EngCourse,
                cs3EngCourse
            ],
        },

        // 4 attendance records 
        // 1 on his day off
        // 1 before 7 AM and 2 after 7 PM 
        {
            gucId: 'AC-2',
            name: 'Sarah',
            gender: 'female',
            email: 'sarah.abdelfattah@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office2,
            type: 'Academic Member',
            role: 'Course Instructor',
            dayOff: 'Monday',
            attendanceRecords: [
                //9:24 hours
                {
                    day: 'Sunday',
                    date: '2020-12-12',
                    startTime: '06:00:00',
                    endTime: '16:24:00',
                    status: 'Present'
                },
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '20:24:00',
                    status: 'Present'
                },
                //7:24 hours
                {
                    day: 'Tuesday',
                    date: '2020-12-14',
                    startTime: '06:00:00',
                    endTime: '14:24:00',
                    status: 'Present'
                },
                //11:00 hours
                {
                    day: 'Wednesday',
                    date: '2020-12-15',
                    startTime: '08:00:00',
                    endTime: '20:24:00',
                    status: 'Present'
                },
            ],
            faculty: facENG,
            department: depMET,
            courses: [
                cs1EngCourse,
                cs3EngCourse
            ],
        },
        // 2 attendance records 
        // 1 less than 8:24 and 1 more than 8:24 --> no missing/extra hours
        {
            gucId: 'AC-3',
            name: 'Reem',
            gender: 'female',
            email: 'reem@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office2,
            type: 'Academic Member',
            role: 'Course Instructor',
            dayOff: 'Monday',
            attendanceRecords: [
                {
                    day: 'Sunday',
                    date: '2020-12-12',
                    startTime: '08:00:00',
                    endTime: '15:24:00',
                    status: 'Present'
                },
                {
                    day: 'Tuesday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '17:24:00',
                    status: 'Present'
                },
            ],
            faculty: facMNGT,
            department: depBI,
            courses: [
                cs1BICourse,
                cs3BICourse
            ],
        },
        // 4 attendance records 
        // one without sign out and two without sign in --> should be considered in missing days
        //one missing hour
        {
            gucId: 'AC-4',
            name: 'Aya',
            gender: 'female',
            email: 'aya@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office2,
            type: 'Academic Member',
            role: 'Course Instructor',
            dayOff: 'Thursday',
            attendanceRecords: [
                {
                    day: 'Sunday',
                    date: '2020-12-12',
                    startTime: '08:00:00',
                    endTime: '15:24:00',
                    status: 'Present'
                },
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    status: 'Present'
                },
                {
                    day: 'Tuesday',
                    date: '2020-12-14',
                    endTime: '17:24:00',
                    status: 'Present'
                },
                {
                    day: 'Wednesday',
                    date: '2020-12-15',
                    endTime: '17:24:00',
                    status: 'Present'
                },
                {
                    day: 'Saturday',
                    date: '2020-12-12',
                    endTime: '17:24:00',
                    status: 'Present'
                },

            ],
            faculty: facMNGT,
            department: depBI,
            courses: [],
        },
    ]

    await StaffMember.insertMany(CI);
    console.log('Seeded CI successfully');

    //Teaching assistants
    const TA = [
        //no attendance record
        {
            gucId: 'AC-5',
            name: 'Yahia',
            gender: 'male',
            email: 'yahia@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office1,
            type: 'Academic Member',
            role: 'Teaching Assistant',
            dayOff: 'Saturday',
            attendanceRecords: [],
            faculty: facENG,
            department: depMET,
            courses: [
                cs1EngCourse,
                cs3EngCourse
            ],
        },
        // 2 attendance records 
        // 1 before 7 AM and 1 after 7 PM --> no extra hours
        {
            gucId: 'AC-6',
            name: 'Leen',
            gender: 'female',
            email: 'leen@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office1,
            type: 'Academic Member',
            role: 'Teaching Assistant',
            dayOff: 'Sunday',
            attendanceRecords: [
                {
                    day: 'Monday',
                    date: '2020-12-12',
                    startTime: '06:00:00',
                    endTime: '16:24:00',
                    status: 'Present'
                },
                {
                    day: 'Tuesday',
                    date: '2020-12-13',
                    startTime: '06:00:00',
                    endTime: '14:24:00',
                    status: 'Present'
                },
            ],
            faculty: facENG,
            department: depMET,
            courses: [
                cs1EngCourse,
                cs3EngCourse
            ],
        },
        // 2 attendance records 
        // 1 less than 8:24 and 1 more than 8:24 --> no missing/extra hours
        {
            gucId: 'AC-7',
            name: 'Karim',
            gender: 'male',
            email: 'karim@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office1,
            type: 'Academic Member',
            role: 'Teaching Assistant',
            dayOff: 'Monday',
            attendanceRecords: [
                {
                    day: 'Sunday',
                    date: '2020-12-12',
                    startTime: '08:00:00',
                    endTime: '15:24:00',
                    status: 'Present'
                },
                {
                    day: 'Tuesday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '17:24:00',
                    status: 'Present'
                },
            ],
            faculty: facMNGT,
            department: depBI,
            courses: [
                cs1BICourse,
                cs3BICourse
            ],
        },
        // 4 attendance records 
        // one without sign out and two without sign in --> should be considered in missing days
        //one missing hour
        {
            gucId: 'AC-8',
            name: 'Abdullah',
            gender: 'male',
            email: 'abdullah@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office1,
            type: 'Academic Member',
            role: 'Teaching Assistant',
            dayOff: 'Thursday',
            attendanceRecords: [
                {
                    day: 'Sunday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '15:24:00',
                    status: 'Present'
                },
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    status: 'Present'
                },
                {
                    day: 'Tuesday',
                    date: '2020-12-13',
                    endTime: '17:24:00',
                    status: 'Present'
                },
                {
                    day: 'Wednesday',
                    date: '2020-12-12',
                    endTime: '17:24:00',
                    status: 'Present'
                },

            ],
            faculty: facMNGT,
            department: depBI,
            courses: [],
        },
        //2 attendance records
        // from 7:00 to 12:00 and from 12:01 to 16:24 --> 1 missing minute
        {
            gucId: 'AC-9',
            name: 'Khalid',
            gender: 'male',
            email: 'khalid@guc.edu.eg',
            password: await bcrypt.hash('123456', 12),
            salary: 10000,
            officeLocation: office1,
            type: 'Academic Member',
            role: 'Teaching Assistant',
            dayOff: 'Wednesday',
            attendanceRecords: [
                {
                    day: 'Sunday',
                    date: '2020-12-13',
                    startTime: '08:00:00',
                    endTime: '12:00:00',
                    status: 'Present'
                },
                {
                    day: 'Monday',
                    date: '2020-12-13',
                    startTime: '12:01:00',
                    endTime: '16:24:00',
                    status: 'Present'
                },
            ],
            faculty: facMNGT,
            department: depBI,
            courses: [],
        },
    ]

    await StaffMember.insertMany(TA);
    console.log('Seeded TA successfully');


    const staff = await StaffMember.findOne({ gucId: "AC-1" });

    const notifications = [
        {
            reciever: staff._id,
            message: "seeded message 1",
        },
        {
            reciever: staff._id,
            message: "seeded message 3",
        },
        {
            reciever: staff._id,
            message: "seeded message 3",
        }
    ]

    await Notification.insertMany(notifications);
    console.log('Seeded Notifications successfully');
}