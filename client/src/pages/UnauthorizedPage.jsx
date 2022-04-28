import React from "react";
import brokenSVG from "../assets/brokenSVG.svg";

function UnauthorizedPage() {
  return (
    <div id="notfound">
      <div className="notfound-bg">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="notfound">
        <img src={brokenSVG} alt="broken website img" />
        <h2>Sorry this page is not available</h2>
        <p>
          Maybe the page is deleted, changed, or you are not authorized to go
          through this page
        </p>
        <a href="/home">Home</a>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
