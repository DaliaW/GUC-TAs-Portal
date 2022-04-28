import React, { useState, useEffect } from "react";
//Icons
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import TodayIcon from "@material-ui/icons/Today";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AddLocationIcon from "@material-ui/icons/AddLocation";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

//Components
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";

//CRUD
import { axios } from "../../helpers/axios";
import { link } from "../../helpers/constants";
import { useToasts } from "react-toast-notifications";
import { axiosCall } from "../../helpers/axiosCall";

//Styling
import "../../styles/_colorSchema.scss";
import { makeStyles } from "@material-ui/core/styles";

function CourseSlotCRUD() {
  //States needed
  const [courses, setCourses] = useState([]); //To get the courses and put it in the list
  const [course1, setCourse] = useState(""); //The selected course
  const [day, setDay] = useState(""); //The day added-deleted
  const [location, setLocation] = useState(""); //The location added-deleted
  const [timing, setTiming] = useState(""); //The timing added-deleted
  const [dayU, setDayU] = useState(""); //The day updated
  const [locationU, setLocationU] = useState(""); //The location updated
  const [timingU, setTimingU] = useState(""); //The timing updated
  const [optionSelected, setOptionSelected] = useState("add"); //To keep track of the selected option
  const [buttonEnabled, setButtonEnabled] = useState(true); //To know if we can enable the button

  const { addToast } = useToasts();
  const useStyles = makeStyles((theme) => ({
    mainGridContainer: {
      marginTop: "150px",
    },
    gridContainer: {
      backgroundColor: "white",
      boxShadow: "0px 0px 15px 0px rgba(0, 0, 0, 0.64)",
      borderRadius: "13px",
    },
    courseSlotsDiv: {
      width: "60%",
      height: "80%",
      marginLeft: "auto",
      marginRight: "auto",
      display: "block",
    },
    button: {
      backgroundColor:
        optionSelected === "add"
          ? "#058c42"
          : optionSelected === "update"
          ? "#045CC8"
          : " #C81927",
      color: "white",
    },
    radio: {
      "&$checked": {
        color: "#058c42",
      },
    },
    checked: {},
  }));
  const classes = useStyles();
  //Constants for select options
  const weekDays = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
  ];
  const slotTiming = [
    "1st slot (08:15 - 09:45)",
    "2nd slot (10:00 - 11:30)",
    "3rd slot (11:45 - 13:15)",
    "4th slot (13:45 - 15:15)",
    "5th slot (15:45 - 17:15)",
  ];

  //Handling components changes and update states
  //1- Choose course
  const handleOnChangeCourse = (newValue) => {
    setCourse(newValue);
  };
  //2- Choose option
  const handleOnChangeRadio = (e) => {
    setOptionSelected(e.target.value);
    if (e.target.value === "add" || e.target.value === "delete") {
      setDayU("");
      setTimingU("");
      setLocationU("");
    }
    // handleButtonEnable();
  };
  //3- Choose day
  const handleOnChangeDay = (newValue) => {
    setDay(newValue);
  };
  //3- Choose updated day
  const handleOnChangeDayU = (newValue) => {
    setDayU(newValue);
  };
  //4- Choose a timing
  const handleOnChangeTiming = (newValue) => {
    setTiming(newValue);
    // handleButtonEnable();
  };
  //5- Choose an updated timing
  const handleOnChangeTimingU = (newValue) => {
    setTimingU(newValue);
    // handleButtonEnable();
  };
  //6- Write a location
  const handleOnChangeLocation = (e) => {
    setLocation(e.target.value);
    // handleButtonEnable();
  };
  //7- Write the updated location
  const handleOnChangeLocationU = (e) => {
    setLocationU(e.target.value);
    // handleButtonEnable();
  };
  //8- Handling the submitting
  const handleSubmit = async (e) => {
    try {
      let response = null;
      if (optionSelected === "add") {
        console.log("add");
        response = await axios.post(`${link}/slots/courseSlot`, {
          course: course1,
          day: day,
          time: timing.substring(10, 15),
          location: location,
        });
      } else if (optionSelected === "update") {
        response = await axios.put(`${link}/slots/courseSlot`, {
          course: course1,
          dayOld: day,
          timeOld: timing.substring(10, 15),
          locationOld: location,
          dayNew: dayU,
          timeNew: timingU.substring(10, 15),
          locationNew: locationU,
        });
      } else if (optionSelected === "delete") {
        console.log(course1);
        response = await axiosCall("delete", `${link}/slots/courseSlot`, {
          course: course1,
          day: day,
          time: timing.substring(10, 15),
          location: location,
        });
      } else {
        addToast("You should specify an option", {
          appearance: "warning",
          autoDismiss: true,
        });
        return;
      }
      if (response.data.error) {
        addToast(response.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      } else if (response.data.errorJ) {
        addToast(
          "The location should be written in the format: 'Building.RoomNumber' e.g.'C7.209'",
          { appearance: "error", autoDismiss: true }
        );
      } else {
        console.log(response.data.data);
        addToast(response.data.data, {
          appearance: "success",
          autoDismiss: true,
        });
      }
    } catch (e) {
      console.log("~ err", e);
      document.location.href = window.location.origin + "/unauthorized";
    }
  };
  const handleButtonEnable = () => {
    if (
      (course1 &&
        day &&
        location &&
        timing &&
        (optionSelected === "add" || optionSelected === "delete")) ||
      (course1 &&
        day &&
        location &&
        timing &&
        dayU &&
        locationU &&
        timingU &&
        optionSelected === "update")
    ) {
      setButtonEnabled(false);
    } else {
      setButtonEnabled(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${link}/courses/coursesCC`);
        if (response.data.error) {
          addToast(response.data.error, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          const myCourses = response.data.data;
          setCourses(myCourses);
        }
      } catch (e) {
        console.log("~ err", e);
        document.location.href = window.location.origin + "/unauthorized";
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    handleButtonEnable();
  }, [
    courses,
    course1,
    day,
    dayU,
    timing,
    timingU,
    location,
    locationU,
    optionSelected,
    buttonEnabled,
  ]);

  return (
    <div className={classes.courseSlotsDiv}>
      <Grid container className={classes.mainGridContainer} justify="center">
        <Grid
          item
          container
          spacing={7}
          className={classes.gridContainer}
          justify="space-between"
          xs={12}
          sm={12}
          md={12}
        >
          {/* Choose Course */}
          <Grid item container spacing={2} xs={12} sm={12} md={6}>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              style={{
                alignSelf: "flex-end",
                marginBottom: "5px",
                marginRight: "15px",
              }}
            >
              <LibraryBooksIcon />
            </Grid>
            <Grid item xs={9} sm={9} md={7}>
              <Autocomplete
                id="auto-complete"
                options={courses}
                getOptionLabel={(coursename) => coursename}
                onChange={(e, newValue) => handleOnChangeCourse(newValue)}
                autoComplete
                includeInputInList
                renderInput={(params) => (
                  <TextField {...params} label="Course" value={course1} />
                )}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={2}
            xs={12}
            sm={12}
            md={6}
            justify="space-between"
          >
            <Grid item xs={12} sm={12} md={2}>
              <FormControlLabel
                value="add"
                control={
                  <Radio
                    classes={{ root: classes.radio, checked: classes.checked }}
                    value="add"
                    checked={optionSelected === "add"}
                    onChange={handleOnChangeRadio}
                  />
                }
                label="Add"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} style={{ marginRight: "30px" }}>
              <FormControlLabel
                value="update"
                control={
                  <Radio
                    color="primary"
                    value="update"
                    checked={optionSelected === "update"}
                    onChange={handleOnChangeRadio}
                  />
                }
                label="Update"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={2} style={{ marginRight: "115px" }}>
              <FormControlLabel
                value="delete"
                control={
                  <Radio
                    value="delete"
                    checked={optionSelected === "delete"}
                    onChange={handleOnChangeRadio}
                  />
                }
                label="Delete"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={2} xs={12} sm={12} md={6}>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              style={{
                alignSelf: "flex-end",
                marginBottom: "10px",
                marginRight: "15px",
              }}
            >
              <TodayIcon />
            </Grid>
            <Grid item xs={9} sm={9} md={6}>
              <Autocomplete
                id="auto-complete"
                options={weekDays}
                getOptionLabel={(day) => day}
                onChange={(e, newValue) => handleOnChangeDay(newValue)}
                autoComplete
                includeInputInList
                renderInput={(params) => (
                  <TextField {...params} label="Day" margin="normal" />
                )}
              />
            </Grid>
          </Grid>
          {/* Update day */}
          {optionSelected === "update" ? (
            <Grid container item spacing={2} xs={12} sm={12} md={6}>
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: "10px",
                  marginRight: "15px",
                }}
              >
                <TodayIcon />
              </Grid>
              <Grid item xs={9} sm={9} md={6}>
                <Autocomplete
                  id="auto-complete"
                  options={weekDays}
                  getOptionLabel={(day) => day}
                  onChange={(e, newValue) => handleOnChangeDayU(newValue)}
                  autoComplete
                  includeInputInList
                  renderInput={(params) => (
                    <TextField {...params} label="New day" margin="normal" />
                  )}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} />
          )}
          <Grid item container spacing={2} item xs={12} sm={12} md={6}>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              style={{
                alignSelf: "flex-end",
                marginBottom: "10px",
                marginRight: "15px",
              }}
            >
              <AccessTimeIcon />
            </Grid>
            <Grid item xs={9} sm={9} md={6}>
              <Autocomplete
                id="auto-complete"
                options={slotTiming}
                getOptionLabel={(slot) => slot}
                onChange={(e, newValue) => handleOnChangeTiming(newValue)}
                autoComplete
                includeInputInList
                renderInput={(params) => (
                  <TextField {...params} label="Timing" margin="normal" />
                )}
              />
            </Grid>
          </Grid>
          {/* Update slot timing */}
          {optionSelected === "update" ? (
            <Grid container item spacing={2} xs={12} sm={12} md={6}>
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: "10px",
                  marginRight: "15px",
                }}
              >
                <AccessTimeIcon />
              </Grid>
              <Grid item xs={9} sm={9} md={6}>
                <Autocomplete
                  id="auto-complete"
                  options={slotTiming}
                  getOptionLabel={(slot) => slot}
                  onChange={(e, newValue) => handleOnChangeTimingU(newValue)}
                  autoComplete
                  includeInputInList
                  renderInput={(params) => (
                    <TextField {...params} label="New timing" margin="normal" />
                  )}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} />
          )}
          <Grid container item spacing={2} xs={12} sm={12} md={6}>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              style={{ marginTop: "15px", marginRight: "15px" }}
            >
              <LocationOnIcon />
            </Grid>
            <Grid item xs={9} sm={9} md={6}>
              <TextField
                // id="standard-error-helper-text"
                label="Location"
                // helperText="Incorrect entry."
                placeholder="eg. C7.209"
                onChange={handleOnChangeLocation}
                // margin="normal"
              />
            </Grid>
          </Grid>
          {/* Update slot location */}
          {optionSelected === "update" ? (
            <Grid container item spacing={2} xs={12} sm={12} md={6}>
              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                style={{ marginTop: "15px", marginRight: "15px" }}
              >
                <AddLocationIcon />
              </Grid>
              <Grid item xs={9} sm={9} md={6}>
                <TextField
                  // id="standard-error-helper-text"
                  label="New location"
                  // helperText="Incorrect entry."
                  placeholder="eg. C7.209"
                  onChange={handleOnChangeLocationU}
                  // margin="normal"
                />
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} sm={12} md={6} />
          )}
          <Grid item container xs={12} sm={12} md={12} justify="flex-end">
            <Grid item xs={12} sm={12} md={2}>
              <Button
                variant="contained"
                // color = {optionSelected === 'add'?"success":optionSelected === 'update'?"primary":"secondary"}
                className={classes.button}
                startIcon={
                  optionSelected === "add" ? (
                    <AddCircleIcon />
                  ) : optionSelected === "update" ? (
                    <EditIcon />
                  ) : (
                    <DeleteIcon />
                  )
                }
                onClick={handleSubmit}
                disabled={buttonEnabled}
              >
                {optionSelected === "add"
                  ? "Add"
                  : optionSelected === "update"
                  ? "Update"
                  : "Delete"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default CourseSlotCRUD;
