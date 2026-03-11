import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const { state, dispatch } = useContext(AuthContext);

  if (state.isLoggedIn) {
    return null;  
  }

  function handleLogin() {
    dispatch({
      type: "LOGIN",
      payload: "Seventeen"
    });
  }

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
}