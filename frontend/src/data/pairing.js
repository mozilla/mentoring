import useAxios from 'axios-hooks'

// Return [{loading, error, data}, refetch] where data is the
// full set of current pairs
export function usePairs() {
  return useAxios('/api/pairs', { useCache: false });
}

// Return [{loading, error}, postPairing] where
// postPairing({data: {mentor, learner}}) will asynchronously
// post a pairing.
export function usePostPairing() {
  return useAxios({
    url: '/api/pairs',
    method: 'POST',
    headers: { 'X-CSRFToken': MENTORING_SETTINGS.csrftoken },
  }, { manual: true, useCache: false });
}
