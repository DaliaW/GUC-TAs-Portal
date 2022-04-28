import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import { FormControl, InputLabel, Input } from "@material-ui/core";

function AddFaculty() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const { addToast } = useToasts();

  const handleSubmit = async () => {
    try {
      const body = {
        code: code.toUpperCase(),
        name: name,
      };

      const res = await axiosCall("post", "faculties/faculty", body);
      console.log(
        "🚀 ~ file: AddFaculty.jsx ~ line 21 ~ handleSubmit ~ res",
        res
      );

      if (res.data.data) {
        addToast("Faculty created successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setCode("");
        setName("");
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
          <InputLabel className="crud-inputLabel">Faculty Code</InputLabel>
          <Input
            className="crud-input"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Faculty Name</InputLabel>
          <Input
            className="crud-input"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormControl>
      </div>

      <Button
        variant="success"
        className="crud-submit crud-add-btn green"
        disabled={code === "" || name === "" ? true : false}
        onClick={handleSubmit}
      >
        Add Faculty
      </Button>
    </div>
  );
}

export default AddFaculty;
