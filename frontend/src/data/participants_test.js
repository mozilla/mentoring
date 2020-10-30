import { renderHook } from '@testing-library/react-hooks'
import { useParticipants } from './participants';
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
