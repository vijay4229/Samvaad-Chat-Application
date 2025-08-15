// onlineUsersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState: {
    users: [], // This will be an array of user IDs
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;