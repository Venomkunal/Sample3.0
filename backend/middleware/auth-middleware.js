const jwt = require('jsonwebtoken');

// 🔍 Extract token from cookie OR Authorization header
const extractToken = (req) => {
  const cookieToken = req.cookies?.adminToken; // Optional for cookie-based login
  const headerToken = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null;

  return cookieToken || headerToken;
};

const SECRET = process.env.SECRET_KEY || 'INDIANBAZZARGUYBYKUNAL';

// 🔐 Basic token verification middleware
const verifyToken = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // must include userId
    next();
  } catch (err) {
    console.error('[verifyToken] JWT verification error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 🔐 Only allow admins
const requireAdmin = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admins only' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error('[requireAdmin] JWT error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 🔐 Allow role-based access
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({ error: 'No token' });
    }

    try {
      const decoded = jwt.verify(token, SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error('[requireRole] JWT error:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireRole,
};
