import React, { useState, useEffect } from "react";

import axiosCall from "../../../helpers/axiosCall";

import { useToasts } from "react-toast-notifications";
import MaterialTable from "material-table";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "react-reveal/Fade";
import { link } from "../../../helpers/constants.js";

function Sent() {
  const { addToast } = useToasts();
  const [rows, setRows] = useState([]);

  useEffect(async () => {
    try {
      const response = await axiosCall("get", "requests/viewMyRequest");
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
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
          return {
            id: req._id,
            date: x,
            type: req.type,
            status: req.status,
            subject: req.subject,
          };
        });
        setRows(myRequests);
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  }, []);

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
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };
  return (
    <div className="my-table">
      <Fade>
        <Grid container justify="center" alignItems="center" spacing={2}>
          <Grid item xs={10} sm={10} md={10}>
            <MaterialTable
              title=""
              columns={[
                { title: "Date", field: "date" },
                { title: "Type", field: "type" },
                { title: "Subject", field: "subject" },
                { title: "Status", field: "status" },
              ]}
              data={rows}
              onRowClick={(event, rowData) => {
                document.location.href = `/viewReq/${rowData.id}`;
              }}
              actions={[
                {
                  title: "Delete",
                  icon: "delete",
                  tooltip: "Delete Request",
                  onClick: (event, rowData) => {
                    handleDelete(rowData);
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
                headerStyle: {
                  backgroundColor: "#01579b",
                  color: "#FFF",
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

export default Sent;
