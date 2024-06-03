import "./topbar.css"
import { Search, Person, Notifications, Chat, ArrowBackIos } from '@mui/icons-material'
import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import axios from "../../axios";
import SearchResults from "../search/SearchResults";
import { HOST, PF } from "../../global-links"
import { jsonHeader } from "../../global-links"

function Topbar({ profile }) {

    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const { user } = useContext(AuthContext);
    let searchRef = useRef();
    const username = useRef();
    const [searchResult, setSearchResult] = useState([]);
    const [searchOpened, setSearchOpened] = useState(false);
    const searchUser = async () => {
        if (username.current.value.trim() === "") {
            setSearchOpened(false);
        }
        else {
            try {
                const res = await axios.get(HOST + "/users/search?username=" + username.current.value, { headers: jsonHeader });
                setSearchResult(res.data);
                setSearchOpened(true);
            }
            catch (err) {
                console.log(err);
                setSearchResult(false)
            }
        }
    }



    useEffect(() => {
        const closeOutSide = (e) => {
            if (!searchRef.current?.contains(e.target))
                setSearchOpened(false);
        };
        document.addEventListener("click", closeOutSide)
        return () => {
            document.removeEventListener("click", closeOutSide);
        }
    })
    return (
        <div className="topbarContainer">
            {
                smallWindow ? profile ?
                    <div className="topbarLeft">
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <span className="logo">
                                <ArrowBackIos style={{ fontSize: "1.2rem" }} />
                            </span>
                        </Link>
                    </div> :
                    ""
                    :
                    <div className="topbarLeft">
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <span className="logo">
                                Social Network
                            </span>
                        </Link>
                    </div>
            }

            <div className="topbarCenter">
                <div className="searchBar">
                    <Search className="searchIcon" />
                    <input className="searchInput"
                        type="text"
                        placeholder="Search for friends, groups or posts"
                        ref={username}
                        onChange={searchUser}
                        onFocus={searchUser}

                    />
                </div>
                {
                    (searchOpened && username.current.value.trim() !== "") &&
                    <SearchResults searchResult={searchResult} ref={searchRef} search={username.current.value} />
                }

            </div>
            <div className="topbarRight">
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">
                            4
                        </span>
                    </div>

                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">
                            6
                        </span>
                    </div>
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">
                            7
                        </span>
                    </div>

                </div>
                <Link to={`/${user?.username}`}>
                    <img loading="lazy" src={user.profilePicture ? `${PF + user.profilePicture}` : `${PF}avatars/${user.gender}.png`} alt="" className="topbarImg" />
                </Link>
            </div>

        </div>

    )
}

export default Topbar
