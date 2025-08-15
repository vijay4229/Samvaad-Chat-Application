import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchAllChats } from '../apis/chat';

const initialState = {
    chats: [],
    activeChat: null,
    isLoading: false,
    notifications: [],
};

export const fetchChats = createAsyncThunk('redux/chats', async () => {
    try {
        const data = await fetchAllChats();
        return data;
    } catch (error) {
        toast.error('Something Went Wrong! Could not fetch chats.');
    }
});

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setActiveChat: (state, { payload }) => {
            state.activeChat = payload;
            // --- THIS IS THE FIX: When a chat is opened, remove its notifications ---
            if (payload) {
                state.notifications = state.notifications.filter(
                    (n) => n.chatId._id !== payload._id
                );
            }
        },
        setNotifications: (state, { payload }) => {
            state.notifications = payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchChats.fulfilled, (state, { payload }) => {
                state.chats = payload;
                state.isLoading = false;
            })
            .addCase(fetchChats.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;