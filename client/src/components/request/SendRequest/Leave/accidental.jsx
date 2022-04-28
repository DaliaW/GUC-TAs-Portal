import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import axiosCall from "../../../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import DatePicker from "react-date-picker";

import { FormControl, InputLabel } from "@material-ui/core";

function Accidental() {
  const [date, setDate] = useState();
  const [Reason, setReason] = useState(" ");
  const { addToast } = useToasts();
  const handleSubmit = async () => {
    try {
      const body = {
        type: "Leave Request",
        leaveType: "Accidental",
        AccidentDate: date,
        reason: Reason,
      };
      const res = await axiosCall("post", "requests/sendrequest", body);
      if (res.data.data) {
        addToast("Your Request has been sent successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setDate();
        setReason("");
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
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Accident Date</InputLabel>

          <br />
          <br />
          <DatePicker className="crud-input" value={date} onChange={setDate} />
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
        disabled={date == null ? true : false}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
}
export default Accidental;
