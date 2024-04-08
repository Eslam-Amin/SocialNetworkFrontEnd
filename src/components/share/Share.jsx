import { useContext, useRef } from "react";
import "./share.css"
import { useSnackbar } from 'notistack';

import { PermMedia, Label, Room, EmojiEmotions } from '@mui/icons-material';
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";

import axios from 'axios';
import Loader from "../loader/Loader";

const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
const PF = "https://social-media-network.netlify.app/assets/";
function Share({ refreshFeed, addPostAndUpdateFeed }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const content = useRef();
    const smallWindow = window.matchMedia("(max-width:480px)").matches;

    const handleShare = async (e) => {

        e.preventDefault();
        setLoading(true);
        if (content.current.value.trim().length !== 0) {
            const newPost = {
                userId: user._id,
                content: content.current.value.trim(),
            }
            try {
                const newp = await axios.post(HOST + "/posts", newPost);
                addPostAndUpdateFeed(newp.data);
                content.current.value = "";
            } catch (err) {

            }
        }
        else {
            enqueueSnackbar("You can't share an empty post", { variant: "info" })
        }
        setLoading(false);
    }



    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ? `${PF + user.profilePicture}` : `${PF}avatars/${user.gender}.png`} alt="" className="shareProfileImg" />
                    {
                        loading ?
                            <Loader cName="sharePorfileImg" />
                            :
                            <textarea ref={content} type="text" className="shareInput" placeholder={`What's in Your Mind, ${user.name}?`} />
                    }
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
