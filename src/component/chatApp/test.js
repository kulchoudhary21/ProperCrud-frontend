import React, { useEffect, useState } from "react";
import socket from "./io";

function Test() {
  const [inputField, setInputField] = useState({
    name: "",
    room: "",
    message: "",
  });
  const [isChatting, setIsChatting] = useState(false);
  const [messageList, setMessageList] = useState([]);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  function inputHandler(e) {
    setInputField({
      ...inputField,
      [e.target.name]: e.target.value,
    });
  }
  function enterRoom() {
    console.log(inputField);
    socket.emit("join_room", inputField.room);
    setIsChatting(true);
  }
  async function sendMessage() {
    await socket.emit("send_message", inputField);
    setMessageList([...messageList, inputField]);
    setInputField({ ...inputField, message: "" });
  }
  console.log(messageList);
  return (
    <div>
      <h4>Chat app</h4>
      {!isChatting ? (
        <>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={inputHandler}
          ></input>
          <input
            type="text"
            placeholder="Room"
            name="room"
            onChange={inputHandler}
          ></input>
          <button type="button" className="btn btn-primary" onClick={enterRoom}>
            enter chat room
          </button>
        </>
      ) : (
        <>
          <div>
            <h6>Chat box</h6>
            <div>
              <input
                type="text"
                name="message"
                placeholder="message"
                onChange={inputHandler}
                value={inputField.message}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={sendMessage}
              >
                send
              </button>
            </div>
            <div>
              {messageList ? (
                <>
                  <div>
                    {messageList.map((item) => {
                      return (
                        <h5>
                          {item.name} : {item.message}
                        </h5>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Test;
