import { Link } from "react-router-dom"
import "./searchResults.css"




function SearchResults({ searchResult }) {
    const PF = " https://funny-crepe-a4bd78.netlify.app/assets/";


    console.log(searchResult);
    return (

        <div className="searchResults" style={{ display: searchResult ? "block" : "none" }} >

            {
                searchResult ?
                    searchResult.map((user) => (
                        <Link to={`/${user.username}`} className="linkClass " key={user._id}>
                            <ul className="searchItem">
                                <li>
                                    <img src={PF + user.profilePicture} className="searchImg"></img>{user.name}</li>
                            </ul>
                        </Link>
                    )) : ""

            }
        </div>
    )
}

export default SearchResults
