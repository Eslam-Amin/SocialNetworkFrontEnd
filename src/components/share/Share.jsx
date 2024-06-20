import { useContext, useRef } from "react";
import "./share.css"
import { useSnackbar } from 'notistack';

import { PermMedia, Label, Room, EmojiEmotions } from '@mui/icons-material';
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";

import axios from '../../axios';
import Loader from "../loader/Loader";
import { PF } from "../../global-links"
import { multiFormHeader } from "../../global-links"

function Share({ addPostAndUpdateFeed }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(false)

    const { user } = useContext(AuthContext);
    const content = useRef();
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const handleShare = async (e) => {

        e.preventDefault();
        setLoading(true);
        if (
            image || content.current.value.trim().length !== 0
        ) {
            let formData = new FormData();
            formData.append('media', image);
            formData.append("updatedAt", new Date().getTime())
            formData.append("createdAt", new Date().getTime())
            formData.append("content", content.current.value.trim())

            try {
                content.current.value = "";
                const newp = await axios.post("/posts", formData, {
                    headers: multiFormHeader,
                });
                addPostAndUpdateFeed(newp.data);
            } catch (err) {
                if (err.code === "ERR_BAC_RESPONSE")
                    enqueueSnackbar("Please select a picture", { variant: "error" })
                if (err.code === "ERR_BAD_REQUEST")
                    enqueueSnackbar(err.response.data.error, { variant: "error" })
                console.log(err)
            }
            finally {
                formData = {}
                setImage(false)
            }
        }
        else {
            enqueueSnackbar("You can't share an empty post", { variant: "info" })
        }
        setLoading(false);
    }

    const handleFileChanged = (e) => {
        e.preventDefault()
        setImage(e.target.files[0]);
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={user.profilePicture ?
                        user.profilePicture.startsWith("http") ? user.profilePicture :
                            PF + user.profilePicture : `${PF}avatars/${user.gender}.png`}
                        alt="" className="shareProfileImg" />
                    {
                        (loading && image) ?
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
                            <label htmlFor="postFile" className="shareOptionText">Photo Or Video</label>
                        </div>
                        <input
                            disabled={loading}
                            type="file"
                            id="postFile"
                            name="postFile"
                            style={{ display: "none" }}
                            onChange={handleFileChanged}
                        />
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
            </div >
        </div >
    );
}

export default Share
