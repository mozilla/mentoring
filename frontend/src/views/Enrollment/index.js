import React, { Fragment, useState } from "react";
import propTypes from 'prop-types';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import EnrollmentForm from './EnrollmentForm';

export default function Enrollment({ role }) {
  const { user } = MENTORING_SETTINGS;

  const [participant, setParticipant] = useState({
    full_name: `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    manager: '',
    manager_email: '',
    is_mentor: role === 'mentor',
    is_learner: role === 'learner',
    time_availability: 'NNNNNNNNNNNNNNNNNNNNNNNN',
    org: '',
    org_level: '',
    time_at_org_level: '',
    learner_interests: [],
    mentor_interests: [],
    track_change: '',
    org_chart_distance: '',
    comments: '',
  });

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
            participant={participant}
            onParticipantChange={setParticipant}
            onSubmit={handleSubmit} />
        </Grid>
      </Grid>
    </Fragment>
  );
}

Enrollment.propTypes = {
  role: propTypes.string.isRequired,
};
