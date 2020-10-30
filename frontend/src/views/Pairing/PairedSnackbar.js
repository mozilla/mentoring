import React from "react";
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import { participantType } from '../../data/participants';

export default function PairedSnackbar({ onClose, open, pair }) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={10000}
      onClose={onClose}
      message={`Pair created: ${pair.mentor?.full_name} / ${pair.learner?.full_name}`} />
  );
}

PairedSnackbar.propTypes = {
  // callback when the snackbar closes
  onClose: PropTypes.func.isRequired,

  // if the snackbar is open
  open: PropTypes.bool.isRequired,

  // pair to display
  pair: PropTypes.shape({
    mentor: participantType,
    learner: participantType,
  }).isRequired,
};
