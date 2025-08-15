import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./redux/activeUserSlice";
import chatsSlice from "./redux/chatsSlice";
import profileSlice from "./redux/profileSlice";
import searchSlice from "./redux/searchSlice";
import onlineUsersReducer from './redux/onlineUsersSlice';
const store = configureStore({
  reducer: {
    activeUser: activeUserSlice,
    profile: profileSlice,
    search: searchSlice,
    chats: chatsSlice,
    onlineUsers: onlineUsersReducer, 
  },
});
export default store;
