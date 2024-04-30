import { CircularProgress } from "@material-ui/core";


function Loader({ cName, size = "25px" }) {
    return (
        <span className={cName}>
            <CircularProgress color="inherit" size={size} />
        </span>
    )
}

export default Loader
