import React from "react";
import { Outlet } from "react-router-dom";

const Wraper = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Wraper;
