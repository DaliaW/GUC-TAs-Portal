import React, { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import checkLogin from "../helpers/checkLogin";
import axiosCall from "../helpers/axiosCall";

//icons
import { AiFillHome } from "react-icons/ai";
import { RiFolderWarningFill } from "react-icons/ri";
import { BsTable } from "react-icons/bs";

//users
import HRMenuItems from "./sidebar/HRMenuItems";
import HODMenuItems from "./sidebar/HODMenuItems";
import CIMenuItems from "./sidebar/CIMenuItems";
import CCMenuItems from "./sidebar/CCMenuItems";

function SideBar() {
  const [user, setUser] = useState("");
  const [showHome, setHome] = useState(false);
  const [showRequest, setRequest] = useState(false);
  const [showSchedule, setSchedule] = useState(false);

  const routeChange = (path) => {
    document.location.href = window.location.origin + `/${path}`;
  };

  useEffect(() => {
    async function fetchData() {
      const res = await checkLogin();
      const depResult = await axiosCall(
        "get",
        "departments/department/all/all"
      );

      const courseResult = await axiosCall("get", "courses/course/all/all/all");

      if (res.role === "Course Instructor") setUser("Course Instructor");
      else if (res.role === "Teaching Assistant") setUser("Teaching Assistant");
      else setUser("HR");

      if (depResult.data.data) {
        let HOD = await depResult.data.data.find(({ HOD }) => HOD === res.id);

        if (HOD) {
          console.log("yes");
          setUser("HOD");
        }
      }

      const courses = courseResult.data.data;
      for (let i = 0; i < courses.length; i++) {
        if (courses[i].courseCoordinator === res.id) setUser("CC");
      }

      // if (courseResult.data.data) {
      //   let CC = await courseResult.data.data.find(({ CC }) => console.log(CC));
      //   if (CC) {
      //     console.log(" CC yes");
      //     setUser("CC");
      //   }
      // }
    }
    fetchData();
  }, []);

  return (
    <ProSidebar collapsed="false" className="custom-sidebar">
      <Menu iconShape="round">
        <MenuItem
          icon={<AiFillHome />}
          onMouseEnter={() => setHome(true)}
          onMouseLeave={() => setHome(false)}
          onClick={() => routeChange("home")}
        >
          {showHome ? "Home" : ""}
        </MenuItem>

        {user !== "HR" ? (
          <MenuItem
            icon={<BsTable />}
            onMouseEnter={() => setSchedule(true)}
            onMouseLeave={() => setSchedule(false)}
            onClick={() => routeChange("viewMySchedule")}
          >
            {showSchedule ? "My Schedule" : ""}
          </MenuItem>
        ) : (
          <></>
        )}

        {user === "HOD" ? <HODMenuItems /> : <p />}
        {user === "Course Instructor" ? <CIMenuItems /> : <p />}
        {user === "CC" ? <CCMenuItems /> : <p />}
        {user === "HR" ? (
          <HRMenuItems />
        ) : (
          <MenuItem
            className={user !== "Teaching Assistant" ? `last-menuItem` : null}
            icon={<RiFolderWarningFill />}
            onMouseEnter={() => setRequest(true)}
            onMouseLeave={() => setRequest(false)}
            onClick={() => routeChange("request")}
          >
            {showRequest ? "My Requests" : ""}
          </MenuItem>
        )}
      </Menu>
    </ProSidebar>
  );
}

export default SideBar;
