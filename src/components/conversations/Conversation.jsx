import { PF } from "../../global-links"
import "./conversation.css"

function Conversation({ receiver }) {
    return (
        <div className="conversation">
            <img loading="lazy" src={receiver?.profilePicture ?
                receiver?.profilePicture.startsWith("http") ? receiver?.profilePicture :
                    PF + receiver?.profilePicture : `${PF}avatars/${receiver?.gender}.png`}
                className="conversationImg" alt={receiver?.name + " image"} />
            <span className="conversationName">{receiver?.name}</span>
        </div>
    )
}

export default Conversation
