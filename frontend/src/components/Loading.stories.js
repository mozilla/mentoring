import React from 'react';
import Card from '@material-ui/core/Card';

import Loading from '../components/Loading';

export default {
  title: 'Utils/Loading',
  component: Loading,
  decorators: [
    Story => <Card><Story /></Card>,
  ],
};

const Template = (args) => (
  <Loading {...args}>
    (component content)
  </Loading>
);

export const Busy = Template.bind({});
Busy.args = {
  loads: [{ loading: true }, {loading: false}],
};

export const Loaded = Template.bind({});
Loaded.args = {
  loads: [{ loading: false }],
};

export const Error_ = Template.bind({});
Error_.title = 'Error';
Error_.args = {
  loads: [{ loading: false, error: new Error('uhoh') }],
};
