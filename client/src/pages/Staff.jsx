import React, { useState, useEffect } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import Avatar from "react-avatar";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import { link } from "../helpers/constants.js";
import Button from "react-bootstrap/Button";
import Fade from "react-reveal/Fade";
import add from "../assets/add.svg";
import auth from "../helpers/auth";
import Modal from "react-bootstrap/Modal";

function Staff() {
  const [data, setData] = useState([]); //table data
  const [rowData, setRowData] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToasts();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = window.location.origin + "/login";
    } else {
      async function fetchData() {
        try {
          await auth(["HR"]);
          const response = await axiosCall("get", `/staffMembers/all/all`);

          const locations = await axiosCall(
            "get",
            `${link}/locations/room/all`
          );

          if (response.data.data.error) {
            addToast(response.data.data.error, {
              appearance: "danger",
              autoDismiss: true,
            });
          } else {
            //get missing hours and days
            const missingRes = await axiosCall(
              "get",
              "attendance/viewStaffMissing"
            );

            const facResult = (await axiosCall("get", "faculties/faculty/all"))
              .data.data;

            const depResult = (
              await axiosCall("get", "departments/department/all/all")
            ).data.data;

            const courseResult = (
              await axiosCall("get", "courses/course/all/all/all")
            ).data.data;

            let data = response.data.data.map((staff) => {
              return {
                name: staff.name,
                gucId: staff.gucId,
                gender: staff.gender,
                email: staff.email,
                role: staff.role,
                salary: staff.salary,
                dayOff: staff.dayOff,
                id: staff._id,
                position: depResult.find((dep) => dep.HOD === staff._id)
                  ? "HOD"
                  : courseResult.find(
                      (course) => course.courseCoordinator === staff._id
                    )
                  ? "Course Coordinator"
                  : null,
                faculty: facResult.map((fac) => {
                  if (staff.faculty === fac._id) {
                    return fac.code;
                  } else return null;
                }),
                department: depResult.map((dep) => {
                  if (staff.department === dep._id) {
                    return dep.name;
                  } else return null;
                }),
                location: locations.data.data
                  .map((location) => {
                    if (staff.officeLocation === location._id) {
                      return location.location;
                    } else return null;
                  })
                  .filter((location) => location !== null),
                missingHours: missingRes.data.data
                  .map((rec) => {
                    if (rec.GUCID === staff.gucId) {
                      return rec.MissingHours;
                    } else return null;
                  })
                  .filter((rec) => rec !== null),
                missingDays: missingRes.data.data
                  .map((rec) => {
                    if (rec.GUCID === staff.gucId) {
                      return rec.MissingDays;
                    } else return null;
                  })
                  .filter((rec) => rec !== null),
              };
            });
            await setData(data);
          }
        } catch (err) {
          console.log("~ err", err);
          //   document.location.href = "/unauthorized";
        }
      }
      fetchData();
    }
  }, []);

  const handleDelete = async (gucId) => {
    try {
      setShow(false);

      const res = await axiosCall("delete", "staffMembers/staff", {
        gucId: rowData,
      });

      if (res.data.data) {
        addToast("Staff deleted successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        const response = await axiosCall("get", `/staffMembers/all/all`);

        const locations = await axiosCall("get", `${link}/locations/room/all`);

        if (response.data.data.error) {
          addToast(response.data.data.error, {
            appearance: "danger",
            autoDismiss: true,
          });
        } else {
          //get missing hours and days
          const missingRes = await axiosCall(
            "get",
            "attendance/viewStaffMissing"
          );

          let data = await response.data.data.map((staff) => {
            return {
              name: staff.name,
              gucId: staff.gucId,
              gender: staff.gender,
              email: staff.email,
              role: staff.role,
              salary: staff.salary,
              dayOff: staff.dayOff,
              id: staff._id,
              location: locations.data.data
                .map((location) => {
                  if (staff.officeLocation === location._id) {
                    return location.location;
                  } else return null;
                })
                .filter((location) => location !== null),
              missingHours: missingRes.data.data
                .map((rec) => {
                  if (rec.GUCID === staff.gucId) {
                    return rec.MissingHours;
                  } else return null;
                })
                .filter((rec) => rec !== null),
              missingDays: missingRes.data.data
                .map((rec) => {
                  if (rec.GUCID === staff.gucId) {
                    return rec.MissingDays;
                  } else return null;
                })
                .filter((rec) => rec !== null),
            };
          });

          await setData(data);
        }

        // delete from table
        // const filtered = await data.filter((staff) => staff.gucId !== gucId);
        // setData(filtered);
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (error) {
      addToast(error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">Staff Members</h3>
        <hr className="general-line" />
        <Grid container spacing={1}>
          <Grid item xs={11}>
            <MaterialTable
              title=""
              columns={[
                {
                  title: "Avatar",
                  render: (rowData) => (
                    <Avatar
                      maxInitials={1}
                      size={35}
                      round={true}
                      name={rowData === undefined ? " " : rowData.name}
                    />
                  ),
                },
                { title: "Name", field: "name" },
                { title: "Gender", field: "gender" },
                { title: "ID", field: "gucId" },
                { title: "Email", field: "email" },
                { title: "Day off", field: "dayOff" },
                { title: "office", field: "location" },
                { title: "Missing Days", field: "missingDays" },
                { title: "Missing Hours", field: "missingHours" },
                { title: "Role", field: "role" },
                { title: "Position", field: "position" },
                { title: "Faculty", field: "faculty" },
                { title: "Department", field: "department" },
              ]}
              onRowClick={(event, rowData) =>
                // <StaffProfile gucId={rowData.gucId} />
                (document.location.href =
                  window.location.origin + `/staffProfile/${rowData.gucId}`)
              }
              align="center"
              data={data}
              actions={[
                {
                  title: "Delete",
                  icon: "delete",
                  tooltip: "Delete Staff",
                  onClick: (event, rowData) => {
                    setRowData(rowData.gucId);
                    handleShow(rowData.gucId);
                  },
                },
              ]}
              options={{
                search: true,
                actionsColumnIndex: -1,
                headerStyle: {
                  backgroundColor: "#FFF",
                  color: "#000",
                  letterSpacing: "0.1em",
                  fontSize: "18px",
                  margin: "0",
                  padding: "0 0 10px 0",
                },
                rowStyle: {
                  fontSize: "15px",
                },
              }}
              components={{
                Toolbar: (props) => (
                  <div style={{ display: "inline" }}>
                    <MTableToolbar {...props} />
                    <Button
                      variant="success"
                      className="add-new-staff green"
                      onClick={() =>
                        (document.location.href =
                          window.location.origin + "/newStaffMember")
                      }
                    >
                      <img src={add} alt="add-icon" className="icon" />
                      <h5 className="text">New Staff Member </h5>
                    </Button>
                  </div>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>DELETE</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this Staff Member?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => handleDelete()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Fade>
    </div>
  );
}

export default Staff;
