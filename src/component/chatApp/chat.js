import React, { useRef } from "react";
import "./chat.css";
import { useEffect, useState } from "react";
import socket from "./io";
import "react-toastify/dist/ReactToastify.css";
import decryptCrypto from "../../utils/decryptCrypto";
import moment from "moment";
function Chat({ roomId, ReceiverId }) {
  const [messages, setMessage] = useState();
  const [render, setRender] = useState(false);
  const [allMessage, setAllMessages] = useState();
  const [lastMessages, setLastMessages] = useState({});
  const [inputField, setInputField] = useState({
    userReceiverId: "",
    roomId: "",
    messages: "",
    userReceiverId: "",
  });
  const bottomRef = useRef(null);
  useEffect(() => {
    console.log("============room id===========",roomId)
      enterRoom();
    }, [roomId]);

  useEffect(() => {
    socket.on("broadcast", (result, ls) => {
      console.log("result-27", result)
      console.log("roomiid",roomId)
      if(result.length > 0){
        if (result && result[0].id === roomId) {
          setAllMessages(result);
          setMessage(result.messages);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }else{
        setAllMessages([]);
      }
      
    });
  }, [socket]);

  async function enterRoom() {
    const name = await decryptCrypto();
    setInputField({
      ...inputField,
      roomId: roomId,
      messages: messages,
      userSenderId: name.id,
      userReceiverId: ReceiverId,
    });
    socket.emit("join_room", roomId);
    socket.on("broadcast", (result, lst) => {
      console.log("last11..", lst);
      setAllMessages(result);
    });
  }
  async function sendMessage() {
    try {
      console.log("inputField58",inputField)
      await socket.emit("send_message", inputField, lastMessages);
      setMessage(inputField.messages);
      setRender(!render);
      setInputField({ ...inputField, messages: "" });
    } catch (err) {
      console.log("error in chat");
    }
  }

  function inputHandler(e) {
    console.log("e.target.value", e.target.value);
    console.log("inputField", inputField);
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
    if (e.target.name == "messages") setLastMessages(e.target.value);
  }
  return (
    <div
      class="col-md-6 col-lg-7 col-xl-8"
      style={{
        height: "500px",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "rgb(179, 180, 233)",
        textAlign: "justify",
        border: "gray 2px solid",
        borderRadius: "30px",
      }}
    >
      <ul class="list-unstyled">
        {allMessage ? (
          <>
            {allMessage.map((item) => {
              return (
                <li class="d-flex justify-content-between mb-4">
                  <img
                    src={`http://localhost:3001/userDataImages/${item.userdatum.image}`}
                    alt="avatar"
                    class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                    width="60"
                  />
                  <div class="card">
                    <div class="card-header d-flex justify-content-between p-3">
                      <p class="fw-bold mb-0">{item.userdatum.name}</p>
                      <p
                        class="text-muted small mb-0"
                        style={{ marginLeft: "4px" }}
                      >
                        <i class="far fa-clock"></i>
                        {moment(item.createdAt)
                          .subtract(1, "days")
                          .format("h:mm a")}
                      </p>
                    </div>
                    <div class="card-body">
                      <p class="mb-0">{item.messages}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </>
        ) : null}
        <li class="bg-white mb-3">
          <div class="form-outline">
            <textarea
              class="form-control"
              id="textAreaExample2"
              rows="4"
              style={{ height: "15px" }}
              type="text"
              name="messages"
              placeholder="messages"
              onChange={inputHandler}
              value={inputField.messages}
            ></textarea>
            <div>
              <button
                type="button"
                style={{}}
                class="btn btn-info btn-rounded float-end"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;

// async function setUserMessage() {
//   const currentUser = await decryptCrypto();
//   // const data = {
//   //   roomId: roomId,
//   //   messages: message,
//   //   userSenderId: currentUser.id,
//   //   userReceiverId: ReceiverId,
//   // };
//   // const result = await postApi(
//   //   `${getURl.BASE_URL_MESSAGE}/setMessage`,
//   //   data,
//   //   true
//   // );
//   // if (result.status === 200 && result.data.roomCheck) {
//   //   console.log("in post ", result.data.data);
//   // } else {
//   //   toast.error(result.message, {
//   //     position: toast.POSITION.TOP_RIGHT,
//   //   });
//   // }
// }
