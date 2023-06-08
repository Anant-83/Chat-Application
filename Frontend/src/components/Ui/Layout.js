import { Container } from "@mui/system";
import { useMediaQuery } from "@mui/material";
import React from "react";

const Layout = (props) => {
  const matches = useMediaQuery("(max-width:600px)");
  return (
    <Container
      maxWidth={!matches ? "md" : "sm"}
      sx={{
        marginTop: !matches ? "15rem" : "10rem",
        boxShadow: "2px 2px 8px black",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {props.children}
    </Container>
  );
};

export default Layout;
