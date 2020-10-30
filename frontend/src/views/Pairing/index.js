import React, { Fragment, useState } from "react";
import Helmet from 'react-helmet';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import Loading from '../../components/Loading';
import ParticipantColumn from './ParticipantColumn';
import PairDrawer from './PairDrawer';
import PairedSnackbar from './PairedSnackbar';
import { useParticipants } from '../../data/participants';
import { usePostPairing } from '../../data/pairing';


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
