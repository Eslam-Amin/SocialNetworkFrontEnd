import { useContext, useEffect, useState } from "react";
import "./dropdownMenu.css"
import { useSnackbar } from 'notistack';


import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

function DropdownMenu({ post }) {
    const HOST = "https://socialmediabackend-7o1t.onrender.com/api";

    const { user: currentUser } = useContext(AuthContext)
    const { enqueueSnackbar } = useSnackbar();
    const [editFlagClicked, setEditFlagClicked] = useState(false);
    const handleDeletePost = async (e) => {
        try {
            await axios.delete(`${HOST}/posts/${post._id}`, { data: { userId: currentUser._id } });
            enqueueSnackbar("post Deleted Successfully! ", { variant: "success" })
        } catch (err) {
            enqueueSnackbar(err.response.data, { variant: 'error' });
            console.log(err.response.data);
        }
    }

    const handleEditPost = () => {
        setEditFlagClicked(true);
    }
    return (
        editFlagClicked,
        <div className="dropdownProfile">
            <ul className="moreList">
                <li onClick={handleEditPost}>Edit</li>
                <hr />
                <li onClick={handleDeletePost}>Delete</li>

            </ul>

        </div>
    )
}

export default DropdownMenu
