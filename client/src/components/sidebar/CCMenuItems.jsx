import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { BsFillCalendarFill, BsLink } from "react-icons/bs";

function CCMenuItems() {
  const [icons, setIcons] = useState({
    courseSlotsCC: false,
    slotLinkingCC: false,
  });

  const routeChange = (path) => {
    document.location.href = window.location.origin + `/${path}`;
  };

  const showTag = (name) => {
    setIcons({
      ...icons,
      [name]: true,
    });
  };

  return (
    <Menu iconShape="round" className="first-new">
      <MenuItem
        icon={<BsFillCalendarFill />}
        onMouseEnter={() => showTag("courseSlotsCC")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("courseSlotCC")}
      >
        {icons.courseSlotsCC ? "Course Slots" : ""}
      </MenuItem>

      <MenuItem
        icon={<BsLink />}
        onMouseEnter={() => showTag("slotLinkingCC")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("slotLinkingCC")}
      >
        {icons.slotLinkingCC ? "Slot Linking" : ""}
      </MenuItem>
    </Menu>
  );
}

export default CCMenuItems;
