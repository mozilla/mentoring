import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Participant from './Participant';

describe('Participant', () => {
  const makeParticip = particip => ({
    id: 123,
    email: 'abcd@efg.com',
    manager: 'Big Boss',
    manager_email: 'bboss@mozilla.com',
    is_mentor: false,
    is_learner: true,
    full_name: 'Ab Cd',
    learner_interests: [],
    mentor_interests: [],
    org: 'Firefox',
    org_level: 'P1',
    time_at_org_level: 'forever',
    track_change: 'no thanks',
    org_chart_distance: 'far, far away',
    comments: '',
    time_availability: 'YYNNYYNNYYNNYYNNYYNNYYNN',
    ...particip,
  });

  const withinTableRow = testId => {
    const row = screen.getByTestId(testId);
    return within(row.querySelector('td'));
  };

  test('renders a title line containing the name', () => {
    const participant = makeParticip({ full_name: 'Ab Cd' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('name').getByText('Ab Cd')).toBeInTheDocument();
  });

  test('omits a title line on omitTitle', () => {
    const participant = makeParticip({ full_name: 'Ab Cd' });
    render(<Participant role="learner" participant={participant} omitTitle />);
    expect(screen.queryByTestId('name')).not.toBeInTheDocument();
  });

  test('renders an organization line', () => {
    const participant = makeParticip({ org: 'ORG' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('organization').getByText(/ORG/)).toBeInTheDocument();
  });

  test('renders an organization line with org chart distance', () => {
    const participant = makeParticip({ org: 'ORG', org_chart_distance: 'DIST' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('organization').getByText(/ORG/)).toBeInTheDocument();
    expect(withinTableRow('organization').getByText(/DIST/)).toBeInTheDocument();
  });

  test('renders an organization line with interest in changing tracks', () => {
    const participant = makeParticip({ org: 'ORG', track_change: 'TRACK' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('organization').getByText(/ORG/)).toBeInTheDocument();
    expect(withinTableRow('organization').getByText(/TRACK/)).toBeInTheDocument();
  });

  test('omits interest in changing tracks for mentors', () => {
    const participant = makeParticip({ org: 'ORG', track_change: 'TRACK' });
    render(<Participant role="mentor" participant={participant}/>);
    expect(withinTableRow('organization').getByText(/ORG/)).toBeInTheDocument();
    expect(withinTableRow('organization').queryByText(/TRACK/)).not.toBeInTheDocument();
  });

  test('renders an org level line', () => {
    const participant = makeParticip({ org_level: 'P1' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('org-level').getByText(/P1/)).toBeInTheDocument();
  });

  test('renders an org level line with time at that level', () => {
    const participant = makeParticip({ org_level: 'P1', time_at_org_level: '1y' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('org-level').getByText(/P1/)).toBeInTheDocument();
    expect(withinTableRow('org-level').getByText(/1y/)).toBeInTheDocument();
  });

  test('omits learner_interests when none given', () => {
    const participant = makeParticip({ learner_interests: [] });
    render(<Participant role="learner" participant={participant} omitTitle />);
    expect(screen.queryByTestId('learner_interests')).not.toBeInTheDocument();
  });

  test('omits mentor_interests for learners', () => {
    const participant = makeParticip({ mentor_interests: ['cats'] });
    render(<Participant role="learner" participant={participant} omitTitle />);
    expect(screen.queryByTestId('mentor_interests')).not.toBeInTheDocument();
  });

  test('omits learner_interests for mentors', () => {
    const participant = makeParticip({ learner_interests: ['cats'] });
    render(<Participant role="mentor" participant={participant} omitTitle />);
    expect(screen.queryByTestId('learner_interests')).not.toBeInTheDocument();
  });

  test('renders learner_interests', () => {
    const participant = makeParticip({ learner_interests: ['golf', 'cricket'] });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('learner_interests').getByText(/golf/)).toBeInTheDocument();
    expect(withinTableRow('learner_interests').getByText(/cricket/)).toBeInTheDocument();
  });

  test('omits comments when none given', () => {
    const participant = makeParticip({ });
    render(<Participant role="learner" participant={participant} omitTitle />);
    expect(screen.queryByTestId('comments')).not.toBeInTheDocument();
  });

  test('renders comments', () => {
    const participant = makeParticip({ comments: 'green pancakes' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('comments').getByText(/green pancakes/)).toBeInTheDocument();
  });

  test('renders time availability', () => {
    const participant = makeParticip({ time_availability: 'YYYYYYYYYYYYYYYYYYYYYYYY' });
    render(<Participant role="learner" participant={participant}/>);
    expect(withinTableRow('time-availability').getByText(/Y{24}/)).toBeInTheDocument();
  });

});
