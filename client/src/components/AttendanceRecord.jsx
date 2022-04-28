import React from "react";

function AttendanceRecord(props) {
  return (
    <div className="record-container" onClick={props.onClick}>
      <h6 className="attendance-day">
        <b>Day: </b> {props.day}
      </h6>
      <h6 className="attendance-date">
        <b>Date: </b> {props.date}
      </h6>
      <h6 className="attendance-startTime">
        <b>Sign In: </b> {props.startTime}
      </h6>
      <h6 className="attendance-endTime">
        <b>SignOut: </b> {props.endTime}
      </h6>
      <h6 className="attendance-status">
        <b>Status: </b>
        <p className={`status ${props.status}`}>{props.status} </p>
      </h6>
    </div>
  );
}

export default AttendanceRecord;
