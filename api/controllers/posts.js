import { db } from "../connectDB.js";
import moment from "moment/moment.js";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";

export const addPost = (req, res) => {
  try {
    const post =
      "INSERT INTO posts (`content`, `img`, `createdAt`, `userId`) VALUES(?)";
    const values = [
      req.body.content,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.user.id,
    ];
    db.query(post, [values], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res.status(200).json({ message: "Post has been Created." });
    });
  } catch (error) {
    console.log("Error in addPost controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// get user and its freinds posts
// before getting the data u should check createdAt time if one day left delete the image story then get the data
export const getPosts = (req, res) => {
  try {
    const posts = `SELECT DISTINCT  p.* , u.id AS userId , username , profilePic 
      FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
      LEFT JOIN relationships AS r ON(p.userId = r.followedUserId) 
      WHERE r.followerUserId= ? OR p.userId= ?
      ORDER BY p.createdAt DESC;`; //to get all posts of the user and the user he
    db.query(posts, [req.user.id, req.user.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      //To DO
      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getPosts controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//get only user posts used at Profile page
export const getUserPosts = (req, res) => {
  try {
    const posts = `SELECT p.* , u.id AS userId , username,profilePic 
                    FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
                    WHERE p.userId = ?
                    ORDER BY p.createdAt DESC;`; //to get all posts of the user and the user he
    db.query(posts, [req.query.userId], (err, data) => {
      if (err) return res.status(500).json({ Error: err });

      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getUserPosts controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//get Post
export const getPost = (req, res) => {
  try {
    const post = `SELECT p.* , u.id AS userId , username,profilePic 
      FROM posts AS p JOIN users AS u ON (u.id = p.userId)
      WHERE p.id = ?;`; //to get all posts of the user and the user he
    db.query(post, [req.params.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });

      res.status(200).json(data[0]);
    });
  } catch (error) {
    console.log("Error in getPost controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
// update post

export const updatePost = (req, res) => {
  try {
    const { postId } = req.query;
    const updateValues = req.body;

    // Fetch existing post data to compare the image
    db.query(
      "SELECT img, userId FROM posts WHERE id = ?",
      [postId],
      (err, results) => {
        if (err) return res.status(500).json({ Error: err });
        const existingPost = results[0];

        if (updateValues.img && updateValues.img !== existingPost.img) {
          const oldImgPath = path.join(
            "../client/public/upload",
            existingPost.img
          );
          if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);
          }
        }
        // Create a SQL query string with only the fields that need to be updated
        const fields = Object.keys(updateValues)
          .map((field) => `${field} = ?`)
          .join(", ");
        const values = Object.values(updateValues);
        values.push(postId);

        const query = `UPDATE posts SET ${fields} WHERE id = ?`;

        db.query(query, values, (err, data) => {
          if (err) return res.status(500).json({ Error: err });
          if (data.affectedRows > 0) {
            return res.status(200).json({
              message: "Your post has been updated successfully!",
            });
          } else {
            return res
              .status(404)
              .json({ error: "Post not found or no changes made" });
          }
        });
      }
    );
  } catch (error) {
    console.log("Error in updatePost controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* export const updatePost = (req, res) => {
  const postId = req.query.id;
  try {
    // Fetch the post to get the image path and verify ownership
    const postQuery = "SELECT * FROM posts WHERE id = ?";
    db.query(postQuery, [postId], (err, data) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });

      if (data.length === 0) {
        return res.status(404).json({ error: "Post not found" });
      }

      const post = data[0];
      if (post.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this post" });
      }

      const filePath = path.join("../client/public/upload", post.img);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err)
            return res.status(500).json({ error: "Error deleting file" });

          const updatedValues = req.body;
          const fields = Object.keys(updatedValues)
            .map((field) => `${field} = ?`)
            .join(",");
          const values = Object.values(updatedValues);
          values.push(postId);
          values.push(req.user.id);
          const query = `UPDATE posts SET ${fields} WHERE id = ? AND userId = ?`;
          db.query(query, values, (err, data) => {
            if (err) return res.status(500).json({ Error: err });
            res
              .status(200)
              .json({ message: "Your Post Updated Successfully!" });
          });
        });
      }
    });
  } catch (error) {
    console.log("Error in updatePost controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
}; */

//delete post

export const deletePost = (req, res) => {
  const postId = req.query.postId;

  try {
    // Fetch the post to get the image path and verify ownership
    db.query(
      "SELECT img, userId FROM posts WHERE id = ?",
      [postId],
      (err, results) => {
        if (err) return res.status(500).json({ Error: err });

        const post = results[0];

        if (post.img) {
          const filePath = path.join("../client/public/upload", post.img);
          // Delete the image file if it exists
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        // Delete the post from the database
        db.query(
          "DELETE FROM posts WHERE id = ? AND userId = ?",
          [postId, req.user.id],
          (err) => {
            if (err) return res.status(500).json({ Error: err });

            res
              .status(200)
              .json({ message: "Your post was deleted successfully!" });
          }
        );
      }
    );
  } catch (error) {
    console.log("Error in deletePost controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
