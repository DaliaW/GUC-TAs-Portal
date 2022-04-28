import React, { useState, useEffect } from "react";
import AttendanceTable from "../../components/AttendanceTable";
import axiosCall from "../../helpers/axiosCall";
import auth from "../../helpers/auth";

function StaffAttendance() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function fetchData() {
      await auth(["HR"]);
      //get user
      const url = document.location.pathname.split("/");
      const gucId = url[url.length - 1];

      //   let gucId = "AC-1";
      let res = await axiosCall("get", `staffMembers/all/${gucId}`);
      if (res.data.data) setUserId(res.data.data.gucId);
    }
    fetchData();
  }, [userId]);

  return (
    <div>
      {userId !== "" ? (
        <AttendanceTable
          title={`Attendance Record of ${userId}`}
          gucId={userId}
          hr={true}
        />
      ) : null}
    </div>
  );
}

export default StaffAttendance;
