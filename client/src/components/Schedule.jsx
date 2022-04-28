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
import auth from "../helpers/auth";
import checkLogin from "../helpers/checkLogin";

import { axios } from "../helpers/axios";
import "../styles/_colorSchema.scss";

function Schedule(props) {
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
        if (i === 0 && arr[j].time === "8:15") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
          };
          found = true;
          break;
        } else if (i === 1 && arr[j].time === "10:00") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
          };
          found = true;
          break;
        } else if (i === 2 && arr[j].time === "11:45") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
          };
          found = true;
          break;
        } else if (i === 3 && arr[j].time === "13:45") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
          };
          found = true;
          break;
        } else if (i === 4 && arr[j].time === "15:45") {
          newArr[i] = {
            Course: arr[j].course,
            Location: arr[j].location,
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
      try {
        await checkLogin();

        let response;
        if (props.gucId) {
          await auth(["Course Instructor","Teaching Assistant"]);
          response = await axios.get(`${link}/staffMembers/viewMySchedule`);
        } else if (props.id) {
          await auth(["Course Instructor"]);
          response = await axios.get(
            `${link}/staffMembers/viewStaffSchedule/${props.id}`
          );
        }

        if (response.data.error) {
          addToast(response.data.error, {
            appearance: "error",
            autoDismiss: true,
          });
        } else if (response.data) {
          const slotsDisplay = response.data;
          var sat = [];
          var sun = [];
          var mon = [];
          var tues = [];
          var wed = [];
          var thurs = [];
          for (var i = 0; i < slotsDisplay.length; i++) {
            switch (slotsDisplay[i].day) {
              case "Saturday":
                sat.push(slotsDisplay[i]);
                break;
              case "Sunday":
                sun.push(slotsDisplay[i]);
                break;
              case "Monday":
                mon.push(slotsDisplay[i]);
                break;
              case "Tuesday":
                tues.push(slotsDisplay[i]);
                break;
              case "Wednesday":
                wed.push(slotsDisplay[i]);
                break;
              case "Thursday":
                thurs.push(slotsDisplay[i]);
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
        addToast("Sorry there is an error occurred, please try again later", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div class="table-page-slots-styleS">
      <h7 class="slots-titleS">Academic Schedule</h7>
      <div class="slots-lineS"></div>
      <TableContainer class="table-slots-containerS" component={Paper}>
        <Table
          class="table-slots-style border"
          aria-label="customized table"
          size="small"
        >
          <TableHead className="yellow">
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
              <TableCell component="th" scope="row" className="yellow">
                Saturday
              </TableCell>
              {sats.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="Sunday">
              <TableCell component="th" scope="row" className="yellow">
                Sunday
              </TableCell>
              {suns.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="Monday">
              <TableCell component="th" scope="row" className="yellow">
                Monday
              </TableCell>
              {mons.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="Tuesday">
              <TableCell component="th" scope="row" className="yellow">
                Tuesday
              </TableCell>
              {tuess.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="Wednesday">
              <TableCell component="th" scope="row" className="yellow">
                Wednesday
              </TableCell>
              {weds.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
            <TableRow key="Thursday">
              <TableCell component="th" scope="row" className="yellow">
                Thursday
              </TableCell>
              {thurss.map((day) => (
                <TableCell
                  align="center"
                  className={
                    typeof day === "string" ? "border" : "border occupiedS"
                  }
                >
                  {typeof day === "string" ? day : day.Location} <br />
                  &nbsp;{typeof day === "string" ? "\t" : day.Course}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Schedule;
