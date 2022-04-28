import React from "react";

import update from "../assets/update.svg";

function Update(props) {
  return (
    <div className="crud-button crud-update blue" onClick={props.onClick}>
      <img src={update} alt="Update-icon" className="icon" />
      {props.textClassified ? (
        <h5 className="text">{props.textClassified} </h5>
      ) : (
        <h5 className="text">Update {props.text} </h5>
      )}{" "}
    </div>
  );
}

export default Update;
