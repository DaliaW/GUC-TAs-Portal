import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdPersonAdd, MdAssignmentInd } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { IoIosPeople, IoIosPaper } from "react-icons/io";
import { BiCalendarExclamation } from "react-icons/bi";
import { BsPersonLinesFill, BsFillCalendarFill } from "react-icons/bs";

function HODMenuItems() {
  const [icons, setIcons] = useState({
    courseCoverage: false,
    staff: false,
    instAssignment: false,
    teachAssignment: false,
    requests: false,
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

  const hideTag = (name) => {
    setIcons({
      ...icons,
      [name]: false,
    });
  };

  return (
    <Menu iconShape="round" className="first-new">
      <MenuItem
        icon={<MdPersonAdd />}
        onMouseEnter={() => showTag("staff")}
        onMouseLeave={() => hideTag("staff")}
        onClick={() => routeChange("viewStaff")}
      >
        {icons.staff ? "Staff " : ""}
      </MenuItem>

      <MenuItem
        icon={<IoIosPeople />}
        onMouseEnter={() => showTag("instAssignment")}
        onMouseLeave={() => hideTag("instAssignment")}
        onClick={() => routeChange("instructorAssignment")}
      >
        {icons.instAssignment ? " Instructors Assignments " : ""}
      </MenuItem>

      <MenuItem
        icon={<IoIosPaper />}
        onMouseEnter={() => showTag("teachAssignment")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("teachingAssignments")}
      >
        {icons.teachAssignment ? "Teaching Assignments " : ""}
      </MenuItem>

      <MenuItem
        icon={<MdAssignmentInd />}
        onMouseEnter={() => showTag("assignCC")}
        onMouseLeave={() => hideTag("assignCC")}
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
        {icons.slotsAssigned ? " Slots Assignments" : ""}
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
        onClick={() => routeChange("viewCourseCoverage")}
      >
        {icons.courseCoverage ? "Course Coverage" : ""}
      </MenuItem>

      <MenuItem
        icon={<BiCalendarExclamation />}
        onMouseEnter={() => showTag("requests")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("viewRequests")}
      >
        {icons.requests ? "Staff Requests" : ""}
      </MenuItem>
    </Menu>
  );
}

export default HODMenuItems;
