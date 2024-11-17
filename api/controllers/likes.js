import { StatusCodes } from "http-status-codes";
import { db } from "../connectDB.js";

//add Like
export const addLike = (req, res) => {
  try {
    const like = "INSERT INTO likes (`userId`, `postId`) VALUES (?)";
    const values = [req.user.id, req.body.postId];
    db.query(like, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like added successfully");
    });
  } catch (error) {
    console.log("Error in addLike controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//remove Like
export const removeLike = (req, res) => {
  try {
    const like = "DELETE FROM likes WHERE `postId` = ? AND `userId` = ?";
    db.query(like, [req.query.postId, req.user.id], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "Like removed successfully" });
    });
  } catch (error) {
    console.log("Error in removeLike controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//get post's Likes
export const getPostLikes = (req, res) => {
  try {
    const like = "SELECT * FROM likes WHERE `postId` = ?";
    const values = [req.query.postId];
    db.query(like, [values], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(
        data.map((like) => {
          return like.userId;
        })
      );
    });
  } catch (error) {
    console.log("Error in getPostLikes controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
