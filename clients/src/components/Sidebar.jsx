import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VscHubot } from "react-icons/vsc";
import { IoChatbubblesOutline, IoLogOutOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { BiNotification } from "react-icons/bi";
import { setShowProfile, setShowNotifications } from '../redux/profileSlice';
import { getSender } from '../utils/logics';
import { setActiveChat, setNotifications } from '../redux/chatsSlice';
import NotificationBadge from 'react-notification-badge';
import { Effect } from "react-notification-badge";
import LogoutModal from './ui/LogoutModal';

const Tooltip = ({ text, children }) => (
    <div className="relative group flex items-center">
        {children}
        <div className="absolute left-14 p-2 px-3 w-max text-sm rounded-md shadow-md bg-bkg-dark text-text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {text}
        </div>
    </div>
);

function Sidebar() {
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.activeUser);
    const { showProfile, showNotifications } = useSelector((state) => state.profile);
    const { notifications } = useSelector((state) => state.chats) || {};
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
    };

    return (
        <>
            <div className="flex flex-col items-center justify-between w-20 h-screen py-6 bg-bkg-light border-r border-border">
                <div className="text-accent">
                    <VscHubot size={32} />
                </div>

                <div className="flex flex-col items-center gap-y-8">
                    <Tooltip text="Profile">
                        <button onClick={() => dispatch(setShowProfile(true))}>
                            {/* --- CHANGE: Icon is highlighted when profile is active --- */}
                            <CgProfile size={28} className={showProfile ? "text-accent" : "text-text-secondary hover:text-text-primary transition"} />
                        </button>
                    </Tooltip>
                    <Tooltip text="Chats">
                        {/* --- THIS IS THE FIX --- */}
                        {/* 1. Added onClick to return to the chat list */}
                        {/* 2. Button is highlighted when chat is active */}
                        <button 
                            onClick={() => dispatch(setShowProfile(false))}
                            className={`p-3 rounded-xl ${!showProfile ? "bg-accent text-white" : "bg-transparent text-text-secondary hover:text-text-primary transition"}`}
                        >
                            <IoChatbubblesOutline size={28} />
                        </button>
                    </Tooltip>
                    <Tooltip text="Notifications">
                        <div className="relative">
                            <button onClick={() => dispatch(setShowNotifications(!showNotifications))}>
                                <NotificationBadge
                                    count={notifications?.length || 0}
                                    effect={Effect.SCALE}
                                    style={{ zIndex: 20 }}
                                />
                                <BiNotification size={28} className="text-text-secondary hover:text-text-primary transition" />
                            </button>
                            {showNotifications && (
                                <div className="absolute top-0 left-16 z-20 w-72 bg-bkg-dark rounded-lg shadow-xl p-2 border border-border">
                                    <div className='text-sm text-text-primary p-2'>
                                        {!notifications?.length ? "No new messages" : `You have ${notifications.length} new messages`}
                                    </div>
                                    {notifications?.map((notif, index) => (
                                        <div
                                            onClick={() => {
                                                dispatch(setActiveChat(notif.chatId));
                                                dispatch(setNotifications(notifications.filter((n) => n._id !== notif._id)));
                                            }}
                                            key={index}
                                            className='text-xs text-text-secondary p-2 rounded-md hover:bg-bkg-light cursor-pointer'
                                        >
                                            {notif.chatId?.isGroup
                                                ? `New Message in ${notif.chatId.chatName}`
                                                : `New Message from ${getSender(activeUser, notif.chatId.users)}`}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Tooltip>
                </div>

                <div className="flex flex-col items-center gap-y-4">
                    <Tooltip text="Logout">
                        <button onClick={() => setIsLogoutModalOpen(true)}>
                            <IoLogOutOutline size={28} className="text-text-secondary hover:text-red-400 transition" />
                        </button>
                    </Tooltip>
                    <img
                        className='w-12 h-12 rounded-full object-cover'
                        src={activeUser?.profilePic}
                        alt="User Profile"
                    />
                </div>
            </div>
            
            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={handleLogout} 
            />
        </>
    );
}

export default Sidebar;