import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";
import axios from "axios";

const fetchUser = async () => {
    if (localStorage.getItem("userId") !== null) {
        console.log("I'm Here in Auth Context")
        const userId = (localStorage.getItem("userId"));
        const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
        const res = await axios.get(HOST + "/users?userId=" + userId);
        return res.data;
    }
}



const currentUser = await fetchUser();
const INITIAL_STATE = {
    user: currentUser ? currentUser : null,
    isFetching: false,
    error: false
}
//if (localStorage.getItem("user") !== null) { INITIAL_STATE.user = JSON.parse(localStorage.getItem("user")) };

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

