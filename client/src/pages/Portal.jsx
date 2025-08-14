import { useNavigate } from "react-router";
import { use, useEffect, useState } from "react";
import { getUserDetails, isUserLoggedin, logoutUser } from "../utils/Login";
import "../css/Portal.css";
import { HiMiniBolt } from "react-icons/hi2";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";
import { MyContentions } from "./PoolContentions";
import { ContentionsAgainstMe } from "./ContentionsAgainstPool";
import { Admin } from "./Admin";

const SOCKET_URI = "http://localhost:8080";
// const SOCKET_URI = window.location.origin;

export function Portal() {
  const userData = getUserDetails();

  let navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [poolContension, setPoolContension] = useState([]);
  const [againstContension, setAgainstContension] = useState([]);
  const [aHall, setAHall] = useState(userData.pool);
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
      if (userData.role === "admin") {
        setPoolContension(a.data);
      } else {
        setPoolContension(a.data["byPool"]);
        setAgainstContension(a.data["againstPool"]);
      }
    });

    newSocket.on("new_feedback", (feedback) => {
      console.log(1);
      if (userData.role === "admin") {
        setPoolContension((data) => {
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
        if (feedback.pool == userData.pool)
          setPoolContension((prevFeedbacks) => [feedback, ...prevFeedbacks]);
        else
          setAgainstContension((prevFeedbacks) => [feedback, ...prevFeedbacks]);
      }
    });

    newSocket.on("status_changed", (statusData) => {
      if (userData.role === "admin") {
        setPoolContension((data) => {
          let tempData = { ...data };
          tempData[statusData.feedback.pool].find(
            (e) => e._id == statusData.feedback._id
          )["status"] = statusData.status;
          return tempData;
        });
      } else {
        if (userData.pool == statusData.feedback.pool)
          setPoolContension((data) => {
            let tempData = [...data];
            tempData.find((e) => e._id == statusData.feedback._id)["status"] =
              statusData.status;
            return tempData;
          });
        else
          setAgainstContension((data) => {
            let tempData = [...data];
            tempData.find((e) => e._id == statusData.feedback._id)["status"] =
              statusData.status;
            return tempData;
          });
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
    if (
      aHall.length < 1 ||
      problemStatement.length < 1 ||
      para.length < 1 ||
      link.length < 1
    ) {
      console.error("Form submission error: Please fill all fields correctly.");
      alert("Please enter all required fields");
      return;
    }
    if (userData.pool == aHall) {
      console.error(
        "Form submission error: Pool cannot be the same as Against Pool."
      );
      alert("Pool cannot be the same as Against Pool.");
      return;
    }

    socket.emit("submit_feedback", {
      againstPool: aHall,
      headline: problemStatement,
      description: para,
      drive: link,
    });

    setAHall(userData.pool);
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
        <img src={logo} alt="IIT Kanpur Logo"   className="portal-logo" />

        <div className="navbar-center">
          <h2 className="portal-subtitle" style={{fontStyle:"initial",fontFamily:"serif" }}  >Contention Portal</h2>
          <h3 className="portal-subtitle"  style={{fontStyle:"initial",fontFamily:"serif" }}>TAKNEEK | IIT Kanpur</h3>
        </div>
        <button  id="logout" onClick={() => logoutUser()}>
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
            position: "sticky",
            top: "0",
            zIndex: 1000,
            backgroundColor: "#000000ff",
            border: "0",
            padding: "10px 0",
            position:"sticky",
            fontStyle:"initial",fontFamily:"serif" 
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
          <button
          
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
          </button>
           <hr style={{width:"100%", color:"#7f7fff", opacity:"1",  border:"1px solid #7f7fff"}}  />
        </div>

      )}

      <div className="tab-content">
        {getUserDetails().role === "user" && activeTab === "submit" && (
          <div className="contention-form"  style={{marginTop:"1px",   borderTop:"2px solid #7f7fff", borderRight:"2px solid #7f7fff", borderBottom:"2px solid #7f7fff", borderLeft:"8px solid #7f7fff"}}>
            <form className="feedback-input" onSubmit={handleFormSubmit}>
              <label
                htmlFor="against-hall"
                style={{
                  color: "white",
                  backgroundColor: "white",
                 fontSize:"1rem"
                }}
              >
                <select
                  className="feedback-submit"
                  value={aHall}
                  onChange={(e) => setAHall(e.target.value)}
style={{fontSize:"1rem"}}
                >
                  <option value="Pool 1" style={{fontSize:"1rem"}}>Pool 1</option>
                  <option value="Pool 2" style={{fontSize:"1rem"}}>Pool 2</option>
                  <option value="Pool 3" style={{fontSize:"1rem"}}>Pool 3</option>
                  <option value="Pool 4" style={{fontSize:"1rem"}}>Pool 4</option>
                  <option value="Pool 5" style={{fontSize:"1rem"}}>Pool 5</option>
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
                  style={{fontSize:"1rem"}}
                />
                <HiMiniBolt style={{fontSize:"1rem"}} />
              </label>

              <label htmlFor="text">
                <input
                  className="feedback-submit"
                  type="text"
                  placeholder="Description"
                  value={para}
                  onChange={(e) => setPara(e.target.value)}
                  style={{fontSize:"1rem"}}
                />
                <HiMiniBolt style={{fontSize:"1rem"}} />
              </label>

              <label htmlFor="link">
                <input
                  className="feedback-submit"
                  type="text"
                  placeholder="Any references or links"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  style={{fontSize:"1rem"}}
                />
                <HiMiniBolt style={{fontSize:"1rem"}} />
              </label>

              <input style={{fontSize:"1rem"}} type="submit" value={"Submit"} />
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
          <Admin poolContension={poolContension} socket={socket} />
        )}
      </div>
    </div>
  );
}
