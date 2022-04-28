import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../../helpers/axiosCall";
import { checkHOD, link } from "../../helpers/constants.js";
import Fade from "react-reveal/Fade";
import { MyButton } from "../../styles/StyledComponents";

function ViewCourseCoverage() {
  const [data, setData] = useState([]); //table data
  const { addToast } = useToasts();
  const [HOD, setHOD] = useState(false);


  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = window.location.origin + "/login";
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
            `${link}/departments/viewCourseCoverage`
          );
          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "error",
              autoDismiss: true,
            });
          } else {
            let data = response.data.data;
            setData(data);
          }
        } catch (err) {
          console.log("~ err", err);
          document.location.href = window.location.origin + "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  if(HOD)
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
                { title: "Course name", field: "course" },
                { title: "Coverage %", field: "coverage" },
              ]}
              data={data}
              options={{
                headerStyle: {
                  backgroundColor: "#ECEFF4",
                  color: "#000000",
                  fontSize: 16,
                },
              }}
              components={{
                Toolbar: (props) => (
                  <div style={{ padding: "10px 10px", margin: "auto" }}>
                    <MyButton
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        (document.location.href =
                          window.location.origin + "/CourseCoverage")
                      }
                    >
                      My courses coverage
                    </MyButton>
                  </div>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
  else return null;
}
export default ViewCourseCoverage;
