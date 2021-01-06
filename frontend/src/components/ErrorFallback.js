import React from "react";
import propTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <Dialog
        open
        onClose={resetErrorBoundary}
        aria-labelledby="error-fallback-title"
        aria-describedby="error-fallback-desc">
        <>
          <DialogTitle id="error-fallback-title">Frontend Error</DialogTitle>
          <DialogContent>
            <DialogContentText id="error-fallback-desc">
              An error occurred: <tt>{error.toString()}</tt>. More detail is available in the browser console.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetErrorBoundary} color="primary">Retry</Button>
          </DialogActions>
        </>
      </Dialog>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: propTypes.object.isRequired,
  resetErrorBoundary: propTypes.func.isRequired,
};
