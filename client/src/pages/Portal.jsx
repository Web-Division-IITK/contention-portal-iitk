import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUserDetails, isUserLoggedin, logoutUser } from "../utils/Login";
import "../css/Portal.css";
import { HiMiniBolt } from "react-icons/hi2";
import io from "socket.io-client";

// const SOCKET_URI = "http://localhost:8080";
const SOCKET_URI = window.location.origin;

export function Portal() {
  let navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Connect to backend
    const newSocket = io(SOCKET_URI, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    // Save socket instance to state
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
    });

    newSocket.on("load_feedbacks", (a) => {
      setFeedbacks(a);
    });

    newSocket.on("new_feedback", (feedback) => {
      setFeedbacks((prevFeedbacks) => [feedback, ...prevFeedbacks]);
    });

    newSocket.on("status_changed", (feedback) => {
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((e) => {
          if (e._id == feedback.id) {
            e.status = feedback.status;
          }
          return e;
        })
      );
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isUserLoggedin()) navigate("/");
  });

  return (
    <div className="portal-box">
      {getUserDetails().role == "user" && (
        <form
          className="feedback-input"
          onSubmit={(e) => {
            e.preventDefault();
            if (feedback.length < 1) {
              alert("Please enter feedback");
              return;
            }
            const userData = getUserDetails();
            socket.emit("submit_feedback", {
              username: userData.name,
              feedback,
            });
            setFeedback("");
          }}
        >
          <label htmlFor="feedback">
            <input
              className="feedback-submit"
              type="text"
              placeholder="Feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
            <HiMiniBolt />
            <input type="submit" value={"Submit"} />
          </label>
        </form>
      )}

      <div className="container">
        {feedbacks.length > 0 ? (
          feedbacks.map((feedback) => {
            return (
              <div className="feedback-card" key={feedback._id}>
                <div className="feedback-header">
                  <span className={`status ${feedback.status}`}>
                    {feedback.status}
                  </span>
                  <p className="feedback-text">{feedback.feedbackText}</p>
                  <span className="username">{feedback.username}</span>

                  {getUserDetails().role == "admin" && (
                    <button
                      className="toggle-btn"
                      onClick={() => {
                        socket.emit("change_status", {
                          id: feedback._id,
                          status:
                            feedback.status == "pending"
                              ? "reviewed"
                              : "pending",
                        });
                      }}
                    >
                      Toggle Review
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <h2>No feedbacks yet</h2>
        )}
      </div>

      <button id="logout" onClick={() => logoutUser()}>Logout</button>
    </div>
  );
}
