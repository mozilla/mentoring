import React, { Fragment, useState } from "react";
import propTypes from 'prop-types';
import Helmet from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import { useParticipantByEmail } from '../../data/participants';
import { LOCAL_NINE_TO_FIVE } from '../../components/AvailabilitySelector';
import Loading from '../../components/Loading';
import ErrorDialog from '../../components/ErrorDialog';
import EnrollmentForm from './EnrollmentForm';
import PostedDialog from './PostedDialog';
import { participantType, usePostParticipant } from '../../data/participants';

export default function Enrollment({ role, update }) {
  const { user } = MENTORING_SETTINGS;

  // load the participant's enrollment from the API, if present
  const [existing] = useParticipantByEmail(user.email);
  const initialParticipant = existing.participant ? existing.participant : {
    // no `id` property, meaning a new participant
    full_name: `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    manager: '',
    manager_email: '',
    is_mentor: role === 'mentor',
    is_learner: role === 'learner' || Boolean(update),
    time_availability: LOCAL_NINE_TO_FIVE,
    org: '',
    org_level: '',
    time_at_org_level: '',
    learner_interests: [],
    mentor_interests: [],
    track_change: 'maybe', // default for mentors, since the choice is disabled
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
  const [{loading: postLoading, error: postError}, postParticipant] = usePostParticipant(participant);
  const [posted, setPosted] = useState(false);
  const [postErrorDismissed, setPostErrorDismissed] = useState(false);

  const handleSubmit = event => {
    setPostErrorDismissed(false);
    postParticipant().then(
      () => setPosted(true),
      // errors are reported via postError, so ignore them here
      () => {});
    event.preventDefault();
  };

  const handleRetry = () => setPostErrorDismissed(true);
  const showErrorDialog = postError && !postErrorDismissed;

  return (
    <Fragment>
      {showErrorDialog && <ErrorDialog error={postError} onRetry={handleRetry} />}
      <Helmet>
        <title>Mozilla Mentorship Program - Enrollment</title>
      </Helmet>
      {posted ? <PostedDialog /> : (
        <Grid container justify="center">
          <Grid item>
            <EnrollmentForm
              update={update}
              participant={participant}
              onParticipantChange={setParticipant}
              onSubmit={handleSubmit}
              submitLoading={postLoading}
            />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
}

WithLoadedParticipant.propTypes = {
  update: propTypes.bool,
  initialParticipant: participantType.isRequired,
};
