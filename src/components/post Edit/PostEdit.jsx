import { useRef } from "react";
import { useSnackbar } from 'notistack';

import "./postEdit.css"
import axios from "axios";

const HOST = "https://socialmediabackend-7o1t.onrender.com/api";
function PostEdit({ post, cancelPostEdit, user, editPostAndUpdateFeed }) {
    const newContent = useRef();
    const { enqueueSnackbar } = useSnackbar();

    const handleCancel = (e) => {
        e.preventDefault();
        cancelPostEdit();
    }


    const handleEditPost = async (e) => {
        e.preventDefault();
        if (newContent.current.value.trim().length !== 0) {
            try {
                await axios.put(HOST + "/posts/" + post._id, { userId: user._id, content: newContent.current.value.trim() });
                cancelPostEdit();
                enqueueSnackbar("post Edited Successfully! ", { variant: "success" })
                editPostAndUpdateFeed(post, newContent.current.value.trim())
            } catch (err) {
                console.log(err);
            }
        } else {
            enqueueSnackbar("You can't share an empty post", { variant: "info" })
        }

    }
    return (

        <div className="postEditWrapper">
            <form className="editWrapper">
                <textarea className="editInput" autoFocus defaultValue={post.content} ref={newContent} />
                <div className="editBottom">
                    <button className="shareBtn btn" onClick={handleEditPost}>Save</button>
                    <button className="cancelBtn btn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>

    )
}




export default PostEdit
