import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from "redux";
import { thunk, ThunkMiddleware } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Status } from "./types/types";
import statusesReducer from "./redux/status/statusesReducer";
import categoriesReducer from "./redux/category/categoriesReducer";
import employeesReducer from "./redux/employee/employeesReducer";

export type StatusesState = {
  statuses: Status[];
  loading: boolean;
  error: string | null;
};

// Placeholder reducers (replace with actual reducers later)
const rootReducer = combineReducers({
  statuses: statusesReducer,
  categories: categoriesReducer, // Added categories reducer
  employees: employeesReducer, // Added employees reducer
  // Add reducers here, e.g., assignment: assignmentReducer
});

export type AppState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk as unknown as ThunkMiddleware<AppState, AnyAction>)
  )
);

export type AppDispatch = typeof store.dispatch;

export default store;
