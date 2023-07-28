import React, { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";
import { postApi } from "../../utils/apiUtils";
import getURl from "../../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import decryptCrypto from "../../utils/decryptCrypto";
import Chat from "./chat";
function UserList() {
  const [userList, setUserList] = useState();
  const [flag, setFlag] = useState();
  const [ReceiverId, setReceiverId] = useState();
  const [isChatting, setIsChatting] = useState(false);
  const [roomId, setRoomId] = useState();
  const chatBox = useMemo(
    () => <Chat flag={flag} roomId={roomId} ReceiverId={ReceiverId}></Chat>,
    [flag]
  );
  useEffect(() => {
    getUserList();
  }, []);
  async function checkRoom(userReceiverId) {
    try {
      setReceiverId(userReceiverId);
      const currentUser = await decryptCrypto();
      const obj = {
        userSenderId: currentUser.id,
        userReceiverId: userReceiverId,
      };
      const result = await postApi(`${getURl.BASE_URL_CHAT}/room`, obj, true);
      if (result.status === 200 && result.data.roomCheck) {
        console.log("userdatarrrrrr", result.data.data);
        console.log("roomId", result.data.data[0].id);
        setRoomId(result.data.data[0].id);
        setIsChatting(true);
        setFlag(result.data.data[0].id);
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      console.log("ee", err);
    }
  }
  const getUserList = async () => {
    try {
      const currentUser = await decryptCrypto();
      const result = await postApi(
        `${getURl.BASE_URL_CHAT}/users`,
        { id: currentUser.id },
        true
      );
      console.log(result);
      if (result) {
        setUserList(result.data.data);
      } else if (result.status == 400) {
        toast.error(result.response.data.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(result.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      console.log("error ", err);
    }
  };
  return (
    <>
      <section style={{ backgroundColor: "#eee" }}>
        <div class="container py-5">
          <div class="row">
            <div class="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
              <h5 class="font-weight-bold mb-3 text-center text-lg-start">
                Member
              </h5>
              <div class="card">
                <div class="card-body">
                  <ul class="list-unstyled mb-0">
                    {userList ? (
                      <>
                        {userList.map((item) => {
                          return (
                            <li
                              class="p-2 border-bottom"
                              style={{ backgroundColor: "#eee" }}
                            >
                              <Link
                                to="/chatapp"
                                class="d-flex justify-content-between"
                                style={{ textDecoration: "none" }}
                                onClick={() => checkRoom(item.id)}
                              >
                                <div class="d-flex flex-row">
                                  <img
                                    src={`http://localhost:3001/userDataImages/${item.image}`}
                                    alt="avatar"
                                    class="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                    width="60"
                                  />
                                  <div class="pt-1">
                                    <p class="fw-bold mb-0">{item.name}</p>
                                    <p class="small text-muted">
                                      Hello, Are you there?
                                    </p>
                                  </div>
                                </div>
                                <div class="pt-1">
                                  <p class="small text-muted mb-1">Just now</p>
                                  <span class="badge bg-danger float-end">
                                    1
                                  </span>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </>
                    ) : null}
                  </ul>
                </div>
              </div>
            </div>
            {isChatting ? chatBox : null}
          </div>
        </div>
      </section>
    </>
  );
}

export default UserList;
