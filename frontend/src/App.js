import React, { Fragment } from "react";
import Helmet from 'react-helmet';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Home from './views/Home';
import Pairing from './views/Pairing';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const theme = createMuiTheme({});

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    display: 'flex',
    background: theme.palette.primary.dark,
  },
  appIcon: {
    fill: theme.palette.common.white,
  },
  appBar: {
    position: 'fixed',
    backgroundColor: theme.palette.secondary.dark,
    zIndex: theme.zIndex.drawer + 1,
    '& a': {
      borderBottom: 0,
    },
    '& a:hover': {
      borderBottom: 0,
    },
  },
  content: {
    backgroundColor: theme.palette.background,
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      marginTop: 64,
    },
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'end',
  },
  mentorship: {
    maxHeight: 48,
    paddingRight: theme.spacing(3),
  }
}));

export default function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <title>Mozilla Mentorship Program</title>
      </Helmet>
      <Router>
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <img src="/static/images/mentorship.png" alt="Program Logo" className={classes.mentorship} />
            <Typography variant="h6" style={{ flexGrow: '1' }}>
              Mozilla Mentoring Program
            </Typography>
            <Typography>
              {MENTORING_SETTINGS.user.username ? (
                <Fragment>
                  {MENTORING_SETTINGS.user.first_name} {MENTORING_SETTINGS.user.last_name}
                </Fragment>
              ) : (
                "(not signed in)"
              )}
            </Typography>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/pairing">
            <Pairing />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
