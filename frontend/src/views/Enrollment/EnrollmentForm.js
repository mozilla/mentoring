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
import CircularProgress from '@material-ui/core/CircularProgress';
import InterestsControl from '../../components/InterestsControl';
import AvailabilitySelector from '../../components/AvailabilitySelector';
import { participantType } from '../../data/participants';

const useStyles = makeStyles(theme => ({
  formCard: {
    maxWidth: "80em",
    margin: theme.spacing(2),
  },
  buttonWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
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
const CANNED_INTERESTS = [
  "Technical Leadership",
  "Public Speaking",
  "Interpersonal Communication",
  "Time Management",
  "Increasing Impact on Mozilla's Mission",
  "Getting Things Done at Mozilla (navigating organizational culture)",
];

// A link in a form control's help text, opening in a new page and not in the tab index.
const InfoLink = ({ page, children }) => (
  <a tabIndex="-1" rel="noreferrer" target="_blank" href={page}>{children}</a>
);

InfoLink.propTypes = {
  page: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
};

export default function EnrollmentForm({ participant, update, onParticipantChange, onSubmit, submitLoading }) {
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

  const handleTimeAvailabilityChange = timeAvailability => {
    onParticipantChange({
      ...participant,
      time_availability: timeAvailability,
    });
  }

  const setLearnerInterests = interests => {
    onParticipantChange({
      ...participant,
      learner_interests: interests,
    });
  };

  const setMentorInterests = interests => {
    onParticipantChange({
      ...participant,
      mentor_interests: interests,
    });
  };

  // each control uses a pretty similar set of properties, so we calculate
  // those here, and override below.
  const textFieldProps = attr => ({
    variant: 'outlined',
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
              <AvailabilitySelector timeAvailability={participant.time_availability} onChange={handleTimeAvailabilityChange} />
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
            <Grid item xs={12} sm={6}>
              <TextField
                {...textFieldProps('track_change')}
                label="Track Change"
                disabled={!learner}
                required={learner}
                select
                helperText="Are you considering change track (such as between IC and management)?" >
                {menuItems(TRACK_CHANGE_INTEREST)}
              </TextField>
            </Grid>
            <Grid item sm={6} />
            <Grid item xs={12} sm={6}>
              <InterestsControl
                title="Mentor Interests"
                subheader="Select the topics on which you can offer mentorship"
                disabled={!mentor}
                choices={CANNED_INTERESTS}
                interests={participant.mentor_interests}
                onInterestChange={setMentorInterests} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InterestsControl
                title="Learner Interests"
                subheader="Select the topics where you are interested in improving"
                disabled={!learner}
                choices={CANNED_INTERESTS}
                interests={participant.learner_interests}
                onInterestChange={setLearnerInterests} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...textFieldProps('comments')}
                multiline
                rows={4}
                required={false}
                helperText="What else should the committe know when looking for your partner?" />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <div className={classes.buttonWrapper}>
            <Button disabled={submitLoading} type="submit" color="primary">
              {either ? (update ? "Update" : "Enroll") : "Leave"}
            </Button>
            {submitLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </CardActions>
      </Card>
    </form>
  );
}

EnrollmentForm.propTypes = {
  participant: participantType.isRequired,
  // if true, this is updating an existing enrollment
  update: propTypes.bool,
  onParticipantChange: propTypes.func.isRequired,
  onSubmit: propTypes.func.isRequired,
  submitLoading: propTypes.bool.isRequired,
};
