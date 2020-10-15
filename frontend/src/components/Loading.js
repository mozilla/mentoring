import React, { Fragment } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';

// Show a spinner if any of the array of loads are still loading, or an error
// if the load fails; otherwise show children.
export default function Loading({ children, loads }) {
  if (!loads.every(({ loading }) => !loading)) {
    return <LinearProgress />
  }

  for (let {error} of loads) {
    if (error) {
      return (
        <div>
          <h2>Error</h2>
          {error}
        </div>
      );
    }
  }

  return <Fragment>{children}</Fragment>;
}
