import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveChat, fetchChats } from '../redux/chatsSlice';
import { getChatName, getChatPhoto, getChatUser, timeSince } from '../utils/logics';
import NoContacts from './ui/NoContacts';
import { FaFileImage } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri"; // Import the delete icon
import CreateAiAgentModal from './ui/CreateAiAgentModal';
import { getIntroLine } from '../apis/ai';
const defaultAgents = [
    // Your list of default AI agents (Circuit, Geet, etc.) remains here
    {
        _id: 'ai-circuit',
        chatName: 'Circuit (Dost)',
        isGroup: true,
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbBmqQTR0P3AThjwuGyenw_SgZW_mWrnOlqQ&s',
        latestMessage: { message: { text: "Tension nahi lene ka bhai!" } },
        updatedAt: new Date().toISOString(),
        personality: 'circuit',
        introMessage: "Bhai, Circuit bol raha hai. Tension nahi lene ka, apun hai na!"
    },
    {
        _id: 'ai-naina', 
        chatName: 'Naina (Girlfriend)', 
        isGroup: true,
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWMZuwAT9n1U3UGm_Bw7N4_sggPyWnJ3vMdQ&s', 
        latestMessage: { message: { text: "Want to go on an adventure?" } },
        updatedAt: new Date().toISOString(),
        personality: 'naina', 
        introMessage: "Hi, I'm Naina. I was just reading a book, but I'd much rather talk to you."
    },
    {
        _id: 'ai-aditya',
        chatName: 'Aditya (Boyfriend)',
        isGroup: true,
        photo: 'https://im.idiva.com/content/2022/Jul/pasted-image-0-1_62c6db9437665.png?w=900&h=638&cc=1',
        latestMessage: { message: { text: "Everything will be okay." } },
        updatedAt: new Date().toISOString(),
        personality: 'aditya',
        introMessage: "Hey, I'm Aditya. If you ever need to talk, I'm here to listen. Everything will be okay."
    },
    {
        _id: 'ai-veeru',
        chatName: 'Veeru (Wingman)',
        isGroup: true,
        photo: 'https://im.rediff.com/movies/2015/jul/28sholay.jpg',
        latestMessage: { message: { text: "Basanti in kutton ke... oh, hi!" } },
        updatedAt: new Date().toISOString(),
        personality: 'veeru',
        introMessage: "Arre o, Sambha! Dost bol raha hai. Koi problem hai toh bas bata de, dekh lenge!"
    },
    {
        _id: 'ai-rancho',
        chatName: 'Rancho (Career Helper)',
        isGroup: true,
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfX8VDvSF2undccby4mmE03xJKYIX6WL3Z1w&s',
        latestMessage: { message: { text: "Aal Izz Well!" } },
        updatedAt: new Date().toISOString(),
        personality: 'rancho',
        introMessage: "Aal Izz Well! Don't run after success, chase excellence. Success will follow. Poochho, kya poochhna hai?"
    },
    {
        _id: 'ai-chatur',
        chatName: 'Chatur (The Know-it-all)',
        isGroup: true,
        photo: 'https://images.indianexpress.com/2024/12/Omi.jpg',
        latestMessage: { message: { text: "Definition chahiye? Main dega." } },
        updatedAt: new Date().toISOString(),
        personality: 'chatur',
        introMessage: "Namaste. Main Chatur Ramalingam. Yahan par har prashn ka uttar, paribhasha sahit, uplabdh hai."
    }
];

