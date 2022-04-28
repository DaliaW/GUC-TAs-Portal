import React, { useState, useEffect } from "react";
import { link } from "../../helpers/constants.js";
import axiosCall from "../../helpers/axiosCall";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { addToast } from "react-toast-notifications";
import auth from "../../helpers/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    fontSize: 20,
    borderRadius: 10,
    padding: "2%",
    width: "70%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "5%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    margin: "auto",
  },
  margin: {
    margin: "auto",
  },
  text: {
    margin: theme.spacing(1),
    fontSize: 18,
  },
}));
function ViewReq(props) {
  const [request, setRequest] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          await auth(["Course Instructor", "Teaching Assistant"]);
          const response = await axiosCall(
            "get",
            `${link}/requests/viewReq/${props.match.params.id}`
          );

          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            let req = response.data.data.request;
            setRequest(req);
            if (req.type == "Leave Request") {
              setType(req.leavetype);
            }
            if (
              req.type == "Replacement Request" ||
              req.type == "Slot Request" ||
              req.type == "Change DayOff"
            ) {
              setType(req.type);
            }
          }
        } catch (err) {
          console.log("~ err", err);
        }
      }
      fetchData();
    }
  }, []);

  const classes = useStyles();
  return (
    <div className={classes.modal}>
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Date:{" "}
            {new Date(Date.parse(request.date)).getDate() +
              "/" +
              (new Date(Date.parse(request.date)).getMonth() + 1) +
              "/" +
              new Date(Date.parse(request.date)).getFullYear() +
              " at " +
              new Date(Date.parse(request.date)).getHours() +
              ":" +
              new Date(Date.parse(request.date)).getMinutes()}
          </Typography>
          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Type: {type}
          </Typography>
          {type == "Replacement Request" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Replacemnt Date:
                {new Date(Date.parse(request.replacemntDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.replacemntDate)).getMonth() +
                    1) +
                  "/" +
                  new Date(Date.parse(request.replacemntDate)).getFullYear() +
                  " at " +
                  new Date(Date.parse(request.replacemntDate)).getHours() +
                  ":" +
                  new Date(Date.parse(request.replacemntDate)).getMinutes()}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Location: {request.location}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                coursename: {request.coursename}
              </Typography>
            </div>
          ) : type == "Slot Request" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Course name:{request.coursename}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Slot Date:{" "}
                {new Date(Date.parse(request.slotDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.slotDate)).getMonth() + 1) +
                  "/" +
                  new Date(Date.parse(request.slotDate)).getFullYear() +
                  " at " +
                  new Date(Date.parse(request.slotDate)).getHours() +
                  ":" +
                  new Date(Date.parse(request.slotDate)).getMinutes()}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Location Type : {request.locationType}
              </Typography>
            </div>
          ) : type == "Change DayOff" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                New DayOff: {request.newDayOff}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Compensation" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                CompensationDate:
                {new Date(Date.parse(request.CompensationDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.CompensationDate)).getMonth() +
                    1) +
                  "/" +
                  new Date(Date.parse(request.CompensationDate)).getFullYear()}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                LeaveDate:{" "}
                {new Date(Date.parse(request.LeaveDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.LeaveDate)).getMonth() + 1) +
                  "/" +
                  new Date(Date.parse(request.LeaveDate)).getFullYear()}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document: {request.document}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Maternity" ? (
            //startDate: startDate,
            //  document: doc,
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Maternity Date:{" "}
                {new Date(Date.parse(request.startDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.startDate)).getMonth() + 1) +
                  "/" +
                  new Date(Date.parse(request.startDate)).getFullYear()}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document: {request.document}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Accidental" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Accident Date:{" "}
                {new Date(Date.parse(request.AccidentDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.AccidentDate)).getMonth() + 1) +
                  "/" +
                  new Date(Date.parse(request.AccidentDate)).getFullYear()}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason: {request.reason}
              </Typography>
            </div>
          ) : type == "Annual" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                AnnualLeave Date:
                {new Date(Date.parse(request.AnnualLeaveDate)).getDate() +
                  "/" +
                  (new Date(Date.parse(request.AnnualLeaveDate)).getMonth() +
                    1) +
                  "/" +
                  new Date(Date.parse(request.AnnualLeaveDate)).getFullYear()}
              </Typography>

              {request.replacements.reps.map((rep) => (
                <div>
                  Replacements
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    TA ID:{rep.TAId}
                  </Typography>
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    time :{rep.time}
                  </Typography>
                  <Typography
                    className={classes.text}
                    color="textPrimary"
                    component="h6"
                    variant="h6"
                  >
                    Course Name:{rep.coursename}
                  </Typography>
                </div>
              ))}

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                AnnualLeave Date:{request.AnnualLeaveDate}
              </Typography>

              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason:{request.reason}
              </Typography>
            </div>
          ) : type == "Sick" ? (
            <div>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Sick Date:{request.SickDayDate}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Document:{request.document}
              </Typography>
              <Typography
                className={classes.text}
                color="textPrimary"
                component="h6"
                variant="h6"
              >
                Reason:{request.reason}
              </Typography>
            </div>
          ) : null}

          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            status: {request.status}
          </Typography>

          <Typography
            className={classes.text}
            color="textPrimary"
            component="h6"
            variant="h6"
          >
            Subject: {request.subject}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
export default ViewReq;