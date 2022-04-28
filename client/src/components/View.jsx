import React from "react";
import view from "../assets/view.svg";

function View(props) {
  return (
    <div className="crud-button crud-view orange" onClick={props.onClick}>
      <img src={view} alt="add-icon" className="icon" />
      {props.textClassified ? (
        <h5 className="text">{props.textClassified} </h5>
      ) : (
        <h5 className="text">View {props.text} </h5>
      )}{" "}
    </div>
  );
}

export default View;
