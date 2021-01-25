import useAxios from 'axios-hooks'
import PropTypes from 'prop-types';

// Return [{loading, error, data}, refetch] where data is the full set
// of current participants
export function useParticipants() {
  return useAxios('/api/participants');
}

// a PropTypes shape describing the data expected from the API
export const participantType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['M', 'L']),
  full_name: PropTypes.string.isRequired,
  manager: PropTypes.string.isRequired,
  approved: PropTypes.bool,
  time_availability: PropTypes.string.isRequired,
  org: PropTypes.string,
  org_chart_distance: PropTypes.string,
  org_level: PropTypes.string,
  time_at_org_level: PropTypes.string,
  learner_interests: PropTypes.arrayOf(PropTypes.string),
  mentor_interests: PropTypes.arrayOf(PropTypes.string),
  track_change: PropTypes.string,
  comments: PropTypes.string,
});
