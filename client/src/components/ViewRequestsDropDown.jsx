import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";

import Sent from "./request/ViewRequests/Sent";
import Received from "./request/ViewRequests/Received";

function ViewRequestsDropDown() {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  const handleSelectType = (value) => {
    setType(value);
    setValue("");
  };

  return (
    <div>
      <div
        className="crud-inner-container request-select"
        style={{
          minHeight: "0",
        }}
      >
        <Select
          className="crud-select "
          placeholder="Select Type"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        >
          <MenuItem
            className="crud-menuItem "
            value="Sent Requests" 
            key="Sent Requests"
          >
            Sent Requests
          </MenuItem>
          <MenuItem
            className="crud-menuItem"
            value="Received Requests"
            key="Received Requests"
          >
            Received Requests
          </MenuItem>
        </Select>
      </div>

      {value === "Sent Requests" ? (
        <Sent />
      ) : value === "Received Requests" ? (
        <Received />
      ) : null}
    </div>
  );
}

export default ViewRequestsDropDown;
