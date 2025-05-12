import {
  FETCH_ASSIGNMENTS_REQUEST,
  FETCH_ASSIGNMENTS_SUCCESS,
  FETCH_ASSIGNMENTS_FAILURE,
  ADD_ASSIGNMENT_REQUEST,
  ADD_ASSIGNMENT_SUCCESS,
  ADD_ASSIGNMENT_FAILURE,
  DELETE_ASSIGNMENT_REQUEST,
  DELETE_ASSIGNMENT_SUCCESS,
  DELETE_ASSIGNMENT_FAILURE,
  FETCH_ASSIGNMENT_BY_ID_REQUEST,
  FETCH_ASSIGNMENT_BY_ID_SUCCESS,
  FETCH_ASSIGNMENT_BY_ID_FAILURE,
  UPDATE_ASSIGNMENT_REQUEST,
  UPDATE_ASSIGNMENT_SUCCESS,
  UPDATE_ASSIGNMENT_FAILURE,
} from "./assignmentActionTypes";
import { AnyAction } from "redux";
import { Assignment } from "../../types/types";

// Define the initial state for assignments
const initialState: {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
} = {
  assignments: [],
  loading: false,
  error: null,
};

const assignmentsReducer = (
  state = initialState,
  action: AnyAction
): typeof initialState => {
  switch (action.type) {
    case FETCH_ASSIGNMENTS_REQUEST:
    case ADD_ASSIGNMENT_REQUEST:
    case DELETE_ASSIGNMENT_REQUEST:
    case FETCH_ASSIGNMENT_BY_ID_REQUEST:
    case UPDATE_ASSIGNMENT_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_ASSIGNMENTS_SUCCESS:
      return { ...state, loading: false, assignments: action.payload };
    case FETCH_ASSIGNMENT_BY_ID_SUCCESS:
      return { ...state, loading: false, assignments: [action.payload] };
    case ADD_ASSIGNMENT_SUCCESS:
    case UPDATE_ASSIGNMENT_SUCCESS:
      return { ...state, loading: false };
    case DELETE_ASSIGNMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        assignments: state.assignments.filter(
          (assignment) => assignment.id !== action.payload
        ),
      };
    case FETCH_ASSIGNMENTS_FAILURE:
    case ADD_ASSIGNMENT_FAILURE:
    case DELETE_ASSIGNMENT_FAILURE:
    case FETCH_ASSIGNMENT_BY_ID_FAILURE:
    case UPDATE_ASSIGNMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default assignmentsReducer;
