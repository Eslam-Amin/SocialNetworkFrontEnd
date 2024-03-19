import { useContext, useRef, useEffect } from "react";
import "./share.css"

import { PermMedia, Label, Room, EmojiEmotions } from '@mui/icons-material';
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';


function Share() {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";

    const { user } = useContext(AuthContext);
    const content = useRef();
    const smallWindow = window.matchMedia("(max-width:480px)").matches;


    const handleShare = async (e) => {
        e.preventDefault();
        console.log(content.current.value);
        if (content.current.value !== "") {
            const newPost = {
                userId: user._id,
                content: content.current.value,
            }
            try {

                await axios.post(HOST + "/posts", newPost);
                content.current.value = "";
            } catch (err) {

            }
        }

    }



    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? `${PF + user.profilePicture}` : `${PF}/person/noProfile.png`} alt="" className="shareProfileImg" />
                    <textarea ref={content} type="text" className="shareInput" placeholder={`What's in Your Mind, ${user.name}?`} />
                </div>
                <hr className="shareHr" />
                <form className="shareBottom" onSubmit={handleShare}>
                    <div className="shareOptions">
                        <div className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon" style={{ fontSize: smallWindow ? "1rem" : "" }} />
                            <span className="shareOptionText">Photo Or Video</span>
                        </div>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon" style={{ fontSize: smallWindow ? "1rem" : "" }} />
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon" style={{ fontSize: smallWindow ? "1rem" : "" }} />
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon" style={{ fontSize: smallWindow ? "1rem" : "" }} />
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareBtn" type="submit">Share</button>
                </form>
            </div>
        </div>
    );
}

export default Share
