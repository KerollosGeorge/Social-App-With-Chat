import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json({ Error: "You are not authenticated" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ Error: "Invalid Token" + err });
    req.user = user;
    next();
  });
};
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    /*     console.log(req.user.id);
    console.log(req.params.id); */
    if (req.user.id != req.params.id) {
      return res.status(403).json({ Error: "You are not authorized!" });
    }
    next();
  });
};
