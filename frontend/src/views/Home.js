import React, { Fragment } from "react";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountMultipleCheckIcon from 'mdi-react/AccountMultipleCheckIcon';
import DatabaseIcon from 'mdi-react/DatabaseIcon';
import ApiIcon from 'mdi-react/ApiIcon';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import Loading from '../components/Loading';
import { useParticipantByEmail } from '../data/participants';

const useStyles = makeStyles(theme => ({
  callToActionGrid: {
    flexGrow: 1,
    padding: theme.spacing(5),
  },
  callToActionCard: {
    minWidth: "30vw",
  },
  callToActionButton: {
    margin: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  homeRow: {
    paddingBottom: theme.spacing(5),
  },
  staffCard: {
    minWidth: "30vw",
    padding: theme.spacing(2),
  },
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();

  const staffMenu = (
    <Card raised className={classes.staffCard}>
      <Typography variant="h5">Program Administration</Typography>
      <List>
        <ListItem button onClick={() => history.push("/pairing")}>
          <ListItemIcon><AccountMultipleCheckIcon /></ListItemIcon>
          <ListItemText primary="Make Pairings"/>
        </ListItem>
        <ListItem button component="a" href="/admin/">
          <ListItemIcon><DatabaseIcon /></ListItemIcon>
          <ListItemText primary="DB Admin Panel"/>
        </ListItem>
        <ListItem button component="a" href="/api/">
          <ListItemIcon><ApiIcon /></ListItemIcon>
          <ListItemText primary="REST API Explorer"/>
        </ListItem>
      </List>
    </Card>
  );

  const signupCard = action => {
    let likeTo, button, link;
    switch (action) {
      case 'mentor': {
        likeTo = "mentor another Mozillian";
        button = "Sign Up as a Mentor";
        link = "/enroll/mentor";
        break;
      }
      case 'learn': {
        likeTo = "learn and grow with help from a mentor";
        button = "Sign Up as a Learner";
        link = "/enroll/learner";
        break;
      }
      case 'update': {
        likeTo = "update my enrollment in the mentoring program";
        button = "Update Enrollment";
        link = "/enroll/update";
        break;
      }
    }

    const handleClick = () => {
      history.push(link);
    };

    return (
      <Grid key={action} item>
        <Card raised className={classes.callToActionCard}>
          <CardContent>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              I would like to {likeTo}
            </Typography>
            <Grid container justify="center">
              <Grid item>
                <Button onClick={handleClick} variant="contained" color="primary" className={classes.callToActionButton}>
                  {button}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const { user } = MENTORING_SETTINGS;
  const [existing] = useParticipantByEmail(user.email);

  return (
    <Fragment>
      <Grid container className={classes.callToActionGrid}>
        <Grid item xs={12} className={classes.homeRow}>
          <Grid container justify="center" spacing={6}>
            <Loading loads={[existing]}>
              {(existing.participant ? ["update"] : ["mentor", "learn"]).map(signupCard)}
            </Loading>
          </Grid>
        </Grid>
        {MENTORING_SETTINGS.user.is_staff && (
          <Grid item xs={12} className={classes.homeRow}>
            <Grid container justify="center" spacing={6}>
              <Grid item>
                {staffMenu}
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
}
