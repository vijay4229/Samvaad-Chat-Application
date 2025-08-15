// src/components/ui/Typing.jsx
import React from 'react';

function Typing() {
    return (
        <div className="flex items-center gap-x-2 p-3 rounded-lg bg-bkg-light w-fit">
            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-2.5 h-2.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
    );
}

export default Typing;