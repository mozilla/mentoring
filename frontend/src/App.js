import React from "react";
import Home from './views/Home';
import Pairing from './views/Pairing';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

export default function App(props) {
  return (
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
  );
};
