import React, { useState } from "react";
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import CustomSelection from './CustomSelection';
import RangeSelection from './RangeSelection';
import { rangeToYN, ynToRange, utcToLocal, localToUtc } from './util';

const useStyles = makeStyles(theme => {
  // copied (roughly) from OutlinedInput
  const borderColor = theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';

  return {
    box: {
			// copied (roughly) from OutlinedInput
      borderRadius: theme.shape.borderRadius,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor,
      padding: theme.spacing(1),
    },
		header: {
			paddingLeft: theme.spacing(1),
		},
  };
});

// Allow the user to select their time_availability.  The timeAvailability
// parameter is in the form of a 24-character string, containing `Y` or `N` in
// each position, corresponding to the person's availability at that hour
// offset from midnight, UTC.  So someone available from 3am-11am UTC would
// have availability `NNNYYYYYYYYYNNNNNNNNNNNN`.  The control assumes that
// most users will be available during a single block of time (working hours)
// and uses a range slider for that condition, but allows the user to select
// specific hours in a "custom" variant of the control.
export default function AvailabilitySelector({ timeAvailability, onChange }) {
  const classes = useStyles();

  // if null or invalid, treat as 9-5 local time
  if (timeAvailability === null || timeAvailability.length !== 24) {
    console.error(`Invalid timeAvailability value ${timeAvailability}; substituting default`);
    timeAvailability = AvailabilitySelector.default();
  }

  // translate the availability to local time by rotating the string
  const localAvailability = utcToLocal(timeAvailability);

  let range = ynToRange(localAvailability);

  // track the custom switch's state, but for a non-range-compatible value, require
  // the custom view.
  const [custom, setCustom] = useState(!range);
  const customRequired = !range;

  const onRangeChange = (e, range) => {
    const yn = rangeToYN(range);
    if (yn) {
      onChange(localToUtc(yn));
    }
  };

  const onCustomChange = local => {
    onChange(localToUtc(local));
  };

  return (
    <Box className={classes.box}>
      <Grid container justify="space-between">
        <Grid item xs={9}>
          <Typography className={classes.header} display="block" variant="body1">Time Availability</Typography>
          <Typography className={classes.header} display="block" variant="caption" color="textSecondary">
            Hours you are available to meet (in your timezone)
          </Typography>
        </Grid>
        <Grid item xs={3} align="right">
          <Tooltip title={"Custom time selection" + (customRequired ? " (required because times are not contiguous)" : "")}>
            <FormControlLabel
                control={(
                  <Switch
                    color="secondary"
                    checked={custom || customRequired}
                    disabled={customRequired}
                    onChange={() => setCustom(!custom)}
                    size="small" />
                )}
                labelPlacement="bottom"
                label={(
                  <Hidden xsDown>
                    <Typography variant="caption">Custom</Typography>
                  </Hidden>
                )} />
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          {(custom || customRequired) ? (
            <CustomSelection
              value={localAvailability}
              onChange={onCustomChange} />
          ) : (
            <RangeSelection
              range={range}
              onChange={onRangeChange} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

AvailabilitySelector.propTypes = {
  timeAvailability: propTypes.string,
  onChange: propTypes.func.isRequired,
};

// Get a default value for this component (which depends on the timezon)
AvailabilitySelector.default = () => {
  return localToUtc('NNNNNNNNNYYYYYYYYNNNNNNN');
}
