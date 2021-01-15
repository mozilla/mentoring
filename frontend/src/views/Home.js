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

  const signupCard = role => {
    let action, button;
    if (role === 'mentor') {
      action = "mentor another Mozillian";
      button = "Sign Up as a Mentor";
    } else {
      action = "learn and grow with help from a mentor";
      button = "Sign Up as a Learner";
    }

    const handleClick = () => {
      history.push(`/enroll/${role}`);
    };

    return (
      <Grid key={role} item>
        <Card raised className={classes.callToActionCard}>
          <CardContent>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              I would like to {action}
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

  return (
    <Fragment>
      <Grid container className={classes.callToActionGrid}>
        <Grid item xs={12} className={classes.homeRow}>
          <Grid container justify="center" spacing={6}>
            {["mentor", "learner"].map(signupCard)}
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
