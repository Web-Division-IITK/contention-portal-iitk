const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authUser = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    let data = decoded;
    if (data.role == "user") {
      return res.status(403).json({ status: false, message: "Forbidden" });
    }
    req.user = data;
    next();
  });
};

const authAdmin = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }

    let data = decoded;
    if (data.role == "admin") {
      return res.status(403).json({ status: false, message: "Forbidden" });
    }
    req.user = data;
    next();
  });
};
