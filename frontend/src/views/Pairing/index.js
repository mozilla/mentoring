import React, { Fragment, useState } from "react";
import Helmet from 'react-helmet';
import Loading from '../../components/Loading';
import ParticipantColumn from './ParticipantColumn';
import PairDrawer from './PairDrawer';
import PairedSnackbar from './PairedSnackbar';
import { useParticipants } from '../../data/participants';
import { usePostPairing } from '../../data/pairing';


export default function Home() {
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
          participants={participants.data?.filter(p => p.is_mentor)}
          onSelect={p => {
            if (!pair.loading) {
              setMentor(p);
              learner && setDrawerOpen(true);
            }
          }}
          selected={mentor} />
        <ParticipantColumn
          title="Learners"
          participants={participants.data?.filter(p => p.is_learner)}
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
}
