import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";

function UpdateFaculty() {
  const [faculties, setfaculties] = useState({ faculties: [] });
  const [facultyChosen, setFacultyChosen] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const result = await axiosCall("get", "faculties/faculty/all");
      setfaculties(result.data.data);
    }
    fetchData();
  }, [newName]);

  const handleOnChange = (target) => {
    setFacultyChosen(target.value);
    const nameRes = faculties.find(({ _id }) => _id === target.value).name;
    setName(nameRes);
  };

  const handleSubmit = async () => {
    try {
      let code;
      if (faculties)
        code = faculties.find(({ _id }) => _id === facultyChosen).code;

      const body = {
        code: code,
        newName: newName,
      };

      const res = await axiosCall("put", "faculties/faculty", body);

      if (res.data.data) {
        addToast(res.data.data, {
          appearance: "success",
          autoDismiss: true,
        });

        setName("");
        setFacultyChosen("");
        setNewName("");
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
              handleOnChange(event.target);
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

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Name</InputLabel>
          <Input className="crud-input" value={name} disabled={true} />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">New Name</InputLabel>
          <Input
            className="crud-input"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </FormControl>
      </div>

      <Button
        variant="primary"
        className="crud-submit crud-update-btn blue"
        disabled={facultyChosen === "" ? true : false}
        onClick={handleSubmit}
      >
        Update Faculty
      </Button>
    </div>
  );
}

export default UpdateFaculty;
