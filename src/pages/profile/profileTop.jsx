import { useState, useContext, useRef, useEffect } from "react"
import { Edit, Star } from '@mui/icons-material'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { AuthContext } from "../../context/AuthContext"

import { useSnackbar } from 'notistack';
import axios from "../../axios.js";
import { HOST, PF } from "../../global-links"
import Loader from "../../components/loader/Loader";

function ProfileTop({
    user,
    smallWindow
}) {
    const { enqueueSnackbar } = useSnackbar();

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
    const editDescReff = useRef();
    const [openedDescEdit, setOpenedDescEdit] = useState(false);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const [userDesc, setUserDesc] = useState(user?.desc);
    const [loading, setLoading] = useState(false);


    const handleOpenEditDesc = () => {
        setOpenedDescEdit(true);
    }

    const handleCancelDescEdit = () => {
        setOpenedDescEdit(false);
    }

    useEffect(() => {
        setUserDesc(user.desc)

    }, [user])

    const handleDescEdit = async () => {
        try {
            setLoading(true)
            const res = await axios.put("/users/updateDesc/" + user?._id, { desc: editDescReff.current.value.trim() !== "" ? editDescReff.current.value.trim() : user.desc }, { headers });

            setUserDesc(res.data.updatedUser.desc);
            enqueueSnackbar("Description Updated Successfully!", { variant: "success" })

            setOpenedDescEdit(false);

            dispatch({ type: "UPDATE_USER", payload: res.data.updatedUser });
            // localStorage.setItem("user", JSON.stringify(res.data.updatedUser))
            setLoading(false)
        } catch (err) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }
    return (
        <div className="profileTop">
            <div className="profileCover">
                <img src={user?.coverPicture ? `${PF + user.coverPicture}` : PF + "cover/No_Cover.jpg"} alt="" className="profileCoverImg" loading="lazy" />
                <img src={user?.profilePicture ? `${PF + user.profilePicture}` : `${PF}avatars/${user.gender}.png`} alt="" className="profileUserImg" loading="lazy" />
            </div>

            <div className="profileInfo">
                <div className="profileName">
                    <h4 className="profileInfoName">{user.name}
                    </h4>
                    {user.isAdmin &&
                        <span title="Verified Badge">
                            <Star htmlColor="#1877f2" className="verifiedBadge" />
                        </span>

                    }
                </div>
                {
                    !openedDescEdit ?
                        <div className="profileInfoDesc">

                            {userDesc}
                            {
                                user?._id === currentUser?._id &&
                                <Edit style={{ fontSize: "15px", marginLeft: "10px", cursor: "pointer" }}
                                    onClick={handleOpenEditDesc} />
                            }
                        </div>
                        :
                        user?._id === currentUser?._id &&

                        <div className="editDescDiv" >
                            <input type="text" className="editDescInput"
                                autoFocus
                                defaultValue={userDesc}
                                placeholder={userDesc}
                                ref={editDescReff}
                            />
                            {
                                loading ?
                                    <Loader
                                        cname="progress"
                                        size="20px"
                                        style={{ marginLeft: "10px" }} />
                                    :
                                    <>
                                        <CheckCircleRoundedIcon htmlColor="green" onClick={handleDescEdit}
                                            style={{ cursor: "pointer", fontSize: smallWindow && "1.5rem", margin: smallWindow && "5px" }} />
                                        <CancelRoundedIcon htmlColor="red" onClick={handleCancelDescEdit}
                                            style={{ cursor: "pointer", fontSize: smallWindow && "1.5rem", margin: smallWindow && "5px" }} />

                                    </>
                            }

                        </div>

                }
            </div>


        </div>
    )
}

export default ProfileTop
