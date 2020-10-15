import React, { Fragment } from "react";
import Helmet from 'react-helmet';
import Home from './views/Home';
import Pairing from './views/Pairing';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App(props) {
  return (
    <Fragment>
      <Helmet>
        <title>Mozilla Mentorship Program</title>
      </Helmet>
      <Router>
        <Switch>
          <Route path="/pairing">
            <Pairing />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </Fragment>
  );
};
