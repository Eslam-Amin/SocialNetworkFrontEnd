import { useState, useContext, useRef, useEffect } from "react"
import { Edit, Star } from '@mui/icons-material'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { AuthContext } from "../../context/AuthContext"
import { multiFormHeader } from "../../global-links"

import { useSnackbar } from 'notistack';
import axios from "../../axios";
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
    const [image, setImage] = useState("")
    const [imageUpload, setImageUpload] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)
    const handleUploadProfilePicture = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (image !== "") {
                setUploadLoading(true)
                formData.append('media', image);
                const res = await axios.put('/users/upload/profile-picture', formData, {
                    headers: multiFormHeader,
                });
                console.log(res.data.user)
                dispatch({ type: "UPDATE_USER", payload: res.data.user });
            }
        } catch (err) {
            if (err.code === "ERR_BAC_RESPONSE")
                enqueueSnackbar("Please select a picture", { variant: "error" })
            if (err.code === "ERR_BAD_REQUEST")
                enqueueSnackbar(err.response.data.message, { variant: "error" })
            console.log(err)
        }
        finally {
            setImageUpload(false)
            setUploadLoading(false)
        }
    }
    const handleUploadPicture = (e) => {
        e.preventDefault()
        setImageUpload(true)
    }

    const handleFileChanged = (e) => {
        e.preventDefault()

        setImage(e.target.files[0]);
        setImageUpload(true)
    }

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
            setLoading(false)
        } catch (err) {
            enqueueSnackbar(err, { variant: "error" })
        }
    }
    return (
        <div className="profileTop">
            <div className="profileCover">
                <img src={user?.coverPicture ? `${PF + user.coverPicture}` : PF + "cover/No_Cover.jpg"} alt="" className="profileCoverImg" loading="lazy" />

                <div className="profilePictureSpan">
                    <label htmlFor="profilePicture">
                        <img loading="lazy" src={user.profilePicture ?
                            user.profilePicture.startsWith("http") ? user.profilePicture :
                                PF + user.profilePicture : `${PF}avatars/${user.gender}.png`} alt={user.name}
                            className="profileUserImg" />
                    </label>
                    {
                        user?._id === currentUser?._id &&
                        <span className="profilePictureUpload">
                            <input
                                type="file"
                                id="profilePicture"
                                name="profilePicture"
                                title="Upload Profile Picture"
                                style={{ display: "none" }}
                                onChange={handleFileChanged}
                            />
                            {
                                imageUpload ?
                                    uploadLoading ?
                                        <Loader
                                            cname="progress"
                                            size="20px"
                                        />
                                        :
                                        <CheckCircleRoundedIcon htmlColor="green" onClick={handleUploadProfilePicture}
                                            style={{ cursor: "pointer", fontSize: smallWindow && "1.5rem", margin: smallWindow && "5px" }} />
                                    :
                                    <label onClick={handleUploadPicture}>
                                        <Edit style={{ fontSize: "12px", marginLeft: "10px", cursor: "pointer" }}
                                        />
                                    </label>

                            }
                        </span>
                    }
                </div>
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


        </div >
    )
}

export default ProfileTop
