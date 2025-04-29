import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Employee from "../components/Employee";
import EmployeeDetails from "../components/EmployeeDetails";
import Assignments from "../components/Assignments";
import Statuses from "../components/Statuses";
import Categories from "../components/Categories";
import CategoryDetails from "../components/CategoryDetails";
import EditCategory from "../components/EditCategory";
import StatusDetails from "../components/StatusDetails";
import EditStatus from "../components/EditStatus";
import EditEmployee from "../components/EditEmployee";
import AssignmentDetails from "../components/AssignmentDetails";
import EditAssignment from "../components/EditAssignment";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/employees" element={<Employee />} />
      <Route path="/employees/:id" element={<EmployeeDetails />} />
      <Route path="/employees/:id/edit" element={<EditEmployee />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/assignments/:id" element={<AssignmentDetails />} />
      <Route path="/assignments/:id/edit" element={<EditAssignment />} />
      <Route path="/statuses" element={<Statuses />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:id" element={<CategoryDetails />} />
      <Route path="/categories/:id/edit" element={<EditCategory />} />
      <Route path="/statuses/:id" element={<StatusDetails />} />
      <Route path="/statuses/:id/edit" element={<EditStatus />} />
    </Routes>
  );
};

export default AppRoutes;
