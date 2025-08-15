// src/components/ui/CreateAiAgentModal.jsx
import React, { useState } from 'react';

function CreateAiAgentModal({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [personality, setPersonality] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (name && personality) {
            onSave({ name, personality });
            onClose(); // Close the modal after saving
        } else {
            alert('Please fill out both name and personality.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-bkg-light p-6 rounded-lg shadow-xl w-full max-w-md space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Create Your Own AI Agent</h2>
                <div>
                    <label className="text-sm font-medium text-text-secondary">Agent Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Sherlock Holmes"
                        className="w-full mt-1 px-4 py-2 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary">Personality Description</label>
                    <textarea
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        placeholder="Describe the agent's personality. For example: 'You are a master detective. Be witty, observant, and speak in a formal 19th-century English style.'"
                        rows="4"
                        className="w-full mt-1 px-4 py-2 bg-bkg-dark border border-border text-text-primary rounded-lg focus:ring-accent focus:border-accent focus:outline-none transition"
                    />
                </div>
                <div className="flex justify-end gap-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-bkg-dark text-text-primary hover:bg-opacity-80 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-lg bg-accent text-white hover:bg-opacity-80 transition"
                    >
                        Create Agent
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateAiAgentModal;