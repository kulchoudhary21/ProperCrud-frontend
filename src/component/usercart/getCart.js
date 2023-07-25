import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import decryptCrypto from "../../utils/decryptCrypto";
import { deletApi, getApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsLogin } from "../store/isLoginSlice";
import { setCounter } from "../store/cartCounterSlice";
import PaymentGateway from "../paymentGateway/paymentGateway";
import { postApi } from "../../utils/apiUtils";
import logo from "../../assets/lgo.png";
import emptyImageCart from "../../assets/emptycartimg.png";

function GetCart() {
  const headRender = useSelector((state) => state.isLogin.value);
  const cartCounter = useSelector((state) => state.cartCounter.value);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [render, setRender] = useState(true);
  const [totalPrice, setTotalPrice] = useState();
  const [priceRender, setPriceRender] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    getCart();
    getTotalPrice();
  }, [render]);
  useEffect(() => {
    getTotalPrice();
  }, [priceRender]);
  async function getTotalPrice() {
    let sum = 0;
    await data.map((item) => {
      sum += item.product.price;
      console.log("sunm", sum);
    });
    setTotalPrice(sum);
  }
  async function getCart() {
    try {
      const result = await getApi(`${getURl.BASE_URL_CART}/getCart`, true);
      if (result.status === 200) {
        console.log("result-28", result);
        if (result.data.data.length === 0) {
          setData([]);
        } else {
          setData(result.data.data[0].usercarts);
        }
        console.log("userdata", result.data.data[0].usercarts);
        setPriceRender(!priceRender);
        console.log("userdatainini", result.data.count);
        dispatch(setCounter(result.data.count));
        console.log("-------", result.data.count);
        dispatch(setIsLogin(!headRender));
      } else if (result.response.data.status) {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (result.status === 400) {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.log("rererer", result);
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      console.log("eeeee", err);
    }
  }
  async function removeCart(id) {
    try {
      console.log("ididi-", id);
      const result = await deletApi(
        `${getURl.BASE_URL_CART}/removeCart/${id}`,
        true
      );
      console.log("result==================", result);
      if (result.status === 200) {
        console.log("tryueue=====================", result);
        dispatch(setCounter(result.data.count));
        console.log("render=====================", render);
        setRender(!render);
        dispatch(setIsLogin(!headRender));
        toast.success(result.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (result.status === 400) {
        console.log("tryueue11.......", result);
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setRender(!render);
      } else {
        console.log("tryueue22.......", result);
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setRender(!render);
      }
    } catch (err) {
      console.log("eeeee", err);
    }
  }
  /////////////////////////------payment gateway start---------------//////////////////////////

  function loadScript(src) {
    console.log("yaha tk11");
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      console.log("sresrs11", script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      console.log("sresrs1122", src);
      document.body.appendChild(script);
    });
  }

  const handlePayment = async () => {
    console.log("data--", data);
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    console.log("res,,,,,", res);
    if (!res) {
      console.log("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const paymentOptions = {
      amount: totalPrice * 100,
      currency: "INR",
      order_id: "ljendfechn",
      payment_capture: 0,
    };
    const result = await postApi(
      `${getURl.BASE_URL_PAYMENT}/create`,
      paymentOptions,
      true
    );

    if (!result) {
      console.log("Server error. Are you online?");
      return;
    }
    console.log("amamam", result);
    const { amount, id: order_id, currency } = result.data.data;

    const options = {
      key: "rzp_test_vwK5Q8YXbcB5nG", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "kuldeep corp...",
      description: "Test Transaction",
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        console.log("response", response);
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        console.log("---3r2drfrecd--dfewd", options);
        const result = await postApi(
          `${getURl.BASE_URL_PAYMENT}/success`,
          data,
          true
        );

        console.log("-----", result);
      },
      prefill: {
        name: "Kuldeep",
        email: "kuldeep@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "kuldeep Office",
      },
      theme: {
        color: "#61dafb",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  /////////////////////////------payment gateway end---------------//////////////////////////

  return (
    <div>
      <div class="page-content page-container" id="page-content">
        <div class="padding">
          <div
            class="row container d-flex justify-content-center"
            style={{ margin: "10px" }}
          >
            <div class="col-lg-8 grid-margin stretch-card">
              {data.length > 0 ? (
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Cart</h4>
                    <p class="card-description">
                      All Product added to your cart
                    </p>

                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>ID No.</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Created On</th>
                            <th>Remove Product</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td>
                                    <img
                                      src={`http://localhost:3001/productDataImages/${item.product.image}`}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        border: "1px solid black",
                                        borderRadius: "30px",
                                        marginRight: "10px",
                                      }}
                                      alt=""
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{item.product.productName}</td>
                                  <td>{item.product.price} ₹</td>
                                  <td>
                                    {moment(item.createdAt).format(
                                      "MM/DD/YYYY"
                                    )}{" "}
                                  </td>
                                  <td>
                                    <Link
                                      onClick={() => {
                                        dispatch(setIsLogin(!headRender));
                                        removeCart(item.id);
                                      }}
                                    >
                                      <DeleteIcon></DeleteIcon>
                                    </Link>
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                      <div>Total Product : {data.length}</div>
                      <div>Total Price : {totalPrice} ₹</div>
                    </div>
                  </div>
                  <div>
                    <center>
                      {" "}
                      <button
                        className="btn btn-primary"
                        style={{ margin: "10px" }}
                        onClick={() => handlePayment()}
                      >
                        checkout
                      </button>
                    </center>
                  </div>
                </div>
              ) : (
                <div>
                  <center>
                    <img src={emptyImageCart} alt="emptycart" />
                  </center>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetCart;
