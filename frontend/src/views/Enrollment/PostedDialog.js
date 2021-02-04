import React from "react";
import { useHistory } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

export default function PostedDialog() {
  const history = useHistory();
  const goHome = () => history.push("/");

  return (
    <div>
      <Dialog
        open
        onClose={goHome}
        aria-labelledby="posted-title"
        aria-describedby="posted-desc">
        <>
          <DialogTitle id="posted-title">Responses Submitted</DialogTitle>
          <DialogContent>
            <DialogContentText id="posted-desc">
              Thank you!
              Your responses have been submitted.
              You can expect to hear from the mentoring committee soon.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={goHome} color="primary">OK</Button>
          </DialogActions>
        </>
      </Dialog>
    </div>
  );
}
