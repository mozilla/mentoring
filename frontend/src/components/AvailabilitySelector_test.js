import React from 'react';
import { render } from '@testing-library/react';
import AvailabilitySelector from './AvailabilitySelector';
import {
  set_TZ_OFFSET_POSITIVE_HOURS,
  utcToLocal,
  localToUtc,
  rangeToYN,
  ynToRange,
  formatHour,
} from './AvailabilitySelector/util';

describe('AvailabilitySelector', () => {
  beforeEach(() => {
    set_TZ_OFFSET_POSITIVE_HOURS(0);
  });

  describe('util', () => {
    test('utcToLocal for UTC = local', () => {
      expect(utcToLocal('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('NYYYNNNNNNNNNYYYNNNYYYNN');
    });

    test('utcToLocal for east of meridan', () => {
      set_TZ_OFFSET_POSITIVE_HOURS(22); // UTC+2:00, so things are later than in UTC
      expect(utcToLocal('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('NNNYYYNNNNNNNNNYYYNNNYYY');
    });

    test('utcToLocal for west of meridan', () => {
      set_TZ_OFFSET_POSITIVE_HOURS(5); // UTC-5:00, so things are earlier than in UTC
      expect(utcToLocal('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('NNNNNNNNYYYNNNYYYNNNYYYN');
    });

    test('localToUtc for UTC = local', () => {
      expect(localToUtc('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('NYYYNNNNNNNNNYYYNNNYYYNN');
    });

    test('localToUtc for east of meridian', () => {
      set_TZ_OFFSET_POSITIVE_HOURS(22); // UTC+2:00, so things are later than in UTC
      expect(localToUtc('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('YYNNNNNNNNNYYYNNNYYYNNNY');
    });

    test('localToUtc for west of meridian', () => {
      set_TZ_OFFSET_POSITIVE_HOURS(5); // UTC-5:00, so things are earlier than in UTC
      expect(localToUtc('NYYYNNNNNNNNNYYYNNNYYYNN')).toEqual('YYYNNNYYYNNNNNNNNNYYYNNN');
    });

    test('rangeToYN', () => {
      expect(rangeToYN([3, 5])).toEqual('NNNYYNNNNNNNNNNNNNNNNNNN');
      expect(rangeToYN([0, 23])).toEqual('YYYYYYYYYYYYYYYYYYYYYYYN');
    });

    test('ynToRange', () => {
      expect(ynToRange('NNNNNNNNNNNNNNNNNNNNNNNN')).toEqual(null);
      expect(ynToRange('NNYYYNNNNNNNYYYNNNNNNNNN')).toEqual(null);
      expect(ynToRange('NYYYNNNNNNNNNNNNNNNNNNNN')).toEqual([1, 4]);
      expect(ynToRange('YYYYYYYYYYYYYYYYYYYYYYYY')).toEqual([0, 24]);
    });

    test('formatHour', () => {
      [
        [0, '12am'],
        [1, '1am'],
        [2, '2am'],
        [11, '11am'],
        [12, 'noon'],
        [13, '1pm'],
        [14, '2pm'],
        [23, '11pm'],
      ].forEach(([h, str]) => expect(formatHour(h)).toEqual(str));
    });
  });

  describe('component', () => {
    test('shows slider with a contiguous time range', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <AvailabilitySelector timeAvailability="NNYYYYYYYYNNNNNNNNNNNNNN" onChange={handleChange} />);
      expect(getByTestId('range-slider')).toBeInTheDocument();
    });

    test('shows custom view with a non-contiguous time range', () => {
      const handleChange = jest.fn();
      const { getByTestId } = render(
        <AvailabilitySelector timeAvailability="NNYYYYYYYYNNNNNYYYYYYNNN" onChange={handleChange} />);
      expect(getByTestId('custom-selection')).toBeInTheDocument();
    });
  });
});
