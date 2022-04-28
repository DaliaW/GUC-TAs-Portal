import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Input,
} from "@material-ui/core";

function UpdateCourse() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [departments, setDepartments] = useState({ departments: [] });
  const [depChosen, setDepChosen] = useState("");
  const [courses, setCourses] = useState({ courses: [] });
  const [courseChosen, setCourseChosen] = useState("");
  const [newDepChosen, setNewDepChosen] = useState("");
  const [slot, setSlot] = useState({
    day: "",
    time: "",
    location: "",
  });

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const facResult = await axiosCall("get", "faculties/faculty/all");
      setFaculties(facResult.data.data);
    }
    fetchData();
  }, [facultyChosen]);

  const handleFacOnChange = async (target) => {
    setFacultyChosen(target.value);

    const depResult = await axiosCall(
      "get",
      `departments/department/${target.value}/all`
    );
    setDepartments(depResult.data.data);
  };

  const handleDepOnChange = async (target) => {
    const facCode = faculties.find(({ code }) => code === facultyChosen).code;

    setDepChosen(target.value);
    const depName = departments.find(({ name }) => name === target.value).name;

    const courseResult = await axiosCall(
      "get",
      `courses/course/${facCode}/${depName}/all`
    );
    setCourses(courseResult.data.data);
  };

  const addSlot = (event) => {
    setSlot({
      ...slot,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      let depName;
      if (departments)
        depName = await departments.find(({ name }) => name === depChosen).name;

      let courseName;
      if (courses)
        courseName = await courses.find(({ name }) => name === courseChosen)
          .name;

      let newDepName;
      if (departments && newDepChosen !== "")
        newDepName = await departments.find(({ name }) => name === newDepChosen)
          .name;

      const body = {
        facultyCode: facultyChosen.toUpperCase(),
        departmentName: depName,
        courseName: courseName,
        newDepartment: newDepChosen ? newDepName : undefined,
        newSlot: slot ? slot : undefined,
      };

      const res = await axiosCall("put", "courses/course", body);

      if (res.data.data) {
        addToast("Course updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setFacultyChosen("");
        setDepChosen("");
        setDepartments({ departments: [] });
        setCourseChosen("");
        setCourses({ courses: [] });
        setNewDepChosen("");
        setSlot({
          day: "",
          time: "",
          location: "",
        });
      }

      if (res.data.error || res.data.error.errors.message) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.log("~error: ", err);
    }
  };

  return (
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Faculty</InputLabel>
          <Select
            className="crud-select"
            value={facultyChosen}
            onChange={(event) => {
              handleFacOnChange(event.target);
            }}
          >
            {faculties.length > 0 &&
              faculties.map((faculty) => (
                <MenuItem
                  className="crud-menuItem"
                  value={faculty.code}
                  key={faculty.code}
                >
                  {faculty.code} - {faculty.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Department</InputLabel>
          <Select
            className="crud-select"
            value={depChosen}
            onChange={(event) => {
              handleDepOnChange(event.target);
            }}
          >
            {departments.length > 0 &&
              departments.map((department) => (
                <MenuItem
                  className="crud-menuItem"
                  value={department.name}
                  key={department.name}
                >
                  {department.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Course</InputLabel>
          <Select
            className="crud-select"
            value={courseChosen}
            onChange={(event) => setCourseChosen(event.target.value)}
          >
            {courses.length > 0 &&
              courses.map((course) => (
                <MenuItem
                  className="crud-menuItem"
                  value={course.name}
                  key={course.name}
                >
                  {course.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">New Department</InputLabel>
          <Select
            className="crud-select"
            value={newDepChosen}
            onChange={(event) => setNewDepChosen(event.target.value)}
          >
            {departments.length > 0 &&
              departments.map((department) => (
                <MenuItem
                  className="crud-menuItem"
                  value={department.name}
                  key={department.name}
                >
                  {department.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">
            Add a slot to the course
          </InputLabel>
          <Input
            className="crud-input"
            placeholder="day"
            name="day"
            value={slot.day}
            onChange={addSlot}
          />
          <Input
            className="crud-input"
            placeholder="time"
            name="time"
            value={slot.time}
            onChange={addSlot}
          />
          <Input
            className="crud-input"
            placeholder="location"
            name="location"
            value={slot.location.toUpperCase()}
            onChange={addSlot}
          />
        </FormControl>
      </div>

      <Button
        variant="primary"
        className="crud-submit crud-update-btn blue"
        disabled={
          facultyChosen === "" || depChosen === "" || courseChosen === ""
            ? true
            : false
        }
        onClick={handleSubmit}
      >
        Update Course
      </Button>
    </div>
  );
}

export default UpdateCourse;
