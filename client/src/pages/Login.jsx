import { Link, useNavigate } from "react-router";
import { HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import illustrationImg from "../assets/image.png";  
import "../css/Login.css";
import { useEffect, useState } from "react";
import { createUser, isUserLoggedin, loginUser } from "../utils/Login";
import logo from "../assets/logo.png";
export function Signinup() {
  let [isLogin, setIsLogin] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedin()) navigate("/portal");
  });

  return (
    <div className="login-signup-box">
       <div className="navbar" style={{ display: "flex", color:"white", flexDirection: "row", alignItems: "center" }}>
        <img src={logo} alt="IIT Kanpur Logo" className="portal-logo" />
        
        <div className="navbar-center">
          <h2 className="portal-subtitle">Contention Portal</h2>
          <h3 className="portal-subtitle">TAKNEEK | IIT Kanpur</h3>
        </div>
        
      
      </div>
      <div className="illustartion">
        {/* <img
          className="illustrationImg"
          src={illustartionImg}
          alt="Connected Peoples Image"
        /> */}
      </div>
      {isLogin ? (
        <Login switchToSignup={() => setIsLogin(false)} />
      ) : (
        <Signup switchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  );
}

export function Login({ switchToSignup }) {
  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);

  return (



  
     
  
  
        
 <div className="login-box">
       
             
      <div className="logo">
        {/* <img src={illustrationImg} alt="logo" /> */}
        <span style={{color:"whitesmoke"}}  className="eventlogo" >TAKNEEK'25</span>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let email = e.target[0].value;
          let password = e.target[1].value;
          let data = await loginUser(email, password);

          if (data.status) navigate("/portal");
          else {
            alert(data.message);
          }
        }}
      >
        <label htmlFor="email" style={{color:"white"  }}  >
          <input type="email" placeholder="Email" required />
          <HiMail />
        </label>
        <label htmlFor="password" style={{color:"white"  }}  >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onFocus={() => setShowPassword(true)}
            onBlur={() => setShowPassword(false)}
            required
          />
          {showPassword ? <HiEye /> : <HiEyeOff />}
        </label>
        <input type="submit" value={"Login"} />
      </form>
     
    </div>

  
 

    
    
  );
}

export function Signup({ switchToLogin }) {
  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-box">
      <div className="logo">
        {/* <img src="/Logo-Transperent.png" alt="logo" /> */}
        <span>TAKNEEK'25</span>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let name = e.target[0].value;
          let email = e.target[1].value;
          let password = e.target[2].value;

          let data = await createUser(name, email, password);

          if (data.status) switchToLogin();
          else {
            alert(data.message);
          }
        }}
      >
        <label htmlFor="name">
          <input type="text" placeholder="Name" required />
          <HiMail />
        </label>
        <label htmlFor="email">
          <input type="email" placeholder="Email" required />
          <HiMail />
        </label>
        <label htmlFor="password">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onFocus={() => setShowPassword(true)}
            onBlur={() => setShowPassword(false)}
            required
          />
          {showPassword ? <HiEye /> : <HiEyeOff />}
        </label>
        <input type="submit" value={"Signup"} />
      </form>
      <span className="alr" style={{ textAlign: "center", width: "100%", display: "block" }}>
        Already Have an account?{" "}
        <span
          style={{ color: "#7f7fff", textDecoration: "underline" }}
          onClick={switchToLogin}
          className="switch-to-login"
        >
          Login
        </span>
      </span>
    </div>
  );
}