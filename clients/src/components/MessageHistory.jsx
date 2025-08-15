import React from 'react';
import { useSelector } from 'react-redux';
import ScrollableFeed from "react-scrollable-feed";
import { Tooltip, Avatar } from "@chakra-ui/react";
import { FaFileAlt, FaFilePdf } from "react-icons/fa";
import { downloadFile } from '../apis/messages';

function MessageHistory({ messages }) {
    const activeUser = useSelector((state) => state.activeUser);

    const handleDownload = async (messageObject) => {
        const { url, filename } = messageObject;
        const data = await downloadFile(url, filename);
        if (!data) return;

        const blobUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    };

    return (
        <ScrollableFeed className='scrollbar-hide px-4'>
            {messages &&
                messages.map((m, i) => {
                    const senderIsMe = m.sender._id === activeUser.id;
                    
                    // This is a simpler logic: Show the avatar if it's the last message
                    // in a sequence from the other user.
                    const showAvatar = !senderIsMe && ((i === messages.length - 1) || (messages[i + 1].sender._id !== m.sender._id));

                    const isFile = typeof m.message === 'object' && m.message !== null && m.message.url;
                    const isText = typeof m.message === 'object' && m.message !== null && m.message.text;
                    const isImage = isFile && m.message.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                    const isPdf = isFile && m.message.url.match(/\.pdf$/i);

                    return (
                        <div
                            key={m._id}
                            className={`flex w-full my-1 ${senderIsMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="flex items-end gap-x-2 max-w-[80%]">
                                
                                {/* --- AVATAR LOGIC --- */}
                                {showAvatar ? (
                                    <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
                                        <Avatar
                                            className="w-8 h-8" // Explicitly sets a small size
                                            name={m.sender?.name}
                                            src={m.sender?.profilePic}
                                        />
                                    </Tooltip>
                                ) : (
                                    // If no avatar, this spacer keeps messages aligned
                                    <div className="w-8" /> 
                                )}

                                {/* --- MESSAGE BUBBLE LOGIC --- */}
                                <div>
                                    {isImage ? (
                                        <img src={m.message.url} alt={m.message.filename} className="max-w-xs rounded-lg shadow-md" />
                                    ) : isFile ? (
                                        <div
                                            onClick={() => handleDownload(m.message)}
                                            className={`flex items-center gap-x-3 p-3 max-w-xs rounded-lg cursor-pointer ${senderIsMe ? "bg-accent text-white" : "bg-bkg-light text-text-primary"}`}
                                        >
                                            {isPdf ? <FaFilePdf size="2.5em" /> : <FaFileAlt size="2em" />}
                                            <div className='flex flex-col overflow-hidden'>
                                                <span className='font-semibold truncate text-sm'>{m.message.filename}</span>
                                                <span className='text-xs opacity-80'>{isPdf ? "PDF Document" : "File"}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-2 rounded-2xl ${senderIsMe ? 'bg-accent text-white rounded-br-none' : 'bg-bkg-light text-text-primary rounded-bl-none'}`}>
                                            <p className="whitespace-pre-wrap break-words">
                                                {isText ? m.message.text : m.message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </ScrollableFeed>
    );
}

export default MessageHistory;