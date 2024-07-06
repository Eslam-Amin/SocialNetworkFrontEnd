import "./messenger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversations/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext, useEffect, useRef, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "../../axios"
import { io } from "socket.io-client"
import { PF } from "../../global-links"
import Loader from "../../components/loader/Loader";


function Messenger() {
    const smallWindow = window.matchMedia("(max-width:480px)").matches;
    const [conversations, setConversations] = useState([])
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [socket, setSocket] = useState(null);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const newMessageRef = useRef();
    const scrollRef = useRef();
    const socketRef = useRef();
    const username = useRef();
    const [page, setPage] = useState(2);
    const [searchResult, setSearchResult] = useState([]);
    const [searchOpened, setSearchOpened] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext)




    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("/conversation/" + user._id);
                setConversations(res.data.conversations);
            } catch (error) {
                console.log(error)
            }
        }
        getConversations();
    }, [])

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get("/message/" + currentChat?._id);
                // console.log(res.data)
                setMessages([...res.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))])
            } catch (error) {
                console.log(error)
            }
        }
        getMessages()
        setPage(2);
        setNoMoreMessages(false);
    }, [currentChat])

    useEffect(() => {
        //https://messengerbackend-yte5.onrender.com/
        socketRef.current = io("https://messengerbackend-yte5.onrender.com/");

        socketRef.current.on("getMessage", data => {
            setArrivalMessage({
                sender: {
                    _id: data.senderId,
                    profilePicture: data.profilePicture,
                    gender: data.gender,
                    isAdmin: data.isAdmin,
                },
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [])


    useEffect(() => {

        // const membersId = currentChat?.members?.map((member) => member.id);
        // console.log(membersId)
        const memberFound = currentChat?.members?.some((member) => member._id === arrivalMessage?.sender?._id);
        if (arrivalMessage && memberFound) {
            setMessages(prev => [...prev, arrivalMessage])
        }
    }, [arrivalMessage, currentChat])
    //Whenever a message is sent it will scroll to it
    useEffect(() => {

        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])



    useEffect(() => {
        socketRef.current.emit("addUser", user)
        socketRef.current.on("getOnlineUsers", users => {
            setOnlineUsers(users)
        })
    }, [user])

    useEffect(() => {
        socketRef.current.emit("removeUser", user)
        socketRef.current.on("getOnlineUsers", users => {
            setOnlineUsers(users)
        })
    }, [user])


    // useEffect(() => {
    //     socketRef.current.emit("disconnect")
    //     socketRef.current.on("getOnlineUsers", users => {
    //         setOnlineUsers(users)
    //     })
    // }, [user])





    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessageRef.current.value.trim().length !== 0) {
            const message = {
                sender: user._id,
                text: newMessageRef.current.value.trim(),
                conversation: currentChat._id
            };
            try {
                const sentMessage = newMessageRef.current.value.trim();
                newMessageRef.current.value = ""

                const res = await axios.post("/message", message);
                setMessages(messages => [...messages, res.data.message])

                socketRef.current.emit("sendMessage", {
                    sender: user,
                    receiverId: currentChat.members.find(member => member._id !== user._id)._id,
                    text: sentMessage
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    const handleCreateNewConversation = async (receiver) => {
        try {
            const res = await axios.post("/conversation", { receiver })
            setConversations(prev => [...prev, res.data.conversation])
        } catch (error) {
            console.log(error)
        }
        finally {
            username.current.value = ""
            setSearchOpened(false)
        }
    }
    const searchUser = async () => {
        if (username.current.value.trim() === "") {
            setSearchOpened(false);
        }
        else {
            try {
                const res = await axios.get("/users/search?username=" + username.current.value);
                setSearchResult(res.data);
                setSearchOpened(true);
            }
            catch (err) {
                console.log(err);
                setSearchResult(false)
            }
        }
    }

    const loadMoreMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/message/" + currentChat?._id + "?page=" + page);
            setMessages(messages => [...res.data.messages, ...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)))
            if (res.data.messages.length === 0) setNoMoreMessages(true)
            setPage(page => page + 1);
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    const handleScrollTo = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    return (
        <>
            <Topbar messenger={true} />

            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search For friends" className="chatMenuInput"
                            type="text"
                            ref={username}
                            onChange={searchUser}
                            onFocus={searchUser}
                        />
                        <div className="searchResultsMessenger" style={{ display: searchResult ? "block" : "none" }} >
                            {

                                (username.current?.value && searchResult) &&
                                searchResult.map((user) => (
                                    <ul className="searchItemMessenger" onClick={() => handleCreateNewConversation(user._id)}>
                                        <li>

                                            <img loading="lazy"
                                                src={user.profilePicture ?
                                                    user.profilePicture.startsWith("http") ? user.profilePicture :
                                                        PF + user.profilePicture : `${PF}avatars/${user.gender}.png`}
                                                className="searchImg messengerSearchImg" alt="profile picture" />

                                        </li>
                                        <li className="messengerSearchName">
                                            {user.name}
                                        </li>
                                    </ul>
                                ))

                            }
                        </div>
                        {
                            conversations?.map((conversation) => (
                                <div onClick={() => setCurrentChat(conversation)}>
                                    <Conversation
                                        receiver={conversation.members.find(member => member._id !== user._id)}
                                        key={conversation._id}
                                    />
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                <>

                                    <div className="chatBoxTop">
                                        {
                                            loading ?
                                                <Loader cName="progress messengerLoader" size="18px" />
                                                :
                                                noMoreMessages ?

                                                    <span className="loadMoreMessages"
                                                    >
                                                        No More Messages To View
                                                    </span>
                                                    :
                                                    <span className="loadMoreMessages"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={loadMoreMessages}
                                                    >
                                                        Load More
                                                    </span>
                                        }
                                        {
                                            messages.map((message) => (
                                                <div ref={scrollRef}>
                                                    <Message message={message} own={message.sender._id === user._id} />
                                                </div>
                                            ))

                                        }

                                    </div>
                                    <div className="chatBoxBottom">
                                        <textarea className="chatMessageInput" ref={newMessageRef}
                                            // onChange={(e) => newMessageRef = e.target.value}
                                            placeholder="your message..." ></textarea>

                                        <button className="chatSendBtn" onClick={handleSendMessage}>
                                            {smallWindow ?
                                                ">" : "Send"
                                            }
                                        </button>
                                    </div>
                                </>
                                :
                                <span className="noConversationSpan">Open a conversation to start a chat</span>
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        {
                            onlineUsers.map((onlineUser) => (
                                user._id !== onlineUser.user._id &&
                                <div onClick={() => handleCreateNewConversation(onlineUser.user._id)}>

                                    <ChatOnline onlineUser={onlineUser.user} />
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>

        </>
    )
}

export default Messenger
