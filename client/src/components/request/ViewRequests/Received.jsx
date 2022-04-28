import React, { useState, useEffect } from "react";
import axiosCall from "../../../helpers/axiosCall";

import { useToasts } from "react-toast-notifications";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "react-reveal/Fade";
import { link } from "../../../helpers/constants.js";

function Received() {
  const { addToast } = useToasts();
  const [rows, setRows] = useState([]);
  const [reqIDRes, setReqIDRes] = useState(0);

  useEffect(async () => {
    try {
      const response = await axiosCall(
        "get",
        "requests/viewRecievedReplacementRequest"
      );
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "warning",
          autoDismiss: true,
        });
      } else {
        let myRequests = response.data.data.map((req) => {
          var date = new Date(Date.parse(req.date));
          var x =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear();
          var y =
            new Date(Date.parse(req.replacemntDate)).getDate() +
            "/" +
            (new Date(Date.parse(req.replacemntDate)).getMonth() + 1) +
            "/" +
            new Date(Date.parse(req.replacemntDate)).getFullYear() +
            " at " +
            new Date(Date.parse(req.replacemntDate)).getHours() +
            ":" +
            new Date(Date.parse(req.replacemntDate)).getMinutes();
          return {
            id: req._id,
            date: x,

            repDate: y,
            loc: req.location,
            coursename: req.coursename,
            status: req.status,
            subject: req.subject,
          };
        });

        setRows(myRequests);
      }
    } catch (e) {
      console.log("~ err", e);
      //  document.location.href = window.location.origin + "/unauthorized";
    }
  }, [reqIDRes]);

  const handleSubmit = async (e, rowData) => {
    try {
      let submittedStatus = e.currentTarget.value;
      console.log("requests/AcceptOrRejectRep/" + rowData.id);
      const response = await axiosCall(
        "put",
        "requests/AcceptOrRejectRep/" + rowData.id,
        { AcceptOrReject: submittedStatus }
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
            "you cannot accept this request, you do not have this free slot in your Schedule"
        ) {
          addToast(
            "you cannot accept this request, you do not have this free slot in your Schedule",
            { appearance: "warning", autoDismiss: true }
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
      console.log(e);
    }
  };
  const handleDelete = async (rowData) => {
    try {
      if (rowData.status == "pending") {
        const response = await axiosCall(
          "delete",
          `${link}/requests/CancelRequest/${rowData.id}`
        );

        addToast(response.data.data, {
          appearance: "success",
          autoDismiss: true,
        });
        const filtered = await rows.filter((req) => req.id !== rowData.id);
        setRows(filtered);
      } else {
        addToast("Sorry you can't cancel this Request", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    } catch (e) {
      console.log("~ err", e);
      // document.location.href = window.location.origin + "/unauthorized";
    }
  };
  const useStyles = makeStyles((theme) => ({
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
  const classes = useStyles();
  return (
    <div className="my-table requests-table">
      <Fade>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item xs={10} sm={10} md={10}>
            <MaterialTable
              title=""
              columns={[
                { title: "Date", field: "date" },
                { title: "Subject", field: "subject" },
                { title: "Status", field: "status" },
                { title: "Replacement Date", field: "repDate" },
                { title: "Location", field: "loc" },
                { title: "Course Name", field: "coursename" },
              ]}
              data={rows}
              align="center"
              actions={[
                {
                  icon: "save",
                  tooltip: "Save User",
                  onClick: (event, rowData) => handleSubmit(event, rowData),
                },
              ]}
              components={{
                Action: (props) => (
                  <div style={{ width: "150px" }}>
                    <Button
                      onClick={(event) =>
                        props.action.onClick(event, props.data)
                      }
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
              options={{
                headerStyle: {
                  backgroundColor: "#01579b",
                  color: "#FFF",
                  letterSpacing: "0.1em",
                  fontSize: "18px",
                  margin: "0",
                  padding: "0 0 10px 0",
                },
                rowStyle: {
                  fontSize: "15px",
                },
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}
export default Received;
