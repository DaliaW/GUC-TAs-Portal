import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import Schedule from "../../components/Schedule";
import checkLogin from "../../helpers/checkLogin";

function InstructorSlotsAssigned() {
  const [id, setId] = useState("");
  const { addToast } = useToasts();

  useEffect(() => {
    async function fetchData() {
      try {
        await checkLogin();

        //get user
        const url = document.location.pathname.split("/");
        const id = url[url.length - 1];

        setId(id);
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

  return <div>{id ? <Schedule id={id} /> : null}</div>;
}

export default InstructorSlotsAssigned;
