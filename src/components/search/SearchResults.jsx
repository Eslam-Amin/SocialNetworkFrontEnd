/* eslint-disable jsx-a11y/img-redundant-alt */
import { Link } from "react-router-dom"
import "./searchResults.css"




const PF = "https://social-media-network.netlify.app/assets/";
function SearchResults({ searchResult, search }) {
    return (

        <div className="searchResults" style={{ display: searchResult ? "block" : "none" }} >
            {

                (search.trim() && searchResult) &&
                searchResult.map((user) => (
                    <Link to={`/${user.username}`} className="linkClass " key={user._id}>
                        <ul className="searchItem">
                            <li>
                                <img src={user.profilePicture ? PF + user.profilePicture : PF + `${PF}avatars/${user.gender}.png`} className="searchImg" alt="profile picture" />
                                {user.name}
                            </li>
                        </ul>
                    </Link>
                ))

            }
        </div>
    )
}

export default SearchResults
