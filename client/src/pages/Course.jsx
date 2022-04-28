import React, { useState, useEffect } from "react";
import auth from "../helpers/auth";

//components
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

import AddCourse from "../components/course/AddCourse";
import UpdateCourse from "../components/course/UpdateCourse";
import DeleteCourse from "../components/course/DeleteCourse";

function Course() {
  const [crudBtns, setBtns] = useState({
    add: false,
    update: false,
    delete: false,
  });

  useEffect(() => {
    async function fetchData() {
      await auth(["HR"]);
    }
    fetchData();
  }, []);

  return (
    <div className="crud-outer-container">
      <div className="crud-container">
        <Add
          text="Course"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="Course"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="Course"
          onClick={() =>
            setBtns({
              add: false,
              update: false,
              delete: true,
            })
          }
        />
      </div>
      {crudBtns.add ? (
        <AddCourse />
      ) : crudBtns.update ? (
        <UpdateCourse />
      ) : crudBtns.delete ? (
        <DeleteCourse />
      ) : null}
    </div>
  );
}

export default Course;
