import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: false,
};
export const IsLoginSlice = createSlice({
  name: "isLogin",
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
        state.value = action.payload
      },
  },
});
export const {setIsLogin}=IsLoginSlice.actions
export default IsLoginSlice.reducer