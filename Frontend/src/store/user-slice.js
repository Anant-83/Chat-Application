import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails: {},
  userId: null,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails(state, action) {
      state.userDetails = action.payload;
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setUsersInRoom(state, action) {
      state.users = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
