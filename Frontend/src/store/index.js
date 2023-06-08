import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import messageReducer from "./message-slice";

const store = configureStore({
  reducer: { user: userReducer, message: messageReducer },
});
export default store;
