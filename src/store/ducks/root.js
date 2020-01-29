import { createActions, createReducer } from 'reduxsauce';

/**
 * Action types & Creators
 */
export const { Types, Creators } = createActions({
  setLogout: {},
});

/**
 * Handlers
 */
const INITIAL_STATE = {};

const logout = (state = INITIAL_STATE) => [
  ...state,
  { }
];

/**
 * Reducer
 */
export default createReducer(INITIAL_STATE, {
    [Types.SET_LOGOUT]: logout,
  });