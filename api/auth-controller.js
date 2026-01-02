import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user-model.js";
const JWT_SECRET = process.env.JWT_SECRET||'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET||'your_refresh_secret';

export const register = async (req, res) => {
  try {
      const { username,fullname, email, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create and save the new user
      const user = new User({ username, fullname, email, password });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration Error:', error); // Log the error for debugging
    // Respond with error details for debugging
    if (error.name === 'ValidationError') {
      // Mongoose validation errors
      res.status(400).json({ message: 'Validation Error', details: error.errors });
    } else {
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }
};

export const login = async (req, res) => {
  // Helper functions to generate tokens
  const generateAccessToken = (user) => {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '60m' });
  };

  const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  };

  try {
      const { username, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({
        $or:  [{ email: username }, { username: username }],
      });
      if (!user) return res.status(400).json({ message: 'User not found' });
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Set tokens in HTTP-only cookies
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true, // Use true in production for HTTPS
        sameSite: 'Strict', // Prevent cross-site request forgery
        maxAge: 60 * 60 * 1000 // 60 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Use true in production for HTTPS
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      //res.json({ message: 'Logged in successfully' });
      await user.save();
  
      res.json({ user, accessToken, refreshToken });
  } catch (error) {
      res.status(500).json({ error: 'Login failed - '+error.message });
  }
};

export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  //const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(0), // Expire immediately
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: new Date(0), // Expire immediately
    });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const refreshtoken = async (req, res) => {
  const { refreshToken } = req.body;
  //const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Token required' });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user);

    // Set new access token in HTTP-only cookie
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

export const deleteuser =  async (req, res) => {
  const { userId } = req.body; // Assume userId is provided in the body

  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};