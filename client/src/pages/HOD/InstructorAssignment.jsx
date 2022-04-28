import React, { useState, useEffect } from "react";
import { checkHOD, link } from "../../helpers/constants";
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
import { axiosCall } from "../../helpers/axiosCall";

import Add from "../../components/Add";
import Update from "../../components/Update";
import Delete from "../../components/Delete";

function InstructorAssignment() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [crudBtns, setBtns] = useState({
    add: false,
    update: false,
    delete: false,
  });
  const [id, setID] = useState("");
  const [HOD, setHOD] = useState(false);

  const { addToast } = useToasts();

  const handleOnChange = (target) => {
    setCourse(target.value);
  };

  const handleUpdateOnChange = (target) => {
    setNewCourse(target.value);
  };

  useEffect(() => {
    async function fetchData() {
      const loggedInUser = localStorage.getItem("user");
      if (!loggedInUser) {
        document.location.href = window.location.origin + "/login";
      } else {
        try {
          let found = await checkHOD();
          if (found) {
            setHOD((prevCheck) => !prevCheck);
          } else {
            document.location.href = window.location.origin + "/unauthorized";
          }
          const response = await axiosCall(
            "get",
            `${link}/departments/courses`
          );
          console.log(response);
          if (response.data.error) {
            addToast(response.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            const coverageDisplay = response.data.data;
            const coursesState = coverageDisplay.map((course) => {
              return course.course;
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

  const handleSubmit = async () => {
    try {
      let response = null;
      let optionSelected = "";
      if (crudBtns.add) {
        optionSelected = "post";
      } else if (crudBtns.update) {
        optionSelected = "put";
      } else if (crudBtns.delete) {
        optionSelected = "delete";
      } else {
        addToast("You should specify an option", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }

      response = await axiosCall(
        optionSelected,
        `${link}/departments/assignInstructor`,
        {
          gucId: id,
          name: course,
        }
      );

      console.log(response);

      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        if (optionSelected === "post")
          addToast("Successfully assigned instructor to course", {
            appearance: "success",
            autoDismiss: true,
          });
        else if (optionSelected === "put") {
          addToast("Updated the instructor assignment successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          addToast("The instructor assignment is deleted successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        }
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      let response = null;
      let optionSelected = "";
      if (crudBtns.add) {
        optionSelected = "post";
      } else if (crudBtns.update) {
        optionSelected = "put";
      } else if (crudBtns.delete) {
        optionSelected = "delete";
      } else {
        addToast("You should specify an option", {
          appearance: "warning",
          autoDismiss: true,
        });
        return;
      }

      response = await axiosCall(
        optionSelected,
        `${link}/departments/assignInstructor`,
        {
          gucId: id,
          newName: newCourse,
          oldName: course,
        }
      );

      console.log(response);

      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "warning",
          autoDismiss: true,
        });
      } else {
        if (optionSelected === "post")
          addToast("Successfully assigned instructor to course", {
            appearance: "success",
            autoDismiss: true,
          });
        else if (optionSelected === "put") {
          addToast("Updated the instructor assignment successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          addToast("The instructor assignment is deleted successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        }
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };

  if (HOD)
    return (
      <div className="crud-outer-container">
        <div className="crud-container">
          <Add
            text="Instructor to course"
            onClick={() =>
              setBtns({
                add: true,
                update: false,
                delete: false,
              })
            }
          />
          <Update
            text="Instructor to course"
            onClick={() =>
              setBtns({
                add: false,
                update: true,
                delete: false,
              })
            }
          />
          <Delete
            text="Instructor from course"
            onClick={() =>
              setBtns({
                add: false,
                update: false,
                delete: true,
              })
            }
          />
        </div>

        {!crudBtns.add && !crudBtns.delete ? null : (
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
                <InputLabel className="crud-inputLabel">
                  Member GUC ID
                </InputLabel>
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
              variant={
                crudBtns.add
                  ? "success"
                  : crudBtns.update
                  ? "primary"
                  : "danger"
              }
              className={
                crudBtns.add
                  ? "crud-submit crud-add-btn green"
                  : crudBtns.update
                  ? "crud-submit crud-update-btn blue"
                  : "crud-submit crud-delete-btn red"
              }
              disabled={id === "" || course === "" ? true : false}
              onClick={handleSubmit}
            >
              {crudBtns.add ? "Assign" : crudBtns.update ? "Update" : "Delete"}
            </Button>
          </div>
        )}
        {!crudBtns.update ? null : (
          <div className="crud-inner-container">
            <div className="crud-form">
              <FormControl className="crud-formControl" required>
                <InputLabel className="crud-inputLabel">
                  New Course Name
                </InputLabel>
                <Select
                  className="crud-select"
                  value={newCourse}
                  onChange={(event) => {
                    handleUpdateOnChange(event.target);
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
                <InputLabel className="crud-inputLabel">
                  Old Course Name
                </InputLabel>
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
                <InputLabel className="crud-inputLabel">
                  Member GUC ID
                </InputLabel>
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
              variant={
                crudBtns.add
                  ? "success"
                  : crudBtns.update
                  ? "primary"
                  : "danger"
              }
              className={
                crudBtns.add
                  ? "crud-submit crud-add-btn green"
                  : crudBtns.update
                  ? "crud-submit crud-update-btn blue"
                  : "crud-submit crud-delete-btn red"
              }
              disabled={id === "" || course === "" ? true : false}
              onClick={handleUpdateSubmit}
            >
              {crudBtns.add ? "Assign" : crudBtns.update ? "Update" : "Delete"}
            </Button>
          </div>
        )}
      </div>
    );
  else return null;
}

export default InstructorAssignment;
