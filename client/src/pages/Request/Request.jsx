import React, { useState, useEffect } from "react";
import auth from "../../helpers/auth";

import Add from "../../components/Add";
import View from "../../components/View";

//components
import RequestsDropDown from "../../components/RequestsDropDown";
import ViewRequestsDropDown from "../../components/ViewRequestsDropDown";

function Request() {
  //var user = checkLogin() ;
  const [crudBtns, setBtns] = useState({
    send: false,
    requests: false,
  });

  useEffect(() => {
    async function fetchData() {
      await auth(["Course Instructor", "Teaching Assistant"]);
    }
    fetchData();
  }, []);

  return (
    <div className="crud-outer-container">
      <div className="crud-container">
        <Add
          textClassified=" Send Request / Leave"
          onClick={() =>
            setBtns({
              send: true,
              requests: false,
            })
          }
        />
        <View
          textClassified="View All Requests"
          onClick={() =>
            setBtns({
              send: false,
              requests: true,
            })
          }
        />
      </div>
      {crudBtns.send ? (
        <RequestsDropDown hide={false} />
      ) : crudBtns.requests ? (
        <ViewRequestsDropDown />
      ) : null}
    </div>
  );
}
export default Request;
