import { useRef } from "react";
import { useSnackbar } from 'notistack';

import "./postEdit.css"
import axios from "axios";

import { HOST } from "../../global-links"
function PostEdit({ post, cancelPostEdit, user, editPostAndUpdateFeed }) {
    const newContent = useRef();
    const { enqueueSnackbar } = useSnackbar();

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    const handleCancel = (e) => {
        e.preventDefault();
        cancelPostEdit();
    }


    const handleEditPost = async (e) => {
        e.preventDefault();
        if (newContent.current.value.trim().length !== 0) {
            try {
                await axios.put("/posts/" + post._id, { userId: user._id, content: newContent.current.value.trim() }, { headers });
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

        <div className="postEditWrapper" >
            <form className="editWrapper">
                <textarea className="editInput" autoFocus
                    defaultValue={post.content} ref={newContent} />
                <div className="editBottom">
                    <button className="shareBtn postEditBtn" onClick={handleEditPost}>Save</button>
                    <button className="cancelBtn postEditBtn" onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>

    )
}




export default PostEdit
