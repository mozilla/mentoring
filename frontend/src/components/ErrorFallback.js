import React from "react";
import propTypes from 'prop-types';
import ErrorDialog from './ErrorDialog';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div>
      <ErrorDialog error={error} onRetry={resetErrorBoundary} />
    </div>
  );
}

ErrorFallback.propTypes = {
  error: propTypes.object.isRequired,
  resetErrorBoundary: propTypes.func.isRequired,
};
