const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user; // save user to socket
    next();
  } catch (err) {
    console.log("Token:", err);
    next(new Error("Invalid token"));
  }
};

module.exports = { socketAuth };
