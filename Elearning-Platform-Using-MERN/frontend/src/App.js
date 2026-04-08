import { useSelector } from "react-redux";
import AllRoute from "./routes/AllRoute";
import UserNavbar from "./components/UserComponents/UserNavbar";
import Navbar from "./Pages/Navbar";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

function App() {
  const userStore = useSelector((store) => store.UserReducer);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Routes that shouldn't show the global navbars (e.g., login, signup)
  const noNavRoutes = ["/login", "/signup"];
  const isNoNavRoute = noNavRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!isNoNavRoute && (
        userStore?.token || user?.token ? <UserNavbar /> : <Navbar />
      )}
      <Box pt={!isNoNavRoute ? "80px" : 0}>
        <AllRoute />
      </Box>
    </div>
  );
}

export default App;
