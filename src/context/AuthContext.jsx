import { createContext, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
  isLoggedIn: false,
  user: null
};

function authReducer(state, action) {

  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: { name: action.payload }
      };

    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {

  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}