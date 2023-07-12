import "./App.css";
import Home from "./component/Home";
import UserData from "./component/UserData";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/userData" element={<UserData></UserData>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
