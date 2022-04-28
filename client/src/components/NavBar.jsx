import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import checkLogin from "../helpers/checkLogin";
import { AiFillCaretDown } from "react-icons/ai";

//assets
import profileIcon from "../assets/profileIcon.svg";
import logout from "../assets/logout.svg";
import logo from "../assets/logo2.png";
import alert from "../assets/notification.svg";

import Notification from "./Notification";

import axiosCall from "../helpers/axiosCall";

function NavBar(props) {
  const [name, setName] = useState("");
  const [notification, setNot] = useState(false);
  const [notificationNumber, setNotNum] = useState(0);

  useEffect(() => {
    async function fetchData() {
      let res = await (await checkLogin()).gucId;
      setName(res);

      setInterval(async () => {
        let res = await (await checkLogin()).gucId;
        const notResult = await (await axiosCall("get", `notifications/${res}`))
          .data.data;

        if (notResult) {
          let count = 0;
          for (let i = 0; i < notResult.length; i++) {
            if (!notResult[i].is_seen) {
              count++;
            }
          }

          setNotNum(count);
        }
      }, 3000);
    }
    fetchData();
  }, [notificationNumber]);

  const handleLogout = async () => {
    localStorage.removeItem("user");
    document.location.href = window.location.origin + "/login";
  };

  return (
    <div>
      <Navbar className="navbar">
        <Navbar.Brand href="#home">
          <img
            alt=""
            src={profileIcon}
            className="profile-icon"
            onClick={() => (document.location.href = "/profile")}
          />{" "}
          <a className="navbar-name" href="/home">
            {name}
          </a>
        </Navbar.Brand>
        <img src={logo} alt="logo" className="nav-logo" />

        <img
          src={alert}
          alt="notification"
          className="notification"
          onClick={() => setNot(!notification)}
        />
        <img
          alt="logout icon"
          src={logout}
          className="logout-icon"
          onClick={handleLogout}
        />
        {parseInt(notificationNumber) > 0 ? (
          <h6 className="notification-number">{notificationNumber}</h6>
        ) : null}
      </Navbar>
      {notification ? (
        <div>
          <AiFillCaretDown className="arrow-icon" />
          <Notification />{" "}
        </div>
      ) : null}
    </div>
  );
}

export default NavBar;
