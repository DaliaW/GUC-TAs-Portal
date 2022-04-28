import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "react-avatar";
import Typography from "@material-ui/core/Typography";
import { checkHOD, link } from "../../helpers/constants.js";
import axiosCall from "../../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import { dateFormat } from "../../helpers/constants.js";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";
import { AcceptButton, RejectButton } from "../../styles/StyledComponents.js";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 500,
    fontSize: 20,
    borderRadius: 10,
    padding: "2%",
    boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.64)",
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

function Request(props) {
  const [request, setRequest] = useState([]);
  const [date, setDate] = useState([]);
  const [title, setTitle] = useState([]);
  const [sender, setSender] = useState([]);
  const [gucId, setId] = useState([]);
  const [comment, setComment] = useState("");
  const { addToast } = useToasts();
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [HOD, setHOD] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          let found = await checkHOD();
          if (found) {
            setHOD((prevCheck) => !prevCheck);
          } else {
            document.location.href = window.location.origin + "/unauthorized";
          }
          const response = await axiosCall(
            "get",
            `${link}/requests/viewRequest/${props.match.params.id}`
          );
          console.log(response);
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            let sender = response.data.data.sender;
            setSender(sender);
            let gucId = response.data.data.senderId;
            setId(gucId);
            let date = dateFormat(response.data.data.requestData.date);
            setDate(date);
            let data = response.data.data.requestData;
            setRequest(data);
            if (response.data.data.requestData.type === "Change DayOff") {
              let title = response.data.data.requestData.subject;
              setTitle(title);
            } else {
              let title = response.data.data.requestData.subject;
              setTitle(title);
            }
          }
        } catch (err) {
          console.log("~ err", err);
          document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  const handleAccept = async function () {
    let accept_or_reject_request = true;
    const rejectBody = { accept_or_reject_request, comment };
    if (request.type === "Change DayOff") {
      try {
        const response = await axiosCall(
          "put",
          `${link}/requests/AcceptOrRejectChangeDay/${props.match.params.id}`,
          rejectBody
        );
        console.log(response);
        addToast("Request accepted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.error("~err", err);
        addToast("Failed to accept request", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      try {
        const response = await axiosCall(
          "put",
          `${link}/requests/AcceptOrRejectLeave/${props.match.params.id}`,
          rejectBody
        );
        console.log(response);
        addToast("Request accepted successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.error("~err", err);
        addToast("Failed to accept request", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  // in case of rejection and optionally leave a comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    let accept_or_reject_request = false;
    const rejectBody = { accept_or_reject_request, comment };
    if (request.type === "Change DayOff") {
      try {
        const response = await axiosCall(
          "put",
          `${link}/requests/AcceptOrRejectChangeDay/${props.match.params.id}`,
          rejectBody
        );
        console.log(response);
        addToast("Request rejected successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.error("~err", err);
        addToast("Failed to reject request", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      try {
        const response = await axiosCall(
          "put",
          `${link}/requests/AcceptOrRejectLeave/${props.match.params.id}`,
          rejectBody
        );
        console.log(response);
        addToast("Request rejected successfully", {
          appearance: "success",
          autoDismiss: true,
        });
      } catch (err) {
        console.error("~err", err);
        addToast("Failed to reject request", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  if (HOD)
    return (
      <div className={classes.modal}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar maxInitials={1} size={45} round={true} name={sender} />
            }
            title={title}
            subheader={date}
          />
          <CardContent>
            <Typography
              className={classes.text}
              color="textPrimary"
              component="h5"
              variant="p"
            >
              Sender: {sender}
            </Typography>
            <Typography
              className={classes.text}
              color="textPrimary"
              component="h6"
              variant="h6"
            >
              Sender ID: {gucId}
            </Typography>
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
              Reason:
            </Typography>
            <Typography
              className={classes.text}
              color="textPrimary"
              component="p"
              variant="h6"
            >
              {request.reason}
            </Typography>
            <Typography
              className={classes.text}
              color="textPrimary"
              component="h6"
              variant="h6"
            >
              Document: {request.document}
            </Typography>
          </CardContent>
          <div>
            {(() => {
              if (request.status === "pending") {
                return (
                  <CardActions>
                    <AcceptButton
                      onClick={handleAccept}
                      variant="contained"
                      color="primary"
                      className={classes.margin}
                      startIcon={<CheckCircleIcon />}
                    >
                      {" "}
                      Accept
                    </AcceptButton>
                    <RejectButton
                      onClick={handleClick}
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={<CancelIcon />}
                    >
                      {" "}
                      Reject
                    </RejectButton>
                    <Popper id={id} open={open} anchorEl={anchorEl}>
                      <div className={classes.paper}>
                        <form
                          onSubmit={handleSubmit}
                          noValidate
                          autoComplete="off"
                        >
                          <TextField
                            value={comment}
                            onChange={({ target }) => setComment(target.value)}
                            id="standard-multiline-static"
                            label="Reason for rejection"
                            multiline
                            rows={4}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                          >
                            Confirm
                          </Button>
                        </form>
                      </div>
                    </Popper>
                  </CardActions>
                );
              } else {
                return <div />;
              }
            })()}
          </div>
        </Card>
      </div>
    );
  else return null;
}
export default Request;