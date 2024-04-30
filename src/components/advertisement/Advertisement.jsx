import "./advertisement.css"

import { PF } from "../../global-links"
function Advertisement() {

    return (
        <div className="birthdayContainer">
            <img loading="lazy" src={`${PF}gift.png`} alt="" className="birthdayImg" />
            <span className="birthdayText">
                <b>Pola Foster</b> and <b>3 other Friends </b> have a birthday Today!
            </span>
        </div>
    )
}

export default Advertisement
