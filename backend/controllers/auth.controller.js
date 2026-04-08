const authService = require("../services/auth.service");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    const user = await authService.register(username, email, password);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    const user = await authService.login(username, password);

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message,
    });
  }
}

async function getProfile(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = authService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    res.json({
      success: true,
      data: {
        id: decoded.id,
        username: decoded.username,
      },
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message,
    });
  }
}

module.exports = { register, login, getProfile };
