import React, { useState, useEffect } from "react";
import { link } from "../helpers/constants";

import Button from "react-bootstrap/Button";
import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Input,
} from "@material-ui/core";

import { useToasts } from "react-toast-notifications";
import { axiosCall } from "../helpers/axiosCall";

import { axios } from "../helpers/axios";
import "../styles/_colorSchema.scss";

function InstrCourseAssignCC() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [id, setID] = useState("");
  const { addToast } = useToasts();
  useEffect(() => {
    async function fetchData() {
      const loggedInUser = localStorage.getItem("user");
      if (!loggedInUser) {
        document.location.href = window.location.origin + "/login";
      } else {
        try {
          const response = await axios.get(
            `${link}/academicMember/courseInstructor/courseCoverage`
          );
          if (response.data.error) {
            addToast(response.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            const coverageDisplay = response.data.data;
            const coursesState = coverageDisplay.map((course) => {
              return course.course_name;
            });
            setCourses(coursesState);
          }
        } catch (e) {
          console.log("~ err", e);
          document.location.href = window.location.origin + "/unauthorized";
        }
      }
    }
    fetchData();
  }, []);
  const handleOnChange = (target) => {
    setCourse(target.value);
  };

  const handleSubmit = async () => {
    try {
      let response = await axiosCall(
        "post",
        `${link}/academicMember/courseInstructor/courseCoordinator`,
        {
          gucId: id,
          courseName: course,
        }
      );

      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else if (response.data.data) {
        addToast(
          `The academic member '${response.data.data.courseCoordinator}' is assigned successfully to be the course coordinator of the course '${response.data.data.courseName}'`,
          { appearance: "success", autoDismiss: true }
        );
      } else {
        addToast(
          "The GUC ID should be written in the corrent format: 'role-IDNumber' e.g. HR-1",
          { appearance: "error", autoDismiss: true }
        );
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };

  return (
    <div>
      <h3 className="general-header">Assign a Course Coordinator</h3>
      <hr className="general-line" />
      <br />
      <div className="crud-inner-container">
        <div className="crud-form">
          <FormControl className="crud-formControl" required>
            <InputLabel className="crud-inputLabel">Course Name</InputLabel>
            <Select
              className="crud-select"
              value={course}
              onChange={(event) => {
                handleOnChange(event.target);
              }}
            >
              {courses.length > 0 &&
                courses.map((coursename) => (
                  <MenuItem
                    className="crud-menuItem"
                    value={coursename}
                    key={coursename}
                  >
                    {coursename}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText className="crud-helperText">
              This field is required
            </FormHelperText>
          </FormControl>

          <FormControl className="crud-formControl" required>
            <InputLabel className="crud-inputLabel">Member GUC ID</InputLabel>
            <Input
              className="crud-input"
              value={id}
              onChange={(event) => setID(event.target.value)}
            />
            <FormHelperText className="crud-helperText">
              This field is required
            </FormHelperText>
          </FormControl>
        </div>

        <Button
          variant="success"
          className="crud-submit crud-add-btn green"
          disabled={id === "" || course === "" ? true : false}
          onClick={handleSubmit}
        >
          Assign
        </Button>
      </div>
    </div>
  );
}

export default InstrCourseAssignCC;
