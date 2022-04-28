import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdAssignmentInd, MdPersonAdd } from "react-icons/md";
import { BsPersonLinesFill, BsFillCalendarFill } from "react-icons/bs";
import { FaBook } from "react-icons/fa";

function CIMenuItems() {
  const [icons, setIcons] = useState({
    courseCoverage: false,
    staff: false,
    assignCC: false,
    SlotsAssigned: false,
    courseSlotsCI: false,
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
        icon={<MdPersonAdd />}
        onMouseEnter={() => showTag("staff")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("viewStaff")}
      >
        {icons.staff ? "Staff " : ""}
      </MenuItem>
      <MenuItem
        icon={<MdAssignmentInd />}
        onMouseEnter={() => showTag("assignCC")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("assignCC")}
      >
        {icons.assignCC ? "Course Coordinator Assignment" : ""}
      </MenuItem>
      <MenuItem
        icon={<BsPersonLinesFill />}
        onMouseEnter={() => showTag("slotsAssigned")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("SlotsAssigned")}
      >
        {icons.slotsAssigned ? "Slots Assignments" : ""}
      </MenuItem>
      <MenuItem
        icon={<BsFillCalendarFill />}
        onMouseEnter={() => showTag("courseSlotsCI")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("courseSlotsCI")}
      >
        {icons.courseSlotsCI ? "Course Assignment" : ""}
      </MenuItem>
      <MenuItem
        icon={<FaBook />}
        onMouseEnter={() => showTag("courseCoverage")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("CourseCoverage")}
      >
        {icons.courseCoverage ? "Course Coverage" : ""}
      </MenuItem>
    </Menu>
  );
}

export default CIMenuItems;
