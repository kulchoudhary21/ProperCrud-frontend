import "./App.css";
import Home from "./component/Home";
import UserData from "./component/UserData";
import UpdateUser from "./component/UpdateUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/userData" element={<UserData></UserData>}></Route>
          <Route path="/updateData/:id" element={<UpdateUser></UpdateUser>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
