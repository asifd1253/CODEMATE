import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    items: [],
  },
  reducers: {
    addFeed: (state, action) => {
      state.items = action.payload;
    },
    removeFromFeed: (state, action) => {
      state.items = state.items.filter((feedUser) => {
        return feedUser._id !== action.payload;
      });
    },
    removeAllFeed: (state) => {
      state.items = [];
    },
  },
});

export const { addFeed, removeFromFeed, removeAllFeed } = feedSlice.actions;
export default feedSlice.reducer;
