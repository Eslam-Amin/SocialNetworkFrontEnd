import "./advertisement.css"

function Advertisement() {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";

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
