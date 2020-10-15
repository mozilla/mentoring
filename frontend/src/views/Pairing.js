import React, { Fragment, useState } from "react";
import Helmet from 'react-helmet';
import Loading from '../components/Loading';
import Participant from '../components/Participant';
import { useParticipants } from '../data/participants';

function ParticipantColumn({ participants, title, filter, onClick }) {
  return (
    <div style={{ float: 'left', width: '50%' }}>
      <h2>{title}</h2>
      {participants.data
        .filter(filter)
        .map(p => <Participant key={p.id} participant={p} onClick={() => onClick(p)} />)}
    </div>
  );
}

export default function Home(props) {
  const [participants, refectParticipants] = useParticipants();
  const [mentor, setMentor] = useState(null);
  const [learner, setLearner] = useState(null);

  return (
    <Fragment>
      <Helmet>
        <title>Mozilla Mentorship Program - Pairing</title>
      </Helmet>
      <h1>Mozilla Mentorship Program - Pairing</h1>
      {mentor && (<span>Selected mentor: {mentor.full_name}</span>)}
      {learner && (<span>Selected learner: {learner.full_name}</span>)}
      <Loading loads={ [ participants ] }>
        <ParticipantColumn
          title="Mentors"
          participants={participants}
          filter={p => p.role == 'M'}
          onClick={p => setMentor(p)} />
        <ParticipantColumn
          title="Learners"
          participants={participants}
          filter={p => p.role == 'L'}
          onClick={p => setLearner(p)} />
        <div style={{ clear: 'all' }} />
      </Loading>
    </Fragment>
  );
};
