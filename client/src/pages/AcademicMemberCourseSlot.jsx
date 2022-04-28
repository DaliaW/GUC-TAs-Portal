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
import Modal from "react-bootstrap/Modal";

import { useToasts } from "react-toast-notifications";
import { axiosCall } from "../helpers/axiosCall";

import { axios } from "../helpers/axios";
import "../styles/_colorSchema.scss";

import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

function AcademicMemberCourseSlot() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [crudBtns, setBtns] = useState({
    add: false,
    update: false,
    delete: false,
  });
  const [day, setDay] = useState("");
  const [id, setID] = useState("");
  const [timing, setTiming] = useState("");
  const weekDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];
  const slotTiming = [
    "1st slot (08:15 - 09:45)",
    "2nd slot (10:00 - 11:30)",
    "3rd slot (11:45 - 13:15)",
    "4th slot (13:45 - 15:15)",
    "5th slot (15:45 - 17:15)",
  ];

  const { addToast } = useToasts();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleOnChange = (target) => {
    setCourse(target.value);
  };

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
        setShow(false);
      } else {
        addToast("You should specify an option", {
          appearance: "error",
          autoDismiss: true,
        });
        return;
      }
      let slot = timing.substring(0, 3);
      let convertedTiming = "";
      switch (slot) {
        case "1st":
          convertedTiming = "08:15 AM";
          break;
        case "2nd":
          convertedTiming = "10:00 AM";
          break;
        case "3rd":
          convertedTiming = "11:45 AM";
          break;
        case "4th":
          convertedTiming = "01:45 PM";
          break;
        case "5th":
          convertedTiming = "03:45 PM";
          break;
        default:
          break;
      }
      response = await axiosCall(
        optionSelected,
        `${link}/academicMember/courseInstructor/slotsAssignment`,
        {
          gucId: id,
          courseName: course,
          slot: {
            day: day,
            time: convertedTiming,
          },
        }
      );
      console.log(
        "🚀 ~ file: AcademicMemberCourseSlot.jsx ~ line 146 ~ handleSubmit ~ response.data",
        response.data
      );

      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        if (optionSelected === "post")
          addToast("The slot assignment is added successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        else if (optionSelected === "put") {
          addToast("The slot assignment is updated successfully", {
            appearance: "success",
            autoDismiss: true,
          });
        } else {
          addToast("The slot assignment is deleted successfully", {
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

  return (
    <div className="crud-outer-container">
      <div className="crud-container">
        <Add
          text="Slot Assignment"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="Slot Assignment"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="Slot Assignment"
          onClick={() =>
            setBtns({
              add: false,
              update: false,
              delete: true,
            })
          }
        />
      </div>

      {!crudBtns.add && !crudBtns.update && !crudBtns.delete ? null : (
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
              <InputLabel className="crud-inputLabel">Slot Day</InputLabel>
              <Select
                className="crud-select"
                value={day}
                onChange={(event) => {
                  setDay(event.target.value);
                }}
              >
                {weekDays.map((weekDay) => (
                  <MenuItem
                    className="crud-menuItem"
                    value={weekDay}
                    key={weekDay}
                  >
                    {weekDay}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className="crud-helperText">
                This field is required
              </FormHelperText>
            </FormControl>

            <FormControl className="crud-formControl" required>
              <InputLabel className="crud-inputLabel">Slot Timing</InputLabel>
              <Select
                className="crud-select"
                value={timing}
                onChange={(event) => {
                  setTiming(event.target.value);
                }}
              >
                {slotTiming.map((slotTime) => (
                  <MenuItem
                    className="crud-menuItem"
                    value={slotTime}
                    key={slotTime}
                  >
                    {slotTime}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText className="crud-helperText">
                This field is required
              </FormHelperText>
            </FormControl>

            {!crudBtns.delete ? (
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
            ) : null}
          </div>

          <Button
            variant={
              crudBtns.add ? "success" : crudBtns.update ? "primary" : "danger"
            }
            className={
              crudBtns.add
                ? "crud-submit crud-add-btn green"
                : crudBtns.update
                ? "crud-submit crud-update-btn blue"
                : "crud-submit crud-delete-btn red"
            }
            disabled={
              id === "" || timing === "" || day === "" || course === ""
                ? true
                : false
            }
            onClick={crudBtns.delete ? handleShow : handleSubmit}
          >
            {crudBtns.add ? "Assign" : crudBtns.update ? "Update" : "Delete"}
          </Button>
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DELETE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this course slot (SEE IF CORRECT)?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleSubmit()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AcademicMemberCourseSlot;
