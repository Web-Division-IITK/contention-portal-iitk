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
import { Admin } from "./Admin";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { BASEURL } from "../utils/Login";
 import { FiLogOut } from "react-icons/fi";

// const SOCKET_URI = import.meta.env.VITE_SOCKET_URL;
const SOCKET_URI = "http://localhost:8080";
//export const socket = io(SOCKET_URI);

const toastData = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

export function Portal() {
  const userData = getUserDetails();

  let navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [poolContention, setPoolContention] = useState("");
  const [PS, setPS] = useState(new Array());
  const [club, setClub] = useState("");
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

    // Save socket instance to state
    setSocket(newSocket);

    newSocket.on("connect", () => {});

    newSocket.on("load_feedbacks", (a) => {
      setPoolContention(a.data);
    });

    newSocket.on("new_feedback", (feedback) => {
      if (userData.role === "admin") {
        toast.info(`${feedback.pool} filed a contention for ${feedback.club} PS`, toastData);
        setPoolContention((data) => {
          let tempData = { ...data };
          const feedbackExists = tempData[feedback.pool].some(
            (item) => item._id === feedback._id
          );
          if (!feedbackExists) {
            tempData[feedback.pool].push(feedback);
          }
          return tempData;
        });
      } else {
        if (feedback.pool == userData.pool) {
          toast.info(`Your Pool filed a contention for ${feedback.club} PS`, toastData);
          setPoolContention((prevFeedbacks) => [feedback, ...prevFeedbacks]);
        }
      }
    });

    newSocket.on("status_changed", (statusData) => {
      if (userData.role === "admin") {
        if (statusData.status == "accepted")
          toast.info(
            `${statusData.feedback.pool} contention for ${statusData.feedback.club} PS got Accepted`,
            toastData
          );
        else
          toast.info(
            `${statusData.feedback.pool} contention for ${statusData.feedback.club} PS got Rejected`,
            toastData
          );

        setPoolContention((data) => {
          let tempData = { ...data };
          tempData[statusData.feedback.pool].find(
            (e) => e._id == statusData.feedback._id
          )["status"] = statusData.status;
          return tempData;
        });
      } else {
        if (userData.pool == statusData.feedback.pool) {
          if (statusData.status == "accepted")
            toast.success(
              `Your contention for ${statusData.feedback.againstPool} PS got Accepted`,
              toastData
            );
          else
            toast.warn(
              `Your contention for ${statusData.feedback.againstPool} PS got Rejected`,
              toastData
            );

          setPoolContention((data) => {
            let tempData = [...data];
            tempData.find((e) => e._id == statusData.feedback._id)["status"] =
              statusData.status;
            return tempData;
          });
        }
      }
    });

    newSocket.on("disconnect", () => {});

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isUserLoggedin()) navigate("/");
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(problemStatement, para, club);
    if (!problemStatement || para.length < 1 || !club) {
      console.error("Form submission error: Please fill all fields correctly.");
      alert("Please enter all required fields");
      return;
    }

    socket.emit("submit_feedback", {
      problemStatement: problemStatement,
      club,
      description: para,
      drive: link,
    });

    setProblemStatement("");
    setPara("");
    setLink("");

    setActiveTab("my-contentions");
  };

  return (
    <div
      className="portal-box"
      style={{
        backgroundColor: "#000000",
        color: "white",
        marginTop: "0px",
        position: "relative",
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

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
        }}
      >
        <img src={logo} alt="IIT Kanpur Logo" className="portal-logo" />
       
       

        <div className="navbar-center" style={{ flex: 1, textAlign: "center" }}>
          <h2
            className="portal-subtitle"
            style={{ fontStyle: "initial", fontFamily: "serif" }}
          >
            Contention Portal
          </h2>
          <h3
            className="portal-subtitle"
            style={{ fontStyle: "initial", fontFamily: "serif" }}
          >
            TAKNEEK'25 | IIT Kanpur
          </h3>
        </div>

        <button id="logout" onClick={() => logoutUser()} style={{display: "flex",
    alignItems: "center",
    gap: "8px"}} >
           <FiLogOut className="logout-icon" />
  <span className="logout-text">Logout</span>
        </button>
        
      </div>
    
  {getUserDetails().role === "admin" && (
  <div className="admin-info">
    <span role="img" aria-label="crown" style={{fontSize: "1.5em"}}>👑</span>
    Welcome, Admin!
    <span className="club-name">
      {userData.club}
    </span>
  </div>

  
)}
{getUserDetails().role === "user" && (
  <div className="admin-info">
    <span role="img" aria-label="crown" style={{fontSize: "1.5em"}}></span>
    Welcome,  <span className="club-name">
      {userData.pool}
    </span>
   
  </div>

  
)}
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
            position: "sticky",
            top: "0",
            zIndex: 1000,
            backgroundColor: "#000000ff",
            border: "0",
            padding: "10px 0",
          }}
        >
          <button
            className={`tab-button ${activeTab === "submit" ? "active" : ""}`}
            onClick={() => setActiveTab("submit")}
            style={{
              backgroundColor:
                activeTab === "submit" ? "#7f7fff" : "transparent",
              color: activeTab === "submit" ? "#000" : "#fff",
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
              backgroundColor:
                activeTab === "my-contentions" ? "#7f7fff" : "transparent",
              color: activeTab === "my-contentions" ? "#000" : "#fff",
            }}
          >
            My Contentions
          </button>
          {/* <button
            className={`tab-button ${
              activeTab === "against-me" ? "active" : ""
            }`}
            onClick={() => setActiveTab("against-me")}
            style={{
              backgroundColor:
                activeTab === "against-me" ? "#7f7fff" : "transparent",
              color: activeTab === "against-me" ? "#000" : "#fff",
            }}
          >
            Against My Pool
          </button> */}
          <hr
            style={{
              width: "100%",
              color: "#7f7fff",
              opacity: "1",
              border: "1px solid #7f7fff",
            }}
          />
        </div>
      )}

      <div className="tab-content">
        {getUserDetails().role === "user" && activeTab === "submit" && (
          <div
            className="contention-form"
            style={{
              marginTop: "1px",
              borderTop: "2px solid #7f7fff",
              borderRight: "2px solid #7f7fff",
              borderBottom: "2px solid #7f7fff",
              borderLeft: "8px solid #7f7fff",
            }}
          >
           <form className="feedback-input" onSubmit={handleFormSubmit}>
  <label htmlFor="club" style={{ color: "white" }}>
     <b>Entity:</b>
    <select
      className="feedback-submit"
      value={club}
      onChange={async (e) => {
        setPS([]);
        setClub(e.target.value);

        let res = await fetch(BASEURL + "/problemstatement/" + e.target.value);
        let data = await res.json();

        setPS(data.data.map((e) => e.title));
        setProblemStatement(data.data[0].title);
      }}
      style={{
        border: "2px solid #f7f7f9ff",
        color: "white",
        fontSize: "1rem",
        background: "transparent",
          maxWidth: "90%",       
      whiteSpace: "normal",    
      wordBreak: "break-word", 
       display: "block",       // dropdown on new line
        marginTop: "0.3rem", 
      }}
    >
      {[
        "Select Club",
        "Aeromodelling Club",
        "Astronomy Club",
        "Brain and Cognitive Science Club",
        "Electronics Club",
        "Finance and Analytics Club",
        "Game Development Club",
        "Programming Club",
        "Robotics Club",
        "DesCon Society",
        "IITK Consulting Group",
        "SciMathSoc",
        "Speedcubing"
      ].map((e) => (
        <option key={e} value={e} style={{ fontSize: "1rem", color: "black" }}>
          {e}
        </option>
      ))}
    </select>
  </label>

  <label htmlFor="ps" style={{ color: "white" }}>
    <b>PS:</b>
    <select
      className="problem-statement feedback-submit"
      value={problemStatement}
      onChange={(e) => setProblemStatement(e.target.value)}
      style={{
        border: "2px solid #f7f7f9ff",
        color: "white",
        fontSize: "1rem",
        background: "transparent",
        maxWidth: "90%",       
      whiteSpace: "normal",    
      wordBreak: "break-word", 
       display: "block",       // dropdown on new line
        marginTop: "0.3rem", 
      }}

      required
    >
      {PS.map((e) => (
        <option key={e} value={e} style={{ fontSize: "1rem", color: "black" }}>
          {e}
        </option>
      ))}
    </select>
  </label>

  <label htmlFor="text" style={{ color: "white" }}>
    <input
      className="feedback-submit"
      type="text"
      placeholder="Description"
      value={para}
      onChange={(e) => setPara(e.target.value)}
      style={{
        border: "2px solid #f7f7f9ff",
        color: "white",
        fontSize: "1rem",
        background: "transparent",
      }}
    />
    <HiMiniBolt style={{ fontSize: "1rem" }} />
  </label>

  <label htmlFor="link" style={{ color: "white" }}>
    <input
      className="feedback-submit"
      type="text"
      placeholder="Any drive link"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      style={{
        border: "2px solid #f7f7f9ff",
        color: "white",
        fontSize: "1rem",
        background: "transparent",
      }}
    />
    <HiMiniBolt style={{ fontSize: "1rem" }} />
  </label>

  <input
    type="submit"
    value="Submit"
    style={{
      fontSize: "1rem",
      cursor: "pointer",
    }}
  />
</form>

          </div>
        )}

        {getUserDetails().role === "user" && activeTab === "my-contentions" && (
          <MyContentions feedbacks={poolContention} />
        )}

        {/* {getUserDetails().role === "user" && activeTab === "against-me" && (
          <ContentionsAgainstMe feedbacks={againstContention} socket={socket} />
        )} */}

        {getUserDetails().role === "admin" && (
          <Admin poolContention={poolContention} socket={socket} />
        )}
      </div>
    </div>
  );
}
