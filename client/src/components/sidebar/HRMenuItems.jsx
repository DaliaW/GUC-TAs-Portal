import React, { useState } from "react";
import { Menu, MenuItem } from "react-pro-sidebar";

//icons
import { MdLocationOn, MdPersonAdd } from "react-icons/md";
import { FaUniversity, FaClipboardList, FaBook } from "react-icons/fa";

function HRMenuItems() {
  const [icons, setIcons] = useState({
    location: false,
    faculty: false,
    department: false,
    course: false,
    staff: false,
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
        onClick={() => routeChange("staff")}
      >
        {icons.staff ? "Staff " : ""}
      </MenuItem>

      <MenuItem
        icon={<MdLocationOn />}
        onMouseEnter={() => showTag("location")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("location")}
      >
        {icons.location ? "Location" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaUniversity />}
        onMouseEnter={() => showTag("faculty")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("faculty")}
      >
        {icons.faculty ? "Faculty" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaClipboardList />}
        onMouseEnter={() => showTag("department")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("department")}
      >
        {icons.department ? "Department" : ""}
      </MenuItem>

      <MenuItem
        icon={<FaBook />}
        onMouseEnter={() => showTag("course")}
        onMouseLeave={() => setIcons(false)}
        onClick={() => routeChange("course")}
      >
        {icons.course ? "Course" : ""}
      </MenuItem>
    </Menu>
  );
}

export default HRMenuItems;
