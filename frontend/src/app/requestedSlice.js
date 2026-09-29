import { createSlice } from "@reduxjs/toolkit";

const requestedSlice = createSlice({
  name: "requested",
  initialState: {
    new_requests: [],
  },
  reducers: {
    addNewRequests: (state, action) => {
      state.new_requests = action.payload;
    },
    removeRequest: (state, action) => {
      state.new_requests = state.new_requests.filter((request) => {
        return request._id !== action.payload;
      });
    },
  },
});

export const { addNewRequests, removeRequest } = requestedSlice.actions;
export default requestedSlice.reducer;
