import React, { useEffect } from 'react';
import { validUser } from '../apis/auth';
import { useNavigate } from "react-router-dom";
import { VscHubot } from "react-icons/vsc";

function Start() {
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = async () => {
            const data = await validUser();
            if (!data?.user) {
                navigate("/login");
            } else {
                navigate("/chats");
            }
        };
        isValid();
    }, [navigate]);

    return (
        <div className='bg-bkg-dark flex flex-col items-center justify-center w-screen h-screen'>
            <VscHubot className="text-accent animate-pulse" size={80} />
            <h3 className='font-semibold text-lg text-text-secondary tracking-wider mt-4'>Loading Samvaad...</h3>
        </div>
    );
}

export default Start;