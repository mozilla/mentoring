import React from 'react';
import Card from '@material-ui/core/Card';

import Participant from '../components/Participant';

const baseParticipant = {
  id: 123,
  email: 'abcd@efg.com',
  manager: 'Big Boss',
  full_name: 'Ab Cd',
  learner_interests: [],
  mentor_interests: [],
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
