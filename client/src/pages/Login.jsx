import React, { useState, useEffect } from "react";
import axios from "axios";
import setAuthToken from "../helpers/setAuthToken";
import { link } from "../helpers/constants";
import { useToasts } from "react-toast-notifications";
import Fade from "react-reveal/Fade";

function Login() {
  // defining the variables and states
  const [gucId, setId] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToasts();

  // => used in the header to greet the user <=
  var date = new Date();
  var hrs = date.getHours();
  var greet;

  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs <= 16) greet = "Good Afternoon";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";
  //-------------------------------------------

  // get the token of the user to be used later
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      document.location.href = window.location.origin + "/home";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { gucId, password };
    if (gucId === "" || password === "") {
      addToast("Please enter your GUC ID and Password", {
        appearance: "error",
        autoDismiss: true,
      });
    } else {
      try {
        const response = await axios.post(`${link}/logIn`, user);
        console.log(response);
        if (response.data.err) {
          addToast(response.data.err, {
            appearance: "error",
            autoDismiss: true,
          });
        } else if (response.data.JOI_validation_error) {
          addToast(response.data.JOI_validation_error, {
            appearance: "error",
            autoDismiss: true,
          });
        } else {
          // store the user in the localStorage
          const token = response.data.token;
          localStorage.setItem("user", token);
          setAuthToken(token);
          // go to the home page after login is successful
          document.location.href = window.location.origin + "/home";
        }
      } catch (err) {
        addToast("wrong Id or password", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  return (
    <div className="container-login100">
      <Fade bottom>
        <div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
          <form onSubmit={handleSubmit} className="login100-form validate-form">
            <span className="login100-form-title p-b-37">{greet}✨</span>

            <div
              className="wrap-input100 validate-input m-b-20"
              data-validate="Please enter your GUC ID"
            >
              <input
                value={gucId}
                className="input100"
                type="text"
                name="text"
                placeholder="guc id "
                onChange={({ target }) => setId(target.value)}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-25"
              data-validate="Please enter your password"
            >
              <input
                className="input100"
                type="password"
                value={password}
                placeholder="password"
                onChange={({ target }) => setPassword(target.value)}
              />
              <span className="focus-input100"></span>
            </div>

            <div className="container-login100-form-btn">
              <button type="submit" className="login100-form-btn">
                Login In
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </div>
  );
}
export default Login;
