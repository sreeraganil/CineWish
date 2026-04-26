import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateResetToken } from "../utilities/token.js";
import { transporter } from "../utilities/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret123cinewish";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: err.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Logout failed", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Don't reveal if user exists
    if (!user) {
      return res.json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const token = generateResetToken(user._id);

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"CineWish" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password - CineWish",
      html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background-color: #0f172a;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #1e293b;
          border-radius: 12px;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #1a4d53 0%, #06b6d4 100%);
          padding: 40px 30px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          padding: 40px 30px;
          color: #e2e8f0;
        }
        .content h2 {
          margin: 0 0 20px;
          color: #ffffff;
          font-size: 22px;
          font-weight: 600;
        }
        .content p {
          margin: 0 0 20px;
          line-height: 1.6;
          color: #cbd5e1;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 14px 32px;
          margin: 20px 0;
          background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
        }
        .warning {
          background-color: #334155;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          margin: 24px 0;
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          color: #fbbf24;
          font-size: 14px;
        }
        .footer {
          padding: 30px;
          text-align: center;
          border-top: 1px solid #334155;
          color: #64748b;
          font-size: 14px;
        }
        .footer p {
          margin: 8px 0;
          color: #64748b;
        }
        .link-text {
          color: #94a3b8;
          font-size: 13px;
          word-break: break-all;
          margin-top: 12px;
        }
      </style>
    </head>
    <body>
      <div style="background-color: #0f172a; padding: 40px 20px;">
        <div class="container">
          <div class="header">
          <img width="40" src="https://cinewish-web.onrender.com/logo/pwa-192x192.png" alt="logo" />
            <h1>CineWish</h1>
          </div>
          
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi there,</p>
            <p>We received a request to reset your password for your CineWish account. Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            
            <p class="link-text">Or copy and paste this link into your browser:<br>${resetLink}</p>
            
            <div class="warning">
              <p>⏱️ This link will expire in 15 minutes for security reasons.</p>
            </div>
            
            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <p>Thanks,<br><strong>The CineWish Team</strong></p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} CineWish. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
    });

    res.json({
      success: true,
      message: "Reset link sent",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send reset email",
      error: err.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.userId, {
      password: hashedPassword,
    });

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
