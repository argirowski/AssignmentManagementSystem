import { AnyAction } from "redux";

// Define the initial state for statuses
const initialState = {
  statuses: [],
  loading: false,
  error: null,
};

// Define action types
export const FETCH_STATUSES_REQUEST = "FETCH_STATUSES_REQUEST";
export const FETCH_STATUSES_SUCCESS = "FETCH_STATUSES_SUCCESS";
export const FETCH_STATUSES_FAILURE = "FETCH_STATUSES_FAILURE";

// Define the reducer
const statusesReducer = (
  state = initialState,
  action: AnyAction
): typeof initialState => {
  switch (action.type) {
    case FETCH_STATUSES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STATUSES_SUCCESS:
      return { ...state, loading: false, statuses: action.payload };
    case FETCH_STATUSES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state; // Ensure the reducer always returns a valid state
  }
};

export default statusesReducer;
