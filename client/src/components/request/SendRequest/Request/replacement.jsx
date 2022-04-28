import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import axiosCall from "../../../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import DateTimePicker from "react-datetime-picker";

import {
  FormControl,
  InputLabel,
  Select,
  Input,
  MenuItem,
} from "@material-ui/core";

function Replacement() {
  const [date, setDate] = useState();
  const [recId, setRecId] = useState("");
  const [loc, setLoc] = useState("");
  const [courses, SetCourses] = useState([]);
  const [courseChosen, setCourseChosen] = useState("");

  const { addToast } = useToasts();
  useEffect(() => {
    async function fetchData() {
      const resp = await axiosCall("get", "requests/hisCourses");

      SetCourses(resp.data.data);
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const body = {
        type: "Replacement Request",
        replacementDate: date,
        recieverId: recId,
        location: loc,
        course: courseChosen,
      };
      const res = await axiosCall("post", "requests/sendrequest", body);
      if (res.data.data) {
        addToast("Your Request has been sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setDate();
        setLoc("");
        setRecId("");
        setCourseChosen("");
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
          <InputLabel className="crud-inputLabel">Date and Time </InputLabel>
          <br />
          <br />
          <DateTimePicker
            className="crud-input"
            value={date}
            onChange={setDate}
          />
        </FormControl>
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Receiver id</InputLabel>
          <Input
            className="crud-input"
            value={recId}
            onChange={(event) => setRecId(event.target.value)}
          />
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Location</InputLabel>
          <Input
            className="crud-input"
            value={loc}
            onChange={(event) => setLoc(event.target.value)}
          />
        </FormControl>
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Course</InputLabel>
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
        </FormControl>
      </div>

      <Button
        variant="success"
        className="crud-submit crud-add-btn green"
        disabled={
          loc === "" || date == null || courseChosen == "" || recId == ""
            ? true
            : false
        }
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
}
export default Replacement;
