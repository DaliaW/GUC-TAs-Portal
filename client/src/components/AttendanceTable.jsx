import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { useToasts } from "react-toast-notifications";
import axiosCall from "../helpers/axiosCall";
import Fade from "react-reveal/Fade";
import { IoFilter, IoCloseSharp } from "react-icons/io5";
import { Select, MenuItem } from "@material-ui/core";
import MaterialTable, { MTableToolbar } from "material-table";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";

function AttendanceTable(props) {
  const [staff, setStaff] = useState([]);
  const [HR, setHr] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]); //table data
  const [filtered, setFiltered] = useState(false);
  const [selectedMonth, setMonth] = useState("Month");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { addToast } = useToasts();

  const month = [
    "11 Jan - 10 Feb", //0 1-2
    "11 Feb - 10 Mar", //1 2-3
    "11 Mar - 10 Apr", //2 3-4
    "11 Apr - 10 May", //3 4-5
    "11 May - 10 Jun", //4 5-6
    "11 Jun - 10 Jul", //5 6-7
    "11 Jul - 10 Aug", //6 7-8
    "11 Aug - 10 Sep", //7 8-9
    "11 Sep - 10 Oct", //8 9-10
    "11 Oct - 10 Nov", //9 10-11
    "11 Nov - 10 Dec", //10 11-12
    "11 Dec - 10 Jan", //11 12-1
  ];

  const compare = (a, b) => {
    const rec1 = a.date;
    const rec2 = b.date;

    let comparison = 0;
    if (rec1 < rec2) {
      comparison = 1;
    } else if (rec1 > rec2) {
      comparison = -1;
    }
    return comparison;
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (!loggedInUser) {
      document.location.href = window.location.origin + "/login";
    } else {
      async function fetchData() {
        try {
          let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
          let staff = "";
          if (temp.data.data) staff = temp.data.data;

          if (props.hr) setHr(true);

          if (staff) {
            setStaff(staff);
            let records = staff.attendanceRecords;

            //sorted .. from most to least recent
            const result = records.sort(compare);
            setOriginalData(result);
            setData(result);
          } else {
            addToast("Error occurred, please try again later", {
              appearance: "danger",
              autoDismiss: true,
            });
          }
        } catch (err) {
          console.log("~ err", err);
        }
      }
      fetchData();
    }
  }, [props]);

  const handleFilter = async () => {
    try {
      if (selectedMonth === "Month") {
      } else {
        setFiltered(true);
        let term = parseInt(month.indexOf(selectedMonth));
        if (term > -1) {
          let month1 = term + 1;
          let month2;
          if (month1 === 12) month2 = 1;
          else month2 = month1 + 1;

          const res = await axiosCall(
            "get",
            `attendance/viewAttendance/${month1}/${month2}`
          );
          console.log(
            "🚀 ~ file: AttendanceTable.jsx ~ line 105 ~ handleFilter ~ res",
            res
          );

          addToast("filtered successfully", {
            appearance: "success",
            autoDismiss: true,
          });

          return setData(res.data);
        } else {
          addToast("Sorry this is not a valid month", {
            appearance: "danger",
            autoDismiss: true,
          });
        }
      }
    } catch (error) {
      addToast("crashed", {
        appearance: "danger",
        autoDismiss: true,
      });
    }
  };

  const handleRemoveFilter = async () => {
    setData(originalData);
    setFiltered(false);
    setMonth("");
  };

  const handleDateChange = (date) => {
    console.log(
      "🚀 ~ file: AttendanceTable.jsx ~ line 139 ~ handleDateChange ~ date",
      date
    );
    setSelectedDate(date);
  };

  const handleRowUpdate = async (newData, oldData) => {
    if (oldData.startTime && oldData.endTime) {
      return addToast(
        "Sorry you cannot update a record with no missing sign in/out",
        {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        }
      );
    }
    //get number
    const filtered = originalData.filter((rec) => rec.date === oldData.date);
    let numberHere = 0;
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i]._id === oldData._id) {
        numberHere = i + 1;
        break;
      }
    }

    const newSignIn = newData.startTime;
    const newSignOut = newData.endTime;

    if (typeof newSignIn === "object" && typeof newSignOut === "object") {
      return addToast("Sorry you cannot change both signIn and sign Out", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    } else if (!oldData.startTime && newData.startTime) {
      //changed signIn
      let time = newData.startTime.toLocaleTimeString().split(" ");
      let signIn = time[0];
      let splitted = time[0].split(":");
      if (time[1] === "PM") {
        splitted[0] = parseInt(splitted[0]) + 12;
      } else {
        if (parseInt(splitted[0]) < 7) {
          splitted[0] = 7;
          splitted[1] = "00";
          splitted[2] = "00";
        }
      }
      signIn = splitted[0] + ":" + splitted[1] + ":" + splitted[2];

      if (signIn.length < 8) signIn = "0" + signIn;

      const body = {
        id: staff.gucId,
        signIn: signIn,
        date: oldData.date,
        day: oldData.day,
        number: parseInt(numberHere),
      };

      const res = await axiosCall(
        "put",
        "attendance/addMissingSignInOut",
        body
      );
      console.log(
        "🚀 ~ file: AttendanceTable.jsx ~ line 194 ~ handleRowUpdate ~ res",
        res
      );

      if (res.data.data) {
        addToast("Record updated successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });

        let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
        let staffUpdated = "";
        if (temp.data.data) staffUpdated = temp.data.data;

        if (staffUpdated) {
          let records = staffUpdated.attendanceRecords;

          //sorted .. from most to least recent
          const result = records.sort(compare);

          setOriginalData(result);
          setData(result);
        }
      }
      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    } else if (!oldData.endTime && newData.endTime) {
      //changed signOut

      let time = newData.endTime.toLocaleTimeString().split(" ");
      let signOut = time[0];
      if (time[1] === "PM") {
        let splitted = time[0].split(":");
        splitted[0] = parseInt(splitted[0]) + 12;
        if (splitted[0] > 19) {
          splitted[0] = 19;
          splitted[1] = "00";
          splitted[2] = "00";
        }
        signOut = splitted[0] + ":" + splitted[1] + ":" + splitted[2];
      }
      if (signOut.length < 8) signOut = "0" + signOut;

      const body = {
        id: staff.gucId,
        signOut: signOut,
        date: oldData.date,
        day: oldData.day,
        number: parseInt(numberHere),
      };

      const res = await axiosCall(
        "put",
        "attendance/addMissingSignInOut",
        body
      );
      if (res.data.data) {
        addToast("Record updated successfully", {
          appearance: "success",
          autoDismiss: true,
          autoDismissTimeout: 3000,
        });

        let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
        let staffUpdated = "";
        if (temp.data.data) staffUpdated = temp.data.data;

        if (staffUpdated) {
          let records = staffUpdated.attendanceRecords;

          //sorted .. from most to least recent
          const result = records.sort(compare);

          setOriginalData(result);
          setData(result);
        }
      }
      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 2000,
        });
      }
    } else if (
      (typeof oldData.startTime === "string" &&
        typeof newData.startTime === "object") ||
      (typeof oldData.endTime === "string" &&
        typeof newData.endTime === "object")
    ) {
      return addToast("You can not change existing records", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    } else {
      return addToast("You did not change any record", {
        appearance: "warning",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }
  };

  const handleRowAdd = async (newData) => {
    let input = newData.date;

    // console.log(selectedDate);
    if (!newData.startTime || !newData.endTime) {
      return addToast("Please enter all details", {
        appearance: "error",
        autoDismiss: true,
      });
    }

    //day
    let day;
    switch (input.toString().split(" ")[0]) {
      case "Sat":
        day = "Saturday";
        break;
      case "Sun":
        day = "Sunday";
        break;
      case "Mon":
        day = "Monday";
        break;
      case "Tue":
        day = "Tuesday";
        break;
      case "Wed":
        day = "Wednesday";
        break;
      case "Thu":
        day = "Thursday";
        break;
      case "Fri":
        return addToast("Sorry you cannot add a record on Friday", {
          appearance: "error",
          autoDismiss: true,
        });
      default:
        break;
    }

    //date
    let dayOfMonth =
      input.getDate() > 9 ? input.getDate() : "0" + input.getDate();
    let monthOfYear =
      input.getMonth() + 1 > 9
        ? input.getMonth() + 1
        : "0" + (input.getMonth() + 1);

    let date = input.getFullYear() + "-" + monthOfYear + "-" + dayOfMonth;

    //signIn
    let time = newData.startTime.toLocaleTimeString().split(" ");
    let signIn = time[0];
    let splitted = time[0].split(":");
    if (time[1] === "PM") {
      splitted[0] = parseInt(splitted[0]) + 12;
    } else {
      if (parseInt(splitted[0]) < 7) {
        splitted[0] = 7;
        splitted[1] = "00";
        splitted[2] = "00";
      }
    }
    signIn = splitted[0] + ":" + splitted[1] + ":" + splitted[2];

    if (signIn.length < 8) signIn = "0" + signIn;

    //signOut
    time = newData.endTime.toLocaleTimeString().split(" ");
    let signOut = time[0];
    if (time[1] === "PM") {
      let splitted = time[0].split(":");
      splitted[0] = parseInt(splitted[0]) + 12;
      if (splitted[0] > 19) {
        splitted[0] = 19;
        splitted[1] = "00";
        splitted[2] = "00";
      }
      signOut = splitted[0] + ":" + splitted[1] + ":" + splitted[2];
    }
    if (signOut.length < 8) signOut = "0" + signOut;

    const body = {
      id: staff.gucId,
      signIn: signIn,
      signOut: signOut,
      date: date,
      day: day,
      number: 1,
    };

    const res = await axiosCall("put", "attendance/addMissingSignInOut", body);

    if (res.data.data) {
      addToast("Record updated successfully", {
        appearance: "success",
        autoDismiss: true,
      });

      let temp = await axiosCall("get", `staffMembers/all/${props.gucId}`);
      let staffUpdated = "";
      if (temp.data.data) staffUpdated = temp.data.data;

      if (staffUpdated) {
        let records = staffUpdated.attendanceRecords;

        //sorted .. from most to least recent
        const result = records.sort(compare);

        setOriginalData(result);
        setData(result);
      }
    }
    if (res.data.error) {
      addToast(res.data.error, {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 2000,
      });
    }
  };

  return (
    <div className="my-table">
      <Fade>
        <h3 className="general-header">{props.title}</h3>
        <hr className="general-line" />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container spacing={1}>
            <Grid item xs={11}>
              <MaterialTable
                title=""
                columns={[
                  {
                    title: "Day",
                    field: "day",
                    editable: false,
                  },
                  {
                    title: "Date",
                    field: "date",
                    editComponent: ({ value, onChange }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          value={value}
                          defaultValue={null}
                          onChange={onChange}
                          ampm={false}
                        />
                      </MuiPickersUtilsProvider>
                    ),
                  },
                  {
                    title: "Sign In",
                    field: "startTime",
                    sorting: false,
                    filtering: false,
                    editComponent: ({ value, onChange }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          value={value ? value : null}
                          defaultValue={null}
                          onChange={onChange}
                          ampm={false}
                        />
                      </MuiPickersUtilsProvider>
                    ),
                  },
                  {
                    title: "Sign Out",
                    field: "endTime",
                    sorting: false,
                    filtering: false,
                    editComponent: ({ value, onChange }) => (
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          value={value ? value : null}
                          defaultValue={null}
                          onChange={onChange}
                          ampm={false}
                        />
                      </MuiPickersUtilsProvider>
                    ),
                  },
                  {
                    title: "leave",
                    field: "absentsatisfied",
                    sorting: false,
                    filtering: false,
                    editable: false,
                  },
                  {
                    title: "Absent Status",
                    field: "absentStatus",
                    sorting: false,
                    filtering: false,
                    editable: false,
                  },
                  {
                    title: "Description",
                    field: "description",
                    sorting: false,
                    filtering: false,
                    editable: false,
                  },
                ]}
                align="center"
                data={data}
                options={{
                  search: true,
                  sorting: true,
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
                    <div className="select-table-container">
                      {!HR ? (
                        <div style={{ display: "inline" }}>
                          <MTableToolbar {...props} />
                          <Select
                            className="table-select month"
                            value={selectedMonth}
                            onChange={(event) => setMonth(event.target.value)}
                            placeholder="Month"
                          >
                            <MenuItem
                              className=""
                              value={"Month"}
                              key={"Month"}
                            >
                              Month
                            </MenuItem>
                            {month.map((mon) => (
                              <MenuItem className="" value={mon} key={mon}>
                                {mon}
                              </MenuItem>
                            ))}
                          </Select>

                          <IoFilter
                            style={{ display: "inline" }}
                            className="filter-icon"
                            onClick={() => handleFilter()}
                          />
                        </div>
                      ) : (
                        <MTableToolbar {...props} />
                      )}

                      {filtered ? (
                        <IoCloseSharp
                          style={{ display: "inline" }}
                          className="filter-icon"
                          onClick={handleRemoveFilter}
                        />
                      ) : null}
                    </div>
                  ),
                }}
                editable={
                  HR
                    ? {
                        // handle row add
                        onRowAdd: (newData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              handleRowAdd(newData, resolve);

                              resolve();
                            }, 1500);
                          }),

                        //to update row
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve) => {
                            setTimeout(() => {
                              handleRowUpdate(newData, oldData);
                              resolve();
                            }, 1500);
                          }),
                      }
                    : false
                }
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>
      </Fade>
    </div>
  );
}

export default AttendanceTable;
