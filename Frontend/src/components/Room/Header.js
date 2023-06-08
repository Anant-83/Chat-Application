import React from "react";
import { Typography, useMediaQuery } from "@mui/material";
import logo from "../../assests/app-logo.svg";
import ListIcon from "@mui/icons-material/List";
import classes from "./Header.module.css";

const Header = (props) => {
  const matches = useMediaQuery("(max-width:768px)");
  return (
    <div className={classes["header-div"]}>
      <img src={logo} className={classes["app-logo"]} alt="" />
      <Typography color="whitesmoke" variant="h5" letterSpacing="1px">
        Chat Room
      </Typography>
      {matches && (
        <ListIcon
          fontSize="large"
          sx={{
            color: "whitesmoke",
            marginLeft: "auto",
            // position: "absolute",
            // right: "1rem",
            cursor: "pointer",
            transition: "all 100ms",
            padding: "0.8rem",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#33393d",
            },
          }}
          onClick={props.onClick}
        />
      )}
    </div>
  );
};

export default Header;
