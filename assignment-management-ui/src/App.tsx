import AppNavbar from "./components/Navbar";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <AppNavbar />
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
