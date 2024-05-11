import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";


const getData = () => {
    const pathName = window.location.pathname;
    if (pathName !== "/login" && pathName !== "/register")
        window.location.replace("/login");
}


getData();
const INITIAL_STATE = {
    // user: await getData().user,
    user: JSON.parse(localStorage.getItem("user")),
    token: sessionStorage.getItem("token"),
    isFetching: false,
    error: false
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            isFetching: state.isFetching,
            error: state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    )
}

