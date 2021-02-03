import React from "react";
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { formatHour } from './util';

const useStyles = makeStyles({
  reallyDense: {
    // Google's notion of "dense" gets sparser every year...
    paddingTop: 0,
    paddingBottom: 0,
  },
});

export default function CustomSelection({ value, onChange }) {
  const classes = useStyles();

  const handleClick = h => {
    const splitValue = value.split('');
    splitValue[h] = splitValue[h] === 'Y' ? 'N' : 'Y';
    onChange(splitValue.join(''));
  };

  return (
    <Grid data-testid="custom-selection" container justify="center">
        {[0, 12].map(q => (
          <Grid item key={q} xs={12} sm={6}>
            <List dense>
              {value.slice(q, q + 12).split('').map((v, qh) => (
                <ListItem className={classes.reallyDense} key={qh} onClick={() => handleClick(q + qh)} >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={v === 'Y'}
                      inputProps={{ 'aria-labelledby': formatHour(q + qh) }} />
                  </ListItemIcon>
                  <ListItemText aria-label={formatHour(q + qh)} primary={formatHour(q + qh)} />
                </ListItem>
              ))}
            </List>
          </Grid>
        ))}
    </Grid>
  );
}

CustomSelection.propTypes = {
  value: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
};
