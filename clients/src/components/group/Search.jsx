import React from 'react';
import SkeletonLoading from '../ui/SkeletonLoading';
import "../../pages/home.css";

function Search({ isLoading, searchResults, handleClick, search }) {
    if (!search) return null;

    return (
        <div className="p-2">
            {isLoading ? (
                <SkeletonLoading height={55} count={3} />
            ) : (
                searchResults.length > 0 ? (
                    searchResults.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleClick(user)}
                            className='flex items-center justify-between p-2 rounded-lg hover:bg-bkg-light cursor-pointer transition'
                        >
                            <div className='flex items-center gap-x-3'>
                                <img
                                    className='w-10 h-10 rounded-full object-cover'
                                    src={user.profilePic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                    alt={user.name}
                                />
                                <div className='flex flex-col'>
                                    <h5 className='text-sm text-text-primary font-semibold'>{user.name}</h5>
                                    <p className='text-xs text-text-secondary'>{user.email}</p>
                                </div>
                            </div>
                            <button className='bg-accent text-white text-xs font-bold px-3 py-1 rounded-md hover:bg-opacity-80'>
                                Add
                            </button>
                        </div>
                    ))
                ) : (
                    <span className='text-sm text-text-secondary p-2'>No results found</span>
                )
            )}
        </div>
    );
}

export default Search;