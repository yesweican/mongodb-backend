// middleware/auth.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET||'your_jwt_secret';

const authenticateToken = (req, res, next) => {
  ///const token = req.cookies.accessToken;

  const authHeader = req.headers['authorization']; // Get the Authorization header
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] // Extract the token after "Bearer"
    : null;


  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token:' + token + ' -> err: ' + err.message });
    //extract the userId from accessToken
    const { userId } = user;
    //add to the request object
    req.user = user;
    next();
  });
};

export default authenticateToken;
