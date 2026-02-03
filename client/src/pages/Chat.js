import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const roomId = "room_" + localStorage.getItem("anon_id");

  useEffect(() => {
    socket.emit("join_match", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("chat_cleared", () => {
      setMessages([]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message) return;

    socket.emit("send_message", {
      roomId,
      message,
    });

    setMessages((prev) => [
      ...prev,
      { text: message, sender: "me" },
    ]);

    setMessage("");
  };

  // 🔴 LEAVE CHAT
  const leaveChat = () => {
    socket.emit("leave_chat", roomId);
    setMessages([]); // local clear
    navigate("/match");
  };

  // 🟡 NEXT MATCH
  const nextMatch = () => {
    setMessages([]); // clear old chat
    navigate("/match");
  };

  // 🚩 REPORT USER
  const reportUser = () => {
    socket.emit("report_user", {
      roomId,
      reason: "Inappropriate behavior",
    });
    alert("User reported. Chat ended.");
    setMessages([]);
    navigate("/match");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>ChatBox</h2>

      <div style={{ minHeight: "150px" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender === "me" ? "You" : "Stranger"}:</b> {m.text}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={sendMessage}>Send</button>

      <hr />

      <button onClick={reportUser}>🚩 Report</button>
      <button onClick={leaveChat}>Leave</button>
      <button onClick={nextMatch}>Next</button>
    </div>
  );
}

export default Chat;
