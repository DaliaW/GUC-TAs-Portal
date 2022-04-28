import React, { useState, useEffect } from "react";
import checkLogin from "../helpers/checkLogin";
import AttendanceTable from "../components/AttendanceTable";

function MyAttendanceRecord() {
  const [userId, setUserId] = useState("");
  const [data, setData] = useState({ data: [] });

  useEffect(() => {
    async function fetchData() {
      let user = await checkLogin();
      await setUserId(user.gucId);
    }
    fetchData();
  }, [userId]);

  return (
    <div>
      <AttendanceTable title="Attendance Record" gucId={userId} hr={true} />
    </div>
  );
}

export default MyAttendanceRecord;
