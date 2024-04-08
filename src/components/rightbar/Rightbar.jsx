import "./rightbar.css"

import HomeRightbar from "./HomeRightbar";
import ProfileRightbar from "./ProfileRightbar";

function Rightbar({ user }) {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    return (
        user ?
            <ProfileRightbar user={user} />
            :
            !smallWindow &&
            <HomeRightbar />
    )
}




export default Rightbar
