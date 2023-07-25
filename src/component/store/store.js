import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import loginReducer from "./isLoginSlice"
import cartCounterSlice from "./cartCounterSlice";
export const store = configureStore({
  reducer: {
    isLogin:loginReducer,
    cartCounter:cartCounterSlice
  },
});
