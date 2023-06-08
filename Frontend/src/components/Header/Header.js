import React, { Fragment } from "react";
import { Divider, Typography, useMediaQuery } from "@mui/material";
import logo from "../../assests/app-logo.svg";
import classes from "./Header.module.css";
const Header = () => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Fragment>
      <Typography
        variant="h3"
        padding="1rem"
        sx={{
          fontSize: !matches ? "3.3rem" : "2.5rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "1px",
          gap: !matches ? "1.3rem" : "1rem",
        }}
      >
        <img src={logo} className={classes["chat-logo"]} />
        Chat App
      </Typography>
      <Divider
        sx={{
          border: !matches ? "2px solid black" : "1px solid black",
          marginBottom: !matches ? "2rem" : "1rem",
          width: "100%",
          alignSelf: "center",
        }}
      />
    </Fragment>
  );
};

export default Header;
