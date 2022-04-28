import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import axiosCall from "../../../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import DatePicker from "react-date-picker";
import { FormControl, InputLabel, Input } from "@material-ui/core";

function Sick() {
  const [date, setDate] = useState();
  const [Reason, setReason] = useState(" ");
  const [DocLink, setDoc] = useState("");
  const { addToast } = useToasts();

  const handleSubmit = async () => {
    try {
      var re1 = new RegExp("https://drive.google.com/", "y");
      var OK = DocLink.match(re1);

      if (!OK) {
        addToast("please enter correct drive link", {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        const body = {
          type: "Leave Request",
          leaveType: "Sick",
          SickDayDate: date,

          document: DocLink,
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
          setDoc("");
        }

        if (res.data.error) {
          addToast(res.data.error, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      }
    } catch (err) {
      console.log("~err: ", err);
    }
  };

  return (
    <div className="crud-inner-container">
      <div className="crud-form">
        <FormControl className="crud-formControl" required>
          <InputLabel className="crud-inputLabel">Sick Day Date</InputLabel>

          <br />
          <br />
          <DatePicker className="crud-input" value={date} onChange={setDate} />
        </FormControl>

        <FormControl className="crud-formControl">
          <InputLabel className="crud-inputLabel">
            Document Drive Link
          </InputLabel>

          <Input
            className="crud-input"
            type="url"
            placeholder="https://drive.google.com/.."
            value={DocLink}
            onChange={(event) => setDoc(event.target.value)}
          />
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
        disabled={date == null || DocLink == "" ? true : false}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </div>
  );
}
export default Sick;
