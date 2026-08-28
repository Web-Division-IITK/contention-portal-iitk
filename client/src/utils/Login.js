import { jwtDecode } from "jwt-decode";
import { BASEURL } from "../../config/config";

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
      return { message: data.message, status: true };
    } else {
      return { message: data.message, status: false };
    }
  } catch {
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
  } catch {
    return { message: "Internal Server Error", status: false };
  }
}

export function isUserLoggedin() {
  const token = localStorage.getItem("token");

  if (!token) return false;

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
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

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 <= Date.now()) {
      localStorage.removeItem("token");
      return null;
    }
    return decodedToken;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
}

export async function getClubPS(club) {
  try {
    let res = await fetch(`${BASEURL}/problemstatement/${club}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data = await res.json();

    if (data.status == true) {
      return { message: data.message, status: true, data: data.data };
    } else {
      return { message: data.message, status: false };
    }
  } catch {
    return { message: "Internal Server Error", status: false };
  }
}
