import "./online.css"


import { PF } from "../../global-links"
function Online({ user }) {

    return (


        <li className="rightBarFriend">
            <div className="rightBarProfileImgContainer">
                <img loading="lazy" src={PF + user?.profilePicture} alt="" className="rightBarProfileImg" />
                <span className="rightBarOnline"></span>
            </div>
            <span className="rightBarUsername">{user?.username}</span>

        </li>


    )
}

export default Online
