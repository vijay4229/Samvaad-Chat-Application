import React, { useState } from 'react';
import { TbEdit } from "react-icons/tb";
import { BsCheck2 } from "react-icons/bs";

function InputEdit({ type, handleChange, input, handleSubmit }) {
    const [editable, setEditable] = useState(false);

    const submitButton = () => {
        handleSubmit();
        setEditable(false);
    };

    return (
        <div className='w-full'>
            <label className='text-sm text-accent font-semibold capitalize'>{type === 'name' ? 'Your Name' : 'About'}</label>
            <div className='flex justify-between items-center mt-1'>
                {!editable ? (
                    <>
                        <p className='text-md text-text-primary'>{input}</p>
                        <button onClick={() => setEditable(true)}>
                            <TbEdit size={22} className="text-text-secondary hover:text-text-primary" />
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            name={type}
                            onChange={handleChange}
                            className='w-full bg-transparent text-text-primary outline-none border-b-2 border-accent'
                            type="text"
                            value={input}
                            autoFocus
                        />
                        <button onClick={submitButton}>
                            <BsCheck2 size={24} className="text-green-400" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default InputEdit;