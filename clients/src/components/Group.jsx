import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Box } from "@mui/material";
import { searchUsers } from '../apis/auth';
import { RxCross2 } from "react-icons/rx";
import { IoAddCircleOutline } from "react-icons/io5";
import { createGroup } from '../apis/chat';
import { fetchChats } from '../redux/chatsSlice';
import Search from './group/Search';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1f2937',
    border: '1px solid #4b5563',
    boxShadow: 24,
    p: 4,
    borderRadius: '16px',
    color: '#f9fafb'
};

function Group() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [chatName, setChatName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSearch("");
        setSelectedUsers([]);
        setChatName("");
    };

    const handleFormSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleClick = (userToAdd) => {
        if (selectedUsers.some(user => user._id === userToAdd._id)) {
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const deleteSelected = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter((user) => user._id !== userToDelete._id));
    };

    const handleSubmit = async () => {
        if (selectedUsers.length >= 2 && chatName) {
            await createGroup({
                chatName,
                users: JSON.stringify(selectedUsers.map((e) => e._id))
            });
            dispatch(fetchChats());
            handleClose();
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

    return (
        <>
            {/* --- THIS IS THE NEW, SMALLER ICON BUTTON --- */}
            <button
                onClick={handleOpen}
                className='p-2 rounded-full hover:bg-bkg-dark transition'
                title="New Group Chat"
            >
                <IoAddCircleOutline size={24} className="text-text-secondary" />
            </button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="create-group-modal-title"
            >
                <Box sx={style}>
                    <h5 id="create-group-modal-title" className='text-xl font-bold text-center mb-4'>Create a Group</h5>
                    <form onSubmit={(e) => e.preventDefault()} className='flex flex-col gap-y-4'>
                        <input
                            onChange={(e) => setChatName(e.target.value)}
                            className="w-full px-4 py-2 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition"
                            type="text"
                            name="chatName"
                            placeholder="Group Name"
                            required
                        />
                        <input
                            onChange={handleFormSearch}
                            className="w-full px-4 py-2 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition"
                            type="text"
                            name="users"
                            placeholder="Search users to add"
                        />
                        
                        <div className='flex flex-wrap gap-2 min-h-[24px]'>
                            {selectedUsers.map((user) => (
                                <button
                                    key={user._id}
                                    onClick={() => deleteSelected(user)}
                                    className='flex items-center gap-x-2 bg-accent bg-opacity-80 text-white text-xs font-medium px-2.5 py-1 rounded-full'
                                >
                                    <span>{user.name}</span>
                                    <RxCross2 />
                                </button>
                            ))}
                        </div>

                        <div className="max-h-40 overflow-y-auto scrollbar-hide">
                           <Search isLoading={isLoading} handleClick={handleClick} search={search} searchResults={searchResults} />
                        </div>

                        <div className='flex justify-end mt-4'>
                            <button
                                onClick={handleSubmit}
                                className='bg-accent text-white font-bold px-4 py-2 rounded-lg hover:bg-opacity-80 transition'
                                type='submit'
                            >
                                Create Group
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
}

export default Group;