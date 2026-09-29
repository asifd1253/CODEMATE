import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import networkReducer from "./networkSlice.js";
import requestedReducer from "./requestedSlice.js";

const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    network: networkReducer,
    requested: requestedReducer,
  },
});

export default store;
