import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <AppNavBar />
        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
