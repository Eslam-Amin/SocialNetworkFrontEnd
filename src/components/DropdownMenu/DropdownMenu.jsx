import "./dropdownMenu.css"


function DropdownMenu({ onHandleDeletePost,
    onHandleEditPost,
    sameUser }) {
    return (
        <div className="dropdownProfile">
            <ul className="moreList">
                {sameUser ?
                    <>
                        <li onClick={onHandleEditPost}>Edit</li>
                        <hr />
                        <li onClick={onHandleDeletePost}>Delete</li>
                    </>
                    :
                    <li>Save</li>
                }
            </ul>

        </div>
    )
}

export default DropdownMenu
