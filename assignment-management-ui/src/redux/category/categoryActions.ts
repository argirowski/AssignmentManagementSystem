import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { AppState } from "../../store";
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
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
} from "./categoryActionTypes";
import {
  apiFetchCategories,
  apiAddCategory,
  apiDeleteCategory,
  apiFetchCategoryById,
  apiUpdateCategory,
} from "../../utils/api/categoryApi";
import { Category } from "../../types/types";

export const fetchCategoriesAction = (): ThunkAction<
  void,
  AppState,
  unknown,
  AnyAction
> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });
    try {
      const categories = await apiFetchCategories();
      dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: categories });
    } catch (error: any) {
      dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
    }
  };
};

export const addCategoryAction = (
  name: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: ADD_CATEGORY_REQUEST });
    try {
      await apiAddCategory(name);
      dispatch({ type: ADD_CATEGORY_SUCCESS });
    } catch (error: any) {
      dispatch({ type: ADD_CATEGORY_FAILURE, payload: error.message });
    }
  };
};

export const deleteCategoryAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: DELETE_CATEGORY_REQUEST });
    try {
      await apiDeleteCategory(id);
      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
    } catch (error: any) {
      dispatch({ type: DELETE_CATEGORY_FAILURE, payload: error.message });
    }
  };
};

export const fetchCategoryByIdAction = (
  id: string
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CATEGORY_BY_ID_REQUEST });
    try {
      const category = await apiFetchCategoryById(id.toString());
      dispatch({ type: FETCH_CATEGORY_BY_ID_SUCCESS, payload: category });
    } catch (error: any) {
      dispatch({ type: FETCH_CATEGORY_BY_ID_FAILURE, payload: error.message });
    }
  };
};

export const updateCategoryAction = (
  id: string,
  category: Category
): ThunkAction<void, AppState, unknown, AnyAction> => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });
    try {
      await apiUpdateCategory(id, category);
      dispatch({ type: UPDATE_CATEGORY_SUCCESS });
    } catch (error: any) {
      dispatch({ type: UPDATE_CATEGORY_FAILURE, payload: error.message });
    }
  };
};
