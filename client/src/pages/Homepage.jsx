import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import checkLogin from "../helpers/checkLogin";
import axiosCall from "../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import id from "../assets/id2.svg";
import signIn from "../assets/signin.svg";
import signOut from "../assets/signout.svg";

function Homepage() {
  const [user, setUser] = useState("");
  const [location, setLocation] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [modal, setmodal] = useState(false);

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      setmodal(false);
      //get user
      try {
        // localStorage.removeItem("user");
        const temp = await checkLogin();

        const user = (await axiosCall("get", `staffMembers/all/${temp.gucId}`))
          .data.data;

        setUser(user);

        if (!user.lastLogIn || user.lastLogIn === null) {
          console.log(
            "🚀 ~ file: Homepage.jsx ~ line 34 ~ fetchData ~ user",
            user.lastLogIn
          );
          setmodal(true);
        }

        //get location
        const locationRes = await axiosCall("get", "locations/room/all");
        let office;
        if (locationRes.data.data) {
          office = locationRes.data.data.find(
            ({ _id }) => _id === user.officeLocation
          );

          setLocation(office.location);
        }

        if (user.type === "Academic Member") {
          //get faculty
          const facultyRes = await axiosCall("get", "faculties/faculty/all");
          let fac;
          if (facultyRes.data.data) {
            fac = facultyRes.data.data.find(({ _id }) => _id === user.faculty);
            setFaculty(fac.code);
          }

          //get department
          const depRes = await axiosCall(
            "get",
            "departments/department/all/all"
          );
          let dep;
          if (depRes.data.data) {
            dep = depRes.data.data.find(({ _id }) => _id === user.department);
            setDepartment(dep.name);
          }
        }

        //get days
        const daysRes = await axiosCall("get", "attendance/viewMissingDays");
        if (daysRes.data) setDays(daysRes.data);

        //get hours
        const hoursRes = await axiosCall("get", "attendance/viewHours");
        if (hoursRes.data) setHours(hoursRes.data);

        const res = await axiosCall("put", "staffMembers/lastLogin");
        if (res.data.error) {
          addToast(res.data.error, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await axiosCall("post", "staffMembers/signIn");

      if (res.data.data) {
        const date = new Date();

        if (parseInt(date.getHours()) < 7)
          return addToast("Signing in before 7AM is recorded as 7AM ", {
            appearance: "warning",
            autoDismiss: true,
          });

        if (
          parseInt(date.getHours()) > 19 ||
          (parseInt(date.getHours()) === 19 && parseInt(date.getMinutes()) > 0)
        )
          return addToast("Signing in after 7PM is recorded as 7PM ", {
            appearance: "warning",
            autoDismiss: true,
          });

        addToast("Signed in successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await axiosCall("post", "staffMembers/signOut");

      if (res.data.data) {
        const date = new Date();

        if (parseInt(date.getHours()) < 7)
          return addToast("Signing out before 7AM is recorded as 7AM ", {
            appearance: "warning",
            autoDismiss: true,
          });

        if (
          parseInt(date.getHours()) > 19 ||
          (parseInt(date.getHours()) === 19 && parseInt(date.getMinutes()) > 0)
        )
          return addToast("Signing out after 7PM is recorded as 7PM ", {
            appearance: "warning",
            autoDismiss: true,
          });

        addToast("Signed out successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        //get hours
        const hoursRes = await axiosCall("get", "attendance/viewHours");
        if (hoursRes.data) setHours(hoursRes.data);
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div id="homepage">
      <div className="left-hp">
        <div className="inner-homepage-box">
          <ul>
            <li>
              <h5>GUC ID: </h5>
              <h6>{user.gucId} </h6>
            </li>
            <li>
              <h5>Name: </h5>
              <h6> {user.name}</h6>
            </li>
            <li>
              <h5>Email: </h5>
              <h6> {user.email}</h6>
            </li>
            <li>
              <h5>Office Location: </h5>
              <h6> {location}</h6>
            </li>
            <li>
              <h5>Position: </h5>
              <h6> {user.type}</h6>
            </li>
            {user.type === "Academic Member" ? (
              <li>
                <h5>Faculty: </h5>
                <h6> {faculty}</h6>
              </li>
            ) : null}
            {user.type === "Academic Member" ? (
              <li>
                <h5>Department: </h5>
                <h6> {department}</h6>
              </li>
            ) : null}
            <br></br>
            <li>
              <h5>Missing Days: </h5>
              <h6> {days}</h6>
            </li>
            <li>
              <h5>Missing/Extra hours: </h5>
              <h6> {hours}</h6>
            </li>
          </ul>
          <div className="hompage-btns">
            <button
              className="attendanceRecord-btn"
              onClick={() =>
                (document.location.href =
                  window.location.origin + "/myAttendanceRecord")
              }
            >
              View Attendance Record
            </button>
            <button
              className="attendanceRecord-btn"
              onClick={() =>
                (document.location.href = window.location.origin + "/profile")
              }
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      <div className="right-hp">
        <img alt="" src={id} className="profile-icon" />
        <Button
          variant="success"
          className="sign-btn green"
          onClick={handleSignIn}
        >
          <img alt="" src={signIn} className="sign-btn-icon" />
          <h6> Sign in</h6>
        </Button>
        <Button
          variant="danger"
          className="sign-btn red"
          onClick={handleSignOut}
        >
          <img alt="" src={signOut} className="sign-btn-icon" />
          <h6> Sign Out</h6>
        </Button>
      </div>

      {modal ? (
        <div className="modal-outer-container">
          <div className="modal-container">
            <p>Do you want to change your default password?</p>
            <div className="modal-button-area">
              <button
                className="green"
                onClick={() => {
                  setmodal(false)(
                    (document.location.href =
                      window.location.origin + "/changePassword")
                  );
                }}
              >
                YES
              </button>
              <button className="red" onClick={() => setmodal(false)}>
                NO
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Homepage;
