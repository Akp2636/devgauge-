/**
 * Simple in-memory rate limiter (no external dep).
 * For production, use express-rate-limit + Redis.
 */
const requests = new Map();

const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = requests.get(ip);

    if (!entry || now - entry.start > windowMs) {
      requests.set(ip, { count: 1, start: now });
      return next();
    }

    if (entry.count >= maxRequests) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
      });
    }

    entry.count++;
    next();
  };
};

module.exports = rateLimiter;
