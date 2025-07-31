import { Link, useNavigate } from "react-router";
import { HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import illustartionImg from "../assets/connected-illustration.svg";
import "../css/Login.css";
import { useEffect, useState } from "react";
import { createUser, isUserLoggedin, loginUser } from "../utils/Login";

export function Signinup() {
  let [isLogin, setIsLogin] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    if (isUserLoggedin()) navigate("/portal");
  });

  return (
    <div className="login-signup-box">
      <div className="illustartion">
        <img
          className="illustartionImg"
          src={illustartionImg}
          alt="Connected Peoples Image"
        />
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
        <img src="/Logo-Transperent.png" alt="logo" />
        <span>Fedox</span>
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
        <input type="submit" value={"Login"} />
      </form>
      <span style={{ textAlign: "center", width: "100%", display: "block" }}>
        Don't Have an account?{" "}
        <span
          style={{ color: "#7f7fff", textDecoration: "underline" }}
          onClick={switchToSignup}
        >
          Signup
        </span>
      </span>
    </div>
  );
}

export function Signup({ switchToLogin }) {
  let navigate = useNavigate();
  let [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-box">
      <div className="logo">
        <img src="/Logo-Transperent.png" alt="logo" />
        <span>Fedox</span>
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
      <span style={{ textAlign: "center", width: "100%", display: "block" }}>
        Already Have an account?{" "}
        <span
          style={{ color: "#7f7fff", textDecoration: "underline" }}
          onClick={switchToLogin}
        >
          Login
        </span>
      </span>
    </div>
  );
}
