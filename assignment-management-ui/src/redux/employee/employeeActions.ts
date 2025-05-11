import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AppState } from "../../store";
import {
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
  ADD_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAILURE,
  DELETE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAILURE,
  FETCH_EMPLOYEE_BY_ID_REQUEST,
  FETCH_EMPLOYEE_BY_ID_SUCCESS,
  FETCH_EMPLOYEE_BY_ID_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
} from "./employeeActionTypes";
import {
  fetchEmployees,
  addEmployee,
  deleteEmployee,
  fetchEmployeeById,
  updateEmployee,
} from "../../utils/api/employeeApi";
import { Employee, NewEmployee } from "../../types/types";

export const fetchEmployeesAction = (): ThunkAction<
  void,
  AppState,
  unknown,
  AnyAction
> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_EMPLOYEES_REQUEST });
    try {
      const employees = await fetchEmployees();
      dispatch({ type: FETCH_EMPLOYEES_SUCCESS, payload: employees });
    } catch (error: any) {
      dispatch({ type: FETCH_EMPLOYEES_FAILURE, payload: error.message });
    }
  };
};

export const addEmployeeAction = (
  employee: NewEmployee
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_EMPLOYEE_REQUEST });
    try {
      await addEmployee(employee);
      dispatch({ type: ADD_EMPLOYEE_SUCCESS });
    } catch (error: any) {
      dispatch({ type: ADD_EMPLOYEE_FAILURE, payload: error.message });
    }
  };
};

export const deleteEmployeeAction = (
  id: number
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_EMPLOYEE_REQUEST });
    try {
      await deleteEmployee(id);
      dispatch({ type: DELETE_EMPLOYEE_SUCCESS, payload: id });
    } catch (error: any) {
      dispatch({ type: DELETE_EMPLOYEE_FAILURE, payload: error.message });
    }
  };
};

export const fetchEmployeeByIdAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_EMPLOYEE_BY_ID_REQUEST });
    try {
      const employee = await fetchEmployeeById(id);
      dispatch({ type: FETCH_EMPLOYEE_BY_ID_SUCCESS, payload: employee });
    } catch (error: any) {
      dispatch({ type: FETCH_EMPLOYEE_BY_ID_FAILURE, payload: error.message });
    }
  };
};

export const updateEmployeeAction = (
  id: string,
  employee: Employee
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_EMPLOYEE_REQUEST });
    try {
      await updateEmployee(id, employee);
      dispatch({ type: UPDATE_EMPLOYEE_SUCCESS });
    } catch (error: any) {
      dispatch({ type: UPDATE_EMPLOYEE_FAILURE, payload: error.message });
    }
  };
};
