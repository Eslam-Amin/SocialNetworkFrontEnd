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

        <div className="editComment">
            <textarea ref={newContent} type="text"
                className="commentInput" defaultValue={`${post.content}`} autoFocus
            />
            <div className="editBtns">
                {
                    <>
                        <button className="editBtn saveEditBtn" disabled={loading} onClick={handleEditPost}>
                            {
                                loading ?
                                    <Loader size="13px" />
                                    :
                                    "Save"
                            }
                        </button>
                        <button className="editBtn cancelBtn" disabled={loading} onClick={handleCancel}>Cancel</button>
                    </>
                }
            </div>
        </div>

    )
}




export default PostEdit
