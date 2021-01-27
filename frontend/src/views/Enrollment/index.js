import React, { Fragment, useState } from "react";
import propTypes from 'prop-types';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import { useParticipantByEmail } from '../../data/participants';
import Loading from '../../components/Loading';
import EnrollmentForm from './EnrollmentForm';
import { participantType } from '../../data/participants';

export default function Enrollment({ role, update }) {
  const { user } = MENTORING_SETTINGS;

  // load the participant's enrollment from the API, if present
  const [existing] = useParticipantByEmail(user.email);
  const initialParticipant = existing.participant ? existing.participant : {
    id: 0,
    full_name: `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    manager: '',
    manager_email: '',
    is_mentor: role === 'mentor',
    is_learner: role === 'learner' || update, // default this to true for updates, just in case
    time_availability: 'NNNNNNNNNNNNNNNNNNNNNNNN',
    org: '',
    org_level: '',
    time_at_org_level: '',
    learner_interests: [],
    mentor_interests: [],
    track_change: '',
    org_chart_distance: '',
    comments: '',
  };

  return (
    <Loading loads={[existing]}>
      <WithLoadedParticipant update={Boolean(existing.participant)} initialParticipant={initialParticipant} />
    </Loading>
  );
}

Enrollment.propTypes = {
  role: propTypes.string,
  update: propTypes.bool,
};

// Sub-component that renders with an initial participant, once that
// participant is loaded.
function WithLoadedParticipant({ update, initialParticipant }) {
  const [participant, setParticipant] = useState(initialParticipant);

  const handleSubmit = event => {
    console.log(participant);
    event.preventDefault();
  };

  return (
    <Fragment>
      <Helmet>
        <title>Mozilla Mentorship Program - Enrollment</title>
      </Helmet>
      <Grid container justify="center">
        <Grid item>
          <EnrollmentForm
            update={update}
            participant={participant}
            onParticipantChange={setParticipant}
            onSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </Fragment>
  );
}

WithLoadedParticipant.propTypes = {
  update: propTypes.bool,
  initialParticipant: participantType.isRequired,
};
