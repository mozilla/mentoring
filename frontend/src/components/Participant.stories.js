import React from 'react';
import Card from '@material-ui/core/Card';

import Participant from '../components/Participant';

const baseParticipant = {
  id: 123,
  email: 'abcd@efg.com',
  manager: 'Big Boss',
  manager_email: 'bboss@mozilla.com',
  is_mentor: false,
  is_learner: true,
  full_name: 'Ab Cd',
  learner_interests: ['learning stuff'],
  mentor_interests: ['mentoring'],
  org: 'Firefox',
  org_level: 'P1',
  time_at_org_level: 'forever',
  track_change: 'no thanks',
  org_chart_distance: 'far, far away',
  comments: '',
  time_availability: 'YYNNYYNNYYNNYYNNYYNNYYNN',
};

export default {
  title: 'Participants/Participant',
  component: Participant,
  decorators: [
    Story => <Card><Story /></Card>,
  ],
};

const Template = (args) => (
  <Participant {...args} />
);

export const Mentor = Template.bind({});
Mentor.args = {
  participant: baseParticipant,
  role: 'mentor',
  omitTitle: false,
};

export const Learner = Template.bind({});
Learner.args = {
  participant: baseParticipant,
  role: 'learner',
  omitTitle: false,
};
