import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";
import axios from "../axios";
import { HOST } from "../global-links";


const getData = async () => {
    if (localStorage.getItem("userLoggedIn")) {
        try {
            const res = await axios.get(HOST + "/users/authenticate-user");
            return res.data.user;
        }
        catch (err) {
            console.log(err, " in getData line 14")
            localStorage.clear();
        }
    }
    else
        return false;

}


const INITIAL_STATE = {
    // user: await getData().user,
    user: await getData(),
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

