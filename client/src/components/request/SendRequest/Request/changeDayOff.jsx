import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import axiosCall from "../../../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";

import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

function ChangeDayOff() {
  const [NewDayOff, setDayOff] = useState("");
  const [Reason, setReason] = useState(" ");
  const [CurDayOff, setCurDayOff] = useState("");
  const { addToast } = useToasts();

  useEffect(() => { 
    async function fetchData() {
      const Day = await axiosCall("get", "requests/dayOff");
      setCurDayOff(Day.data.data);
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const body = {
        type: "Change DayOff",
        newDayOff: NewDayOff,
        reason: Reason,
      };
      if (NewDayOff === CurDayOff) {
        addToast("already Your Current DayOff", {
          appearance: "error",
          autoDismiss: true,
        });
        setDayOff("");
        setReason("");
      }

      const res = await axiosCall("post", "requests/sendrequest", body);

      if (res.data.data) {
        addToast("Your Request has been sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setReason("");
        setDayOff("");
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
    <div>
      <div className="crud-inner-container">
        <div className="crud-form">
          <FormControl className="crud-formControl" required>
            <InputLabel className="crud-inputLabel">New DayOff</InputLabel>
            <Select
              className="crud-select"
              value={NewDayOff}
              onChange={(event) => {
                setDayOff(event.target.value);
              }}
            >
              <MenuItem className="crud-menuItem" value="Saturday">
                Saturday
              </MenuItem>
              <MenuItem className="crud-menuItem" value="Sunday">
                Sunday
              </MenuItem>
              <MenuItem className="crud-menuItem" value="Monday">
                Monday
              </MenuItem>
              <MenuItem className="crud-menuItem" value="Tuesday">
                Tuesday
              </MenuItem>
              <MenuItem className="crud-menuItem" value="Wednesday">
                Wednesday
              </MenuItem>
              <MenuItem className="crud-menuItem" value="Thursday">
                Thursday
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className="crud-formControl">
            <InputLabel className="crud-inputLabel">Reason</InputLabel>
            <br />
            <br />
            <textarea
              className="crud-input"
              rows="3"
              cols="40"
              value={Reason}
              onChange={(event) => {
                setReason(event.target.value);
              }}
            ></textarea>
          </FormControl>
        </div>
        <Button
          variant="success"
          className="crud-submit crud-add-btn green"
          disabled={NewDayOff === "" ? true : false}
          onClick={handleSubmit}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
export default ChangeDayOff;
