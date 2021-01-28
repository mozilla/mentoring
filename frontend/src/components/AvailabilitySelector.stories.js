import React, { useState } from 'react';
import propTypes from 'prop-types';
import Card from '@material-ui/core/Card';

import AvailabilitySelector from '../components/AvailabilitySelector';

function Wrapper({ initialValue }) {
  const [timeAvailability, setTimeAvailability] = useState(initialValue);
  return (
    <>
      <Card style={{ padding: "1em" }}>
        <AvailabilitySelector
          timeAvailability={timeAvailability}
          onChange={setTimeAvailability} />
      </Card>
      <Card>
        Controlled value: <pre>{timeAvailability}</pre>
      </Card>
    </>
  );
}

Wrapper.propTypes = {
  initialValue: propTypes.string.isRequired,
};

export default {
  title: 'Participants/AvailabilitySelector',
};

const Template = (args) => (
  <Wrapper initialValue={args.initialValue} />
);

export const Empty = Template.bind({});
Empty.args = {
  initialValue: null
};

export const WorkingHours = Template.bind({});
WorkingHours.args = {
  initialValue: 'NNNNNNNNNYYYYYYYYNNNNNNN',
};

export const WrappedWorkingHours = Template.bind({});
WrappedWorkingHours.args = {
  initialValue: 'YYYYNNNNNNNNNNNNNNNNYYYY',
};
