import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {

  const { state } = useContext(AuthContext);
  return (
    <div>
      {state.isLoggedIn? <h3>Welcome, {state.user.name}</h3>: <h3>Please Login</h3>}
    </div>
  );
}
