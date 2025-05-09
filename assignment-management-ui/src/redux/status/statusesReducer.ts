import { AnyAction } from "redux";
import { Status } from "../../types/types";
import {
  FETCH_STATUSES_REQUEST,
  FETCH_STATUSES_SUCCESS,
  FETCH_STATUSES_FAILURE,
  FETCH_STATUS_BY_ID_REQUEST,
  FETCH_STATUS_BY_ID_SUCCESS,
  FETCH_STATUS_BY_ID_FAILURE,
  ADD_STATUS_REQUEST,
  ADD_STATUS_SUCCESS,
  ADD_STATUS_FAILURE,
  DELETE_STATUS_REQUEST,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAILURE,
} from "../../redux/status/statusActionTypes";

// Define the initial state for statuses
const initialState: {
  statuses: Status[];
  loading: boolean;
  error: string | null;
} = {
  statuses: [],
  loading: false,
  error: null,
};

// Define the reducer
const statusesReducer = (
  state = initialState,
  action: AnyAction
): typeof initialState => {
  switch (action.type) {
    case FETCH_STATUSES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STATUSES_SUCCESS:
      return { ...state, loading: false, statuses: action.payload as Status[] };
    case FETCH_STATUSES_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case FETCH_STATUS_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_STATUS_BY_ID_SUCCESS:
      return { ...state, loading: false, statuses: [action.payload as Status] };
    case FETCH_STATUS_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case ADD_STATUS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_STATUS_SUCCESS:
      return { ...state, loading: false };
    case ADD_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case DELETE_STATUS_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        statuses: state.statuses.filter(
          (status) => status.id !== action.payload
        ),
      };
    case DELETE_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state; // Ensure the reducer always returns a valid state
  }
};

export default statusesReducer;
