const jwt = require("jsonwebtoken");

module.exports = {
  restrict
}

 async function restrict (req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization;
    if (token) {
      jwt.verify(token, (process.env.SECRET || "shh"), (error, decodedToken) => {
        if (error) {
          next({ status: 401, message: "token invalid" })
        } else {
          req.decodedJwt = decodedToken;
          next();
        }
      })
    } else {
      next({ status: 401, message: "token required" })
    }
  } catch (err) { next(err) }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 }
