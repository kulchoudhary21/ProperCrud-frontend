import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import loginReducer from "./isLoginSlice"
export const store = configureStore({
  reducer: {
    isLogin:loginReducer
  },
});
