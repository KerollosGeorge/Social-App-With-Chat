import { db } from "../connectDB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//Register
export const Register = (req, res) => {
  try {
    const { username, email, password, confirmPassword, gender } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and Confirm Password doesn't match." });
    }

    // Check if user already exists
    const q = "SELECT * FROM users WHERE username = ?";
    db.query(q, [username], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length > 0) {
        return res.status(400).json({ error: "User already exists." });
      }

      // Password Hashing
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Generate profile picture URL
      /*  const profilePic =
        gender === "male"
          ? `https://avatar.iran.liara.run/public/boy?username=[${username}]`
          : `https://avatar.iran.liara.run/public/girl?username=[${username}]`; */

      // Insert new user into database
      const insertQ =
        "INSERT INTO users (`username`, `email`, `password`, `gender`) VALUES (?)";
      const values = [
        username,
        email,
        hashedPassword,
        gender /* , profilePic */,
      ];
      db.query(insertQ, [values], (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res
          .status(200)
          .json({ message: "User registered successfully." });
      });
    });
  } catch (error) {
    console.log("Error in signup controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
//Login
export const Login = (req, res) => {
  try {
    const { email, password } = req.body;
    const q = "SELECT * FROM users WHERE email=?";
    db.query(q, [email], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0)
        return res.status(400).json({ error: "User not found" });

      //check pass
      const match = bcrypt.compareSync(password, data[0].password);
      if (!match) return res.status(400).json({ error: "Wrong password" });
      //create token
      const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });
      //create refresh token
      const refreshToken = jwt.sign(
        { id: data[0].id },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: "8h",
        }
      );
      //store refreshToken at user
      const updateQuery = "UPDATE users SET refreshToken = ? WHERE id = ?";
      db.query(updateQuery, [refreshToken, data[0].id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
      });

      //remove password
      delete data[0].password;

      res
        .cookie("access_token", token, {
          httpOnly: false,
          maxAge: 4 * 60 * 60 * 1000,
          sameSite: "Strict",
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: false,
          maxAge: 8 * 60 * 60 * 1000,
          sameSite: "Strict",
        })
        .status(200)
        .json(data[0]);
    });
  } catch (error) {
    console.log("Error in login controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Refresh Token
export const RefreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ Error: "Refresh token not found" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ Error: "Invalid refresh token" });

      const q = "SELECT * FROM users WHERE id=?";
      db.query(q, [user.id], (err, data) => {
        if (err) return res.status(500).json({ Error: err.message });
        if (data.length === 0 || data[0].refreshToken !== refreshToken) {
          return res.status(403).json({ Error: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          {
            expiresIn: "8h",
          }
        );

        res
          .cookie("access_token", newAccessToken, {
            httpOnly: false,
            maxAge: 8 * 60 * 60 * 1000, // 1 hour
            sameSite: "Strict",
          })
          .status(200)
          .json({ accessToken: newAccessToken });
      });
    });
  } catch (error) {
    console.log("Error in refresh token controller");
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

//Logout
export const Logout = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const updateQuery =
      "UPDATE users SET refreshToken = NULL WHERE refreshToken = ?";
    db.query(updateQuery, [refreshToken], (err) => {
      if (err) return res.status(500).json({ error: err.message });
    });

    res
      .clearCookie("access_token", {
        httpOnly: false,
      })
      .clearCookie("refreshToken", {
        httpOnly: false,
      })
      .status(200)
      .json({ message: "You logged out." });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
