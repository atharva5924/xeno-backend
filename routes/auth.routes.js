import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import axios from "axios";

const router = express.Router();

// Google OAuth callback
// Updated backend route
// router.post("/google", async (req, res) => {
//   try {
//     const { code } = req.body;

//     // Exchange code for tokens
//     const tokenResponse = await axios
//       .post("https://oauth2.googleapis.com/token", {
//         code,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         redirect_uri: "postmessage",
//         grant_type: "authorization_code",
//       })
//       .catch((err) => {
//         console.error("Google token exchange failed:", {
//           status: err.response?.status,
//           data: err.response?.data,
//           headers: err.response?.headers,
//         });
//         throw new Error(
//           `Token exchange failed: ${err.response?.data?.error || err.message}`
//         );
//       });
//     console.log("Successfully exchanged code for tokens");

//     // Verify ID token
//     const decoded = jwt.decode(data.id_token);

//     // Rest of your existing user handling logic...
//     let user = await User.findOne({ googleId: decoded.sub });
//     if (!user) {
//       user = new User({
//         googleId: decoded.sub,
//         name: decoded.name,
//         email: decoded.email,
//         avatar: decoded.picture,
//       });
//       await user.save();
//     }

//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });
//     res.json({ token, user });
//   } catch (err) {
//     console.error("Full auth error:", {
//       message: err.message,
//       stack: err.stack,
//       originalError: err.response?.data,
//     });
//     res.status(400).json({
//       message: err.message,
//       details: process.env.NODE_ENV === "development" ? err.stack : null,
//     });
//   }
// });

router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    // 1. Exchange authorization code for tokens
    const tokenResponse = await axios
      .post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "postmessage",
        grant_type: "authorization_code",
      })
      .catch((err) => {
        console.error("Google token exchange error:", err.response?.data);
        throw new Error("Failed to exchange code for tokens");
      });

    // 2. Properly destructure the response data
    const { id_token } = tokenResponse.data;

    if (!id_token) {
      throw new Error("No ID token received from Google");
    }

    // 3. Decode the ID token
    const decoded = jwt.decode(id_token);

    if (!decoded) {
      throw new Error("Invalid ID token received from Google");
    }

    // 4. Find or create user
    let user = await User.findOne({ googleId: decoded.sub });
    if (!user) {
      user = new User({
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      });
      await user.save();
    }

    // 5. Create your own JWT
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("Auth error:", {
      message: err.message,
      stack: err.stack,
      originalError: err.response?.data || err,
    });
    res.status(400).json({
      message: err.message,
      details: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  }
});

export default router;
