import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
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

function GetCart() {
  const headRender = useSelector((state) => state.isLogin.value);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [render, setRender] = useState(true);
  const [totalPrice, setTotalPrice] = useState();
  useEffect(() => {
    getCart();
  }, [render]);
  async function getCart() {
    try {
      const result = await getApi(`${getURl.BASE_URL_CART}/getCart`, true);
     
      if (result.status === 200) {
        console.log("result-28",result)
        if(result.data.data.length === 0){
          setData([]);
        }else{
          setData(result.data.data[0].usercarts);
        }
        // console.log("userdata", result.data.data[0].usercarts);
        // setData(result.data.data[0].usercarts);
        // data.map((item) => {
        //   sum += item.product.price;
        // });
        // setTotalPrice(sum);
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
      console.log("result==================",result)
      
      if (result.status === 200) {
        console.log("tryueue=====================", result);
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
  // useEffect(() => {
  //   if (data) {
  //     let sum = 0;
  //     data.map((item) => {
  //       sum += item.product.price;
  //     });
  //     setTotalPrice(sum); 
  //   }
  // }, [data]);
 
  return (
    <div>
      <div class="page-content page-container" id="page-content">
        <div class="padding">
          <div
            class="row container d-flex justify-content-center"
            style={{ margin: "10px" }}
          >
            <div class="col-lg-8 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Cart</h4>
                  <p class="card-description">All Product added to your cart</p>
                  {data.length > 0 ? (
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
                                     alt = ""/>
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
                  ) : ""}
                </div>
              </div>
              <div>
                <center>
                  {" "}
                  <button
                    className="btn btn-primary"
                    style={{ margin: "10px" }}
                  >
                    checkout
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetCart;
