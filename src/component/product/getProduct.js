import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReactPaginate from "react-paginate";
import { deletApi, postApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import { ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import decryptCrypto from "../../utils/decryptCrypto";
import { setIsLogin } from "../store/isLoginSlice";
import { setCounter } from "../store/cartCounterSlice";
function GetProduct() {
  const [userInfoToken, setUserInfoToken] = useState();
  const dispatch = useDispatch();
  const checker = useSelector((state) => state.isLogin.value);
  const navigate = useNavigate();
  const [udata, setUdata] = useState();
  const [serachData, setSearchData] = useState();
  const [count, setCount] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [deleteId, setDeleteId] = useState();
  const [render, setRender] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getProductData();
  }, [render]);
  function handlePageClick(e) {
    console.log("e.selected", e.selected);
    setPageNumber(e.selected);
    setRender(!render);
  }
  function onClickHandler() {
    setPageNumber(0);
    setRender(!render);
  }
  async function getProductData() {
    try {
      setUserInfoToken(await decryptCrypto());
      setLoader(true);
      let data = { search: serachData, pageNumber: pageNumber };
      console.log("pageNumber", pageNumber);

      const result = await postApi(
        `${getURl.BASE_URL_PRODUCT}/getProduct`,
        data,
        true
      );
      console.log("res11", userInfoToken);
      if (result.status === 200) {
        console.log("userdata", result.data.data);
        setUdata(result.data.data);
        setCount(result.data.count);
        console.log("chchchchchch", result.data.cartcount);
        dispatch(setCounter(result.data.cartcount));
        dispatch(setIsLogin(!checker));
        setLoader(false);
        console.log("ddaattaa", udata);
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }
  async function deleteUser(id) {
    try {
      const result = await deletApi(
        `${getURl.BASE_URL_PRODUCT}/deleteProduct/${id}`,
        true
      );
      setRender(!render);
      console.log("res11", result);
      if (result.status === 200) {
        toast.success("product Successfully deleted !", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(result);
        dispatch(setIsLogin(!checker));
      } else {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("err in delete:", result.response.data.message);
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }

  async function createCart(productId) {
    try {
      const userId = await userInfoToken.id;
      const Formdata = new FormData();
      Formdata.append("userId", userId);
      Formdata.append("productId", productId);
      const result = await postApi(
        `${getURl.BASE_URL_CART}/addCart`,
        Formdata,
        true
      );
      console.log("res_in", result);
      if (result.status === 200) {
        toast.success("product added to cart!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setRender(!render)
        dispatch(setIsLogin(!checker));
        setLoader(false);
      } else {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        setLoader(false);
      }
      setLoader(false);
    } catch (err) {
      console.log("ee", err);
    }
  }
  return (
    <div>
      <div
        className="col-6 "
        style={{ display: "flex", height: "fitContent", margin: "auto",marginBottom:"20px" }}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search by Name/Title"
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
        />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => onClickHandler()}
        >
          Search
        </button>
      </div>
      <div>
        {udata ? (
          <div
            style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            {udata.map((item, index) => {
              return (
                <div>
                  <Card
                    style={{ width: "13rem", height: "30rem", margin: "20px" }}
                    className="shadow-lg bg-white rounded border"
                    key={index}
                  >
                    <Card.Img
                      className="rounded"
                      variant="top"
                      src={`http://localhost:3001/productDataImages/${item.image}`}
                      style={{ width: "13rem", height: "13rem" }}
                    />
                    <Card.Body>
                      <ListGroup className="list-group-flush">
                        {userInfoToken.userType === "admin" ? (
                          <>
                            <ListGroup.Item>
                              user : {item.userdatum.name}
                            </ListGroup.Item>
                          </>
                        ) : null}
                        <ListGroup.Item>
                          <Card.Text>
                            <h6>name : {item.productName}</h6>
                          </Card.Text>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          model : {item.productModel}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          desc : {item.productTitle}
                        </ListGroup.Item>
                        <ListGroup.Item>price : {item.price}</ListGroup.Item>
                      </ListGroup>
                      {userInfoToken &&
                      userInfoToken.userType === "shopOwner" ? (
                        <>
                          <div className="mt-2">
                            <Button
                              variant="primary"
                              style={{ marginRight: "10%" }}
                              onClick={() => {
                                navigate(`/updateProduct/${item.id}`);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => {
                                setDeleteId(item.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      ) : null}
                      {userInfoToken.userType === "user" ? (
                        <>
                          <div className="mt-2">
                            <Button
                              variant="primary"
                              style={{ marginLeft: "20%" }}
                              onClick={() => {
                                createCart(item.id);
                              }}
                            >
                              Add to cart
                            </Button>
                          </div>
                        </>
                      ) : null}
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to delete</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => {
                  deleteUser(deleteId);
                  // dispatch(setIsLogin(!checker));
                }}
              >
                yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={count}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default GetProduct;
