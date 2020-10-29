import { AxiosHooksMock } from 'axios-hooks-mock';
import useAxios from 'axios-hooks';

export const api = {
  /**
   * Utility wrapper for AxiosHooksMock; call with
   * arguments of `helper.api.something()` to mock those calls
   */
  mock() {
    // this global is set by Django in the wrapper HTML
    global.csrftoken = 'abc';
    useAxios.mockImplementation(
      new AxiosHooksMock(
        [...arguments],
        [{ loading: false, error: new Error('unmatched axios request') }] // default
      ).implement()
    );
  },

  /**
   * Given participants (note: no schema is enforced on participants)
   */
  participants() {
    return {
      config: { method: 'GET', url: '/api/participants' },
      implementation: [ { data: [...arguments], loading: false }, jest.fn() ],
    };
  },

  /**
   * Given pairs (note: no schema is enforced on participants)
   */
  pairs() {
    return {
      config: { method: 'GET', url: '/api/pairs' },
      implementation: [ { data: [...arguments], loading: false }, jest.fn() ],
    };
  },

  /**
   * Call the given callback when a pairing is posted
   */
  onPostPairing(cb) {
    return {
      config: { method: 'POST', url: '/api/pairs' },
      implementation: [ { loading: false }, cb ],
    };
  },
}
