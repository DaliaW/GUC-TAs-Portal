import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import Schedule from "../components/Schedule";
import checkLogin from "../helpers/checkLogin";

function InstructorSlotsAssigned() {
  const [gucId, setId] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await checkLogin();
        setId(user.gucId);
      } catch (e) {
        console.log("~ err", e);
        addToast("Sorry there is an error occurred, please try again later", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
    fetchData();
  }, []);

  return <div>{gucId ? <Schedule gucId={gucId} /> : null}</div>;
}

export default InstructorSlotsAssigned;
