import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const staffMenu = (
    <ul>
      <li><Link to="/pairing">Pairing</Link></li>
      <li><a href="/admin/">DB Administration Panel</a></li>
      <li><a href="/api/">REST API Explorer</a></li>
    </ul>
  );
  return (
    <Fragment>
      <h1>Mozilla Mentorship Program</h1>
      {MENTORING_SETTINGS.user.is_staff && staffMenu}
    </Fragment>
  );
}
