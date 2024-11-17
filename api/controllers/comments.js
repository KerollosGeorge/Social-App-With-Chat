import { StatusCodes } from "http-status-codes";
import moment from "moment/moment.js";
import { db } from "../connectDB.js";

// add comment
export const addComment = (req, res) => {
  try {
    const comment =
      "INSERT INTO comments (`content`, `createdAt`, `userId`,`postId`) VALUES(?)";
    const values = [
      req.body.content,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.user.id,
      req.query.postId,
    ];
    db.query(comment, [values], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res.status(200).json({ message: "comment has been Created." });
    });
  } catch (error) {
    console.log("Error in addComment controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// get post's comments
export const getPostComments = (req, res) => {
  try {
    const comment =
      "SELECT c.* , u.id AS userId , profilePic, username FROM comments AS c JOIN users AS u ON c.userId = u.id WHERE postId = ? ORDER BY c.createdAt DESC";
    const values = [req.query.postId];
    db.query(comment, [values], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getPostComments controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//get comment
export const getComment = (req, res) => {
  try {
    const comment = "SELECT * FROM comments WHERE userId = ? AND id =?";
    db.query(comment, [req.user.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res.status(200).json(data[0]);
    });
  } catch (error) {
    console.log("Error in getComment controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//update comment
export const updateComment = (req, res) => {
  try {
    const commentId = req.params.id;
    const updatedValues = req.body;
    const fields = Object.keys(updatedValues)
      .map((field) => `${field} = ?`)
      .join(",");
    const values = Object.values(updatedValues);
    values.push(commentId);
    values.push(req.user.id);
    const query = `UPDATE comments SET ${fields} WHERE id = ? AND userId = ?`;
    db.query(query, values, (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res
        .status(200)
        .json({ message: "your comment has been updated successfully!" });
    });
  } catch (error) {
    console.log("Error in updateComment controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//delete a comment
export const deleteComment = (req, res) => {
  try {
    const comment = "DELETE FROM comments WHERE userId =? AND id =? ";
    db.query(comment, [req.user.id, req.params.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res
        .status(200)
        .json({ message: "your comment has been deleted successfully!" });
    });
  } catch (error) {
    console.log("Error in deleteComment controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
