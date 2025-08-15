import React, { useState } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { setShowProfile } from '../redux/profileSlice';
import { IoMdLogOut } from "react-icons/io";
import InputEdit from './profile/InputEdit';
import { updateUser } from '../apis/auth';
import { toast } from 'react-toastify';
import { setUserNameAndBio } from '../redux/activeUserSlice';

function Profile(props) {
    const dispatch = useDispatch();
    const activeUser = useSelector((state) => state.activeUser);
    const [formData, setFormData] = useState({
        name: activeUser.name,
        bio: activeUser.bio
    });

    const logoutUser = () => {
        toast.success("Logout Successful!");
        localStorage.removeItem("userToken");
        window.location.href = "/login";
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        dispatch(setUserNameAndBio(formData));
        toast.success("Profile Updated!");
        await updateUser(activeUser.id, formData);
    };

    return (
        <div className={props.className}>
            {/* --- START: Redesigned Header --- */}
            <div className='flex items-center p-5 border-b border-border'>
                <button onClick={() => dispatch(setShowProfile(false))} className='mr-4'>
                    <IoArrowBack size={24} className="text-text-secondary hover:text-text-primary" />
                </button>
                <h6 className='text-xl text-text-primary font-semibold'>Profile</h6>
            </div>
            {/* --- END: Redesigned Header --- */}

            <div className='flex flex-col items-center p-8 gap-y-6'>
                {/* --- START: Redesigned Profile Picture --- */}
                <div className='relative'>
                    <img
                        className='w-48 h-48 rounded-full object-cover border-4 border-accent shadow-lg'
                        src={activeUser?.profilePic}
                        alt="Profile"
                    />
                    {/* You could add a button here later to change the picture */}
                </div>
                {/* --- END: Redesigned Profile Picture --- */}

                <div className="w-full px-4 space-y-6">
                    <InputEdit type="name" handleChange={handleChange} input={formData.name} handleSubmit={submit} />
                    <div>
                        <p className='text-xs tracking-wide text-text-secondary'>
                            This is not your username or pin. This name will be visible to your Samvaad contacts.
                        </p>
                    </div>
                    <InputEdit type="bio" handleChange={handleChange} input={formData.bio} handleSubmit={submit} />
                </div>
            </div>

            {/* --- START: Redesigned Logout Button --- */}
            <div className='p-4 mt-8'>
                <button
                    onClick={logoutUser}
                    className='flex items-center justify-center w-full gap-x-4 p-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition'
                >
                    <IoMdLogOut size={24} />
                    <h6 className='font-semibold'>Logout</h6>
                </button>
            </div>
            {/* --- END: Redesigned Logout Button --- */}
        </div>
    );
}

export default Profile;