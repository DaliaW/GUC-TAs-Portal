# milestone-1-team51
- UML: https://drive.google.com/file/d/1pAq3gUUhluCyixunRP-y6evduW2N5mhG/view?usp=sharing
- To launch the server: npm /server/index.js
- The server is listening to port 3000
- for seeded data (some locations/departments/faculties/staff members) please uncomment "dummy.seedDB();" found in index.js, then run once then comment it back again after seeing the last message "Seeded TA successfully"
- sheet routes has organized data related to our work
- Routes: 


### 1.
Functionality: log in the system
Route: /login
Request type: POST
Request body: 
```
{
"gucId": "HR-1",
"password": "123456"
}

```
Response: the token with some data ( first login and last login )

### 2.
Functionality: log out the system
Route: /logout
Request type: POST

Response: "Logged out successfully"

### 3.
Functionality: View their profile.
Route: /staffMembers/profile
Request type: GET

Response: the logged in person’s profile

### 4.
Functionality: View their profile.
Route: /staffMembers/profile
Request type: PUT
Request body: 
```
{
    "gender": "male"
}

```
Response: "Profile Updated Successfully"

### 5.
Functionality: a user can change his/her password
Route: /staffMembers/changePassword
Request type: PUT
Request body: 
```
{
"oldPassword": "123456",
"newPassword": "234567"
}

```
Response:  "Password changed successfully"

### 6.
Functionality: sign a staff member in the system
Route: /staffMembers/signIn
Request type: POST

Response:  "Signed in Successfully" 

### 7.
Functionality: sign a staff member out the system
Route: /staffMembers/signOut
Request type: POST

Response:  "Signed out Successfully" 

### 8.
Functionality: View all their attendance records, or they can specify exactly which month to view.
Route: /attendance/viewAttendance
Request type: GET
Request body:
```
{
    "all": "all"
}
```
Response: AttendanceRecord Object of all his attendance records

```
{
    "month1": 5,
    "month2": 6
}
```
Response: Attendance Record Object of all the attendance records from 11.May till 10.June in this year


### 9.
Functionality: View if they have missing days.
Route: /attendance/viewMissingDays
Request type: GET

Response: "3 days"

### 10.
Functionality: View if they are having missing hours or extra hours.
Route: /attendance/viewHours
Request type: GET

Response: "Missing/extra hours: -7 hrs. 30 min."

### 11. 
Functionality: add a room to the system
Route: /locations/location
Request type: POST
Request body: 

```
{
    "type": "office",
     "location": "C6.302",
     "capacity": 25
}
```
Response: Created room objecct


### 12. 
Functionality: update a room to the system
Route: /locations/location
Request type: PUT
Request body: 

```
{
    "location": "C1.111",
    "type": "Lab",
    "newLocation": "C2.222",
    "capacity": "222"
}
```
Response: "Location Updated Successfully"

### .
Functionality: delete an existing room to the system
Route: /locations/deleteRoom
Request type: POST
Request body: 
```
{
     "location": "C6.302",
}
```
Response: "Room deleted successfully" 
Note: upon deleting, any staff member with that location, the location will be set undefined

### 13.
Functionality: get all rooms in the system
Route: /locations/room/:num
Request type: GET
Parameters: all || room number
Response: Array of rooms

### 14. 
Functionality: create a new faculty
Route: /faculties/faculty
Request type: POST
Request body: 
```
{
    "code": "test",
    "name": "Test Faculty"
}
```
Response: Created Faculty Object

### 15. 
Functionality: update a faculty
Route: /faculties/faculty
Request type: PUT
Request body: 
```
{
    "code": "test",
    "newName": "Test Faculty Updated"
}

```
Response: "Faculty updated successfully"

### 16. 
Functionality: delete a faculty
Route: /faculties/faculty
Request type: DELETE
Request body: 
```
{
    "code": "test"
}
```
Response: "Faculty Deleted successfully"
note: upon deletion, any department under this faculty, its faculty is made undefined

### 17. 
Functionality: add a department to an existing faculty
Route: /departments/department
Request type: POST
Request body: 
```
{
	"facultyCode": "ENG",
    "depName": "Test dep with HOD",
   	"HOD": "AC-1"
}
```
Response: Created Department Object
Note: HOD is optional while creation

