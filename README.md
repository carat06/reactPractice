# Problem Description
Create a React application where a user can log in and log out, and the login state should be accessible across multiple components without using prop drilling.
# Requirements
 State Management using useReducer 
Use the useReducer hook to manage authentication state.
The state should include:
isLoggedIn (boolean)
user (object containing name)
Implement the following actions:
LOGIN
LOGOUT
 Global State Sharing using useContext 
Create an AuthContext using createContext.
Wrap the application inside AuthContext.Provider.
Provide the authentication state and dispatch function to child components.
Component Implementation 
Create the following components:
Login Component
Displays a login button.
Dispatches the LOGIN action with a username.
Navbar Component
Displays “Welcome, Username” when logged in.
Displays “Please Login” when logged out.
Dashboard Component
Visible only when the user is logged in.
Contains a logout button.
 Usage of Hooks and Proper Flow 
Use useContext to access authentication data in components.
Ensure proper state flow:
User Action → Dispatch → Reducer → State Update → UI Re-render
Expected Outcome
The application should update UI dynamically based on login state.
No props should be passed manually between components.
State management should be centralized and predictable
