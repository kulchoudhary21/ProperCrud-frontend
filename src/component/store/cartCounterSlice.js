import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: 0,
};
export const CartCounterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setCounter: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const {setCounter}=CartCounterSlice.actions
export default CartCounterSlice.reducer
