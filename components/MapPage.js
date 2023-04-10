import React, { useRef, useState, useEffect } from "react";
import { Typography, Popover, Box, Button } from "@mui/material";
import styles from "../styles/MapPage.module.css";
import { theme } from "../styles/theme";
import Image from "next/image";


export default function MapPage(props) {
  // state
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeBtn, setActiveBtn] = useState("islands");

  // helpers
  const popName = activeBtn ? props.regionContent[activeBtn].name : "sample";
  const popDesc = activeBtn
    ? props.regionContent[activeBtn].description.map((p) => p)
    : "sample";
  const popBrands = activeBtn
    ? props.regionContent[activeBtn].distilleries
    : "sample";
  const open = Boolean(anchorEl);

  // handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setActiveBtn(event.currentTarget.id);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box className={styles.wrapper}>
        <img
          src="/scotch-regions.webp"
          alt="Scotch regions"
          className={styles.image}
          loading="eager"
        />
        {props.regionButtons.map((region) => (
          <Button
            variant="contained"
            color={"secondary"}
            id={region.name.toLowerCase()}
            className={styles.button}
            size="small"
            onClick={handleClick}
            sx={{
              top: region.top,
              left: region.left,
            }}
            key={region.name.toLowerCase()}
          >
            {region.name}
          </Button>
        ))}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box className={styles.popoverBox}>
            <Typography
              variant="h6"
              className={styles.title}
              style={{
                backgroundColor: theme.palette[activeBtn].main,
              }}
            >
              {popName}
            </Typography>
            <Typography className={styles.descBlock}>{popDesc}</Typography>
            <Typography className={styles.brandBlock}>
              <strong
                className={styles.notableBrands}
                style={{
                  backgroundColor: theme.palette[activeBtn].main,
                }}
              >
                Notable Brands:{" "}
              </strong>
              {popBrands}
            </Typography>
          </Box>
        </Popover>
      </Box>
    </>
  );
}
