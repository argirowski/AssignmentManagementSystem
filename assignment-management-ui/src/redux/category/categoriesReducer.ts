import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  FETCH_CATEGORY_BY_ID_REQUEST,
  FETCH_CATEGORY_BY_ID_SUCCESS,
  FETCH_CATEGORY_BY_ID_FAILURE,
} from "./categoryActionTypes";
import { Category } from "../../types/types";
import { AnyAction } from "redux";

// Define the initial state for categories
const initialState: {
  categories: Category[];
  loading: boolean;
  error: string | null;
} = {
  categories: [],
  loading: false,
  error: null,
};

// Define the reducer
const categoriesReducer = (
  state = initialState,
  action: AnyAction
): typeof initialState => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload as Category[],
      };
    case FETCH_CATEGORIES_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case FETCH_CATEGORY_BY_ID_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: [action.payload as Category],
      };
    case FETCH_CATEGORY_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case ADD_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_CATEGORY_SUCCESS:
      return { ...state, loading: false };
    case ADD_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    case DELETE_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter(
          (category) => category.id !== action.payload
        ),
      };
    case DELETE_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload as string };
    default:
      return state; // Ensure the reducer always returns a valid state
  }
};
export default categoriesReducer;
