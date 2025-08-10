import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUserDetails, isUserLoggedin, logoutUser } from "../utils/Login";
import "../css/Portal.css";
import { HiMiniBolt } from "react-icons/hi2";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import { MyContentions } from "./PoolContentions";
import { ContentionsAgainstMe } from "./ContentionsAgainstPool";

const SOCKET_URI = "http://localhost:8080";
// const SOCKET_URI = window.location.origin;

export function Portal() {
  let navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [poolContension, setPoolContension] = useState([]);
  const [againstContension, setAgainstContension] = useState([]);
  const [hall, setHall] = useState("");
  const [aHall, setAHall] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [para, setPara] = useState("");
  const [link, setLink] = useState("");
  const [activeTab, setActiveTab] = useState("submit");

  useEffect(() => {
    // Connect to backend
    const newSocket = io(SOCKET_URI, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    console.log(newSocket);

    // Save socket instance to state
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to server:", newSocket.id);
    });

    newSocket.on("load_feedbacks", (a) => {
      console.log("=== LOAD FEEDBACKS ===");
      console.log("Feedbacks data:", a);

      setPoolContension(a.data["byPool"]);
      setAgainstContension(a.data["againstPool"]);
    });

    newSocket.on("new_feedback", (feedback) => {
      console.log("=== NEW FEEDBACK RECEIVED ===");
      console.log("New feedback:", feedback);
      console.log("Previous feedbacks count:", poolContension.length);
      setPoolContension((prevFeedbacks) => [feedback, ...prevFeedbacks]);
      console.log("Updated feedbacks count:", poolContension.length + 1);
    });

    newSocket.on("status_changed", (feedback) => {
      setPoolContension((prevFeedbacks) =>
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      hall.length < 1 ||
      aHall.length < 1 ||
      problemStatement.length < 1 ||
      para.length < 1 ||
      link.length < 1
    ) {
      console.error("Form submission error: Please fill all fields correctly.");
      alert("Please enter all required fields");
      return;
    }
    if (hall === aHall) {
      console.error(
        "Form submission error: Pool cannot be the same as Against Pool."
      );
      alert("Pool cannot be the same as Against Pool.");
      return;
    }

    const userData = getUserDetails();
    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("User details:", userData);
    console.log("Current feedbacks before submit:", poolContension.length);

    socket.emit("submit_feedback", {
      username: userData.name,
      hall,
      aHall,
      problemStatement,
      para,
      link,
    });

    console.log("Submitted:", {
      username: userData.name,
      hall,
      aHall,
      problemStatement,
      para,
      link,
    });

    setHall("");
    setAHall("");
    setProblemStatement("");
    setPara("");
    setLink("");

    setActiveTab("my-contentions");

    console.log("Switched to tab: my-contentions");
    console.log("Current feedbacks after submit:", poolContension.length);
  };

  return (
    <div
      className="portal-box"
      style={{ backgroundColor: "#000000", color: "white", marginTop: "0px" }}
    >
      <div
        className="navbar"
        style={{
          display: "flex",
          color: "white",
          flexDirection: "row",
          border: "2px solid #7f7fff",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          alignItems: "center",
          backgroundColor: "#000000",
          marginTop: "0px",
          position: "fixed",
        }}
      >
        <img src={logo} alt="IIT Kanpur Logo" className="portal-logo" />

        <div className="navbar-center">
          <h2 className="portal-subtitle">Contention Portal</h2>
          <h3 className="portal-subtitle">TAKNEEK | IIT Kanpur</h3>
        </div>
        <button id="logout" onClick={() => logoutUser()}>
          Logout
        </button>
      </div>

      {getUserDetails().role == "user" && (
        <div
          className="tab-navigation"
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
            flexWrap: "wrap",
            width: "100%",
            flexDirection: "row",
            position: "fixed",
            top: "100px",
            zIndex: 1000,
            backgroundColor: "#1a1a1a",
            borderBottom: "2px solid #7f7fff",
            padding: "0",
          }}
        >
          <button
            className={`tab-button ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => setActiveTab("submit")}
            style={{
              padding: "15px 30px",
              backgroundColor:
                activeTab === "submit" ? "#7f7fff" : "transparent",
              color: activeTab === "submit" ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
              borderRight: "1px solid #7f7fff",
            }}
          >
            Submit
          </button>

          <button
            className={`tab-button ${
              activeTab === "my-contentions" ? "active" : ""
            }`}
            onClick={() => setActiveTab("my-contentions")}
            style={{
              padding: "15px 30px",
              backgroundColor:
                activeTab === "my-contentions" ? "#7f7fff" : "transparent",
              color: activeTab === "my-contentions" ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
              borderRight: "1px solid #7f7fff",
            }}
          >
            My Contentions
          </button>
          <button
            className={`tab-button ${
              activeTab === "against-me" ? "active" : ""
            }`}
            onClick={() => setActiveTab("against-me")}
            style={{
              padding: "15px 30px",
              backgroundColor:
                activeTab === "against-me" ? "#7f7fff" : "transparent",
              color: activeTab === "against-me" ? "#000" : "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Against My Pool
          </button>
        </div>
      )}

      <div className="tab-content">
        {getUserDetails().role === "user" && activeTab === "submit" && (
          <div className="contention-form">
            <form className="feedback-input" onSubmit={handleFormSubmit}>
              <label
                htmlFor="pool-select"
                style={{
                  color: "white",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <select
                  className="feedback-submit"
                  value={hall}
                  onChange={(e) => setHall(e.target.value)}
                >
                  <option value="">Select Your Pool</option>
                  <option value="Pool1">Pool1</option>
                  <option value="Pool2">Pool2</option>
                  <option value="Pool3">Pool3</option>
                  <option value="Pool4">Pool4</option>
                  <option value="Pool5">Pool5</option>
                </select>
              </label>

              <label
                htmlFor="against-hall"
                style={{
                  color: "white",
                  backgroundColor: "white",
                  width: "100%",
                }}
              >
                <select
                  className="feedback-submit"
                  value={aHall}
                  onChange={(e) => setAHall(e.target.value)}
                >
                  <option value="">Against</option>
                  <option value="Pool1">Pool1</option>
                  <option value="Pool2">Pool2</option>
                  <option value="Pool3">Pool3</option>
                  <option value="Pool4">Pool4</option>
                  <option value="Pool5">Pool5</option>
                </select>
              </label>

              <label htmlFor="problem-statement">
                <input
                  className="feedback-submit"
                  type="text"
                  placeholder="Enter problem statement"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  required
                />
                <HiMiniBolt />
              </label>

              <label htmlFor="text">
                <input
                  className="feedback-submit"
                  type="text"
                  placeholder="Description"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                />
                <HiMiniBolt />
              </label>

              <label htmlFor="link">
                <input
                  className="feedback-submit"
                  type="text"
                  placeholder="Any references or links"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <HiMiniBolt />
              </label>

              <input type="submit" value={"Submit"} />
            </form>
          </div>
        )}

        {getUserDetails().role === "user" && activeTab === "my-contentions" && (
          <MyContentions feedbacks={poolContension} />
        )}

        {getUserDetails().role === "user" && activeTab === "against-me" && (
          <ContentionsAgainstMe feedbacks={againstContension} socket={socket} />
        )}

        {getUserDetails().role === "admin" && (
          <div className="container">
            <h2 style={{ color: "white", marginBottom: "20px" }}>
              All Contentions
            </h2>
            {poolContension.length > 0 ? (
              poolContension.map((feedback) => {
                return (
                  <div className="feedback-card" key={feedback._id}>
                    <div className="feedback-header">
                      <span className={`status ${feedback.status}`}>
                        {feedback.status}
                      </span>
                      <p>
                        <strong>From:</strong> {feedback.hall}
                      </p>
                      <p>
                        <strong>Against:</strong> {feedback.againstHall}
                      </p>
                      <p>
                        <strong>Problem:</strong> {feedback.problemStatement}
                      </p>
                      {feedback.para && (
                        <p>
                          <strong>Description:</strong> {feedback.para}
                        </p>
                      )}
                      {feedback.link && (
                        <p>
                          <strong>Link:</strong>{" "}
                          <a
                            href={feedback.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {feedback.link}
                          </a>
                        </p>
                      )}
                      <span className="username">
                        Submitted by: {feedback.username}
                      </span>

                      <button
                        className="toggle-btn"
                        onClick={() => {
                          socket.emit("change_status", {
                            id: feedback._id,
                            status:
                              feedback.status === "pending"
                                ? "reviewed"
                                : "pending",
                          });
                        }}
                      >
                        Toggle Review
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <h2>No contentions yet</h2>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



