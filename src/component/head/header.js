import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogin } from "../store/isLoginSlice";
import decryptCrypto from "../../utils/decryptCrypto";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Stack } from "@mui/material";
import { getApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Header() {
  const navigate = useNavigate();
  const [userInfoToken, setUserInfoToken] = useState();
  const [checker, setChecker] = useState();
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();
  const count = useSelector((state) => state.isLogin.value);
  async function checkStatus() {
    setUserInfoToken(await decryptCrypto());
    console.log(userInfoToken);
    const userInfo = localStorage.getItem("accessToken");
    if (userInfo) {
      setChecker(true);
    } else {
      setChecker(false);
    }
  }
  async function getCount() {
    try {
      setUserInfoToken(await decryptCrypto());
      const result = await getApi(`${getURl.BASE_URL_CART}/getCountCart`, true);
      console.log("rrr..", result);

      if (result.status === 200) {
        console.log("tryueue");
        setCartCount(result.data.count);
        // dispatch(setIsLogin(!count));
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      console.log("in count", err);
    }
  }
  useEffect(() => {
    getCount();
    checkStatus();
  }, [count]);
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        {userInfoToken ? (
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li>
                  <>
                    <div
                      style={{ display: "flex", marginLeft: "2px" }}
                      className="nav-link"
                    >
                      <img
                        src={`http://localhost:3001/userDataImages/${userInfoToken.image}`}
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "1px solid black",
                          borderRadius: "30px",
                          marginRight: "10px",
                        }}
                      />
                      <h6>{userInfoToken.name}</h6>
                    </div>
                  </>
                </li>
                {userInfoToken.userType === "shopOwner" ? (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        aria-current="page"
                        to="/addProduct"
                      >
                        Add Product
                      </Link>
                    </li>
                  </>
                ) : null}
                <>
                  {userInfoToken.userType === "user" ? (
                    <>
                      <li>
                        <Link
                          className="nav-link"
                          to="/showCart"
                          style={{ position: "absolute", right: "15%" }}
                        >
                          <Stack
                            spacing={4}
                            direction="row"
                            sx={{ color: "action.active" }}
                          >
                            <Badge
                              color="secondary"
                              showZero
                              badgeContent={cartCount}
                              
                            >
                              <ShoppingCartIcon />
                            </Badge>
                          </Stack>
                        </Link>
                      </li>
                    </>
                  ) : null}
                </>
                <>
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{ position: "absolute", right: "5%" }}
                    onClick={() => {
                      localStorage.removeItem("userInfo");
                      localStorage.removeItem("accessToken");
                      dispatch(setIsLogin(!count));
                      navigate("/login");
                    }}
                  >
                    Logout
                  </Link>
                </>
              </ul>
            </div>
          </div>
        ) : (
          <div className="container-fluid">
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" aria-current="page" to="/">
                    Ecommerce
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/login"
                    style={{ position: "absolute", right: "15%" }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={{ position: "absolute", right: "5%" }}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Header;
