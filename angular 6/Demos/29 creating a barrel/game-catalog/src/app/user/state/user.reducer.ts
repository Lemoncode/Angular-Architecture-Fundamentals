import { IUser } from '../user';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface UserState {
  maskUserName: boolean;
  currentUser: IUser;
}

const initialState: UserState = {
  maskUserName: false,
  currentUser: null,
}

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const getMaskUserName = createSelector(
  getUserFeatureState,
  state => state.maskUserName,
);

export const getCurrentUser = createSelector(
  getUserFeatureState,
  state => state.currentUser,
);

export const reducer = (state: UserState = initialState, action): UserState => {
  switch (action.type) {
    case 'MASK_USER_NAME':
      return {
        ...state,
        maskUserName: action.payload,
      }
    default:
      return state;
  }
};
