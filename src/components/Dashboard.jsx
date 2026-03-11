import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { state, dispatch } = useContext(AuthContext);
  if (!state.isLoggedIn) {
    return null;
  }
  function handleLogout() {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLogout}> Logout</button>
    </div>
  );
}