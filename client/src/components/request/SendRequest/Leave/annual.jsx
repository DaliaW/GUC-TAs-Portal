import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import axiosCall from "../../../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";

import {
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
} from "@material-ui/core";

function Annual() {
  const [date, setDate] = useState();
  const [Reason, setReason] = useState(" ");
  const [TAID, setTAID] = useState("");
  const [time, setTime] = useState();

  const [courses, SetCourses] = useState([]);
  const [courseChosen, setCourseChosen] = useState("Course");
  const [check, setCheck] = useState("");
  const [rep, setRep] = useState({
    reps: [
      {
        TAId: "",
        time: null,
        coursename: "",
      },
    ],
  });

  const array = [];
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const resp = await axiosCall("get", "requests/hisCourses");

      SetCourses(resp.data.data);
    }
    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      var object = {
        TAId: TAID,
        time: time,
        coursename: courseChosen,
      };
      var res = time.split(":");
      date.setHours(res[0], res[1], 0);
      console.log(date);
      var str =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        "T" +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":00";
      //  console.log(dates);
      const body1 = {
        id: TAID,
        date: str,
        courseName: courseChosen,
      };
      var resp1 = await axiosCall("post", "requests/checkRep", body1);
      setCheck(resp1.data);

      if (resp1.data == "success") {
        console.log(object);
        setRep({ reps: rep.reps.concat([object]) });

        addToast(
          " replacement added successfully,add another one if you want",
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        setTAID("");
        setTime();
        setCourseChosen("");
        //ha3mlha add f el array w h set kol 7aga b 0 tany w hatl3lh toast by2olh added successfully
        //click add if you have another replacement
      }  
         if (resp1.data.error) {
        addToast(resp1.data.error, {
          appearance: "error",
          autoDismiss: true,
        }); 
      } 
    } catch (err) {
      console.log("~err: ", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const body = {
        type: "Leave Request",
        leaveType: "Annual",
        AnnualLeaveDate: date,
        rep: rep,
        reason: Reason,
      };
      const res = await axiosCall("post", "requests/sendrequest", body);
      if (res.data.data) {
        addToast("Your Request has been sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setDate();
        setReason("");
        setRep([
          {
            TAId: "",
            time: null,
            coursename: "",
          },
        ]);
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.log("~err: ", err);
    }
  };

  return (
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Date</InputLabel>

          <br />
          <br />
          <DatePicker className="crud-input" value={date} onChange={setDate} />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Replacement</InputLabel>
          <br />
          <FormControl className="crud-formControl">
            <InputLabel className="crud-inputLabel">TA ID</InputLabel>
          </FormControl>
          <br />
          <br />
          <Input
            className="crud-input"
            value={TAID}
            onChange={(event) => setTAID(event.target.value)}
          />

          <br />
          <FormControl className="crud-formControl">
            <InputLabel className="crud-inputLabel">Course</InputLabel>
          </FormControl>
          <br />
          <br />

          <Select
            className="crud-select"
            value={courseChosen}
            onChange={(event) => {
              setCourseChosen(event.target.value);
            }}
          >
            {courses.length > 0 &&
              courses.map((course) => (
                <MenuItem className="crud-menuItem" value={course}>
                  {course}
                </MenuItem>
              ))}
          </Select>

          <FormControl className="crud-formControl">
            <InputLabel className="crud-inputLabel">Time</InputLabel>
          </FormControl>
          <br />
          <br />

          <TimePicker className="crud-input" onChange={setTime} value={time} />

          <br />
          <br />

          <Button
            variant="success"
            className="crud-submit crud-add-btn green"
            disabled={
              date == null || time == null || TAID == "" || courseChosen == ""
                ? true
                : false
            }
            onClick={handleClick}
          >
            Add
          </Button>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Reason</InputLabel>
          <br />
          <br />
          <textarea
            className="crud-input"
            rows="3"
            cols="40"
            value={Reason}
            onChange={(event) => {
              setReason(event.target.value);
            }}
          ></textarea>
        </FormControl>
      </div>
      <Button
        variant="success"
        className="crud-submit crud-add-btn green"
        disabled={date == null ? true : false}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
}
export default Annual;
