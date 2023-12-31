import "./App.css";
import Home from "./component/crud/Home";
import UserData from "./component/crud/UserData";
import UpdateUser from "./component/crud/UpdateUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./component/Authentication/login";
import Header from "./component/head/header";
import AddProduct from "./component/product/addProduct";
import GetProduct from "./component/product/getProduct";
import EditProduct from "./component/product/editProduct";
import GetCart from "./component/usercart/getCart";
import PrivateRoutes from "./privateRoutes/PrivateRoutes";
import { useEffect, useState } from "react";
import decryptCrypto from "./utils/decryptCrypto";
import PaymentGateway from "./component/paymentGateway/paymentGateway";
import Chat from "./component/chatApp/chat";
import Test from "./component/chatApp/test";
import UserList from "./component/chatApp/userlist";
import ChatApp from "./component/chatApp/chatApp";
import Testing from "./dummy/testing";
function App() {
  const [data, setData] = useState();
  const [islogin, setisLogin] = useState();
  async function getUserData() {
    const data = await decryptCrypto();
    console.log("data", data);
    await setData(data);
  }
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/dash" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<UserData></UserData>}></Route>
          <Route
            path="/updateData/:id"
            element={<UpdateUser></UpdateUser>}
          ></Route>
          <Route path="/addProduct" element={<AddProduct></AddProduct>}></Route>
          <Route path="/product" element={<GetProduct></GetProduct>}></Route>
          <Route
            path="/updateProduct/:id"
            element={<EditProduct></EditProduct>}
          ></Route>
          <Route path="/showCart" element={<GetCart></GetCart>}></Route>
          <Route
            path="/payment"
            element={<PaymentGateway></PaymentGateway>}
          ></Route>
          {/* <Route path="/chat" element={<Chat></Chat>}></Route> */}
          <Route path="/chatapp" element={<ChatApp></ChatApp>}></Route>
          {/* <Route path="/test" element={<Test></Test>}></Route> */}
          <Route path="/userlist" element={<UserList></UserList>}></Route>

          <Route path="/done" element={<Testing></Testing>}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
