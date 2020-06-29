import React, { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { isToday, isYesterday, isTomorrow, format } from "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

TimePicker.propTypes = {
  since: PropTypes.any,
  until: PropTypes.any,
  onSinceChange: PropTypes.any,
  onUntilChange: PropTypes.any,
};

const setDateFormat = (date, setFormat) => {
  if (isToday(date)) {
    setFormat("今日");
  } else if (isYesterday(date)) {
    setFormat("昨日");
  } else if (isTomorrow(date)) {
    setFormat("明日");
  } else {
    setFormat("MM月dd日");
  }
};

export default function TimePicker(props) {
  const [sinceFormat, setSinceFormat] = useState("MM月dd日");
  const [untilFormat, setUntilFormat] = useState("MM月dd日");
  const now = format(new Date(), "M/dd HH:mm");

  const handleSinceChange = (date) => {
    setDateFormat(date, setSinceFormat);
    props.onSinceChange(date);
  };

  const handleUntilChange = (date) => {
    setDateFormat(date, setUntilFormat);
    props.onUntilChange(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <h3>削除する時間範囲を指定してください</h3>
      <h3>現在時刻: {now}</h3>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format={sinceFormat}
          margin="normal"
          id="since-date-picker-inline"
          label="ここから"
          value={props.since}
          onChange={handleSinceChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="since-time-picker"
          variant="inline"
          label="ここから"
          value={props.since}
          onChange={handleSinceChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format={untilFormat}
          margin="normal"
          id="until-date-picker-inline"
          label="ここまで"
          value={props.until}
          onChange={handleUntilChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          id="until-time-picker"
          variant="inline"
          label="ここまで"
          value={props.until}
          onChange={handleUntilChange}
          KeyboardButtonProps={{
            "aria-label": "change time",
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
