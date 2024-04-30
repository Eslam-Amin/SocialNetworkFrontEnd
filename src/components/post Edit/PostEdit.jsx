import { useRef, useState } from "react";
import { useSnackbar } from 'notistack';

import "./postEdit.css"
import axios from "../../axios";
import Loader from "../loader/Loader";

function PostEdit({ post, cancelPostEdit, user, editPostAndUpdateFeed }) {
    const newContent = useRef();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false)
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
        setLoading(true)
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
        setLoading(false)
    }
    return (

        <div className="postEditWrapper" >
            <form className="editWrapper">
                <textarea className="editInput" autoFocus
                    defaultValue={post.content} ref={newContent} />
                <div className="editBottom">
                    <button className="shareBtn postEditBtn" disabled={loading} onClick={handleEditPost}> {
                        loading ?
                            <Loader size="17px" />
                            :
                            "Save"
                    }</button>
                    <button className="cancelBtn postEditBtn" disabled={loading} onClick={handleCancel}> {
                        loading ?
                            <Loader size="17px" />
                            :
                            "Cancel"
                    }</button>
                </div>
            </form>
        </div>

    )
}




export default PostEdit
