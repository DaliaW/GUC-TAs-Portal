import React, { useState } from "react";
import { Select, MenuItem } from "@material-ui/core";

import Maternity from "./request/SendRequest/Leave/maternity";
import Sick from "./request/SendRequest/Leave/sick";
import Annual from "./request/SendRequest/Leave/annual";
import Accidental from "./request/SendRequest/Leave/accidental";
import Compensation from "./request/SendRequest/Leave/compensation";

import Slot from "./request/SendRequest/Request/slot";
import ChangeDayOff from "./request/SendRequest/Request/changeDayOff";
import Replacement from "./request/SendRequest/Request/replacement";

function RequestsDropDown() {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");

  const handleSelectType = (value) => {
    setType(value);
    setValue("");
  };

  return (
    <div >
      <div
        className="crud-inner-container request-select"
        style={{
          minHeight: "0",
        }}
      >
        <Select
          className="crud-select "
          value={type}
          placeholder="Select Type"
          onChange={(event) => {
            handleSelectType(event.target.value);
          }}
        >
          <MenuItem className="crud-menuItem " value="request" key="request">
            Request
          </MenuItem>
          <MenuItem className="crud-menuItem" value="leave" key="leave">
            Leave
          </MenuItem>
        </Select>
      </div>

      {type === "request" ? (
        <div
          className="crud-inner-container request-select"
          style={{
            minHeight: "0",
          }}
        >
          <Select
            className="crud-select "
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          >
            <MenuItem
              className="crud-menuItem "
              value="Replacement Request"
              key="Replacement Request"
            >
              Replacement Request
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Slot Request"
              key="Slot Request"
            >
              Slot Request
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Change DayOff"
              key="Change DayOff"
            >
              Change DayOff
            </MenuItem>
          </Select>
        </div>
      ) : type === "leave" ? (
        <div
          className="crud-inner-container request-select"
          style={{
            minHeight: "0",
          }}
        >
          <Select
            className="crud-select "
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          >
            <MenuItem
              className="crud-menuItem"
              value="Maternity"
              key="Maternity"
            >
              Maternity Leave
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Annual" key="Annual">
              Annual Leave
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Accidental"
              key="Accidental"
            >
              Accidental Leave
            </MenuItem>
            <MenuItem className="crud-menuItem" value="Sick" key="Sick">
              Sick Leave
            </MenuItem>
            <MenuItem
              className="crud-menuItem"
              value="Compensation"
              key="Compensation"
            >
              Maternity Leave
            </MenuItem>
          </Select>
        </div>
      ) : null}

      {value === "Replacement Request" ? (
        <Replacement />
      ) : value === "Slot Request" ? (
        <Slot />
      ) : value === "Change DayOff" ? (
        <ChangeDayOff />
      ) : value === "Maternity" ? (
        <Maternity />
      ) : value === "Accidental" ? (
        <Accidental />
      ) : value === "Sick" ? (
        <Sick />
      ) : value === "Compensation" ? (
        <Compensation />
      ) : value === "Annual" ? (
        <Annual />
      ) : null}
    </div>
  );
}

export default RequestsDropDown;
