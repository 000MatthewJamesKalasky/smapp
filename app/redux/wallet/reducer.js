// @flow
import type { Action } from '/redux/types';
import { SAVE_FILE_ENCRYPTION_KEY, SET_LOGOUT } from './actions';

const initialState = {
  walletNumber: -1,
  data: null,
  fileKey: null
};

const reducer = (state: any = initialState, action: Action) => {
  switch (action.type) {
    case SAVE_FILE_ENCRYPTION_KEY: {
      const {
        payload: { key }
      } = action;
      return { ...state, fileKey: key };
    }
    case SET_LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
