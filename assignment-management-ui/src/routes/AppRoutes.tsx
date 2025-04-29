import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Employee from "../components/Employee";
import Assignments from "../components/Assignments";
import Statuses from "../components/Statuses";
import Categories from "../components/Categories";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/employees" element={<Employee />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/statuses" element={<Statuses />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  );
};

export default AppRoutes;
