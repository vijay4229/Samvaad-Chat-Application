// src/components/ui/NoContacts.jsx
import React from 'react';
import { VscHubot } from "react-icons/vsc";

function NoContacts() {
    return (
        <div className='flex flex-col items-center justify-center h-full text-center p-4'>
            <VscHubot className="text-accent mb-4" size={60} />
            <h4 className='text-lg font-semibold text-text-primary'>No Contacts Yet</h4>
            <span className='text-sm text-text-secondary'>Search for people to start a conversation!</span>
        </div>
    );
}

export default NoContacts;