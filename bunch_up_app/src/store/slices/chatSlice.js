import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  currentGroupId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentGroup: (state, action) => {
      state.currentGroupId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentGroup,
  addMessage,
  setMessages,
  clearMessages,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer; 