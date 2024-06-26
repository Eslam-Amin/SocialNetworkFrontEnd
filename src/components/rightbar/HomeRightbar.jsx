import "./rightbar.css"
import Advertisement from '../advertisement/Advertisement';
import { Users } from './../../dummyData';
import Online from "../Online/Online"

import { PF } from "../../global-links"
function HomeRightbar() {
    return (
        <div className="rightBar">
            <div className="rightBarWrapper">
                <Advertisement />
                <img loading="lazy" src={`${PF}friendsImage.png`} alt="" className="rightBarAd" />
                <h4 className="rightBarTitle">Online Friends</h4>
                <ul className="rightBarFriendList">
                    {
                        Users.map((u) => (
                            <Online key={u.id} user={u} />
                        ))
                    }
                </ul>
            </div>
        </div>)
}

export default HomeRightbar
