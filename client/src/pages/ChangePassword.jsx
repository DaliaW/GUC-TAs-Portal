import React, { useState, useEffect } from "react";
import axiosCall from "../helpers/axiosCall";
import { useToasts } from "react-toast-notifications";
import checkLogin from "../helpers/checkLogin";
import { Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import changePasswordIcon from "../assets/changepasswordicon.png";
import { FormControl, Input, FormHelperText } from "@material-ui/core";

function ChangePassword() {
  // eslint-disable-next-line
  const [user, setUser] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { addToast } = useToasts();

  
  useEffect(() => {
    async function fetchData() {
      const user = await checkLogin();
      setUser(user);
    }
    fetchData();
  }, []);

  const checkPassword = (password) => {
    var containsLetter = false;
    var containsNumber = false;

    for (var j = 0; j < password.length; j++) {
      if (
        (password.charCodeAt(j) >= 65 && password.charCodeAt(j) <= 90) ||
        (password.charCodeAt(j) >= 97 && password.charCodeAt(j) <= 122)
      ) {
        containsLetter = containsLetter || true;
      } else if (password.charCodeAt(j) >= 48 && password.charCodeAt(j) <= 57) {
        containsNumber = containsNumber || true;
      }
    }
    return containsNumber && containsLetter;
  };

  const validatePassword = (password) => {
    return (
      checkPassword(password) === true &&
      oldPassword.length > 0 &&
      newPassword.length >= 6 &&
      newPassword === confirmPassword &&
      newPassword !== oldPassword
    );
  };

  const handleSubmit = async () => {
    try {
      const body = {
        newPassword,
        oldPassword,
      };

      const res = await axiosCall("put", "staffMembers/changePassword", body);

      if (res.data.data) {
        addToast("Password changed successfully", {
          appearance: "success",
          autoDismiss: true,
        });

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }

      if (res.data.error) {
        addToast(res.data.error, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } catch (err) {
      console.log("~error: ", err);
    }
  };

  return (
    <div className="changePassword-container">
      <h4 className="changePassword-header">Change Password</h4>
      <hr />
      <div className="changePassword-inner-container">
        <div className="changePassword-area">
          <h3 className="changePassword-label">Old Password</h3>
          <FormControl className="changePassword-formControl" required>
            <Input
              className="changePassword-input"
              name="oldPassword"
              value={oldPassword}
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              onChange={(event) => setOldPassword(event.target.value)}
            ></Input>
            {showOldPassword ? (
              <FaEyeSlash
                className="changePassword-eyeIcon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            ) : (
              <FaEye
                className="changePassword-eyeIcon"
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            )}

            <FormHelperText className="helperTextNo">
              This field is required
            </FormHelperText>
          </FormControl>

          <h3 className="changePassword-label">New Password</h3>
          <FormControl className="changePassword-formControl" required>
            <Input
              className="changePassword-input"
              name="newPassword"
              value={newPassword}
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              onChange={(event) => setNewPassword(event.target.value)}
            ></Input>
            {showNewPassword ? (
              <FaEyeSlash
                className="changePassword-eyeIcon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            ) : (
              <FaEye
                className="changePassword-eyeIcon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            )}

            <FormHelperText className="helperTextNo">
              This field is required
            </FormHelperText>
          </FormControl>

          <h3 htmlFor="confirmPassword" className="changePassword-label">
            Confirm new password
          </h3>
          <FormControl className="changePassword-formControl" required>
            <Input
              className="changePassword-input"
              name="confirmPassword"
              value={confirmPassword}
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              onChange={(event) => setConfirmPassword(event.target.value)}
            ></Input>
            {showConfirmPassword ? (
              <FaEyeSlash
                className="changePassword-eyeIcon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <FaEye
                className="changePassword-eyeIcon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}

            {confirmPassword.length === 0 ? (
              <FormHelperText className="helperTextNo">
                This field is required
              </FormHelperText>
            ) : confirmPassword !== newPassword ? (
              <FormHelperText className="helperTextNoMatch">
                Does not match with new password
              </FormHelperText>
            ) : confirmPassword === newPassword ? (
              <FormHelperText className="helperTextYes">
                Matches new password
              </FormHelperText>
            ) : null}
          </FormControl>

          <Button
            className={
              validatePassword(newPassword)
                ? "changePassword-btn valid"
                : "changePassword-btn notValid"
            }
            disabled={!validatePassword(newPassword)}
            onClick={handleSubmit}
          >
            Change Password
          </Button>
        </div>

        <div className="changePassword-restrictions">
          <img
            src={changePasswordIcon}
            alt="changePasswordIcon"
            className="changePasswordIcon"
          />
          <h3>New password should be </h3>
          <h5
            className={
              newPassword.length < 6
                ? "newpassword-restrictions"
                : "newpassword-restrictionsValid"
            }
          >
            - Longer than 6 characters
          </h5>
          <h5
            className={
              checkPassword(newPassword) === false
                ? "newpassword-restrictions"
                : "newpassword-restrictionsValid"
            }
          >
            - Contains at least one letter and one number
          </h5>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
