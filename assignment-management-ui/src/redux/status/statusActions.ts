import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AppState } from "../../store";
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
  UPDATE_STATUS_REQUEST,
  UPDATE_STATUS_SUCCESS,
  UPDATE_STATUS_FAILURE,
  DELETE_STATUS_REQUEST,
  DELETE_STATUS_SUCCESS,
  DELETE_STATUS_FAILURE,
} from "./statusActionTypes";
import {
  apiFetchStatuses,
  apiFetchStatusById,
  apiAddStatus,
  apiUpdateStatus,
  apiDeleteStatus,
} from "../../utils/api/statusApi";
import { Status } from "../../types/types";

// Action creator for fetching statuses
export const fetchStatusesAction = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_STATUSES_REQUEST });
    try {
      const statuses = await apiFetchStatuses();
      dispatch({ type: FETCH_STATUSES_SUCCESS, payload: statuses });
    } catch (error: any) {
      dispatch({ type: FETCH_STATUSES_FAILURE, payload: error.message });
    }
  };
};

export const fetchStatusByIdAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch({ type: FETCH_STATUS_BY_ID_REQUEST });
    try {
      const status: Status = await apiFetchStatusById(id);
      dispatch({ type: FETCH_STATUS_BY_ID_SUCCESS, payload: status });
    } catch (error: any) {
      dispatch({ type: FETCH_STATUS_BY_ID_FAILURE, payload: error.message });
    }
  };
};

export const addStatusAction = (
  description: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch({ type: ADD_STATUS_REQUEST });
    try {
      await apiAddStatus(description);
      dispatch({ type: ADD_STATUS_SUCCESS });
    } catch (error: any) {
      dispatch({ type: ADD_STATUS_FAILURE, payload: error.message });
    }
  };
};

export const updateStatusAction = (
  id: string,
  status: Status
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_STATUS_REQUEST });
    try {
      await apiUpdateStatus(id, status);
      dispatch({ type: UPDATE_STATUS_SUCCESS });
    } catch (error: any) {
      dispatch({ type: UPDATE_STATUS_FAILURE, payload: error.message });
    }
  };
};

export const deleteStatusAction = (
  id: number
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch({ type: DELETE_STATUS_REQUEST });
    try {
      await apiDeleteStatus(id);
      dispatch({ type: DELETE_STATUS_SUCCESS, payload: id });
    } catch (error: any) {
      dispatch({ type: DELETE_STATUS_FAILURE, payload: error.message });
    }
  };
};
