import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { checkHOD, link } from "../../helpers/constants.js";
import Fade from "react-reveal/Fade";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import { dateFormat } from "../../helpers/constants.js";
import { MyButton } from "../../styles/StyledComponents";

function ViewRequests() {
  const [data, setData] = useState([]); //table data
  const { addToast } = useToasts();
  const [HOD, setHOD] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = "/login";
    } else {
      async function fetchData() {
        try {
          let found = await checkHOD();
          if(found){
            setHOD(prevCheck => !prevCheck);
          } else {
            document.location.href = window.location.origin + '/unauthorized'
          }
          const response = await axiosCall(
            "get",
            `${link}/requests/viewRecievedRequest/Leave Request`
          );
          const staff = await axiosCall(
            "get",
            `${link}/departments/getAllStaffMembers/all`
          );
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            let data = response.data.data.map((request) => {
              return {
                sender: staff.data.data.map((staff) => {
                  if (staff._id === request.sender) {
                    return staff.name;
                  }
                }),
                reciever: staff.data.data.map((staff) => {
                  if (staff._id === request.reciever) {
                    return staff.name;
                  }
                }),
                status: request.status,
                type: request.type,
                date: dateFormat(request.date),
                id: request._id,
              };
            });
            setData(data);
          }
        } catch (err) {
          console.log("~ err", err);
          document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  async function handleOnChange(event) {
    try {
      const res = await axiosCall(
        "get",
        `${link}/requests/viewRecievedRequest/${event.type}`
      );
      const staff = await axiosCall(
        "get",
        `${link}/departments/getAllStaffMembers/all`
      );
      console.log(res);
      let data = res.data.data.map((request) => {
        return {
          sender: staff.data.data.map((staff) => {
            if (staff._id === request.sender) {
              return staff.name;
            }
          }),
          reciever: staff.data.data.map((staff) => {
            if (staff._id === request.reciever) {
              return staff.name;
            }
          }),
          status: request.status,
          type: request.type,
          date: dateFormat(request.date),
          id: request._id,
        };
      });
      setData(data);
    } catch (err) {
      console.log("~err", err);
    }
  }

  const requestType = [{ type: "Change DayOff" }, { type: "Leave Request" }];

  if(HOD)
  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">Requests</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <MaterialTable
              title=""
              columns={[
                { title: "Sender", field: "sender" },
                { title: "Receiver", field: "reciever" },
                { title: "Status", field: "status" },
                { title: "Type", field: "type" },
                { title: "Date", field: "date" },
              ]}
              data={data}
              actions={[
                {
                  icon: "save",
                  tooltip: "view schedule",
                  onClick: (event, rowData) => {
                    document.location.href = `${rowData.id}/viewRequest`;
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
                headerStyle: {
                  backgroundColor: "#ECEFF4",
                  color: "#000000",
                  fontSize: 16,
                },
                ToolbarStyle: {
                  backgroundColor: "#045CC8",
                },
              }}
              components={{
                Action: (props) => (
                  <MyButton
                    onClick={(event) => props.action.onClick(event, props.data)}
                    color="primary"
                    variant="contained"
                    style={{ textTransform: "none" }}
                    size="small"
                  >
                    View Request
                  </MyButton>
                ),
                Toolbar: (props) => (
                  <Autocomplete
                    className="crud-select"
                    size="small"
                    id="debug"
                    options={requestType}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue);
                    }}
                    getOptionLabel={(option) => option.type}
                    style={{ width: 200, margin: "auto" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="choose request type"
                        margin="normal"
                      />
                    )}
                  />
                ),
              }}
              onRowClick={(event, rowData) =>
                (document.location.href = `/viewRequest/${rowData.id}`)
              }
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
  else return null;
}
export default ViewRequests;
