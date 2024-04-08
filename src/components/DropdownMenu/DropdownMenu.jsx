import "./dropdownMenu.css"


function DropdownMenu({ post, onHandleDeletePost, onHandleEditPost }) {
    return (
        <div className="dropdownProfile">
            <ul className="moreList">
                <li onClick={onHandleEditPost}>Edit</li>
                <hr />
                <li onClick={onHandleDeletePost}>Delete</li>

            </ul>

        </div>
    )
}

export default DropdownMenu
