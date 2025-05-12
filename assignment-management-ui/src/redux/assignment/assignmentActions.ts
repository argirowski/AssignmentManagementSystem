import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AppState } from "../../store";
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
import {
  apiFetchAssignments,
  apiAddAssignment,
  apiDeleteAssignment,
  apiFetchAssignmentById,
} from "../../utils/api/assignmentApi";
import { Assignment, CreateAssignment } from "../../types/types";

export const fetchAssignmentsAction = (): ThunkAction<
  void,
  AppState,
  unknown,
  AnyAction
> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_ASSIGNMENTS_REQUEST });
    try {
      const assignments: Assignment[] = await apiFetchAssignments();
      dispatch({ type: FETCH_ASSIGNMENTS_SUCCESS, payload: assignments });
    } catch (error: any) {
      dispatch({ type: FETCH_ASSIGNMENTS_FAILURE, payload: error.message });
    }
  };
};

export const addAssignmentAction = (
  assignmentData: CreateAssignment
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_ASSIGNMENT_REQUEST });
    try {
      await apiAddAssignment(assignmentData);
      dispatch({ type: ADD_ASSIGNMENT_SUCCESS });
    } catch (error: any) {
      dispatch({ type: ADD_ASSIGNMENT_FAILURE, payload: error.message });
    }
  };
};

export const deleteAssignmentAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_ASSIGNMENT_REQUEST });
    try {
      await apiDeleteAssignment(id);
      dispatch({ type: DELETE_ASSIGNMENT_SUCCESS, payload: id });
    } catch (error: any) {
      dispatch({ type: DELETE_ASSIGNMENT_FAILURE, payload: error.message });
    }
  };
};

export const fetchAssignmentByIdAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_ASSIGNMENT_BY_ID_REQUEST });
    try {
      const assignment = await apiFetchAssignmentById(id);
      dispatch({ type: FETCH_ASSIGNMENT_BY_ID_SUCCESS, payload: assignment });
    } catch (error: any) {
      dispatch({
        type: FETCH_ASSIGNMENT_BY_ID_FAILURE,
        payload: error.message,
      });
    }
  };
};
