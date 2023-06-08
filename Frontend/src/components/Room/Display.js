import React, { useEffect } from "react";
import moment from "moment";
import { Button, Grid, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ScrollToBottom from "react-scroll-to-bottom";
import classes from "./Display.module.css";

const Display = (props) => {
  return (
    <ScrollToBottom className={classes["scroller"]}>
      <div className={classes["display-div"]}>
        {props.messages.map((data, index) => {
          const personalUI = data.id === props.id;
          const prevId = props.messages[index - 1 <= 0 ? 0 : index - 1].id;

          const classNames = `${classes["text-div"]} ${
            personalUI ? classes["personal-box"] : classes["others-box"]
          }
            ${
              (index == 0 || data.id !== prevId) &&
              (personalUI
                ? classes["new_personal-box"]
                : classes["new_others-box"])
            }
          `;
          return (
            <div key={data.createdAt}>
              <div className={classNames}>
                <div>
                  {!personalUI && <span>{data.name}</span>}
                  {data.message && (
                    <Typography
                      letterSpacing="1px"
                      style={{
                        fontSize: "1.1rem",
                        padding: !personalUI
                          ? "1.2rem 5rem 0.4rem 0.4rem"
                          : "0.4rem 5rem 0.4rem 0.4rem",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {data.message}
                    </Typography>
                  )}
                  {data.files && (
                    <Grid
                      container
                      spacing={1.5}
                      maxHeight={!personalUI ? "33rem" : "32rem"}
                      maxWidth="24.5rem"
                      sx={{
                        padding: !personalUI
                          ? "1.5rem 0.2rem 0rem 0.3rem"
                          : "0.2rem 0.2rem 0rem 0.3rem",
                        overflow: data.files.length > 2 ? "scroll" : "",
                        userSelect: "none",
                      }}
                    >
                      {data.files.map((file, index) => {
                        if (file.type.startsWith("image")) {
                          const url = `data:${file.type};base64,${file.file}`;
                          return (
                            <Grid
                              item
                              md={data.files.length === 1 ? 12 : 6}
                              key={index}
                              sx={{
                                position: "relative",
                                transition: "all 200ms",
                                "&:hover a": {
                                  display: "block",
                                },
                              }}
                            >
                              <img
                                src={url}
                                className={classes["img-msg"]}
                                id="i1"
                                alt=""
                              />
                              {!personalUI && (
                                <a
                                  href={url}
                                  download={file.name}
                                  className={classes["download-btn"]}
                                >
                                  <Button
                                    variant="contained"
                                    sx={{
                                      transition: "all 200ms",
                                      backgroundColor: "#616965",
                                      "&:hover": {
                                        backgroundColor: "#4e5451",
                                      },
                                      "&:active": {
                                        transform: "scale(0.9)",
                                      },
                                    }}
                                  >
                                    <DownloadOutlinedIcon fontSize="small" />
                                  </Button>
                                </a>
                              )}
                            </Grid>
                          );
                        }
                      })}
                    </Grid>
                  )}
                </div>
                <span className={classes["time-span"]}>
                  {moment(data.createdAt).format("HH:MM")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollToBottom>
  );
};

export default Display;
