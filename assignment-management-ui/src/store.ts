import {
  createStore,
  applyMiddleware,
  combineReducers,
  AnyAction,
} from "redux";
import { thunk, ThunkMiddleware } from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import statusesReducer from "./redux/status/statusesReducer";
import categoriesReducer from "./redux/category/categoriesReducer";
import employeesReducer from "./redux/employee/employeesReducer";
import assignmentsReducer from "./redux/assignment/assignmentsReducer";

const rootReducer = combineReducers({
  statuses: statusesReducer,
  categories: categoriesReducer,
  employees: employeesReducer,
  assignments: assignmentsReducer,
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
