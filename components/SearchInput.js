import React, { useState, forwardRef } from "react";
import {
  TextField,
  Typography,
  Slider,
  Autocomplete,
  Slide,
  useScrollTrigger,
  Box,
  Accordion,
  AccordionSummary,
} from "@mui/material";
import { rangeValues, searchTags } from "../constants/siteContent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styles from "../styles/SearchInputScroll.module.css";

// Unused component; Original attempt to create a search input; Accordion + HideOnScroll logic was bad
// UX and the trigger logic was a bit unruly/didn't want to sink more time figuring it out.

function HideOnScroll(props) {
  const [hidden, setHidden] = useState(false);
  const { children } = props;
  const trigger = useScrollTrigger({ threshold: 0 });
  return (
    <Slide
      appear={false}
      direction="up"
      in={!trigger}
      addEndListener={console.log(trigger)}
    >
      {children}
    </Slide>
  );
}

function SearchInput({ searchValue, handleChangeValue }, ref) {
  // state
  const [expanded, setExpanded] = useState(true);

  // helpers
  const trigger = useScrollTrigger({ threshold: 0 });

  // handlers
  const handleExpand = () => {
    setExpanded(!expanded);
    // setSearchHeight(ref.current.clientHeight);
  };

  return (
    <>
      {/* <HideOnScroll scrollStyle={scrollStyle}> */}
      <Accordion
        expanded={expanded}
        onChange={(ref) => handleExpand(ref)}
        ref={ref}
        sx={{ top: "64px" }}
        className={styles.wrapper}
        elevation={6}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h4" className={styles.title} align={"center"}>
            Whisky Search
          </Typography>
        </AccordionSummary>
        <Box className={styles.textInput}>
          <TextField
            variant="outlined"
            label="Whisky"
            name="whisky"
            value={searchValue.whisky}
            onChange={(event, newValue) => handleChangeValue(event, newValue)}
            fullWidth
          ></TextField>
        </Box>
        <Box className={styles.costSliderWrapper}>
          <Slider
            key="range"
            aria-label="Range slider for cost represented in dollar signs"
            name="range"
            value={[searchValue.min, searchValue.max]}
            onChange={(event) => handleChangeValue(event)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => {
              return rangeValues[value];
            }}
            step={1}
            marks
            min={1}
            max={6}
            className={styles.costSlider}
          />
          <Typography variant="subtitle1" className={styles.costSliderLabel}>
            Cost Range
          </Typography>
        </Box>
        <Box className={styles.textInput}>
          <Autocomplete
            multiple
            options={searchTags.map((obj) => obj.name)}
            onChange={(event, newValue) => handleChangeValue(event, newValue)}
            id="tags"
            renderInput={(params) => <TextField label="Tags" {...params} />}
            width="100%"
          />
        </Box>
      </Accordion>
      {/* </HideOnScroll> */}
    </>
  );
}

export default forwardRef(SearchInput);
