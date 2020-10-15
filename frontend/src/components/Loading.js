import React, { Fragment } from "react";

// Show a spinner if any of the array of loads are still loading, or an error
// if the load fails; otherwise show children.
export default function Loading({ children, loads }) {
  if (!loads.every(({ loading }) => !loading)) {
    // TODO: poor man's spinner
    return <h2>Loading</h2>;
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
