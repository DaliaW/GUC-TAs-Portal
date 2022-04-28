import React, { useState, useEffect } from "react";
import auth from "../helpers/auth";

//components
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

import AddDepartment from "../components/department/AddDepartment";
import UpdateDepartment from "../components/department/UpdateDepartment";
import DeleteDepartment from "../components/department/DeleteDepartment";

function Department() {
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
          text="Department"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="Department"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="Department"
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
        <AddDepartment />
      ) : crudBtns.update ? (
        <UpdateDepartment />
      ) : crudBtns.delete ? (
        <DeleteDepartment />
      ) : null}
    </div>
  );
}

export default Department;