### 18. 
Functionality: update a department to an existing faculty
Route: /departments/department
Request type: PUT
Request body: 
```
    {
    "facultyCode": "ENG",
    "depName": "Test dep with HOD",
    "newFacultyCode": "LAW"

```
Response: "Department Updated Successfully"

### 19. 
Functionality: delete a department 
Route: /departments/department
Request type: DELETE
Request body: 
```
{
    "facultyCode": "ENG",
    "depName": "Test dep with HOD"
}
```
Response: "Department Deleted successfully"
note: upon deletion, any course under this department, its department is made undefined

### 20. 
Functionality: add a course to an existing department
Route: /courses/course
Request type: POST
Request body: 
```
{
    "facultyCode": "ENG",
    "departmentName": "MET",
    "courseName": "Tested Course"
}

```
Response: Created Course Object

### 21. 
Functionality: update a course 
Route: /courses/course
Request type: PUT
Request body: 
```
{
    "facultyCode": "MNGT",
    "departmentName": "Business Informatics",
    "courseName": "Tested Course",
    "newName": "Tested Course Updated"
}

```
Response: "Course Updated Successfully" 

### 22. 
Functionality: delete a course 
Route: /courses/course
Request type: DELETE
Request body: 
```
{
      "facultyCode": "MNGT",
    "departmentName": "Business Informatics",
    "courseName": "Tested Course",
}
```
Response: "Course Deleted successfully"

### 23.
Functionality: add a new staff member to the system
Route: /staffMembers/staff
Request type: POST
Request body: 

```
{
        "name": "Sarah", 
        "gender": "female", 
        "email":    "sarah@student.guc.edu.eg",
        "salary": 20000,
        "officeLocation": "A1.001",
        "type": "Academic Member",
        "role": "Teaching Assistant",
        "faculty": "ENG",
        "department": "MET",
        "dayOff": "Sunday"
}
```

Response: Created Staff Object


### 24.
Functionality: update a new staff member to the system
Route: /staffMembers/staff
Request type: PUT
Request body: 

```
{
    "gucId": "AC-1",
    "faculty": "Eng",
    "department": "MET",
    "officeLocation": "A1.002"
}

```
Response: Updated Staff Object

### 25.
Functionality: delete an existing staff member from the system
Route: /staffMembers/staff
Request type: DELETE
Request body: 
```
{
    "gucId": "AC-1",
}
```
Response: "Staff deleted successfully"
Note: upon deletion, HOD of department is removed if it was this staff, CC of Course is removed if it was this staff,
course coverage is updated, location capacity is updated 

### 26.
Functionality: Manually add a missing signin/sign out record of a staff member except for himself/herself.
Route: /attendance/addMissingSignInOut
Request type: PUT
Request body:
```
{
    "id":"HR-3",
    "signIn":"17:56:00",
    "signOut":"",
    "date":"2020-12-14",
    "day": "Friday",
    "number": 4
}
```
Response: "The missing sign in/out is added successfully"Note: The number in the body indicates the number of the added missing sign in/out.(i.e. If there are 4 sign in/out in that day, and there is missing sign in in 3rd record of that day, number should be 3 I that case).

### 27.
Functionality: View any staff member attendance record.
Route: /attendance/viewAttendance
Request type: GET
Request body:
```
{
    "id": "HR-3",
    "all": "all"
}
```
Response: AttendanceRecord Object of all the attendance records exists for HR-3
```
{
    "id": "HR-3",
    "month1": 5,
    "month2": 6
}
```
Response: AttendanceRecord Object of the attendance records for HR-3 from 11. May to 10. June

### 28.
Functionality: View staff members with missing hours/days.
Route: /attendance/viewStaffMissing
Request type: GET

Response: Array of staffMember Object

### 29.
Functionality: Update the salary of a staff member.
Route: /staffMembers/updateSalary
Request type: PUT
Request body:
{
    "id":"HR-4",
    "newSalary": 234
}
Response: “Salary is updated successfully to 234"

