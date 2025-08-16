import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth';
import { setActiveUser } from '../redux/activeUserSlice';
import { BsSearch, BsThreeDotsVertical } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoLogOutOutline } from "react-icons/io5";
import Chat from './Chat';
import Profile from "../components/Profile";
import { acessCreate } from "../apis/chat.js";
import { fetchChats } from '../redux/chatsSlice';
import Group from '../components/Group';
import Contacts from '../components/Contacts';
import Search from '../components/group/Search';
import Sidebar from '../components/Sidebar';
import { setShowProfile } from '../redux/profileSlice';

function Home() {
    const dispatch = useDispatch();
    const { showProfile } = useSelector((state) => state.profile);
    const { activeChat } = useSelector((state) => state.chats) || {};
    const activeUser = useSelector((state) => state.activeUser);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [showMenu, setShowMenu] = useState(false); // State for mobile menu

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleClick = async (e) => {
        await acessCreate({ userId: e._id });
        dispatch(fetchChats());
        setSearch("");
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("userToken");
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        if (!search) {
            setSearchResults([]);
            return;
        }
        const searchChange = async () => {
            setIsLoading(true);
            const { data } = await searchUsers(search);
            setSearchResults(data);
            setIsLoading(false);
        };
        searchChange();
    }, [search]);

    useEffect(() => {
        const isValid = async () => {
            const data = await validUser();
            const user = {
                id: data?.user?._id,
                email: data?.user?.email,
                profilePic: data?.user?.profilePic,
                bio: data?.user?.bio,
                name: data?.user?.name
            };
            dispatch(setActiveUser(user));
        };
        isValid();
    }, [dispatch]);

    return (
        <div className="flex h-screen w-full bg-bkg-dark font-sans">
            {/* Sidebar is hidden on mobile (md and below) */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>
            
            <div className="flex-grow flex min-w-0">
                {/* --- START: RESPONSIVE CONTACTS/PROFILE PANEL --- */}
                {/* This panel is hidden on mobile if a chat is active */}
                <div className={`h-full flex-col border-r border-border flex-shrink-0 ${activeChat ? 'hidden md:flex' : 'flex w-full md:w-[380px]'}`}>
                    {showProfile ? (
                        <Profile className="w-full h-full bg-bkg-light" />
                    ) : (
                        <>
                            {/* --- THIS IS THE NEW MOBILE-ONLY HEADER --- */}
                            <div className="md:hidden flex justify-between items-center p-4 bg-bkg-light border-b border-border">
                                <img src={activeUser.profilePic} alt="My Profile" className="w-10 h-10 rounded-full object-cover"/>
                                <div className="relative">
                                    <button onClick={() => setShowMenu(!showMenu)}>
                                        <BsThreeDotsVertical size={20} className="text-text-secondary" />
                                    </button>
                                    {showMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-bkg-dark rounded-md shadow-lg z-20">
                                            <button onClick={() => { dispatch(setShowProfile(true)); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-bkg-light flex items-center gap-x-3">
                                                <CgProfile /> Profile
                                            </button>
                                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-bkg-light flex items-center gap-x-3">
                                                <IoLogOutOutline /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* --- DESKTOP HEADER --- */}
                            <div className="hidden md:flex justify-between items-center p-5 border-b border-border">
                                <h1 className="text-2xl font-bold text-text-primary">Samvaad</h1>
                                <Group />
                            </div>

                            <div className="p-4">
                                <div className="relative">
                                    <input
                                        onChange={handleSearch}
                                        value={search}
                                        className='w-full bg-bkg-dark text-text-primary pl-10 pr-4 py-2 rounded-lg outline-none border-2 border-transparent focus:border-accent'
                                        type="text"
                                        placeholder="Search or start new chat"
                                    />
                                    <div className='absolute top-1/2 left-3 -translate-y-1/2'>
                                        <BsSearch className="text-text-secondary" />
                                    </div>
                                </div>
                                {search && (
                                    <div className='absolute z-10 w-[calc(100%-2rem)] mt-2 bg-bkg-dark rounded-lg shadow-lg'>
                                        <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="md:hidden px-4 pb-2 border-b border-border">
                                <Group />
                            </div>
                            
                            <div className="flex-grow overflow-y-auto scrollbar-hide">
                                <Contacts />
                            </div>
                        </>
                    )}
                </div>
                
                {/* --- RESPONSIVE CHAT WINDOW --- */}
                {/* On mobile, this is only shown if a chat is active */}
                <div className={`h-full flex-grow ${activeChat ? 'flex' : 'hidden md:flex'}`}>
                    <Chat />
                </div>
            </div>
        </div>
    );
}

export default Home;