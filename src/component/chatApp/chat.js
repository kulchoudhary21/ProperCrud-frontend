import React, { useRef } from "react";
import "./chat.css";
import { useEffect, useState } from "react";
import socket from "./io";
import "react-toastify/dist/ReactToastify.css";
import decryptCrypto from "../../utils/decryptCrypto";
import moment from "moment";
function Chat({ roomId, ReceiverId, currentUserId }) {
  const [messages, setMessage] = useState();
  const [allMessage, setAllMessages] = useState();
  const [inputField, setInputField] = useState({
    userReceiverId: "",
    roomId: "",
    messages: "",
    userReceiverId: "",
    isRead: false,
  });
  const bottomRef = useRef(null);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    console.log("============room id===========", roomId);
    scrollToBottom();
    enterRoom();

  }, [roomId]);

  useEffect(() => {
    
    socket.on("broadcast", (result, selfId) => {
      if (result.length > 0) {
        if (result && result[0].id === roomId) {
          setAllMessages(result);
          setMessage(result.messages);
        }
      } else {
        setAllMessages([]);
      }
    });
    scrollToBottom();
  }, [socket]);


  async function enterRoom() {
    console.log("entring in rooom")
    // setInputField({ ...inputField, messages: "" });
    const name = await decryptCrypto();
    setInputField({
      ...inputField,
      roomId: roomId,
      messages: messages,
      userSenderId: name.id,
      userReceiverId: ReceiverId,
    });
    socket.emit("join_room", roomId);
    await socket.on("broadcast", (result) => {
      console.log("last11..", result);
      setAllMessages(result);
      console.log("--rgbhn--gkj", result);
    });
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  async function sendMessage() {
    try {
      console.log("inputField58", inputField);
      await socket.emit("send_message", inputField);
      setMessage(inputField.messages);
      setInputField({ ...inputField, messages: "" });
      setInputField({ ...inputField, messages: "" });
      scrollToBottom();
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
  }
  function handleKeypress(e) {
    console.log("eeeeeeee", e.keyCode);
    if (e.key === "Enter") {
      sendMessage();
    }
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
                <>
                  {item.userSenderId == currentUserId ? (
                    <li class="d-flex justify-content-between mb-4">
                      <img
                        src={`http://localhost:3001/userDataImages/${item.userdatum.image}`}
                        alt="avatar"
                        class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                        width="60"
                      />
                      <div class="card w-100">
                        <div
                          class="card-header d-flex justify-content-between p-3"
                          style={{ background: "#C7ECFC" }}
                        >
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
                        <div
                          class="card-body"
                          style={{ background: "#C7ECFC" }}
                        >
                          <p class="mb-0">{item.messages}</p>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li class="d-flex justify-content-between mb-4">
                      <div class="card w-100">
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
                      <img
                        src={`http://localhost:3001/userDataImages/${item.userdatum.image}`}
                        alt="avatar"
                        class="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                        width="60"
                      />
                    </li>
                  )}
                </>
              );
            })}
          </>
        ) : null}

        <li class="bg-white mb-3">
          <div class="form-outline">
            <input
              class="input form-control"
              id="textAreaExample2"
              rows="10"
              // style={{ height: "15px" }}
              type="text"
              name="messages"
              placeholder="messages"
              onChange={inputHandler}
              onKeyDown={handleKeypress}
              value={inputField.messages}
            ></input>
            <div>
              <button
                type="button"
                style={{}}
                class="btn btn-info btn-rounded float-end"
                onClick={() => sendMessage()}
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