### 30.
Functionality: Assign/delete/update a course instructor for each course in his department.
Route: /departments/assignInstructor
    a. Assign a course instructor
        Request Type: POST
        Body:
            {
                "gucId": "AC-1",
                "name":"computer science"
            }

        Response: An object having a message of assigning the course, the course name, and the TA who will be assigned to that course.
    b. Delete a course instructor
        Request Type: DELETE
        Body:
            {
                "gucId": "AC-2",
                "name":"computer science"
            }

        Response: An object having a message of success/fail message of deletion.
    c. Update a course instructor
        Request Type: PUT
        Body:
            {
                "gucId": "AC-1",
                "newName":"computer science 1",
                "oldName":"computer science"
            }

        Response: An object having a success message of updating, the old course info, and the TA who will be assigned to the updated course.

### 31. 
Functionality: 
Request Type: GET
    1- View all the staff in his/her department along with their profiles.
        Route: /departments/getAllStaffMembers
        Response: An array of the staff members in the department with their info.
    2- View staff in his/her department per course along with their profiles.
        Route: /departments/getAllStaffMembers/:course
        Response: An array of the staff members in the department and in the same course specified with their info.

### 32. 
Functionality:
Request Type: GET
    1- View the day off of all the staff in his/her department.
        Route: /departments/viewDayOff
        Response: An array of staff IDs in the department along with their day off.
    2- View the day off of a single staff in his/her department.
        Route: /departments/viewDayOff/:idStaff
        :idStaff -> some gucId of a staff member in the department to get his day off.
        Response: An array of staff IDs in the department along with his/her day off.

///////// TODO: Functions 33:35 that are in Aya's branch

### 36.
Functionality: View the coverage of each course in his/her department.
Request Type: GET
Route: /departments/viewCourseCoverage
Response: An object containing the course name and its coverage.

### 37.
Functionality: View teaching assignments (which staff members teach which slots) of course offered by his department.
Route: /departments/viewTeachingAssignments/:course
Request Type: GET
Parameters: course: which represents the course name and shows the teaching assignments for this specific course.
            all: views all the courses teaching assignments.
Response: Array of TAs, their courses and their assigned slots.

38. View the coverage of course(s) he/she is assigned to
Request:
Path:/academicMember/courseInstructor/courseCoverage
Method: GET
Parameters: none
Body: None
Success Response Example

  StatusCode: 200
  Body:
{
    "data": [
        {
            "course_name": "Computer Science 1",
            "course_coverage": 50
        },
        {
            "course_name": "Computer Science 3",
            "course_coverage": 0
        },
        {
            "course_name": "Computer Science 1",
            "course_coverage": 50
        },
        {
            "course_name": "Computer Science 1",
            "course_coverage": 50
        }
    ]
}