function Contacts() {
    const { chats, activeChat, notifications } = useSelector((state) => state.chats) || {};
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.activeUser);
    const { users: onlineUsers } = useSelector((state) => state.onlineUsers);
    const [view, setView] = useState('chats');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customAgents, setCustomAgents] = useState([]);

    useEffect(() => {
        const savedAgents = JSON.parse(localStorage.getItem('customAiAgents')) || [];
        setCustomAgents(savedAgents);
    }, []);

    const handleSaveAgent = async (newAgent) => {
        // --- THIS IS THE CHANGE: It now calls the AI to generate an intro line ---
        const introResponse = await getIntroLine({ personality: newAgent.personality });
        const introMessage = introResponse ? introResponse.introMessage : "Hello! I'm ready to chat.";

        const agentToAdd = {
            _id: `custom-${Date.now()}`,
            chatName: newAgent.name,
            isGroup: true,
            photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR5d-zlMLRzdCResNcEonXBDuOPf-65y0Bkg&s', // New default photo
            latestMessage: { message: { text: "I'm ready to chat!" } },
            updatedAt: new Date().toISOString(),
            personality: newAgent.personality,
            introMessage: introMessage.replace(/"/g, '') // Remove quotes from AI response
        };

        const updatedAgents = [...customAgents, agentToAdd];
        setCustomAgents(updatedAgents);
        localStorage.setItem('customAiAgents', JSON.stringify(updatedAgents));
    };

    const handleDeleteAgent = (agentId) => {
        if (window.confirm("Are you sure you want to remove this AI agent?")) {
            const updatedAgents = customAgents.filter(agent => agent._id !== agentId);
            setCustomAgents(updatedAgents);
            localStorage.setItem('customAiAgents', JSON.stringify(updatedAgents));
            if (activeChat?._id === agentId) {
                dispatch(setActiveChat(null));
            }
        }
    };


    useEffect(() => {
        if (view === 'chats') {
            dispatch(fetchChats());
        }
    }, [dispatch, view]);

    const renderLatestMessage = (latestMessage) => {
        if (!latestMessage?.message) return <span className="text-sm text-text-secondary italic">No messages yet</span>;
        const message = latestMessage.message;
        if (typeof message === 'object' && message.filename) {
            return (
                <div className="flex items-center gap-x-2 text-sm text-text-secondary">
                    <FaFileImage />
                    <span className="truncate">{message.filename}</span>
                </div>
            );
        }
        const content = message.text || message;
        return <p className="text-sm text-text-secondary truncate">{String(content)}</p>;
    };

    const listToDisplay = view === 'chats' ? chats : [...defaultAgents, ...customAgents];

    return (
        <>
            <CreateAiAgentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveAgent} />
            
            <div className="p-2 mx-2 mt-2 bg-bkg-dark rounded-lg flex">
                <button
                    onClick={() => setView('chats')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition ${view === 'chats' ? 'bg-accent text-white' : 'text-text-secondary'}`}
                >
                    Chats
                </button>
                <button
                    onClick={() => setView('ai')}
                    className={`w-1/2 py-2 text-sm font-semibold rounded-md transition ${view === 'ai' ? 'bg-accent text-white' : 'text-text-secondary'}`}
                >
                    AI Agents
                </button>
            </div>

            {view === 'ai' && (
                <div className="px-2 mt-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-center gap-x-2 py-2 px-4 border-2 border-dashed border-border text-text-secondary rounded-lg hover:bg-bkg-dark hover:text-accent transition"
                    >
                        <IoAdd />
                        Create Your Own AI
                    </button>
                </div>
            )}

            <div className='flex flex-col overflow-y-auto scrollbar-hide p-2'>
                {listToDisplay && listToDisplay.length > 0 ? listToDisplay.map((chat) => {
                    const isAiAgent = !!chat.personality;
                    const isCustomAiAgent = isAiAgent && chat._id.startsWith('custom-');
                    const chatUser = isAiAgent ? null : getChatUser(chat, activeUser);
                    const isOnline = !isAiAgent && onlineUsers.includes(chatUser?._id);
                    const chatNotifications = notifications.filter(n => n.chatId._id === chat._id);

                    return (
                        <div
                            key={chat._id}
                            className={`flex items-center justify-between p-3 my-1 rounded-xl transition group ${activeChat?._id === chat?._id ? "bg-accent bg-opacity-40" : "hover:bg-bkg-dark"}`}
                        >
                            <div
                                onClick={() => dispatch(setActiveChat(chat))}
                                className='flex items-center gap-x-4 min-w-0 flex-grow cursor-pointer'
                            >
                                <div className='relative'>
                                    <img
                                        className='w-14 h-14 rounded-full object-cover'
                                        src={isAiAgent ? chat.photo : getChatPhoto(chat, activeUser)}
                                        alt="Profile"
                                    />
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-bkg-light rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex flex-col items-start min-w-0">
                                    <h5 className={`font-semibold ${activeChat?._id === chat?._id ? "text-white" : "text-text-primary"}`}>{isAiAgent ? chat.chatName : getChatName(chat, activeUser)}</h5>
                                    <div className={`w-48 ${activeChat?._id === chat?._id ? "text-gray-200" : "text-text-secondary"}`}>
                                         {renderLatestMessage(chat.latestMessage)}
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col items-end gap-y-1 self-start'>
                                <p className={`text-xs ${activeChat?._id === chat?._id ? "text-gray-300" : "text-text-secondary"}`}>
                                    {timeSince(new Date(chat.updatedAt))}
                                </p>
                                
                                {/* --- THIS IS THE CHANGE: Show delete button for custom agents --- */}
                                {isCustomAiAgent ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent opening the chat
                                            handleDeleteAgent(chat._id);
                                        }}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <RiDeleteBin6Line size={18} />
                                    </button>
                                ) : (
                                    !isAiAgent && chatNotifications.length > 0 && (
                                        <span className="flex items-center justify-center text-xs text-white bg-accent rounded-full w-5 h-5 font-bold">
                                            {chatNotifications.length}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    );
                }) : <NoContacts />}
            </div>
        </>
    );
}

export default Contacts;