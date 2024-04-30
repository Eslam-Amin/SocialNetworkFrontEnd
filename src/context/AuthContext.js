import { createContext, useReducer } from "react"
import AuthReducer from "./AuthReducer";
import axios from "../axios";

const token = localStorage.getItem("token");
let user = null;
const getData = async () => {

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    if (token !== null) {
        const currentUser = await axios.get(`/users/authenticate-user`, { headers })

        console.log(currentUser.data.user)

        user = currentUser.data.user
        return { user, token };
    }
}

await getData();
const INITIAL_STATE = {
    // user: await getData().user,
    user,
    token,
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

