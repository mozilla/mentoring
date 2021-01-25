import React from "react";
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { participantType } from '../data/participants';

export default function Participant({ participant, role, omitTitle }) {
  const {
    full_name,
    org,
    org_chart_distance,
    track_change,
    org_level,
    time_at_org_level,
    learner_interests,
    mentor_interests,
    comments,
    time_availability,
  } = participant;
  const is_learner = role === 'learner';
  const is_mentor = role === 'mentor';

  // TODO: use a time-availability component to better display this
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="participant information table">
        <TableBody>
          {omitTitle ? undefined : (
            <TableRow data-testid="name">
              <TableCell component="th">Name</TableCell>
              <TableCell>{full_name}</TableCell>
            </TableRow>
          )}
          {org && (
            <TableRow data-testid="organization">
              <TableCell component="th">Organization</TableCell>
              <TableCell>
                {org}
                {org_chart_distance && (
                  <div>Preference for pair in org chart: {org_chart_distance}</div>)}
                {is_learner && track_change && (
                  <div>Interest in changing track: {track_change}</div>)}
              </TableCell>
            </TableRow>
          )}
          {org_level && (
            <TableRow data-testid="org-level">
              <TableCell component="th">Organization Level</TableCell>
              <TableCell>
                {org_level}
                {time_at_org_level && (
                  <div>Time at this level: {time_at_org_level}</div>)}
              </TableCell>
            </TableRow>
          )}
          {is_learner && learner_interests && learner_interests.length > 0 && (
            <TableRow data-testid="learner_interests">
              <TableCell component="th">Interests</TableCell>
              <TableCell>
                {learner_interests.map(i => <div key={i}>{i}</div>)}
              </TableCell>
            </TableRow>
          )}
          {is_mentor && mentor_interests && mentor_interests.length > 0 && (
            <TableRow data-testid="mentor_interests">
              <TableCell component="th">Interests</TableCell>
              <TableCell>
                {mentor_interests.map(i => <div key={i}>{i}</div>)}
              </TableCell>
            </TableRow>
          )}
          {comments.length > 0 && (
            <TableRow data-testid="comments">
              <TableCell component="th">Comments</TableCell>
              <TableCell>
                {comments}
              </TableCell>
            </TableRow>
          )}
          <TableRow data-testid="time-availability">
            <TableCell component="th">Time Availability</TableCell>
            <TableCell>
              {time_availability}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

Participant.propTypes = {
  // the participant to display
  participant: participantType.isRequired,

  // The role to display
  role: PropTypes.oneOf(['mentor', 'learner']),

  // if true, omit the title row (used when the name is already present elsewhere)
  omitTitle: PropTypes.bool,
};
