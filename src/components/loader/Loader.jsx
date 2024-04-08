import { CircularProgress } from "@material-ui/core";


function Loader({ cName }) {
    return (
        <span className={cName}>
            <CircularProgress color="inherit" size="25px" />
        </span>
    )
}

export default Loader
