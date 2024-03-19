import "./online.css"


function Online({ user }) {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";

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
