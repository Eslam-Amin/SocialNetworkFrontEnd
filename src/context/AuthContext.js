import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";

const fetchUser = async () => {
    if (localStorage.getItem("user") !== null) {
        const user = (localStorage.getItem("user"));
        return JSON.parse(user);
    }
}

const currentUser = await fetchUser();
const INITIAL_STATE = {
    user: currentUser ? currentUser : null,
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}

