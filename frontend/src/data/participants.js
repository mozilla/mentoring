import useAxios from 'axios-hooks'

export function useParticipants() {
  return useAxios('/api/participants');
}
