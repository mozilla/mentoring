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
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import Loading from '../components/Loading';
import Participant from '../components/Participant';
import { useParticipants } from '../data/participants';

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

function PairDrawer({ mentor, learner, open, onClose, onPair }) {
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

export default function Home(props) {
  const [participants, refectParticipants] = useParticipants();
  const [mentor, setMentor] = useState(null);
  const [learner, setLearner] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Fragment>
      <Helmet>
        <title>Mozilla Mentorship Program - Pairing</title>
      </Helmet>
      <Loading loads={ [ participants ] }>
        <ParticipantColumn
          title="Mentors"
          participants={participants}
          filter={p => p.role == 'M'}
          onSelect={p => {
            setMentor(p);
            learner && setDrawerOpen(true);
          }}
          selected={mentor} />
        <ParticipantColumn
          title="Learners"
          participants={participants}
          filter={p => p.role == 'L'}
          onSelect={p => {
            setLearner(p);
            mentor && setDrawerOpen(true);
          }}
          selected={learner} />
        <div style={{ clear: 'all' }} />
        <PairDrawer
          mentor={mentor}
          learner={learner}
          open={drawerOpen}
          onClose={() => {
            setMentor(null);
            setLearner(null);
            setDrawerOpen(false);
          }}
          onPair={(mentor, learner) => {
            console.log('pair', mentor.full_name, learner.full_name);
            setMentor(null);
            setLearner(null);
            setDrawerOpen(false);
            refetchParticipants();
          }} />
      </Loading>
    </Fragment>
  );
};
