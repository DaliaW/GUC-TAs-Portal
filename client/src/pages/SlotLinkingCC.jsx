import React, { useState, useEffect } from "react";
import { axios } from "../helpers/axios";
import { link } from "../helpers/constants";
import { useToasts } from "react-toast-notifications";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "react-reveal/Fade";

function SlotLinkingCC() {
  const { addToast } = useToasts();
  const [rows, setRows] = useState([]);
  const [reqIDRes, setReqIDRes] = useState(0);
  const switchDay = (day) => {
    switch (day) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      default:
        return "Sunday";
    }
  };
  useEffect(async () => {
    try {
      const response = await axios.get(`${link}/requests/viewSlotRequest`);
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        let myRequests = response.data.data;
        let index = 1;
        myRequests.map((req) => {
          req.id = index++;
          let dateConvert = new Date(req.date);
          req.time =
            (dateConvert.getHours() < 10 ? "0" : "") +
            dateConvert.getHours() +
            ":" +
            (dateConvert.getMinutes() < 10 ? "0" : "") +
            dateConvert.getMinutes();
          req.day = switchDay(dateConvert.getDay());
        });
        console.log(myRequests);
        setRows(myRequests);
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  }, [reqIDRes]);
  const useStyles = makeStyles((theme) => ({
    //TODO: theme colors
    acceptButton: {
      backgroundColor: "#00c458",
      color: "white",
      // marginLeft:"20px"
    },
    rejecttButton: {
      backgroundColor: "#ff2638",
      color: "white",
      // marginLeft:"20px"
    },
  }));

  const handleSubmit = async (e, rowData) => {
    let submittedStatus = e.currentTarget.value;
    try {
      const response = await axios.put(
        `${link}/requests/acceptRejectSlotLinking`,
        {
          reqNumber: rowData.id,
          status: submittedStatus,
        }
      );
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else {
        if (
          submittedStatus === "accepted" &&
          response.data.data ===
            "The slot-linking request is rejected successfully"
        ) {
          addToast(
            `The slot-linking request is rejected since there is no locations of type ${rowData.locationType} at the requested time.`,
            { appearance: "error", autoDismiss: true }
          );
        } else {
          addToast(response.data.data, {
            appearance: "success",
            autoDismiss: true,
          });
        }
        setReqIDRes(rowData.id);
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };
  const classes = useStyles();
  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">Slot Requests</h3>
        <hr className="general-line" />
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item xs={10} sm={10} md={10}>
            <MaterialTable
              title=""
              columns={[
                { title: "Course name", field: "coursename" },
                { title: "Day", field: "day" },
                { title: "Time", field: "time" },
                { title: "Location type", field: "locationType" },
                { title: "Sender", field: "sender.gucId" },
                { title: "Status", field: "status" },
                { title: "Subject", field: "subject" },
              ]}
              data={rows}
              actions={[
                {
                  icon: "save",
                  tooltip: "Save User",
                  onClick: (event, rowData) => handleSubmit(event, rowData),
                },
              ]}
              options={{
                headerStyle: {
                  backgroundColor: "#01579b",
                  color: "#FFF",
                },
              }}
              components={{
                Action: (props) => (
                  <div style={{ width: "150px" }}>
                    <Button
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                      // color="primary"
                      // class = "green"
                      // style = {{backgroundColor: "#058c42"}}
                      className={classes.acceptButton}
                      variant="contained"
                      style={{ textTransform: "none" }}
                      size="small"
                      value="accepted"
                      disabled={props.data.status === "pending" ? false : true}
                    >
                      Accept
                    </Button>
                    &nbsp;&nbsp;
                    <Button
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
                      // color="secondary"
                      className={classes.rejecttButton}
                      variant="contained"
                      style={{ textTransform: "none" }}
                      size="small"
                      value="rejected"
                      disabled={props.data.status === "pending" ? false : true}
                    >
                      Reject
                    </Button>
                  </div>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default SlotLinkingCC;
