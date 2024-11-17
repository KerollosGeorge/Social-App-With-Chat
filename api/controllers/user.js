import { StatusCodes } from "http-status-codes";
import { db } from "../connectDB.js";
import fs from "fs";
import path from "path";

export const getUser = (req, res) => {
  try {
    const user = "SELECT * FROM users WHERE id=?";
    db.query(user, [req.params.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      delete data[0].password;
      return res.status(200).json(data[0]);
    });
  } catch (error) {
    console.log("Error in getUser controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

export const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const updateValues = req.body;

    // Fetch existing user data to compare the images
    db.query(
      "SELECT profilePic, coverPic FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return res.status(500).json({ Error: err });
        const existingUser = results[0];

        // Delete previous profile image if a new one is uploaded
        if (
          updateValues.profilePic &&
          updateValues.profilePic !== existingUser?.profilePic && // Check if the existing image exists
          existingUser?.profilePic // Ensure the old image path is not null or undefined
        ) {
          const oldProfilePicPath = path.join(
            process.cwd(),
            "client/public/personalImages",
            existingUser.profilePic
          );
          if (fs.existsSync(oldProfilePicPath)) {
            fs.unlinkSync(oldProfilePicPath); // Delete old profile picture
          }
        }

        // Delete previous cover image if a new one is uploaded
        if (
          updateValues.coverPic &&
          updateValues.coverPic !== existingUser?.coverPic && // Check if the existing cover image exists
          existingUser?.coverPic // Ensure the old cover image path is not null or undefined
        ) {
          const oldCoverPicPath = path.join(
            process.cwd(),
            "client/public/personalImages",
            existingUser.coverPic
          );
          if (fs.existsSync(oldCoverPicPath)) {
            fs.unlinkSync(oldCoverPicPath); // Delete old cover picture
          }
        }

        // Create a SQL query string with only the fields that need to be updated
        const fields = Object.keys(updateValues)
          .map((field) => `${field} = ?`)
          .join(", ");
        const values = Object.values(updateValues);
        values.push(id); // Add the id to the end of the values array

        const query = `UPDATE users SET ${fields} WHERE id = ?`;

        db.query(query, values, (err, data) => {
          if (err) return res.status(500).json({ Error: err });
          if (data.affectedRows > 0)
            return res.status(200).json({
              message: "Your profile data has been updated successfully!",
            });
        });
      }
    );
  } catch (error) {
    console.log("Error in updateUser controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user data to delete profilePic and coverPic from storage
    db.query(
      "SELECT profilePic, coverPic FROM users WHERE id = ?",
      [id],
      (err, results) => {
        if (err) return res.status(500).json({ Error: err });
        const user = results[0];

        // Delete profilePic and coverPic from storage
        if (user.profilePic) {
          const profilePicPath = path.join(
            "../client/public/personalImages",
            user.profilePic
          );
          if (fs.existsSync(profilePicPath)) {
            fs.unlinkSync(profilePicPath);
          }
        }

        if (user.coverPic) {
          const coverPicPath = path.join(
            "../client/public/personalImages",
            user.coverPic
          );
          if (fs.existsSync(coverPicPath)) {
            fs.unlinkSync(coverPicPath);
          }
        }

        // Delete the user from the database
        const query = "DELETE FROM users WHERE id = ?";
        db.query(query, [id], (err, data) => {
          if (err) return res.status(500).json({ Error: err });
          res
            .status(200)
            .json({ message: "Your Account Deleted Successfully!" });
        });
      }
    );
  } catch (error) {
    console.log("Error in deleteUser controller");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
