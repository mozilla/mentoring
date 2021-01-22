import React, { Fragment } from "react";
import propTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { titleCase } from "title-case";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  formCard: {
    maxWidth: "80em",
    margin: theme.spacing(2),
  },
}));

const MENTORING_MANA_PAGE = "https://mana.mozilla.org/wiki/pages/viewpage.action?spaceKey=PR&title=Mozilla+Mentoring+Program";
const CLG_PAGE = "https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=119683146";
const ORG_CHART_DISTANCES = [
  {key: "require-close", text: "Yes, someone close please"},
  {key: "prefer-close", text: "I'd prefer someone close, but I'm flexible"},
  {key: "neutral", text: "No preference"},
  {key: "prefer-far", text: "I'd prefer someone far away, but I'm flexible"},
  {key: "require-far", text: "No, someone far away please"},
];
const TRACK_CHANGE_INTEREST = [
  {key: "yes", text: "Yes"},
  {key: "maybe", text: "I'm thinking about it"},
  {key: "no", text: "No"},
];
const TIMES_AT_ORG_LEVEL = [
  {key: "<1 year", text: "Less than a year"},
  {key: "1-2 years", text: "1-2 years"},
  {key: "2-3 years", text: "2-3 years"},
  {key: "3-5 years", text: "3-5 years"},
  {key: ">6 years", text: "6 or more years"},
];

// A link in a form control's help text, opening in a new page and not in the tab index.
const InfoLink = ({ page, children }) => (
  <a tabIndex="-1" rel="noreferrer" target="_blank" href={page}>{children}</a>
);

InfoLink.propTypes = {
  page: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
};

export default function EnrollmentForm({ participant, onParticipantChange, onSubmit }) {
  const classes = useStyles();

  const mentor = participant.is_mentor;
  const learner = participant.is_learner;
  const either = mentor || learner;
  const neither = !either;

  const handleInputChange = event => {
    const { name, value } = event.target;
    onParticipantChange({
      ...participant,
      [name]: value,
    })
  };

  const handleSwitchChange = event => {
    const { name } = event.target;
    onParticipantChange({
      ...participant,
      [name]: !participant[name],
    });
  };

  // each control uses a pretty similar set of properties, so we calculate
  // those here, and override below.
  const textFieldProps = attr => ({
    variant: 'filled',
    label: titleCase(attr.replace(/_/g, ' ')),
    name: attr,
    value: participant[attr],
    required: true,
    margin: 'normal',
    fullWidth: true,
    onChange: handleInputChange,
    disabled: neither,
  });

  const menuItems = items => items.map(
    ({ key, text }) => <MenuItem key={key} value={key}>{text}</MenuItem>
  );

  return (
    <form onSubmit={onSubmit}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={neither}
        message={
          "De-selecting both 'Mentor' and 'Learner' indicates you are no longer interested in" +
          "participating in the program.  We would love to hear your feedback as to why not!"} />
      <Card className={classes.formCard}>
        <CardHeader title="Mentoring Enrollment" />
        <CardContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            The mentoring committee gathers information about participants to help us make the
            best possible parings of mentors and learners.  This information will only be disclosed
            to the members of the committee and will be deleted after six months or after your
            mentoring relationship is complete.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('full_name')}
                autoFocus
                helperText="Your preferred full name" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('email')}
                disabled={true}
                helperText="Your Mozilla email address (taken from your sign-in)" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_mentor"
                    checked={participant.is_mentor}
                    onChange={handleSwitchChange}
                  />}
                label="Mentor" />
              <FormHelperText>You would be willing to mentor another Mozillian</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="is_learner"
                    checked={participant.is_learner}
                    onChange={handleSwitchChange}
                  />}
                label="Learner" />
              <FormHelperText>You would like to learn and grow with help from a mentor</FormHelperText>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('manager')}
                helperText={(
                  <Fragment>
                    Your manager&rsquo;s name
                    (<InfoLink page={MENTORING_MANA_PAGE}>how we use this</InfoLink>)
                  </Fragment>
                )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('manager_email')}
                helperText="Your manager's email" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...textFieldProps('time_availability')}
                helperText="We want to select a match with whom you can meet at a time that is comfortable for both of you.
                  Please indicate in which time ranges you are able to meet on a typical weekday." />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('org')}
                label="Organization"
                placeholder="Firefox"
                helperText="Your Organization at Mozilla" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('org_level')}
                label="Organization Level"
                placeholder="IC3"
                helperText={(
                  <Fragment>
                    Your Organization Level
                    (<InfoLink page={CLG_PAGE}>career leveling guides</InfoLink>)
                  </Fragment>
                )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('track_change')}
                label="Track Change"
                disabled={!learner}
                select
                helperText="Are you considering change track (such as between IC and management)?" >
                {menuItems(TRACK_CHANGE_INTEREST)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('time_at_org_level')}
                label="Time at Level"
                select
                helperText="Time you have been at this organizational level" >
                {menuItems(TIMES_AT_ORG_LEVEL)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('org_chart_distance')}
                label="Organizational Distance"
                select
                helperText="Would you like to be paired with someone close to you on the Organization Chart?" >
                {menuItems(ORG_CHART_DISTANCES)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...textFieldProps('learner_interests')}
                disabled={!learner}
                multiline
                helperText="(As learner) Select the topics where you are interested in improving" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...textFieldProps('mentor_interests')}
                disabled={!mentor}
                multiline
                helperText="(As mentor) Select the topics on which you can offer mentorship" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...textFieldProps('comments')}
                multiline
                required={false}
                helperText="What else should the committe know when looking for your partner?" />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button type="submit" color="primary">{either ? "Enroll" : "Leave"}</Button>
        </CardActions>
      </Card>
    </form>
  );
}

EnrollmentForm.propTypes = {
  participant: propTypes.shape({
    full_name: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    is_mentor: propTypes.bool.isRequired,
    is_learner: propTypes.bool.isRequired,
    manager: propTypes.string.isRequired,
    manager_email: propTypes.string.isRequired,
    time_availability: propTypes.string.isRequired,
    org: propTypes.string.isRequired,
    org_level: propTypes.string.isRequired,
    time_at_org_level: propTypes.string.isRequired,
    mentor_interests: propTypes.string.isRequired,
    learner_interests: propTypes.string.isRequired,
    track_change: propTypes.string.isRequired,
    org_chart_distance: propTypes.string.isRequired,
    comments: propTypes.string.isRequired,
  }).isRequired,
  onParticipantChange: propTypes.func.isRequired,
  onSubmit: propTypes.func.isRequired,
};
