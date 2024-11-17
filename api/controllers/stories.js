import moment from "moment/moment.js";
import { db } from "../connectDB.js";
import path from "path";
import fs from "fs";

// get stories of user and his follwers
// check the createdAt of each story if ond day left then delete this story (delete the image from stories folder)

export const getStories = (req, res) => {
  try {
    const stories = `SELECT DISTINCT s.*, username 
                     FROM stories AS s 
                     JOIN users AS u ON (s.userId = u.id)
                     LEFT JOIN relationships AS r ON (s.userId = r.followedUserId)
                     WHERE r.followerUserId = ? OR s.userId = ?
                      ORDER BY s.createdAt DESC
                     `;

    db.query(stories, [req.user.id, req.user.id], (err, data) => {
      if (err) return res.status(500).json({ error: err });

      const deleteOldStoriesPromises = data.map((story) => {
        const createdAt = moment(story.createdAt).add(1, "day");
        if (moment().isAfter(createdAt)) {
          const filePath = path.join("../client/public/stories", story.img);
          return new Promise((resolve, reject) => {
            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (err) => {
                if (err) {
                  return reject("Error deleting file");
                }
                const deleteStory = `DELETE FROM stories WHERE id = ?`;
                db.query(deleteStory, [story.id], (err, data) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                });
              });
            } else {
              resolve();
            }
          });
        }
        return Promise.resolve();
      });

      Promise.all(deleteOldStoriesPromises)
        .then(() => {
          // Send only non-deleted stories
          const nonDeletedStories = data.filter((story) => {
            const createdAt = moment(story.createdAt).add(1, "day");
            return !moment().isAfter(createdAt);
          });
          res.status(200).json(nonDeletedStories);
        })
        .catch((err) => {
          console.error("Error deleting old stories:", err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    });
  } catch (error) {
    console.log("Error in getStories controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* export const getStories = (req, res) => {
  try {
    const stories = `SELECT DISTINCT s.* , username 
            FROM stories AS s 
            JOIN users AS u 
            ON (s.userId = u.id)
            LEFT JOIN relationships AS r
            ON (s.userId = r.followedUserId)
            WHERE r.followerUserId = ? OR s.userId = ?
            `;
    db.query(stories, [req.user.id, req.user.id], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      // To Do
      // delete the story if the createdAt is one day ago
      data.forEach((story) => {
        const createdAt = moment(story.createdAt)
          .add(1, "day")
          .format("YYYY-MM-DD");
        if (moment().isSame(createdAt, "day")) {
          const filePath = path.join("../client/public/stories", story.img);
          // Check if the file exists and delete it
          if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
              if (err)
                return res.status(500).json({ error: "Error deleting file" });
              const deleteStory = `DELETE FROM stories WHERE id = ?`;
              db.query(deleteStory, [story.id], (err, data) => {
                if (err) return res.status(500).json({ Error: err });
              });
            });
          }
        }
      });
      res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getStories controller:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
 */
//add story
export const addStory = (req, res) => {
  try {
    const story =
      "INSERT INTO stories (`img` , `createdAt`,`userId`) VALUES(?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.user.id,
    ];
    db.query(story, [values], (err, data) => {
      if (err) return res.status(500).json({ Error: err });
      res.status(200).json({ message: "Story added successfully" });
    });
  } catch (error) {
    console.log("Error in addStory controller:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
