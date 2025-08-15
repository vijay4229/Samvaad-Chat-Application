// src/components/ui/Loading.jsx
import React from 'react';
import { VscHubot } from "react-icons/vsc";

function Loading() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-bkg-dark'>
        <VscHubot className="text-accent animate-pulse" size={80} />
        <p className="text-text-secondary mt-4">Loading...</p>
    </div>
  );
}

export default Loading;