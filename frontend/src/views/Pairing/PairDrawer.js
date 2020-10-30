import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { participantType } from '../../data/participants';

const useStyles = makeStyles(theme => ({
  drawer: {
    padding: theme.spacing(1),
  },
}));

export default function PairDrawer({ mentor, learner, open, pairing, onClose, onPair }) {
  const classes = useStyles();

  // TODO: show time compatibility, shared interests, etc.

  return (
    <Drawer
      classes={{ paper: classes.drawer }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      variant="persistent"
      PaperProps={{ elevation: 4 }}>
      {open && (
        <Fragment>
          {pairing && <LinearProgress />}
          <DialogTitle>Proposed Pair: {mentor.full_name} / {learner.full_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This seems like a great match, nice job!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => onPair(mentor, learner)} color="primary" autoFocus>
              Pair
            </Button>
          </DialogActions>
        </Fragment>
      )}
    </Drawer>
  );
}

PairDrawer.propTypes = {
  // mentor and learner being paired
  mentor: participantType,
  learner: participantType,

  // if the drawer is open
  open: PropTypes.bool,

  // if the paring call is in progress
  pairing: PropTypes.bool,

  // callback for closing the drawer
  onClose: PropTypes.func,

  // callback for pairing
  onPair: PropTypes.func,
};
