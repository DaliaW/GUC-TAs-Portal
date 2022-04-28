import React, { useState, useEffect } from "react";
import axiosCall from "../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import auth from "../helpers/auth";
//TODO: el location/staff/dep w el async

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from "@material-ui/core";

function NewStaffMember(props) {
  const [disable, setDisable] = useState(false);
  const [user, setUser] = useState({
    name: "",
    gender: "",
    email: "",
    type: "",
    dayOff: "Saturday",
    salary: "",
    faculty: "",
    department: "",
    role: "",
    officeLocation: "",
  });

  const [rooms, setRooms] = useState({ rooms: [] });
  const [faculties, setFaculties] = useState([]);
  const [deps, setDeps] = useState([]);

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      await auth(["HR"]);

      //get all locations
      const locationRes = await axiosCall("get", "locations/room/all");
      const filtered = locationRes.data.data.filter(
        (loc) => loc.type === "Office"
      );
      setRooms(filtered);

      //get all faculties
      const facultyRes = await axiosCall("get", "faculties/faculty/all");
      setFaculties(facultyRes.data.data);
    }
    // if (updated) updateData();
    fetchData();
  }, []);

  const updateUser = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosCall("post", "staffMembers/staff", user);

      if (res.data.data) {
        addToast("Staff added successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setUser({
          ...user,
          gucId: res.data.data.gucId,
        });
        setDisable(true);
      }
      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.log("~error: ", err);
    }
  };

  const handleFacOnChange = async (event) => {
    try {
      updateUser(event);
      let depResult;

      depResult = await axiosCall(
        "get",
        `departments/department/${event.target.value}/all`
      );

      await setDeps(depResult.data.data);
    } catch (err) {
      console.log("~error:", err);
    }
  };

  return (
    <div className="profile-inner-container">
      <div className="profile-all">
        <div className="profile-form">
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">GUC Id</InputLabel>
            <Input
              className="profile-input"
              value={user.gucId}
              disabled={true}
            />
          </FormControl>
          <FormControl className={`profile-formControl`}>
            <InputLabel className="profile-inputLabel">Name</InputLabel>
            <Input
              className="profile-input"
              name="name"
              value={user.name}
              disabled={disable}
              onChange={(event) => updateUser(event)}
            />
          </FormControl>
          <FormControl className={`profile-formControl`}>
            <InputLabel className="profile-inputLabel">Gender</InputLabel>
            <Input
              className="profile-input"
              name="gender"
              value={user.gender}
              disabled={disable}
              onChange={(event) => updateUser(event)}
            />
          </FormControl>
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Email</InputLabel>
            <Input
              className="profile-input"
              name="email"
              value={user.email}
              onChange={(event) => updateUser(event)}
              disabled={disable}
            />
          </FormControl>
          <FormControl className={`profile-formControl`}>
            <InputLabel className="profile-inputLabel">Salary</InputLabel>
            <Input
              className="profile-input"
              value={user.salary}
              name="salary"
              onChange={(event) => updateUser(event)}
              type="number"
              min="0"
              disabled={disable}
            />
          </FormControl>
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Position</InputLabel>
            <Select
              className="profile-select"
              value={user.type}
              name="type"
              onChange={(event) => updateUser(event)}
              disabled={disable}
            >
              <MenuItem className="profile-menuItem" value={"HR"} key={"HR"}>
                HR
              </MenuItem>
              <MenuItem
                className="profile-menuItem"
                value={"Academic Member"}
                key={"Academic Member"}
              >
                Academic Member
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Day off</InputLabel>
            <Input
              className="profile-input"
              disabled={
                disable ? true : user.type === "Academic Member" ? false : true
              }
              value={user.dayOff}
              name="dayOff"
              onChange={(event) => updateUser(event)}
            />
          </FormControl>
          <FormControl className={`profile-formControl`}>
            <InputLabel className="profile-inputLabel">
              Office Location
            </InputLabel>
            <Select
              className="profile-select"
              value={user.officeLocation}
              name="officeLocation"
              disabled={disable || faculties.length < 1}
              onChange={(event) => {
                updateUser(event);
                // handleLocChange(event);
              }}
            >
              <MenuItem
                className="profile-menuItem"
                value={""}
                key={""}
              ></MenuItem>
              {rooms.length > 0 &&
                rooms.map((room) => (
                  <MenuItem
                    className="profile-menuItem"
                    value={room.location}
                    key={room.location}
                  >
                    {room.location}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {user.type === "Academic Member" ? (
            <div>
              <FormControl className={`profile-formControl`}>
                <InputLabel className="profile-inputLabel">Role</InputLabel>
                <Select
                  className="profile-select"
                  value={user.role}
                  name="role"
                  disabled={disable}
                  onChange={(event) => updateUser(event)}
                >
                  <MenuItem
                    className="profile-menuItem"
                    value={"Course Instructor"}
                    key={"Course Instructor"}
                  >
                    Course Instructor
                  </MenuItem>
                  <MenuItem
                    className="profile-menuItem"
                    value={"Teaching Assistant"}
                    key={"Teaching Assistant"}
                  >
                    Teaching Assistant
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl className={`profile-formControl`}>
                <InputLabel className="profile-inputLabel">Faculty</InputLabel>
                <Select
                  className="profile-select"
                  value={user.faculty}
                  name="faculty"
                  disabled={disable}
                  onChange={async (event) => {
                    await handleFacOnChange(event);
                  }}
                >
                  {faculties.length > 0 &&
                    faculties.map((fac) => (
                      <MenuItem
                        className="profile-menuItem"
                        value={fac.code}
                        key={fac.code}
                      >
                        {fac.code} - {fac.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl className={`profile-formControl`}>
                <InputLabel className="profile-inputLabel">
                  Department
                </InputLabel>
                <Select
                  className="profile-select"
                  value={user.department}
                  name="department"
                  disabled={disable || deps.length < 1}
                  onChange={(event) => {
                    updateUser(event);
                    // handleDepChan ge(event);
                  }}
                >
                  <MenuItem
                    className="profile-menuItem"
                    value={""}
                    key={""}
                  ></MenuItem>
                  {deps.length > 0 &&
                    deps.map((dep) => (
                      <MenuItem
                        className="profile-menuItem"
                        value={dep.name}
                        key={dep.name}
                      >
                        {dep.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          ) : null}
        </div>

        <div className="profile-buttons">
          {!disable ? (
            <button
              className="profile-btn profile-add-btn profile-change-password-btn  green"
              onClick={handleSubmit}
              disabled={disable}
            >
              Add New Staff Member
            </button>
          ) : null}
          <button
            className="profile-change-password-btn"
            onClick={() =>
              (document.location.href = window.location.origin + "/staff")
            }
          >
            Staff Members
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewStaffMember;
