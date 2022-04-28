import React from "react";
import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
} from "react-pro-sidebar";

//assets
import { FaUserAlt, FaBars } from "react-icons/fa";
import profile from "../assets/profile.svg";

function CollapsedSideBar() {
  return (
    <ProSidebar collapsed="false">
      <SidebarHeader>
        <FaBars />
      </SidebarHeader>
      <Menu iconShape="square">
        <MenuItem icon={<FaUserAlt />}>Dashboard</MenuItem>
      </Menu>
    </ProSidebar>
  );
}

export default CollapsedSideBar;
