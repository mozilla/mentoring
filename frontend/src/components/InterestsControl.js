import React, { useState } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import PlusCircleIcon from 'mdi-react/PlusCircleIcon';

const useStyles = makeStyles(theme => {
  // copied (roughly) from OutlinedInput
  const borderColor = theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)';

  return {
    // copied (roughly) from OutlinedInput
    outlined: {
      borderRadius: theme.shape.borderRadius,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor,

      // padding for the interior of the box
      padding: theme.spacing(1),
    },

    header: {
      paddingLeft: theme.spacing(1),
    }
  };
});

// A control to support selection of participants' interests during (re-)enrollment
export default function InterestsControl({ title, subheader, disabled, interests, choices, onInterestChange }) {
  const classes = useStyles();

  const handleToggle = choice => {
    const checked = interests.indexOf(choice) !== -1;
    onInterestChange(checked ? interests.filter(i => i !== choice) : interests.concat([choice]));
  };

  // the customInterests state tracks the set of interests that have been
  // added here that are not among the choices.  Note that this does not
  // include the value currently in the TextField.
  const [customInterests, setCustomInterests] = useState(interests.filter(i => choices.indexOf(i) === -1));

  // customInterest is the custom interest currently in the TextField; if nonempty
  // then this must be the same as the last entry in `interests`.
  const [customInterest, setCustomInterest] = useState('');
  const customInterestChanged = event => {
    const { value } = event.target;

    // update this value for the parent
    if (customInterest === '' && value !== '') {
      // add the new interest as soon as it exists
      onInterestChange(interests.concat([value]))
    } else if (customInterest !== '' && value == '') {
      // remove the interest once it becomes an empty string
      onInterestChange(interests.slice(0, -1));
    } else if (customInterest !== '' && value !== '') {
      // update the value in-place, regardless of whether our prop has been
      // updated yet
      let ints = interests;
      if (ints.length > 0 && ints[ints.length - 1] == customInterest) {
        ints = ints.slice(0, -1);
      }
      onInterestChange(ints.concat([value]));
    }

    setCustomInterest(value);

    event.preventDefault();
  };

  // add the current customInterest to the customInterests, and reset customInterest
  const addCustomInterest = () => {
    setCustomInterests(customInterests.concat([customInterest]));
    setCustomInterest('');
  };

  // select a color for text appropriate to the disabled/enabled state
  const color = disabled ? "textSecondary" : "textPrimary";

  return (
    <Box className={classes.outlined}>
      {title && <Typography className={classes.header} display="block" color={color} variant="body1" > {title} </Typography>}
      {subheader && <Typography className={classes.header} display="block" variant="caption" color="textSecondary">{subheader}</Typography>}
      <List dense>
        {choices.concat(customInterests).map(interest => (
          <ListItem
            key={interest}
            role={undefined}
            button={!disabled}
            onClick={() => !disabled && handleToggle(interest)}>
            <ListItemIcon>
              <Checkbox
                size="small"
                edge="start"
                disabled={disabled}
                checked={interests.indexOf(interest) !== -1}
                tabIndex={-1}
                inputProps={{ 'aria-label': interest }}
              />
            </ListItemIcon>
            <ListItemText
              primary={interest}
              primaryTypographyProps={{ color }} />
          </ListItem>
        ))}
        <ListItem>
          <TextField
            label="Other"
            size="small"
            disabled={disabled}
            fullWidth
            value={customInterest}
            InputProps={{
              'aria-label': "other",
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="add other"
                    disabled={disabled || customInterest === ''}
                    onClick={addCustomInterest}
                    onMouseDown={e => e.preventDefault()} >
                    <PlusCircleIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            onChange={customInterestChanged} />
        </ListItem>
      </List>
    </Box>
  );
}

InterestsControl.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  disabled: PropTypes.bool,

  // The set of pre-defined interests
  choices: PropTypes.arrayOf(PropTypes.string).isRequired,

  // The actively selected interests
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,

  // Callback when interests change
  onInterestChange: PropTypes.func.isRequired,
};

