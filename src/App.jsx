import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";

export default function App() {

  return (

    <AuthProvider>

      <Navbar />

      <Login />

      <Dashboard />

    </AuthProvider>

  );
}