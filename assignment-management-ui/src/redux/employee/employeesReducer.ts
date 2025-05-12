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
import { AnyAction } from "redux";
import { Employee } from "../../types/types";

// Define the initial state for employees
const initialState: {
  employees: Employee[];
  loading: boolean;
  error: string | null;
} = {
  employees: [],
  loading: false,
  error: null,
};

const employeesReducer = (
  state = initialState,
  action: AnyAction
): typeof initialState => {
  switch (action.type) {
    case FETCH_EMPLOYEES_REQUEST:
    case ADD_EMPLOYEE_REQUEST:
    case DELETE_EMPLOYEE_REQUEST:
    case FETCH_EMPLOYEE_BY_ID_REQUEST:
    case UPDATE_EMPLOYEE_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_EMPLOYEES_SUCCESS:
      return { ...state, loading: false, employees: action.payload };
    case FETCH_EMPLOYEE_BY_ID_SUCCESS:
      return { ...state, loading: false, employees: [action.payload] };
    case ADD_EMPLOYEE_SUCCESS:
    case UPDATE_EMPLOYEE_SUCCESS:
      return { ...state, loading: false };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: state.employees.filter(
          (employee) => employee.id !== action.payload
        ),
      };
    case FETCH_EMPLOYEES_FAILURE:
    case ADD_EMPLOYEE_FAILURE:
    case DELETE_EMPLOYEE_FAILURE:
    case FETCH_EMPLOYEE_BY_ID_FAILURE:
    case UPDATE_EMPLOYEE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default employeesReducer;
