import React, { useState, useEffect } from "react";
import { checkHOD, link } from "../../helpers/constants";
import { useToasts } from "react-toast-notifications";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fade from "react-reveal/Fade";

import axiosCall from "../../helpers/axiosCall";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "../../styles/_colorSchema.scss";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";

function ViewTeachingAssignments() {
  const [sats, setSats] = useState([]);
  const [suns, setSuns] = useState([]);
  const [mons, setMons] = useState([]);
  const [tuess, setTuess] = useState([]);
  const [weds, setWeds] = useState([]);
  const [thurss, setThurss] = useState([]);
  const { addToast } = useToasts();
  const [courses, setCourses] = useState([]);
  const [HOD, setHOD] = useState(false);

  const orderDays = (arr) => {
    var newArr = [];
    for (var i = 0; i < 5; i++) {
      var found = false;
      for (var j = 0; j < arr.length; j++) {
        if (i === 0 && arr[j].time === "8:15:00 AM") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 1 && arr[j].time === "10:00:00 AM") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 2 && arr[j].time === "11:45:00 AM") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 3 && arr[j].time === "01:45:00 PM") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 4 && arr[j].time === "03:45:00 PM") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        }
      }
      if (!found) {
        newArr[i] = "Free";
      }
    }
    return newArr;
  };

  useEffect(() => {
    async function fetchData() {
      const loggedInUser = localStorage.getItem("user");
      if (!loggedInUser) {
        document.location.href = window.location.origin + "/login";
      } else {
        try {
          let found = await checkHOD();
          if(found){
            setHOD(prevCheck => !prevCheck);
          } else {
            document.location.href = window.location.origin + '/unauthorized'
          }
          const courses = await axiosCall("get", `${link}/departments/courses`);
          setCourses(courses.data.data);
          let firstCourse = courses.data.data[0].course;
          const response = await axiosCall(
            "get",
            `${link}/departments/viewTeachingAssignments/${firstCourse}`
          );
          console.log(response);
          if (response.data.error) {
            addToast(response.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            const slotsDisplay = response.data.data.slots;
            const courseName = response.data.data.course;
            var sat = [];
            var sun = [];
            var mon = [];
            var tues = [];
            var wed = [];
            var thurs = [];
            for (var i = 0; i < slotsDisplay.length; i++) {
              var obj = {
                course: courseName,
                day: slotsDisplay[i].Day,
                time: slotsDisplay[i].Time,
                location: slotsDisplay[i].Location,
                assignedTo:
                  slotsDisplay[i].Assigned_to === "None"
                    ? "None"
                    : slotsDisplay[i].Assigned_to.name,
              };
              switch (obj.day) {
                case "Saturday":
                  sat.push(obj);
                  break;
                case "Sunday":
                  sun.push(obj);
                  break;
                case "Monday":
                  mon.push(obj);
                  break;
                case "Tuesday":
                  tues.push(obj);
                  break;
                case "Wednesday":
                  wed.push(obj);
                  break;
                case "Thursday":
                  thurs.push(obj);
                  break;
                default:
                  break;
              }
            }
            setSats(orderDays(sat));
            setSuns(orderDays(sun));
            setMons(orderDays(mon));
            setTuess(orderDays(tues));
            setWeds(orderDays(wed));
            setThurss(orderDays(thurs));
          }
        } catch (e) {
          console.log("~ err", e);
          document.location.href = window.location.origin + "/unauthorized";
        }
      }
    }
    fetchData();
  }, []);

  async function handleOnChange(event) {
    try {
      const response = await axiosCall(
        "get",
        `${link}/departments/viewTeachingAssignments/${event.course}`
      );
      console.log(response);
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        const slotsDisplay = response.data.data.slots;
        const courseName = response.data.data.course;
        var sat = [];
        var sun = [];
        var mon = [];
        var tues = [];
        var wed = [];
        var thurs = [];
        for (var i = 0; i < slotsDisplay.length; i++) {
          var obj = {
            course: courseName,
            day: slotsDisplay[i].Day,
            time: slotsDisplay[i].Time,
            location: slotsDisplay[i].Location,
            assignedTo:
              slotsDisplay[i].Assigned_to === "None"
                ? "None"
                : slotsDisplay[i].Assigned_to.name,
          };
          switch (obj.day) {
            case "Saturday":
              sat.push(obj);
              break;
            case "Sunday":
              sun.push(obj);
              break;
            case "Monday":
              mon.push(obj);
              break;
            case "Tuesday":
              tues.push(obj);
              break;
            case "Wednesday":
              wed.push(obj);
              break;
            case "Thursday":
              thurs.push(obj);
              break;
            default:
              break;
          }
        }
        setSats(orderDays(sat));
        setSuns(orderDays(sun));
        setMons(orderDays(mon));
        setTuess(orderDays(tues));
        setWeds(orderDays(wed));
        setThurss(orderDays(thurs));
      }
    } catch (e) {
      console.log("~ err", e);
    }
  }

  const useStyles = makeStyles({
    table: {
      minWidth: 300, //250 //400
      // width: 1200
    },
  });
  const classes = useStyles();

  if(HOD)
  return (
    <div>
      <div className="my-table">
        <Fade>
          <h3 className="general-header">Teaching Assignments</h3>
          <hr className="general-line" />
          <Autocomplete
            size="small"
            id="debug"
            options={courses}
            onChange={(event, newValue) => {
              handleOnChange(newValue);
            }}
            getOptionLabel={(option) => option.course}
            style={{ width: 250, margin: "auto" }}
            renderInput={(params) => (
              <TextField {...params} label="choose course" margin="normal" />
            )}
          />
          <Grid container spacing={1}>
            <Grid item xs={10}>
              <TableContainer component={Paper} className={classes.table}>
                <Table aria-label="customized table" size="small">
                  <TableHead className="dark-blue">
                    <TableRow>
                      <TableCell className="border">Day/Slot</TableCell>
                      <TableCell className="border" align="center">
                        &nbsp;&nbsp;1st
                        <br /> 08:15 - 09:45
                      </TableCell>
                      <TableCell className="border" align="center">
                        &nbsp;&nbsp;2nd
                        <br /> 10:00 - 11:30
                      </TableCell>
                      <TableCell className="border" align="center">
                        &nbsp;&nbsp;3rd
                        <br /> 11:45 - 13:15
                      </TableCell>
                      <TableCell className="border" align="center">
                        &nbsp;&nbsp;4th
                        <br /> 13:45 - 15:15
                      </TableCell>
                      <TableCell className="border" align="center">
                        &nbsp;&nbsp;5th
                        <br /> 15:45 - 17:15
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow key="Saturday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Saturday
                      </TableCell>
                      {sats.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string" ? "\t" : day.Course}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow key="Sunday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Sunday
                      </TableCell>
                      {suns.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string"
                            ? "\t"
                            : day.Course}{" "}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow key="Monday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Monday
                      </TableCell>
                      {mons.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string" ? "\t" : day.Course}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow key="Tuesday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Tuesday
                      </TableCell>
                      {tuess.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string" ? "\t" : day.Course}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow key="Wednesday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Wednesday
                      </TableCell>
                      {weds.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string" ? "\t" : day.Course}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow key="Thursday">
                      <TableCell
                        component="th"
                        scope="row"
                        className="dark-blue"
                      >
                        Thursday
                      </TableCell>
                      {thurss.map((day) => (
                        <TableCell
                          align="center"
                          className={
                            typeof day === "string"
                              ? "border"
                              : "border occupied"
                          }
                        >
                          {typeof day === "string" ? day : day.Location} <br />
                          &nbsp;{typeof day === "string" ? "\t" : day.Course}
                          <br />
                          &nbsp;{day.assignedTo}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Fade>
      </div>
    </div>
  );
  else return null;
}

export default ViewTeachingAssignments;
