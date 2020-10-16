import React, { Fragment, useState } from "react";
import Helmet from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Drawer from '@material-ui/core/Drawer';
import Radio from '@material-ui/core/Radio';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import Loading from '../components/Loading';
import Participant from '../components/Participant';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useParticipants } from '../data/participants';
import { usePostPairing } from '../data/pairing';

const useStyles = makeStyles(theme => ({
  // participant columns are floated to achieve similar heights
  participantColumn: {
    float: 'left',
    width: '50%',
    padding: theme.spacing(1),
  },
  drawer: {
    padding: theme.spacing(1),
  },
}));

function ParticipantColumn({ participants, title, filter, onSelect, selected }) {
  const classes = useStyles();

  return (
    <div className={classes.participantColumn}>
      <h2>{title}</h2>
      {participants.data
        .filter(filter)
        .map(p => (
          <Accordion defaultExpanded key={p.id}>
            <AccordionSummary expandIcon={<ChevronDownIcon />} aria-label="Expand">
							<FormControlLabel
								aria-label="Select"
								onClick={(event) => { event.stopPropagation(); onSelect(p); }}
								onFocus={(event) => event.stopPropagation()}
								control={<Radio checked={Boolean(selected && selected.id === p.id)} />}
								label={p.full_name} />
            </AccordionSummary>
            <AccordionDetails>
              <Participant key={p.id} participant={p} />
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}

function PairDrawer({ mentor, learner, open, pairing, onClose, onPair }) {
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

function PairedSnackbar({ onClose, open, pair }) {
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

export default function Home(props) {
  const [participants, refetchParticipants] = useParticipants();
  const [pair, postPairing] = usePostPairing();
  const [mentor, setMentor] = useState(null);
  const [learner, setLearner] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarPair, setSnackbarPair] = useState({});

  return (
    <Fragment>
      <Helmet>
        <title>Mozilla Mentorship Program - Pairing</title>
      </Helmet>
      <Loading loads={ [ participants ] } errorOnly={ [ pair ] }>
        <ParticipantColumn
          title="Mentors"
          participants={participants}
          filter={p => p.role == 'M'}
          onSelect={p => {
            if (!pair.loading) {
              setMentor(p);
              learner && setDrawerOpen(true);
            }
          }}
          selected={mentor} />
        <ParticipantColumn
          title="Learners"
          participants={participants}
          filter={p => p.role == 'L'}
          onSelect={p => {
            if (!pair.loading) {
              setLearner(p);
              mentor && setDrawerOpen(true);
            }
          }}
          selected={learner} />
        <div style={{ clear: 'all' }} />
        <PairedSnackbar
          pair={snackbarPair}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)} />
        <PairDrawer
          mentor={mentor}
          learner={learner}
          open={mentor && learner && drawerOpen}
          pairing={pair.loading}
          onClose={() => {
            if (!pair.loading) {
              setDrawerOpen(false);
            }
          }}
          onPair={(mentor, learner) => {
            if (!pair.loading) {
              postPairing({
                data: { mentor: mentor.id, learner: learner.id },
              }).then(() => {
                setSnackbarPair({mentor, learner});
                setSnackbarOpen(true);
                setDrawerOpen(false);
                setMentor(null);
                setLearner(null);
                refetchParticipants();
              });
            }
          }} />
      </Loading>
    </Fragment>
  );
};
