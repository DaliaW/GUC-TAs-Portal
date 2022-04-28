//drop down list
import React, { useState, useEffect } from "react";

function Sendd() {
  const [choosenReq, setChosen] = useState("");
  return (
    <select
      value={choosenReq}
      onChange={(event) => {
        setChosen(event.target.value);
      }}
    >
      <option value="Replacement Request">Replacement Request</option>
      <option value="Slot Request">Slot Requesty</option>
      <option value="Change DayOff">Change DayOff</option>
      <option value="Leave Request">Leave Request</option>
    </select>
  );
}
export default Sendd;
