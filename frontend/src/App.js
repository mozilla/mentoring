import React, { Fragment } from "react";
import Helmet from 'react-helmet';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CogOutlineIcon from 'mdi-react/CogOutlineIcon';
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

export default function App(props) {
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
            <a href="/admin/">
              <Tooltip placement="bottom" title="Admin Panel">
                <IconButton>
                  <CogOutlineIcon className={classes.appIcon} />
                </IconButton>
              </Tooltip>
            </a>
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
};
