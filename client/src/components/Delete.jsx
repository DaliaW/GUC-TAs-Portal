import React from "react";

import deleteSVG from "../assets/delete.svg";

function Delete(props) {
  return (
    <div className="crud-button crud-delete red" onClick={props.onClick}>
      <img src={deleteSVG} alt="Delete-icon" className="icon" />
      {props.textClassified ? (
        <h5 className="text">{props.textClassified} </h5>
      ) : (
        <h5 className="text">Delete {props.text} </h5>
      )}{" "}
    </div>
  );
}

export default Delete;
