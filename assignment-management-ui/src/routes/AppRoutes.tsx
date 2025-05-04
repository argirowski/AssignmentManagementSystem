import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import EmployeesPage from "../pages/EmployeesPage";
import EmployeeDetails from "../features/employee/EmployeeDetails";
import AssignmentsPage from "../pages/AssignmentsPage";
import StatusesPage from "../pages/StatusesPage";
import CategoriesPage from "../pages/CategoriesPage";
import CategoryDetails from "../features/category/CategoryDetails";
import EditCategoryForm from "../features/category/EditCategoryForm";
import StatusDetails from "../features/status/StatusDetails";
import EditStatusForm from "../features/status/EditStatusForm";
import EditEmployeeForm from "../features/employee/EditEmployeeForm";
import AssignmentDetails from "../features/assignment/AssignmentDetails";
import EditAssignmentForm from "../features/assignment/EditAssignmentForm";
import AddCategoryForm from "../features/category/AddCategoryForm";
import AddStatusForm from "../features/status/AddStatusForm";
import AddEmployeeForm from "../features/employee/AddEmployeeForm";
import AddAssignmentForm from "../features/assignment/AddAssignmentForm";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/employees/new" element={<AddEmployeeForm />} />
      <Route path="/employees/:id" element={<EmployeeDetails />} />
      <Route path="/employees/:id/edit" element={<EditEmployeeForm />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/assignments/new" element={<AddAssignmentForm />} />
      <Route path="/assignments/:id" element={<AssignmentDetails />} />
      <Route path="/assignments/:id/edit" element={<EditAssignmentForm />} />
      <Route path="/statuses" element={<StatusesPage />} />
      <Route path="/statuses/new" element={<AddStatusForm />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/new" element={<AddCategoryForm />} />
      <Route path="/categories/:id" element={<CategoryDetails />} />
      <Route path="/categories/:id/edit" element={<EditCategoryForm />} />
      <Route path="/statuses/:id" element={<StatusDetails />} />
      <Route path="/statuses/:id/edit" element={<EditStatusForm />} />
    </Routes>
  );
};

export default AppRoutes;
