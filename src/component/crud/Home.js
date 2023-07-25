/* eslint-disable jsx-a11y/img-redundant-alt */
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";
import { deletApi, postApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
function Home() {
  const navigate = useNavigate();
  const [udata, setUdata] = useState();
  const [serachData, setSearchData] = useState();
  const [count, setCount] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [deleteId, setDeleteId] = useState();
  const [render, setRender] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getUserData();
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
  async function getUserData() {
    setLoader(true);
    let data = { search: serachData, pageNumber: pageNumber };
    console.log("pageNumber", pageNumber);

    try {
      const result = await postApi(`${getURl.BASE_URL_USER}/get`, data, true);
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
        `${getURl.BASE_URL_USER}/delete/${id}`,
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
      <div className="row">
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              navigate("/redux");
            }}
          >
            Redux
          </button>
        </div>
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              navigate("/userData");
            }}
          >
            Add
          </button>
        </div>
        <div
          className="col-6 "
          style={{ display: "flex", height: "fitContent", margin: "auto" }}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search by username and email"
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

        <div className="col-11 mt-4">
          {loader ? (
            <div className="m-5">
              <center>
                <Spinner animation="grow" variant="primary" />
              </center>
            </div>
          ) : (
            <div>
              {udata ? (
                <table className="table m-2">
                  <thead>
                    <tr>
                      <th scope="col">Image</th>
                      <th scope="col">Username</th>
                      <th scope="col">Name</th>
                      <th scope="col">User Type</th>
                      <th scope="col">Date of birth</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Email</th>
                      <th scope="col">CreatedAt</th>
                      <th scope="col">UpdatedAt</th>
                      <th scope="col">Action</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {udata.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <div
                              style={{
                                border: "1px black solid",
                                width: "35px",
                                height: "35px",
                                borderRadius: "15px",
                              }}
                            >
                              <img
                                src={`http://localhost:3001/userDataImages/${item.image}`}
                                style={{
                                  width: "35px",
                                  height: "35px",
                                  overflow: "none",
                                  border: "2px black solid",
                                  borderRadius: "15px",
                                }}
                                alt="image"
                              />
                            </div>
                          </td>
                          <th>{item.username}</th>
                          <td>{item.name}</td>
                          <td>{item.userType}</td>
                          <td>{item.age}</td>
                          <td>{item.gender}</td>
                          <td>{item.email}</td>
                          <td>
                            {moment(item.createdAt).format("MM/DD/YYYY")}{" "}
                          </td>
                          <td>
                            {moment(item.updatedAt).format("MM/DD/YYYY")}{" "}
                          </td>
                          <td>
                            <button
                              className="btn btn-success m-1"
                              onClick={() => {
                                navigate(`/updateData/${item.id}`, {
                                  idd: item.id,
                                });
                              }}
                            >
                              Edit
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-secondary"
                              onClick={() => setDeleteId(item.id)}
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </div>
          )}
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
    </div>
  );
}
export default Home;
