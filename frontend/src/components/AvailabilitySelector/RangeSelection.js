import React from "react";
import propTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import Hidden from '@material-ui/core/Hidden';
import { formatHour } from './util';

export default function RangeSelection({ range, onChange }) {
  // use marks to label the current times, rather than the (much larger) value labels
  const marks = [
    { value: range[0], label: formatHour(range[0]) },
    { value: range[1], label: formatHour(range[1]) },
  ];
  // only include noon, as a landmark, if it's not one of the endpoints
  if (range[0] !== 12 && range[1] !== 12) {
    marks.push({ value: 12, label: (<Hidden xsDown>{formatHour(12)}</Hidden>) });
  }

  return (
    <Slider
      min={0}
      max={24}
      marks={marks}
      value={range}
      valueLabelDisplay="off"
      onChange={onChange} />
  );
}

RangeSelection.propTypes = {
  range: propTypes.arrayOf(propTypes.number).isRequired,
  onChange: propTypes.func.isRequired,
};
