import rateLimit from "express-rate-limit";

// Rate limiter for login endpoint - prevent brute force
// Chặn theo EMAIL, không chặn theo IP
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each EMAIL to 5 login attempts per windowMs
  
  // ⭐ KEY GENERATOR: Dùng email thay vì IP
  keyGenerator: (req) => {
    // Lấy email từ request body
    return req.body.email || req.ip; // Fallback to IP if no email
  },
  
  message: {
    message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  
  handler: (req, res) => {
    const email = req.body.email || "unknown";
    console.log(`[Rate Limit] Email ${email} exceeded login attempts`);
    res.status(429).json({
      message: "Quá nhiều lần đăng nhập thất bại cho tài khoản này. Vui lòng thử lại sau 15 phút.",
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: "Quá nhiều requests. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default loginRateLimiter;