39. View the slots’ assignment of course(s) he/she is assigned to
Request:
Path: /academicMember/courseInstructor/slotsAssignment
Method: GET
Parameters: none
Body: None
Success Response Example

  StatusCode: 200
  Body:
{
    "data": [
        {
            "course_name": "Computer Science 1",
            "course_slots": [
                {
                    "day": "Saturday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                },
                {
                    "day": "Monday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                }
            ]
        },
        {
            "course_name": "Computer Science 3",
            "course_slots": []
        },
        {
            "course_name": "Computer Science 1",
            "course_slots": [
                {
                    "day": "Saturday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                },
                {
                    "day": "Monday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                }
            ]
        },
        {
            "course_name": "Computer Science 1",
            "course_slots": [
                {
                    "day": "Saturday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                },
                {
                    "day": "Monday",
                    "time": "8:15:00 AM",
                    "location": "No location is assigned yet"
                }
            ]
        }
    ]
}

40. View all the staff in his/her department or per course along with their profiles.
Request:

Path: /academicMember/courseInstructor/staffMembers/:courseName
Method: GET
Parameters: courseName: which is the name of the course and can also pass params "all" to view all staff members
Body: None

Success Response Example

  StatusCode: 200
  Body:
{
    "data": [
        {
            "gucId": "AC-1",
            "name": "Mohammed",
            "email": "mohammed.abdelfattah@guc.edu.eg",
            "dayOff": "Monday",
            "courses": [
                "Computer Science 1",
                "Computer Science 3",
                "Computer Science 1",
                "Computer Science 1"
            ],
            "officeLocation": "A1.003",
            "gender": "male"
        },
        {
            "gucId": "AC-5",
            "name": "Yahia",
            "email": "yahia@guc.edu.eg",
            "dayOff": "Saturday",
            "courses": [
                "Computer Science 1",
                "Computer Science 3"
            ],
            "officeLocation": "A1.001",
            "gender": "male"
        },
        {
            "gucId": "AC-6",
            "name": "Leen",
            "email": "leen@guc.edu.eg",
            "dayOff": "Sunday",
            "courses": [
                "Computer Science 1",
                "Computer Science 3"
            ],
            "officeLocation": "A1.001",
            "gender": "female"
        }
    ]
}

41. Assign an academic member to an unassigned slots in course(s) he/she is assigned to

Request:

Path: /academicMember/courseInstructor/slotsAssignment
Method: POST
Parameters: none
Body:
{
  "gucId": "AC-1",
  "courseName": "Computer Science 1",
  "slot": {
    "day": "Saturday",
    "time": "10:00 AM"
  }
}
Success Response Example

 StatusCode: 200
 Body: 
{
    "data": {
        "course": "Computer Science 1",
        "assignedTo": "Mohammed",
        "slot": {
            "day": "Saturday",
            "time": "10:00 AM"
        }
    }
}

42. Update assignment of academic member in course(s) he/she is assigned to.

Request:

Path: /academicMember/courseInstructor/slotsAssignment
Method: PUT
Parameters: none
Body:
{
  "gucId": "AC-1",
  "courseName": "Computer Science 1",
  "slot": {
    "day": "Saturday",
    "time": "10:00 AM"
  }
}
Success Response Example

 StatusCode: 200
 Body: 
{
    "data": {
        "course": "Computer Science 1",
        "oldAC": "Mohammed",
        "newAC": "Mohammed",
        "slot": {
            "day": "Saturday",
            "time": "10:00 AM"
        }
    }
}

43. Delete assignment of academic member in course(s) he/she is assigned to.
Request:

Path: /academicMember/courseInstructor/slotsAssignment
Method: DELETE
Parameters: none
Body:
{
  "gucId": "AC-1",
  "courseName": "Computer Science 1",
  "slot": {
    "day": "Saturday",
    "time": "10:00 AM"
  }
}
Success Response Example

 StatusCode: 200
 Body: 
{
    "data": {
        "course": "Computer Science 1",
        "slot": {
            "day": "Saturday",
            "time": "10:00 AM"
        },
        "assignedTo": null
    }
}

44. Assign an academic member in each of his/her course(s) to be a course coordinator
Request:

Path: /academicMember/courseInstructor/courseCoordinator
Method: POST
Parameters: None
Body: {
    "gucId": "AC-9",
    "courseName": "Computer Science 2"
}
Success Response Example

  StatusCode: 200
  Body:
  {
      "data": {
          "courseName": "Computer Science 2",
          "courseCoordinator": "AhmedAshraf 8"
      }
  }  


//requests
### 45
Functionality: Accept/reject “slot linking” requests from academic members linked to his/her course. 
Note that once a “slot linking” request is accepted, it should be automatically added to the sender’s schedule.
Route: /requests/acceptRejectSlotLinking
Request type: PUT
Request body:
{
    "reqNumber":1,
    "status":"rejected"
}
Response: "The slot-linking request is rejected successfully"


///aya
method:sendRequest
functionalities: any staff member can send any type of those requests
'Replacement Request', 'Slot Request' , 'Change DayOff', 'Leave Request'
leave request can be one out of 5 types
Sick , Compensation , Annual , Maternity , Accidental
methodType:post
route: /requests/sendrequest
### 40- send replacement request
{

 "type":"Replacement Request",
 "replacementDate":"2021-10-10T10:30:00",
 "recieverId":"AC-7", 
"location":"c6102",
"course":"Computer Science 4" 
}

### 41- * slot linking request*

{

 "type":"Slot Request",
 "date":"2021-10-10T10:30:00", 
"locationType":"Hall",
"course":"Computer Science 4" 
}

### 42- * ChangeDayOff*

{

 "type": "Change DayOff", 
   "newDayOff":"Sunday",
   "currentDayOff":"Monday",
 "reason":".....somestring"
}

### 43- * Leave request*
hint:here you could have a reason or not
Accidental
{

 "type":"Leave Request", 
"leaveType": "Accidental",
"AccidentDate":"2021-10-12T10:30:00"  
}

Compensation
hint:you must have a reason
{

 "type":"Leave Request", 
"CompensationDate":"2020-12-20",
"LeaveDate":"2020-12-15",
"reason":".....somestring"

}

Annual:
hint:here you could have a reason or not and you can add more than one replacement
you should include these lines in your header
Accept : application/json, text/plain,
Content-Type : application/json;charset=UTF-8

{

 "type":"Leave Request",
 "AnnualLeaveDate":"2021-10-10", 
 "leaveType": "Annual", 
"rep":[{
"id":"AC-7",
"date":"2021-10-10T10:30:00",
"courseName":"Computer Science 4"
}]

}

sick leave:
{

 "type":"Leave Request",  
"leaveType": "Sick",
"SickDayDate":"2020-12-18", 
"document":"string . "
}

Maternity:

{

 "type":"Leave Request",
 "leaveType": "Maternity",
"startDate":"2020-12-18", 
"document":"string . "
}

44 Notifications
functionality: view all notification
path:/requests/viewNotification
for the following use /requests
type:get

hint:all view methods are type get
45 View all Requests
path/viewMyRequest

View Accepted or rejected or pending Requests
path: /requests/viewMyRequeststatus/:status
so you can use
/requests/viewMyRequeststatus/accepted
/requests/viewMyRequeststatus/pending
/requests/viewMyRequeststatus/rejected

40-View Replacement Request or any type
path: /requests/viewMyRequestType/:type
so for replacement you can use
/requests/viewMyRequestType/Replacement Request

View Received Replacement Request
path: /requests/viewRecievedReplacementRequest

24 View all the requests “change day off/leave” sent by staff members in his/her department. FOR HOD
path: /requests/viewRecievedRequest/:type
so you can use
/requests/viewRecievedRequest/Change DayOff
/requests/viewRecievedRequest/Leave Request

36 View “slot linking” request(s) from academic members linked to his/her course FOR CC.
path: /viewSlotRequest

46 cancel request
requests/CancelRequest/:_id
path: requests/CancelRequest/5fdfc73c306f274a93ea5fae
type:delete

AcceptOrReject Requests
all of them are type put
accept or reject replacement
path:/requests/AcceptOrRejectRep/:_id
type:put
body:{

AcceptOrReject:"accepted"

}

AcceptOrReject changeDayoff
path:/AcceptOrRejectChangeDay/:_id
body{
"accept_or_reject_request": true
}
AcceptOrReject leave Request
path:/ AcceptOrRejectLeave/:_id
body{
"accept_or_reject_request": true
}





38.
Functionality: Add/update/delete course slot(s) in his/her course.
Route: /slots/courseSlot
a. Add:
Request type: POST
Request body:
{
"id":"AC-3",
"course":"CS1",
"day": "Saturday",
"time": "14:45",
"location": "C6.306"
}
Response: "The slot is added sucessfully"
b. Delete:
Request type: DELETE
Request body:
{
"id":"AC-3",
"course":"CS1",
"day": "Saturday",
"time": "14:45",
"location": "C6.306"
}
Response: "The slot is deleted sucessfully"
c. Update:
Request type: PUT
Request body:
{
"id":"AC-3",
"course":"CS1",
"dayOld": "Saturday",
"timeOld": "14:45",
"locationOld": "C6.306",
"dayNew": "Sunday",
"timeNew": "16:45",
"locationNew": "C6.206",
}
Response: "The slots are updated sucessfully"
39.
Functionality: View their schedule. Schedule should show teaching activities and replacements if present.
Route: /staffMembers/viewMySchedule
Request type: GET
Response: Object contains the slots assigned