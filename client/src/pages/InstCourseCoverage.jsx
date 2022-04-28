import React, { useState, useEffect } from "react";
// import axios from "axios";
import { link } from "../helpers/constants";
import { useToasts } from "react-toast-notifications";

import { axios } from "../helpers/axios";
import "../styles/_colorSchema.scss";
import { Grid } from "@material-ui/core";
import MaterialTable from "material-table";
import Fade from "react-reveal/Fade";

function InstCourseCoverage() {
  const [rows, setRows] = useState([]);
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      const loggedInUser = localStorage.getItem("user");
      if (!loggedInUser) {
        document.location.href = window.location.origin + "/login";
      } else {
        try {
          const response = await axios.get(
            `${link}/academicMember/courseInstructor/courseCoverage`
          );
          if (response.data.error) {
            addToast(response.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            const coverageDisplay = response.data.data;
            console.log(coverageDisplay);
            setRows(coverageDisplay);
          }
        } catch (e) {
          console.log("~ err", e);
          document.location.href = window.location.origin + "/unauthorized";
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">View course coverage</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={8}>
            <MaterialTable
              title=""
              columns={[
                { title: "Course name", field: "course_name" },
                { title: "Coverage %", field: "course_coverage" },
              ]}
              data={rows}
              options={{
                headerStyle: {
                  backgroundColor: "#045CC8",
                  color: "#FFF",
                },
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

export default InstCourseCoverage;
