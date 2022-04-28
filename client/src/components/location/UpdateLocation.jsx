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

function UpdateLocation() {
  const [rooms, setRooms] = useState({ rooms: [] });
  const [roomChosen, setRoomChosen] = useState("");
  const [capacity, setRoomCapacity] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newType, setNewType] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const result = await axiosCall("get", "locations/room/all");
      setRooms(result.data.data);
    }
    fetchData();
  }, []);

  const handleOnChange = (target) => {
    setRoomChosen(target.value);
    const capacityRes = rooms.find(({ _id }) => _id === target.value).capacity;
    setRoomCapacity(capacityRes);
  };

  const handleSubmit = async () => {
    try {
      let name;
      if (rooms) name = rooms.find(({ _id }) => _id === roomChosen).location;

      const body = {
        type: newType !== "" ? newType : undefined,
        location: name,
        capacity: newCapacity !== "" ? newCapacity : undefined,
      };

      if (newCapacity !== "") setRoomCapacity(newCapacity);

      const res = await axiosCall("put", "locations/location", body);

      if (res.data.data) {
        addToast(res.data.data, {
          appearance: "success",
          autoDismiss: true,
        });
        setRoomChosen("");
        setNewType("");
        setRoomCapacity("");
        setNewCapacity("");
        const result = await axiosCall("get", "locations/room/all");
        setRooms(result.data.data);
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
          <InputLabel className="crud-inputLabel">Location</InputLabel>
          <Select
            className="crud-select"
            value={roomChosen}
            onChange={(event) => {
              handleOnChange(event.target);
            }}
          >
            {rooms.length > 0 &&
              rooms.map((room) => (
                <MenuItem
                  className="crud-menuItem"
                  value={room._id}
                  key={room._id}
                >
                  {room.type} - {room.location}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText className="crud-helperText">
            This field is required
          </FormHelperText>
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">Capacity</InputLabel>
          <Input
            className="crud-input"
            type="number"
            min="1"
            value={capacity}
            disabled={true}
          />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">New Capacity</InputLabel>
          <Input
            className="crud-input"
            type="number"
            min="1"
            value={newCapacity}
            onChange={(event) => setNewCapacity(event.target.value)}
          />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">New Type</InputLabel>
          <Select
            className="crud-select"
            value={newType}
            onChange={(event) => {
              setNewType(event.target.value);
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
              key="Tutorial Room"
            >
              Tutorial Room
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <Button
        variant="primary"
        className="crud-submit crud-update-btn blue"
        disabled={roomChosen === "" ? true : false}
        onClick={handleSubmit}
      >
        Update Location
      </Button>
    </div>
  );
}

export default UpdateLocation;
