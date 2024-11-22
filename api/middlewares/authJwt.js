const jwt = require("jsonwebtoken");
const config = require("../config/key.js");
const User = require("../models/user.js");
const rateLimit = require('express-rate-limit');
const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});

const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
isExist = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(403).send({ message: "User not found" });
    return;
  }
  (user.admin ? adminRateLimiter : userRateLimiter)(req, res, next);
};

isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(403).send({ message: "User not found" });
    return;
  }
  if (!user.admin) {
    res.status(403).send({ message: "User not admin" });
    return;
  }
  (user.admin ? adminRateLimiter : userRateLimiter)(req, res, next);

};

const authJwt = {
  verifyToken,
  isExist,
  isAdmin
};
module.exports = authJwt;
