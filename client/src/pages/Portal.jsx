import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUserDetails, isUserLoggedin, logoutUser } from "../utils/Login";
import "../css/Portal.css";
import { HiMiniBolt } from "react-icons/hi2";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png";

// const SOCKET_URI = "http://localhost:8080";
const SOCKET_URI = window.location.origin;

export function Portal() {
  let navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [hall, setHall] = useState("");
  const [aHall, setAHall] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [para, setPara] = useState("");
  const [link, setLink] = useState("");

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
      console.log("Loaded feedbacks:", a);
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
      <div className="navbar" style={{ display: "flex", color:"white", flexDirection: "row", alignItems: "center" }}>
  <img src={logo} alt="IIT Kanpur Logo" className="portal-logo" />
  
  <div className="navbar-center">
    <h2 className="portal-subtitle">Contention Portal</h2>
    <h3 className="portal-subtitle">TAKNEEK | IIT Kanpur</h3>
  </div>
   <button id="logout" onClick={() => logoutUser()}>Logout</button>

</div>
      
      <div className="contention-form">
        
        {getUserDetails().role == "user" && (
          <>
          
             <form
          className="feedback-input"
          onSubmit={(e) => {
            e.preventDefault();
            if ( hall.length < 1 || aHall.length < 1 || problemStatement.length < 1 ) {
              alert("Please enter all required fields");
              return;
            }
            const userData = getUserDetails();
            socket.emit("submit_feedback", {
              username: userData.name,
 
  hall,
  againstHall: aHall,
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

            setFeedback("");
            setHall("");
            setAHall("");
            setProblemStatement("");
            setPara("");
            setLink("");
           

          }}
        >
         




          <label htmlFor="hall" >
            <input
              className="feedback-submit"
              type="text"
              placeholder="Enter hall name"
              value={hall}
              onChange={(e) => setHall(e.target.value)}
             
              required
            />
            <HiMiniBolt />
           
            
          </label>
           <label htmlFor="against-hall">
            <input
              className="feedback-submit"
              type="text"
              placeholder="Enter hall against which you are raising contention"
              value={aHall}
              onChange={(e) => setAHall(e.target.value)}
              
              required
            />
            <HiMiniBolt />
           
            
          </label>
          <label htmlFor="problem-statement" style={{height:"100px"}}>
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
          <label htmlFor="text" style={{height:"100px"}}>
            <input
              className="feedback-submit"
              type="text"
              placeholder="Enter your remarks"
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
        
         
         <input type="submit" value={"Submit"}/>
        </form>
        </>
     
      )}
      
      </div>
      

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
          <h2>No contentions yet</h2>
        )}
      </div>

     
    </div>
  );
}



