import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Model from '../components/Model';
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { VscHubot } from "react-icons/vsc";
import { fetchMessages, sendMessage, uploadFile } from '../apis/messages';
import { fetchAiResponse } from '../apis/ai';
import { setOnlineUsers } from '../redux/onlineUsersSlice';
import MessageHistory from '../components/MessageHistory';
import io from "socket.io-client";
import "./home.css";
import { fetchChats, setNotifications } from '../redux/chatsSlice';
import Loading from '../components/ui/Loading';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getChatName, getChatUser, getChatPhoto } from '../utils/logics';
import Typing from '../components/ui/Typing';
import { validUser } from '../apis/auth';

const ENDPOINT = process.env.REACT_APP_SERVER_URL;
let socket, selectedChatCompare;

function Chat(props) {
    const { activeChat, notifications } = (useSelector((state) => state.chats) || {});
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const activeUser = useSelector((state) => state.activeUser);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const { users: onlineUsers } = useSelector((state) => state.onlineUsers);
    
    const [typing, setTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const isAiChat = !!activeChat?.personality;

    const isUserOnline = () => {
        if (!activeChat || activeChat.isGroup || isAiChat) return false;
        const chatUser = getChatUser(activeChat, activeUser);
        return onlineUsers.includes(chatUser?._id);
    };

    const handleSendMessage = async (messageContent) => {
        if (!activeChat || (messageContent.text && !messageContent.text.trim())) return;

        setMessage("");
        setShowPicker(false);

        const userMessage = {
            _id: Date.now(),
            sender: { _id: activeUser.id, name: activeUser.name, profilePic: activeUser.profilePic },
            message: messageContent,
            createdAt: new Date().toISOString()
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        if (isAiChat) {
            setIsTyping(true);
            const aiResponse = await fetchAiResponse({
                message: messageContent.text,
                personality: activeChat.personality
            });
            setIsTyping(false);

            if (aiResponse) {
                const aiMessage = {
                    _id: Date.now() + 1,
                    sender: { _id: activeChat._id, name: activeChat.chatName, profilePic: activeChat.photo },
                    message: { text: aiResponse.message },
                    createdAt: new Date().toISOString()
                };
                setMessages((prevMessages) => [...prevMessages, aiMessage]);
            }
        } else {
            socket.emit("stop typing", activeChat._id);
            setTyping(false);
            const data = await sendMessage({ chatId: activeChat._id, message: messageContent });
            if (data) {
                socket.emit("new message", data);
                setMessages((prevMessages) =>
                    prevMessages.map((msg) => (msg._id === userMessage._id ? data : msg))
                );
                dispatch(fetchChats());
            }
        }
    };
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileSizeInMB = file.size / 1024 / 1024;
        if (fileSizeInMB > 10) {
            alert("File size exceeds 10 MB. Please choose a smaller file.");
            e.target.value = null;
            return;
        }
        setIsUploading(true);
        const fileData = await uploadFile(file);
        setIsUploading(false);
        if (fileData && fileData.url) {
            handleSendMessage({ url: fileData.url, filename: fileData.filename });
        }
        e.target.value = null;
    };
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", activeUser);
        socket.on("connected", () => {});
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        socket.on('onlineUsers', (users) => dispatch(setOnlineUsers(users)));
        return () => { socket.disconnect(); };
    }, [activeUser, dispatch]);

    useEffect(() => {
        if (isAiChat && activeChat) {
            // Create the intro message object
            const introMsg = {
                _id: 'intro-msg',
                sender: { _id: activeChat._id, name: activeChat.chatName, profilePic: activeChat.photo },
                message: { text: activeChat.introMessage },
                createdAt: new Date().toISOString()
            };
            setMessages([introMsg]); // Start the chat with the intro message
            setLoading(false);
        } else {
            const fetchMessagesFunc = async () => {
                if (activeChat) {
                    setLoading(true);
                    const data = await fetchMessages(activeChat._id);
                    setMessages(data);
                    socket.emit("join room", activeChat._id);
                    setLoading(false);
                }
            };
            fetchMessagesFunc();
        }
        selectedChatCompare = activeChat;
    }, [activeChat, isAiChat]);

    useEffect(() => {
        const messageReceivedHandler = (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatId._id) {
                if (!notifications.some(n => n._id === newMessageRecieved._id)) {
                    dispatch(setNotifications([newMessageRecieved, ...notifications]));
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
            dispatch(fetchChats());
        };
        socket.on("message recieved", messageReceivedHandler);
        return () => { socket.off("message recieved", messageReceivedHandler); };
    }, [notifications, messages, dispatch]);

    useEffect(() => {
        const isValid = async () => {
            const data = await validUser();
            if (!data?.user) {
                window.location.href = "/login";
            }
        };
        isValid();
    }, []);

    const handleTyping = (e) => {
        setMessage(e.target.value);
        if (!socket || isAiChat) return;

        if (!typing) {
            setTyping(true);
            socket.emit('typing', activeChat._id);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop typing", activeChat._id);
            setTyping(false);
        }, 3000);
    };

    if (loading) {
        return <div className={`${props.className} flex items-center justify-center`}><Loading /></div>;
    }

    return (
        <div className={`${props.className} flex flex-col bg-bkg-dark`}>
            {activeChat ? (
                <>
                    <div className='flex justify-between items-center p-4 bg-bkg-light border-b border-border'>
                        <div className='flex items-center gap-x-4'>
                            <img className='w-10 h-10 rounded-full object-cover' src={isAiChat ? activeChat.photo : getChatPhoto(activeChat, activeUser)} alt="Profile" />
                            <div className='flex flex-col items-start'>
                                <h5 className='text-md font-semibold text-text-primary'>{getChatName(activeChat, activeUser)}</h5>
                                {isUserOnline() && <p className='text-xs text-green-400'>Online</p>}
                            </div>
                        </div>
                        {!isAiChat && <div><Model /></div>}
                    </div>
                    
                    <div className='flex-grow overflow-y-auto scrollbar-hide p-4'>
                        <MessageHistory messages={messages} />
                        {isTyping && <Typing />}
                    </div>

                    <div className="p-4 bg-bkg-light border-t border-border">
                         {showPicker && (
                            <div className="absolute bottom-24 z-10">
                               <Picker data={data} onEmojiSelect={(e) => setMessage(message + e.native)} theme="dark" />
                            </div>
                        )}
                        <div className="flex items-center gap-x-4 bg-bkg-dark rounded-lg p-2">
                           <button className="text-text-secondary hover:text-accent transition" onClick={() => setShowPicker(!showPicker)}>
                                <BsEmojiSmile size={22} />
                            </button>
                            {!isAiChat && (
                                 <button className="text-text-secondary hover:text-accent transition" onClick={() => fileInputRef.current.click()}>
                                    <ImAttachment size={22} />
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                                </button>
                            )}
                            <input
                                onKeyDown={(e) => { if (e.key === 'Enter') { handleSendMessage({ text: message }); } }}
                                onChange={handleTyping}
                                className='flex-grow bg-transparent text-text-primary focus:outline-none'
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                            />
                            {isUploading ? (
                                <p className="text-text-secondary text-sm">Uploading...</p>
                            ) : (
                                <button
                                    onClick={() => handleSendMessage({ text: message })}
                                    className="p-2 rounded-full bg-accent text-white disabled:opacity-50 transition"
                                    disabled={!message}
                                >
                                    <IoSend size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary gap-y-4">
                    <VscHubot className="text-accent" size={80} />
                    <h3 className='text-2xl font-medium text-text-primary'>Welcome to Samvaad</h3>
                    <p>Select a chat from the left to start messaging.</p>
                </div>
            )}
        </div>
    );
}

export default Chat;