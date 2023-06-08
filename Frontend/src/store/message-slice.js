import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  privateMessages: {},
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    setPrivateMessages(state, action) {
      console.log("in slice", action.payload.room, action.payload.data);
      console.log("iter ", state.privateMessages[action.payload.room]);
      console.log("new ", state.privateMessages);
      if (!state.privateMessages[action.payload.room]) {
        state.privateMessages[action.payload.room] = [action.payload.data];
      } else {
        state.privateMessages[action.payload.room] = [
          ...state.privateMessages[action.payload.room],
          action.payload.data,
        ];
      }
    },
  },
});

export const messageActions = messageSlice.actions;

export default messageSlice.reducer;
