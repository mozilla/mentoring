import { renderHook } from '@testing-library/react-hooks'
import { useParticipants, useParticipantByEmail } from './participants';
import { api } from '../../test/helper';

jest.mock('axios-hooks');

describe('useParticipants', () => {
  // NOTE: testing here is light since this just calls through to axios
  test('gets some participants', async () => {
    api.mock(api.participants({id: 1}));
    const { result } = renderHook(() => useParticipants());
    expect(result.current[0].loading).toBeFalsy();
    expect(result.current[0].error).toBeFalsy();
    expect(result.current[0].data).toStrictEqual([{id: 1}]);
  });
});

describe('useParticipantByEmail', () => {
  test('gets a participant by email', async () => {
    api.mock(
      api.participantByEmail('mentor@example.com', { email: 'mentor@example.com' }),
      api.participantByEmail('learner@example.com', { email: 'learner@example.com' }),
    );
    const { result, rerender } = renderHook(({ email }) => useParticipantByEmail(email), {
      initialProps: { email: 'mentor@example.com' },
    });
    expect(result.current[0].loading).toBeFalsy();
    expect(result.current[0].error).toBeFalsy();
    expect(result.current[0].participant).toStrictEqual({ email: 'mentor@example.com' });

    // change the email prop and see that it re-fetches
    rerender({ email: 'learner@example.com' });

    expect(result.current[0].loading).toBeFalsy();
    expect(result.current[0].error).toBeFalsy();
    expect(result.current[0].participant).toStrictEqual({ email: 'learner@example.com' });
  });

  test('handles 404', async () => {
    api.mock(
      api.participantByEmail('missing@example.com', null),
    );
    const { result } = renderHook(() => useParticipantByEmail('missing@example.com'));
    expect(result.current[0].loading).toBeFalsy();
    expect(result.current[0].error).toBeFalsy();
    expect(result.current[0].participant).toBeFalsy();
  });
});
