import React, { useState, useEffect } from "react";
// import axios from "axios";
import { link } from "../helpers/constants";
import { useToasts } from "react-toast-notifications";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { axios } from "../helpers/axios";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import "../styles/_colorSchema.scss";

function InstructorSlotsAssigned() {
  const [sats, setSats] = useState([]);
  const [suns, setSuns] = useState([]);
  const [mons, setMons] = useState([]);
  const [tuess, setTuess] = useState([]);
  const [weds, setWeds] = useState([]);
  const [thurss, setThurss] = useState([]);
  const { addToast } = useToasts();

  const orderDays = (arr) => {
    var newArr = [];
    for (var i = 0; i < 5; i++) {
      var found = false;
      for (var j = 0; j < arr.length; j++) {
        if (i === 0 && arr[j].time === "8:15:00 AM") {
          newArr[i] = {
            Course: arr[j].coursename,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 1 && arr[j].time === "10:00:00 AM") {
          newArr[i] = {
            Course: arr[j].coursename,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 2 && arr[j].time === "11:45:00 AM") {
          newArr[i] = {
            Course: arr[j].coursename,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 3 && arr[j].time === "01:45:00 PM") {
          newArr[i] = {
            Course: arr[j].coursename,
            Location: arr[j].location,
            assignedTo: arr[j].assignedTo,
          };
          found = true;
          break;
        } else if (i === 4 && arr[j].time === "03:45:00 PM") {
          newArr[i] = {
            Course: arr[j].coursename,
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
          const response = await axios.get(
            `${link}/academicMember/courseInstructor/slotsAssignment`
          );
          if (response.data.error) {
            addToast(response.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            const slotsDisplay = response.data.data;
            var sat = [];
            var sun = [];
            var mon = [];
            var tues = [];
            var wed = [];
            var thurs = [];
            for (var i = 0; i < slotsDisplay.length; i++) {
              for (var j = 0; j < slotsDisplay[i].course_slots.length; j++) {
                console.log(slotsDisplay[i].course_slots[j].assignedTo);
                var obj = {
                  coursename: slotsDisplay[i].course_name,
                  day: slotsDisplay[i].course_slots[j].day,
                  time: slotsDisplay[i].course_slots[j].time,
                  location: slotsDisplay[i].course_slots[j].location,
                  assignedTo:
                    slotsDisplay[i].course_slots[j].assignedTo === "None"
                      ? "None"
                      : slotsDisplay[i].course_slots[j].assignedTo.name,
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

  const useStyles = makeStyles({
    table: {
      minWidth: 600, //250 //400
      // width: 1200
    },
  });
  const classes = useStyles();

  return (
    <Grid container style={{ marginLeft: "50px", left: "61px" }}>
      {/* <div class="table-page-slots-styleS"> */}
      <Grid item xs={12} sm={12} md={9} style={{ marginTop: "20px" }}>
        <h7 class="slots-title">Course(s) Slots</h7>
      </Grid>
      <Grid item xs={12} sm={12} md={9}>
        <div class="slots-line"></div>
      </Grid>
      <Grid item container xs={10} sm={10} md={9} style={{ marginTop: "30px" }}>
        <Grid
          item
          class="table-slots-container"
          xs={5}
          sm={5}
          md={9}
          style={{ backgroundColor: "white" }}
        >
          <TableContainer component={Paper} className={classes.table}>
            <Table
              // class="table-slots-style border"

              aria-label="customized table"
              size="small"
            >
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
                  <TableCell component="th" scope="row" className="dark-blue">
                    Saturday
                  </TableCell>
                  {sats.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
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
                  <TableCell component="th" scope="row" className="dark-blue">
                    Sunday
                  </TableCell>
                  {suns.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
                      }
                    >
                      {typeof day === "string" ? day : day.Location} <br />
                      &nbsp;{typeof day === "string" ? "\t" : day.Course} <br />
                      &nbsp;{day.assignedTo}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow key="Monday">
                  <TableCell component="th" scope="row" className="dark-blue">
                    Monday
                  </TableCell>
                  {mons.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
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
                  <TableCell component="th" scope="row" className="dark-blue">
                    Tuesday
                  </TableCell>
                  {tuess.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
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
                  <TableCell component="th" scope="row" className="dark-blue">
                    Wednesday
                  </TableCell>
                  {weds.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
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
                  <TableCell component="th" scope="row" className="dark-blue">
                    Thursday
                  </TableCell>
                  {thurss.map((day) => (
                    <TableCell
                      align="center"
                      className={
                        typeof day === "string" ? "border" : "border occupied"
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
      {/* </div> */}
    </Grid>
  );
}

export default InstructorSlotsAssigned;
