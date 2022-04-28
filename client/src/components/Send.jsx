// import send from "../assets/update.svg";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Dropdown from "react-bootstrap/Dropdown";
// import Slot from "./request/slot.jsx";
// import ChangeDayOff from "../components/request/changeDayOff";

// import Maternity from "../components/request/maternity";
// import Sick from "./request/SendRequest/Leave/sick";
// import Annual from "../components/request/annual";
// import Accidental from "./request/SendRequest/Leave/accidental";
// import Compensation from "../components/request/compensation";

// import Replacement from "./request/SendRequest/Request/replacement.jsx";
// import React, { useState, useEffect } from "react";
// import { CSSTransition } from "react-transition-group";
// function Dropdwonme() {
//   return (
//     <Dropdown>
//       <Dropdown.Menu>
//         <Dropdown.Item eventKey="1">Action</Dropdown.Item>
//         <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
//         <Dropdown.Item eventKey="3">Active Item </Dropdown.Item>

//         <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>
//   );
// }
// function Send(props) {
//   const [value, setValue] = useState("");

//   let handleSelect = (e) => {
//     setValue(e);
//   };

//   return (
//     <div className="crud-outer-container">
//       <div className="crud-button crud-add green" onClick={props.onClick}>
//         <img src={send} alt="add-icon" className="icon" />
//         <Dropdown className="text">
//           <DropdownButton
//             className="text"
//             title="Send Request"
//             alignRight
//             id="dropdown-menu-align-right"
//             onSelect={handleSelect}
//           >
//             <Dropdown.Item
//               className="send-request-dropDown"
//               eventKey="Replacement Request"
//             >
//               Replacement Request
//             </Dropdown.Item>
//             <Dropdown.Item
//               className="send-request-dropDown"
//               eventKey="Slot Request"
//             >
//               Slot Request
//             </Dropdown.Item>
//             <Dropdown.Item
//               eventKey="Change DayOff"
//               className="send-request-dropDown"
//             >
//               Change DayOff
//             </Dropdown.Item>

//             <Dropdown.Item
//               className="send-request-dropDown"
//               eventKey="Maternity"
//             >
//               Maternity Leave
//             </Dropdown.Item>
//             <Dropdown.Item className="send-request-dropDown" eventKey="Annual">
//               Annual Leave
//             </Dropdown.Item>
//             <Dropdown.Item
//               className="send-request-dropDown"
//               eventKey="Accidental"
//             >
//               Accidental Leave{" "}
//             </Dropdown.Item>
//             <Dropdown.Item className="send-request-dropDown" eventKey="Sick">
//               Sick Leave
//             </Dropdown.Item>
//             <Dropdown.Item
//               className="send-request-dropDown"
//               eventKey="Compensation"
//             >
//               Compensation Leave{" "}
//             </Dropdown.Item>
//           </DropdownButton>
//         </Dropdown>
//       </div>

//       <div className="crud-outer-container">
//         {value == "Replacement Request" ? (
//           <Replacement />
//         ) : value == "Slot Request" ? (
//           <Slot />
//         ) : value == "Change DayOff" ? (
//           <ChangeDayOff />
//         ) : value == "Maternity" ? (
//           <Maternity />
//         ) : value == "Accidental" ? (
//           <Accidental />
//         ) : value == "Sick" ? (
//           <Sick />
//         ) : value == "Compensation" ? (
//           <Compensation />
//         ) : value == "Annual" ? (
//           <Annual />
//         ) : null}
//       </div>
//     </div>
//   );
// }

// export default Send;
