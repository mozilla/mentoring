import React from "react";
import propTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

// Display the given error in a full-page dialog.  If `onRetry` is given, it will be called when
// the dialog is closed; otherwise, the dialog represents a "permanent" error.
export default function ErrorDialog({ error, onRetry }) {
  return (
    <Dialog
      open
      onClose={onRetry}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-desc">
      <>
        <DialogTitle id="error-dialog-title">Frontend Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="error-dialog-desc">
            An error occurred: <tt>{error.toString()}</tt>. More detail is available in the browser console.
          </DialogContentText>
        </DialogContent>
        {onRetry && <DialogActions>
          <Button onClick={onRetry} color="primary">Retry</Button>
        </DialogActions>}
      </>
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  error: propTypes.object.isRequired,
  onRetry: propTypes.func,
};
