import { jwtDecode } from "jwt-decode";

// const BASEURL = "http://localhost:8080/api";
const BASEURL = window.location.origin + "/api";

export async function loginUser(email, password) {
  try {
    let res = await fetch(`${BASEURL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    let data = await res.json();

    if (data.status == true) {
      localStorage.setItem("token", data.token);

      // detokenise jwt
      let decodedToken;
      decodedToken = jwtDecode(data.token);

      return { message: data.message, status: true };
    } else {
      return { message: data.message, status: false };
    }
  } catch (e) {
    return { message: "Internal Server Error", status: false };
  }
}

export async function createUser(name, email, password) {
  try {
    let res = await fetch(`${BASEURL}/user/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    let data = await res.json();

    if (data.status == true) {
      return { message: data.message, status: true };
    } else {
      return { message: data.message, status: false };
    }
  } catch (e) {
    return { message: "Internal Server Error", status: false };
  }
}

export function isUserLoggedin() {
  const token = localStorage.getItem("token");

  if (!token) return false;

  let decodedToken;

  try {
    decodedToken = jwtDecode(token);
    return true;
  } catch (error) {
    logoutUser();
    return false;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  window.open("/", "_self");
}

export function getUserDetails() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  let decodedToken;

  try {
    decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    logoutUser();
    return null;
  }
}
