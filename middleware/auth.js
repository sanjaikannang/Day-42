import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];

  if (!token) {
    return res.status(401).json({ message: "Token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Assuming the user ID is stored in the token
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is invalid or expired." });
  }
};

export default auth;