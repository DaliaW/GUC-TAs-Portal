import React, { useState, useEffect } from "react";
import axiosCall from "../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import auth from "../helpers/auth";
import checkLogin from "../helpers/checkLogin";

import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from "@material-ui/core";

function StaffProfile(props) {
  const [btn, setBtn] = useState("Update profile");
  const [update, setUpdate] = useState(false);
  const [gucId, setId] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [dayOff, setDayOff] = useState("");
  const [salary, setSalary] = useState("");
  const [deductedSalary, setDeductedSalary] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState({ rooms: [] });
  const [roomChosen, setRoomChosen] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [facultyChosen, setFacultyChosen] = useState("");
  const [departmentChosen, setDepartmentChosen] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [deps, setDeps] = useState([]);

  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      await checkLogin();
      await auth(["HR"]);
      //get user
      const url = document.location.pathname.split("/");
      const gucId = url[url.length - 1];

      //   let gucId = "AC-1";
      let res = await axiosCall("get", `staffMembers/all/${gucId}`);
      let user = "";
      if (res.data.data) user = res.data.data;

      setId(user.gucId);
      setName(user.name);
      setGender(user.gender);
      setEmail(user.email);
      setDayOff(user.dayOff);
      setSalary(user.salary);
      setPosition(user.type);

      let dSalary = await axiosCall("get", `staffMembers/salary/${gucId}`);
      setDeductedSalary(dSalary.data.salary.toFixed(2));

      //   get location
      const locationRes = await axiosCall("get", "locations/room/all");
      const filtered = locationRes.data.data.filter(
        (loc) => loc.type === "Office"
      );
      setRooms(filtered);
      let office;
      if (locationRes.data.data) {
        office = locationRes.data.data.find(
          ({ _id }) => _id === user.officeLocation
        );

        setRoomChosen(office._id);
        setLocation(office.location);
      }

      if (user.type === "Academic Member") {
        setRole(user.role);

        //get faculty
        const facultyRes = await axiosCall("get", "faculties/faculty/all");
        setFaculties(facultyRes.data.data);

        let fac;
        if (facultyRes.data.data) {
          fac = facultyRes.data.data.find(({ _id }) => _id === user.faculty);
          setFacultyChosen(fac.code);
          setFaculty(fac.code + " - " + fac.name);
        }

        //get department
        const depRes = await axiosCall(
          "get",
          `departments/department/${fac.code}/all`
        );
        setDeps(depRes.data.data);

        let dep;
        if (depRes.data.data) {
          dep = depRes.data.data.find(({ _id }) => _id === user.department);
          setDepartmentChosen(dep._id);
          setDepartment(dep.name);
        }
      }
    }
    fetchData();
  }, [gucId]);

  const handleUpdateProfile = async () => {
    setBtn("Submit Changes");
    setUpdate(true);
  };

  const handleSubmit = async () => {
    try {
      let locName;
      if (rooms) locName = rooms.find(({ _id }) => _id === roomChosen);

      let facName;
      let depName;
      let body;
      if (position === "Academic Member") {
        if (faculties)
          facName = faculties.find(({ code }) => code === facultyChosen).code;
        if (deps)
          depName = deps.find(({ _id }) => _id === departmentChosen).name;
      }

      body = {
        gucId,
        name,
        gender,
        role,
        salary,
        officeLocation: locName.location,
        faculty: facName,
        department: depName,
      };

      const res = await axiosCall("put", "staffMembers/staff", body);

      if (res.data.data) {
        addToast("Profile updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setBtn("Update Profile");
        setLocation(locName.location);
        setFaculty(facName);
        setDepartment(depName);
        setUpdate(false);
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
      setFacultyChosen(event.target.value);
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
            <InputLabel className="profile-inputLabel">GUC ID</InputLabel>
            <Input className="profile-input" value={gucId} disabled={true} />
          </FormControl>
          <FormControl className={`profile-formControl`}>
            <InputLabel className="profile-inputLabel">Name</InputLabel>
            <Input
              className="profile-input"
              value={name}
              disabled={true}
              onChange={(event) => setName(event.target.value)}
            />
          </FormControl>
          <FormControl
            className={
              update ? `profile-formControl toUpdate` : `profile-formControl`
            }
          >
            <InputLabel className="profile-inputLabel">Gender</InputLabel>
            <Input
              className="profile-input"
              value={gender}
              disabled={update ? false : true}
              onChange={(event) => setGender(event.target.value)}
            />
          </FormControl>
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Email</InputLabel>
            <Input className="profile-input" value={email} disabled={true} />
          </FormControl>
          {/* TODO: change day off */}
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Day off</InputLabel>
            <Input className="profile-input" value={dayOff} disabled={true} />
          </FormControl>
          <FormControl
            className={
              update ? `profile-formControl toUpdate` : `profile-formControl`
            }
          >
            <InputLabel className="profile-inputLabel">Salary</InputLabel>
            <Input
              className="profile-input"
              value={salary}
              disabled={update ? false : true}
              onChange={(event) => setSalary(event.target.value)}
            />
          </FormControl>
          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">
              Current Salary
            </InputLabel>
            <Input
              className="profile-input"
              value={deductedSalary}
              disabled={true}
            />
          </FormControl>

          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Position</InputLabel>
            <Input className="profile-input" value={position} disabled={true} />
          </FormControl>
          <FormControl
            className={
              update ? `profile-formControl toUpdate` : `profile-formControl`
            }
          >
            <InputLabel className="profile-inputLabel">
              Office Location
            </InputLabel>
            {update ? (
              <Select
                className="profile-select"
                value={roomChosen}
                onChange={(event) => {
                  setRoomChosen(event.target.value);
                }}
                disabled={update ? false : true}
              >
                {update &&
                  rooms.length > 0 &&
                  rooms.map((room) => (
                    <MenuItem
                      className="profile-menuItem"
                      value={room._id}
                      key={room._id}
                    >
                      {room.location}
                    </MenuItem>
                  ))}
              </Select>
            ) : (
              <Input
                className="profile-input"
                value={location}
                disabled={true}
              />
            )}
          </FormControl>
          {position === "Academic Member" ? (
            <div>
              <FormControl
                className={
                  update
                    ? `profile-formControl toUpdate`
                    : `profile-formControl`
                }
              >
                <InputLabel className="profile-inputLabel">Role</InputLabel>
                <Input
                  className="profile-input"
                  value={role}
                  disabled={update ? false : true}
                  onChange={(event) => setRole(event.target.value)}
                />
              </FormControl>
              <FormControl
                className={
                  update
                    ? `profile-formControl toUpdate`
                    : `profile-formControl`
                }
              >
                <InputLabel className="profile-inputLabel">Faculty</InputLabel>
                {update ? (
                  <Select
                    className="profile-select"
                    value={facultyChosen}
                    onChange={async (event) => {
                      await handleFacOnChange(event);
                    }}
                    disabled={update ? false : true}
                  >
                    {update &&
                      faculties.length > 0 &&
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
                ) : (
                  <Input
                    className="profile-input"
                    value={faculty}
                    disabled={true}
                  />
                )}
              </FormControl>
              <FormControl
                className={
                  update
                    ? `profile-formControl toUpdate`
                    : `profile-formControl`
                }
              >
                <InputLabel className="profile-inputLabel">
                  Department
                </InputLabel>
                {update ? (
                  <Select
                    className="profile-select"
                    value={departmentChosen}
                    onChange={(event) => {
                      setDepartmentChosen(event.target.value);
                    }}
                    disabled={update ? false : true}
                  >
                    {update &&
                      deps.length > 0 &&
                      deps.map((department) => (
                        <MenuItem
                          className="profile-menuItem"
                          value={department._id}
                          key={department._id}
                        >
                          {department.name}
                        </MenuItem>
                      ))}
                  </Select>
                ) : (
                  <Input
                    className="profile-input"
                    value={department}
                    disabled={true}
                  />
                )}
              </FormControl>
            </div>
          ) : null}
        </div>

        <div className="profile-buttons">
          <button
            className="blue profile-update-btn"
            onClick={update ? handleSubmit : handleUpdateProfile}
          >
            {btn}
          </button>
          <button
            className="profile-change-password-btn"
            onClick={() =>
              (document.location.href =
                window.location.origin + `/viewStaffAttendance/${gucId}`)
            }
          >
            View Attendance Records
          </button>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;
