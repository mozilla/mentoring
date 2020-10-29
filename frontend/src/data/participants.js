import useAxios from 'axios-hooks'

// Return [{loading, error, data}, refetch] where data is the full set
// of current participants
export function useParticipants() {
  return useAxios('/api/participants');
}
