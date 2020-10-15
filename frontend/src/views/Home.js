import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
  return (
    <Fragment>
      <h1>Mozilla Mentorship Program</h1>
      <ul>
        <li><a href="/admin/">Administration</a></li>
        <li><Link to="/pairing">Pairing</Link></li>
      </ul>
    </Fragment>
  );
};
