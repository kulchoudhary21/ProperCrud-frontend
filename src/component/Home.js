/* eslint-disable jsx-a11y/img-redundant-alt */
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
function Home() {
  const navigate = useNavigate();
  const [udata, setUdata] = useState();
  function getUserData() {
    axios
      .get("http://localhost:3001/user/get")
      .then((data) => {
        console.log("userdata", data.data.data);
        setUdata(data.data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  function deleteUser(id) {
    axios
      .put(`http://localhost:3001/user/delete/${id}`)
      .then((data) => {
        getUserData();
        toast.success("user Successfully deleted !", {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log(data);
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        console.log("err in delete:", err.response.data.message);
      });
  }
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <div>
      <div className="row">
        <div className="col-11">
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
        {udata ? (
          <div className="col-11">
            <table className="table m-2">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">username</th>
                  <th scope="col">name</th>
                  <th scope="col">age</th>
                  <th scope="col">gender</th>
                  <th scope="col">email</th>
                  <th scope="col">createdAt</th>
                  <th scope="col">UpdatedAt</th>
                  <th scope="col">Action</th>
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
                            src={`http://localhost:3001/${item.image}`}
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
                          onClick={() => deleteUser(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        <ToastContainer />
      </div>
    </div>
  );
}
export default Home;
