import React, { Fragment } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function Participant({ participant, omitTitle }) {
  // TODO: use a time-availability component to better display this
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="participant information table">
        <TableBody>
          {omitTitle ? undefined : (
            <TableRow data-testid="name">
              <TableCell component="th">Name</TableCell>
              <TableCell>{participant.full_name}</TableCell>
            </TableRow>
          )}
          {participant.org && (
            <TableRow data-testid="organization">
              <TableCell component="th">Organization</TableCell>
              <TableCell>
                {participant.org}
                {participant.org_chart_distance && (
                  <div>Preference for pair in org chart: {participant.org_chart_distance}</div>)}
                {participant.track_change && (
                  <div>Interest in changing track: {participant.track_change}</div>)}
              </TableCell>
            </TableRow>
          )}
          {participant.org_level && (
            <TableRow data-testid="org-level">
              <TableCell component="th">Organization Level</TableCell>
              <TableCell>
                {participant.org_level}
                {participant.time_at_org_level && (
                  <div>Time at this level: {participant.time_at_org_level}</div>)}
              </TableCell>
            </TableRow>
          )}
          {participant.interests.length > 0 && (
            <TableRow data-testid="interests">
              <TableCell component="th">Interests</TableCell>
              <TableCell>
                {participant.interests.map(i => <div key={i}>{i}</div>)}
              </TableCell>
            </TableRow>
          )}
          {participant.comments.length > 0 && (
            <TableRow data-testid="comments">
              <TableCell component="th">Comments</TableCell>
              <TableCell>
                {participant.comments}
              </TableCell>
            </TableRow>
          )}
          <TableRow data-testid="time-availability">
            <TableCell component="th">Time Availability</TableCell>
            <TableCell>
              {participant.time_availability}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
