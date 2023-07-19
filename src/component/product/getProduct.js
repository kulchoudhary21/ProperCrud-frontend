import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import { deletApi, postApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import { ListGroup } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

function GetProduct() {
  const [show, setShow] = useState(false);
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
    setLoader(true);
    let data = { search: serachData, pageNumber: pageNumber };
    console.log("pageNumber", pageNumber);

    try {
      const result = await postApi(
        `${getURl.BASE_URL_PRODUCT}/getProduct`,
        data,
        true
      );
      console.log("res11", result);
      if (result.status === 200) {
        console.log("tryueue");
        console.log("userdata", result.data.data);
        setUdata(result.data.data);
        setCount(result.data.count);
        setLoader(false);
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
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
      console.log("res11", result);
      if (result.status === 200) {
        setRender(!render);
        toast.success("user Successfully deleted !", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(result);
      } else {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log("err in delete:", result.response.data.message);
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
        style={{ display: "flex", height: "fitContent", margin: "auto" }}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search by name/title"
          onChange={(e) => {
            setSearchData(e.target.value);
          }}
        />
        <button
          class="btn btn-primary"
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
                <Card
                  style={{ width: "13rem", margin: "20px" }}
                  className="shadow-lg bg-white rounded border"
                >
                  <Card.Img
                    className="rounded"
                    variant="top"
                    src={`http://localhost:3001/productDataImages/${item.image}`}
                    style={{ width: "13rem", height: "13rem", }}
                  />
                  <Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>
                        <Card.Title>name : {item.productName}</Card.Title>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        model : {item.productModel}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        desc : {item.productTitle}
                      </ListGroup.Item>
                    </ListGroup>
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
                          setShow(true);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        ) : null}
      </div>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">Are you sure you want to delete</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => deleteUser(deleteId)}
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
