import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, validUser } from '../apis/auth';
import { setActiveUser } from '../redux/activeUserSlice';
import { BsSearch } from "react-icons/bs";
import Chat from './Chat';
import Profile from "../components/Profile";
import { acessCreate } from "../apis/chat.js";
import { fetchChats } from '../redux/chatsSlice';
import Group from '../components/Group';
import Contacts from '../components/Contacts';
import Search from '../components/group/Search';
import Sidebar from '../components/Sidebar';

function Home() {
    const dispatch = useDispatch();
    const { showProfile } = useSelector((state) => state.profile);
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleClick = async (e) => {
        await acessCreate({ userId: e._id });
        dispatch(fetchChats());
        setSearch("");
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
            <Sidebar />
            <div className="flex-grow flex min-w-0">
                {showProfile ? (
                    <Profile className="w-full md:w-[380px] h-full bg-bkg-light border-r border-border flex-shrink-0" />
                ) : (
                    <div className="w-full md:w-[380px] h-full bg-bkg-light flex flex-col border-r border-border flex-shrink-0">
                        {/* --- THIS IS THE CORRECTED HEADER --- */}
                        <div className="flex justify-between items-center p-5 border-b border-border">
                            <h1 className="text-2xl font-bold text-text-primary">Samvaad</h1>
                            <Group />
                        </div>

                        <div className="p-4">
                            <div className="relative">
                                <input
                                    onChange={handleSearch}
                                    value={search}
                                    className='w-full bg-bkg-dark text-text-primary tracking-wider pl-10 pr-4 py-2 rounded-lg outline-none border-2 border-transparent focus:border-accent'
                                    type="text"
                                    name="search"
                                    placeholder="Search or start new chat"
                                />
                                <div className='absolute top-1/2 left-3 -translate-y-1/2'>
                                    <BsSearch className="text-text-secondary" />
                                </div>
                            </div>
                            {search && (
                                <div className='absolute z-10 w-[340px] mt-2 bg-bkg-dark rounded-lg shadow-lg'>
                                    <Search searchResults={searchResults} isLoading={isLoading} handleClick={handleClick} search={search} />
                                </div>
                            )}
                        </div>
                        
                        {/* The duplicate <Group /> component that was here has been removed */}
                        
                        <div className="flex-grow overflow-y-auto scrollbar-hide">
                            <Contacts />
                        </div>
                    </div>
                )}
                
                <Chat className="flex-grow h-full" />
            </div>
        </div>
    );
}

export default Home;