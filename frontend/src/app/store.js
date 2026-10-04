// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice.js";
// import feedReducer from "./feedSlice.js";
// import networkReducer from "./networkSlice.js";
// import requestedReducer from "./requestedSlice.js";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     feed: feedReducer,
//     network: networkReducer,
//     requested: requestedReducer,
//   },
// });

// export default store;


import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import networkReducer from "./networkSlice.js";
import requestedReducer from "./requestedSlice.js";

const appReducer = combineReducers({
  user: userReducer,
  feed: feedReducer,
  network: networkReducer,
  requested: requestedReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "store/clearStore") {
    state = undefined;
  }

  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;