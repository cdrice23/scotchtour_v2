import React from "react";
import {
  Slider,
  Rating,
  Button,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  Checkbox,
  Box,
  Chip,
} from "@mui/material";
import {
  LocalDrink,
  CheckBox,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import { brandList } from "../constants/siteContent";
import styles from "../styles/Survey.module.css";

export default function Survey(props) {
  // state
  const [hover, setHover] = React.useState(-1);

  // helpers
  function getLabelText(value) {
    return `${value} Star${value !== 1 ? "s" : ""}`;
  }
  function getSliderLabel(interest) {
    return interest;
  }

  return (
    <>
      <Grid container display={props.showSurvey} className={styles.wrapper}>
        <Grid item xs={12}>
          <Typography variant="h1" className={styles.title}>
            Visitor Survey
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.question} variant="h4">
            <span className={styles.questionSpan}>Question 1:</span> How much do
            you like Scotch?
          </Typography>
          <Box align="center" className={styles.content}>
            <Rating
              key="hover-feedback"
              icon={<LocalDrink fontSize="inherit" />}
              name="hover-feedback"
              value={props.surveyValues["hover-feedback"]}
              precision={0.5}
              getLabelText={getLabelText}
              onChange={props.handleChangeValue}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
              emptyIcon={
                <LocalDrink style={{ opacity: 0.55 }} fontSize="inherit" />
              }
            />
          </Box>
          <Box className={styles.label}>
            {
              props.ratingLabels[
                hover !== -1 ? hover : props.surveyValues["hover-feedback"]
              ]
            }
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.question} variant="h4">
            <span className={styles.questionSpan}>Question 2:</span> How often
            do you choose Scotch whisky over other types of whiskey?
          </Typography>
          <Box className={styles.content}>
            <Slider
              key="interest-slider"
              aria-label="Interest in Scotch over other types of whiskey"
              name="interest-slider"
              value={props.surveyValues["interest-slider"]}
              onChange={props.handleChangeValue}
              getAriaValueText={getSliderLabel}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => {
                return props.interestLabels[value];
              }}
              step={1}
              marks
              min={1}
              max={5}
              className={styles.slider}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.question} variant="h4">
            <span className={styles.questionSpan}>Question 3:</span> Which of
            these Scotch brands have you heard of before? (you may choose more
            than one)
          </Typography>
          <Box className={styles.content}>
            <Autocomplete
              multiple
              autoComplete
              disableCloseOnSelect
              options={brandList}
              getOptionLabel={(option) => option}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBox fontSize="small" />}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option}
                </li>
              )}
              onChange={props.handleChangeScotchBrands}
              renderInput={(params) => <TextField {...params} />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="filled"
                    label={option}
                    sx={{ backgroundColor: "#d5ebff" }}
                    {...getTagProps({ index })}
                    key={index}
                  />
                ))
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography className={styles.question} variant="h4">
            <span className={styles.questionSpan}>Question 4:</span> What is
            your favorite Scotch whisky?
          </Typography>
          <Box className={styles.content}>
            <Autocomplete
              onChange={props.handleChangeFavoriteWhisky}
              autoComplete
              options={props.whiskyList}
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </Grid>
        <Grid item className={styles.buttonWrapper}>
          <Button
            variant="contained"
            type="submit"
            onClick={props.handleSurveySubmit}
            disabled={props.disableSubmit}
            className={styles.button}
          >
            Submit Survey
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
