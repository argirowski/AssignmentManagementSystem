import { Dispatch } from "redux";
import {
  FETCH_STATUSES_REQUEST,
  FETCH_STATUSES_SUCCESS,
  FETCH_STATUSES_FAILURE,
} from "./statusesReducer";
import { fetchStatuses as apiFetchStatuses } from "../../utils/api/statusApi";

// Action creator for fetching statuses
export const fetchStatuses = () => {
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
