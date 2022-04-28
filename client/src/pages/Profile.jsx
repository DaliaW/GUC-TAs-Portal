import React, { useState, useEffect } from "react";
import axiosCall from "../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import checkLogin from "../helpers/checkLogin";

// import NavBar from "../components/NavBar";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
} from "@material-ui/core";

//TODO: refactor
function Profile(props) {
  const [btn, setBtn] = useState("Update profile");
  const [update, setUpdate] = useState(false);
  const [HR, setHr] = useState(false);
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
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      //get user
      const res = await checkLogin();

      let user = (await axiosCall("get", `staffMembers/all/${res.gucId}`)).data
        .data;

      setId(user.gucId);
      setName(user.name);
      setGender(user.gender);
      setEmail(user.email);
      setDayOff(user.dayOff);
      setSalary(user.salary);
      setPosition(user.type);

      let dSalary = await axiosCall("get", `staffMembers/salary/${user.gucId}`);

      setDeductedSalary(dSalary.data.salary.toFixed(2));

      //get location
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
        let fac;
        if (facultyRes.data.data) {
          fac = facultyRes.data.data.find(({ _id }) => _id === user.faculty);
          setFaculty(fac.code);
        }

        //get department
        const depRes = await axiosCall("get", "departments/department/all/all");
        let dep;
        if (depRes.data.data) {
          dep = depRes.data.data.find(({ _id }) => _id === user.department);
          setDepartment(dep.name);
        }
      }
    }
    fetchData();
  }, [props.user]);

  const handleUpdateProfile = async () => {
    setBtn("Submit Changes");
    setUpdate(true);
  };

  const handleSubmit = async () => {
    try {
      const body = {
        gucId: gucId,
        name: name,
        gender: gender,
        role: role,
      };

      const res = await axiosCall("put", "staffMembers/profile", body);

      if (res.data.data) {
        addToast("Profile updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setBtn("Update Profile");
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

          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Day off</InputLabel>
            <Input className="profile-input" value={dayOff} disabled={true} />
          </FormControl>

          <FormControl className="profile-formControl">
            <InputLabel className="profile-inputLabel">Salary</InputLabel>
            <Input className="profile-input" value={salary} disabled={true} />
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
              update && HR
                ? `profile-formControl toUpdate`
                : `profile-formControl`
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
                disabled={update && HR ? false : true}
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
              <FormControl className="profile-formControl">
                <InputLabel className="profile-inputLabel">Faculty</InputLabel>
                <Input
                  className="profile-input"
                  value={faculty}
                  disabled={true}
                />
              </FormControl>
              <FormControl className="profile-formControl">
                <InputLabel className="profile-inputLabel">
                  Department
                </InputLabel>
                <Input
                  className="profile-input"
                  value={department}
                  disabled={true}
                />
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
                window.location.origin + "/changePassword")
            }
          >
            Change Password
          </button>
        </div>
      </div>
      {/* <NavBar notify={true} /> */}
    </div>
  );
}

export default Profile;
