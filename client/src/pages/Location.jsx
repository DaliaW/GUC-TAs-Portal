import React, { useState, useEffect } from "react";
import auth from "../helpers/auth";

//components
import Add from "../components/Add";
import Update from "../components/Update";
import Delete from "../components/Delete";

import AddLocation from "../components/location/AddLocation";
import UpdateLocation from "../components/location/UpdateLocation";
import DeleteLocation from "../components/location/DeleteLocation";

function Location() {
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
          text="location"
          onClick={() =>
            setBtns({
              add: true,
              update: false,
              delete: false,
            })
          }
        />
        <Update
          text="location"
          onClick={() =>
            setBtns({
              add: false,
              update: true,
              delete: false,
            })
          }
        />
        <Delete
          text="location"
          onClick={() =>
            setBtns({
              add: false,
              update: false,
              delete: true,
            })
          }
        />
      </div>
      {crudBtns.add === true ? (
        <AddLocation />
      ) : crudBtns.update ? (
        <UpdateLocation />
      ) : crudBtns.delete ? (
        <DeleteLocation />
      ) : null}
    </div>
  );
}

export default Location;
