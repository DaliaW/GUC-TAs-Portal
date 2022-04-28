import React from "react";
import accept from "../assets/view.svg";

function Accept(props) {
  return (
    <div className="crud-button crud-accept yellow" onClick={props.onClick}>
      <img src={accept} alt="add-icon" className="icon" />
      <h5 className="text">Accept Or Reject {props.text} </h5>
    </div>
    
  );
}

export default Accept;