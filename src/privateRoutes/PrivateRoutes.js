import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import decryptCrypto from "../utils/decryptCrypto";
function PrivateRoutes({ data,children }) {
  const navigate=useNavigate()
  console.log(children)
  if (data) {
    if (data.userType === "user") {
      return children;
    }
  } else {
    // return (navigate("/login"))
    return <Navigate to="/login"/>;
  }
}

export default PrivateRoutes;
