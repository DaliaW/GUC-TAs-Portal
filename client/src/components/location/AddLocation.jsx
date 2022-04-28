import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from "@material-ui/core";

function AddLocation() {
  const [type, setRoomType] = useState("");
  const [location, setRoomLocation] = useState("");
  const [capacity, setRoomCapacity] = useState("");
  const { addToast } = useToasts();

  const handleSubmit = async () => {
    try {

      const body = {
        type: type,
        location: location.toUpperCase(),
        capacity: capacity,
      };

      const res = await axiosCall("post", "locations/location", body);

      if (res.data.data) {
        addToast("Location created successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setRoomType("");
        setRoomLocation("");
        setRoomCapacity("");
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
          <InputLabel className="crud-inputLabel">Type</InputLabel>
          <Select
            className="crud-select"
            value={type}
            onChange={(event) => {
              setRoomType(event.target.value);
            }}
          >
            <MenuItem className="crud-menuItem" value="Lab" key="Lab">
              Lab
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Office" key="Office">
              Office
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Lecture Hall"
              key="Lecture Hall"
            >
              Lecture Hall
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Tutorial Room"
              key="Lecture Hall"
            >
              Tutorial Room
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Location</InputLabel>
          <Input
            className="crud-input"
            value={location}
            onChange={(event) =>  setRoomLocation(event.target.value)}
          />
        </FormControl>

        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Capacity</InputLabel>
          <Input
            className="crud-input"
            type="number"
            min="1"
            value={capacity}
            onChange={(event) => setRoomCapacity(event.target.value)}
          />
        </FormControl>
      </div>

      <Button
        variant="success"
        className="crud-submit crud-add-btn green"
        disabled={
        type === "" || capacity === "" || location === "" ? true : false
        }
        onClick={handleSubmit}
      >
        Add Location
      </Button>
    </div>
  );
}

export default AddLocation;
