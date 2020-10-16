import React, { Fragment } from "react";
import LinearProgress from '@material-ui/core/LinearProgress';

// Show a spinner if any of the array of loads are still loading, or an error
// if the load fails; otherwise show children.  errorOnly is similar, but ignoring
// the loading state (for something that does not prevent rendering)
export default function Loading({ children, loads, errorOnly }) {
  if (!loads.every(({ loading }) => !loading)) {
    return <LinearProgress />
  }

  for (let {error} of loads.concat(errorOnly)) {
    if (error) {
      return (
        <div>
          <h2>Error</h2>
          <pre>{error.toString()}</pre>
        </div>
      );
    }
  }

  return <Fragment>{children}</Fragment>;
}
