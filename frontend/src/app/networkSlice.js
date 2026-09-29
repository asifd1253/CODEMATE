import { createSlice } from "@reduxjs/toolkit";

const network = createSlice({
  name: "network",
  initialState: {
    connections: [],
  },
  reducers: {
    addConnections: (state, action) => {
       state.connections = action.payload;
    },
  },
});

export const { addConnections } = network.actions;

export default network.reducer;
