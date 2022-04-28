import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import Modal from "react-bootstrap/Modal";

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function DeleteFaculty() {
  const [faculties, setFaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const result = await axiosCall("get", "faculties/faculty/all");
      setFaculties(result.data.data);
    }
    fetchData();
  }, [facultyChosen]);

  const handleSubmit = async () => {
    try {
      setShow(false);

      let code;
      if (faculties)
        code = await faculties.find(({ _id }) => _id === facultyChosen).code;

      const body = {
        code: code.toUpperCase(),
      };

      const res = await axiosCall("delete", "faculties/Faculty", body);

      if (res.data.data) {
        addToast(res.data.data, {
          appearance: "success",
          autoDismiss: true,
        });

        setFacultyChosen("");
      }

      if (res.data.error) {
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
              setFacultyChosen(event.target.value);
            }}
          >
            {faculties.length > 0 &&
              faculties.map((faculty) => (
                <MenuItem
                  className="crud-menuItem"
                  value={faculty._id}
                  key={faculty._id}
                >
                  {faculty.code} - {faculty.name}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>
      </div>

      <Button
        variant="danger"
        className="crud-submit crud-delete-btn red"
        disabled={facultyChosen === "" ? true : false}
        onClick={handleShow}
      >
        Delete Faculty
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DELETE</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this faculty?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeleteFaculty;
