import React, { Fragment } from "react";
import Snackbar from '@material-ui/core/Snackbar';

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
