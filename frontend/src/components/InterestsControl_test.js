import React from 'react';
import { render, screen } from '@testing-library/react';
import InterestsControl from './InterestsControl';
import userEvent from '@testing-library/user-event'

describe('InterestsControl', () => {
  const choices = ['cats', 'dogs'];

  const checkbox = label => screen.getByLabelText(label);

  test('displays contains checked interests from the given choices', () => {
    render(<InterestsControl interests={['cats']} choices={choices} onChange={() => {}} />);
    expect(checkbox('cats')).toBeChecked();
    expect(checkbox('dogs')).not.toBeChecked();
  });

  test('displays checked interests not in the given choices', () => {
    render(<InterestsControl interests={['rabbits']} choices={choices} onChange={() => {}} />);
    expect(checkbox('cats')).not.toBeChecked();
    expect(checkbox('dogs')).not.toBeChecked();
    expect(checkbox('rabbits')).toBeChecked();
  });

  test('includes typed interests in the returned interests immediately', () => {
    let interests = ['cats'];
    const onChange = i => interests = i;

    render(<InterestsControl interests={interests} choices={choices} onChange={onChange} />);
    userEvent.type(screen.getByLabelText('other'), 'horses');
    expect(interests).toEqual(['cats', 'horses']);
  });
});
