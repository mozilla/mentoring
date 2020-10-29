import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks'
import { useParticipants } from '../../src/data/participants';
import { usePairs, usePostPairing } from '../../src/data/pairing';
import { api } from '../helper';

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

describe('usePairs', () => {
  // NOTE: testing here is light since this just calls through to axios
  test('gets some pairs', async () => {
    api.mock(api.pairs({ learner_id: 1, mentor_id: 2 }));
    const { result } = renderHook(() => usePairs());
    expect(result.current[0].loading).toBeFalsy();
    expect(result.current[0].data).toStrictEqual([{ learner_id: 1, mentor_id: 2 }]);
  });
});

describe('usePostPairing', () => {
  test('posts pairs', async () => {
    let posted;
    api.mock(api.onPostPairing(arg => { posted = arg; }));
    const { result } = renderHook(() => usePostPairing());
    const [pair, postPairing] = result.current;

    // nothing has happened yet
    expect(pair.loading).toBeFalsy();
    expect(posted).toBeFalsy();

    act(() => {
      postPairing({ data: { mentor: 1, learner: 2 } });
    });

    // (note: mock does not (cannot) update pair.loading)
    expect(posted).toStrictEqual({ data: { mentor: 1, learner: 2 } });
  });
});
