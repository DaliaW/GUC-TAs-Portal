import React from "react";
import add from "../assets/add.svg";

function Add(props) {
  return (
    <div className="crud-button crud-add green" onClick={props.onClick}>
      <img src={add} alt="add-icon" className="icon" />
      {props.textClassified ? (
        <h5 className="text">{props.textClassified} </h5>
      ) : (
        <h5 className="text">Add {props.text} </h5>
      )}{" "}
    </div>
  );
}

export default Add;
