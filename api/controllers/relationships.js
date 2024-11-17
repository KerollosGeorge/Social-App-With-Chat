//followerUserId ==>  friend
//followedUserId ==> user himself
import { StatusCodes } from "http-status-codes";
import { db } from "../connectDB.js";

//get Freinds(Followers)
export const getFriends = (req, res) => {
  try {
    const friends =
      "SELECT r.followerUserId, u.username, u.profilePic FROM relationships AS r JOIN users AS u ON(r.followerUserId = u.id) WHERE r.followedUserId = ?";
    db.query(friends, [req.query.id], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(200).json(data);
    });
  } catch (error) {
    console.log("Error in getFreinds controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// add Follow
export const addFollow = (req, res) => {
  try {
    const follow =
      "INSERT INTO relationships (`followerUserId` , `followedUserId`) VALUES(?,?)";
    db.query(follow, [req.user.id, req.body.userId], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "Followed" });
    });
  } catch (error) {
    console.log("Error in addFollow controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

//remove Follow
export const removeFollow = (req, res) => {
  try {
    const unfollow =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?";
    db.query(unfollow, [req.user.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: "Unfollowed" });
    });
  } catch (error) {
    console.log("Error in removeFollow controller");
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// suggestion
// export const getSuggest = async (req, res) => {
//   try {
//     const AllFriends =
//       "SELECT r.followerUserId FROM relationships AS r JOIN users AS u ON(r.followerUserId = u.id) WHERE r.followedUserId = ?";
//     db.query(AllFriends, [req.query.id], (err, data) => {
//       if (err) return res.status(500).json({ error: err.message });
//       console.log(data);
//       //need to convert data object to array
//       /* let dataArr = [];
//       dataArr = Object.entries(data).map((entry) => entry[1]);
//       console.log(typeof dataArr); */
//       if (data) {
//         const suggestionFriends = Promise.all(
//           data.map((id) => {
//             `SELECT prfilePic , username FROM users WHERE id = ${id}`;
//           })
//         );
//         console.log(suggestionFriends);
//         db.query(suggestionFriends, (err, info) => {
//           if (err) return res.status(500).json({ error: err.message });
//           return res.status(200).json(info);
//         });
//       } else {
//         const AllUsers = `SELECT id FROM users`;
//         const suggestionFriends = Promise.all(
//           AllUsers.map((id) => {
//             `SELECT prfilePic , userName FROM users WHERE id = ${id}`;
//           })
//         );
//         db.query(suggestionFriends, (err, data) => {
//           if (err) return res.status(500).json({ error: err.message });
//           return res.status(200).json(data);
//         });
//       }
//     });
//   } catch (error) {
//     console.log("Error in getSuggest controller");
//     res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ error: "Internal Server Error" });
//   }
// };
export const getSuggest = async (req, res) => {
  try {
    const userId = req.query.id;

    // Query to get all friends (both followers and followed users of the current user)
    const allFriendsQuery = `
      SELECT r.followerUserId 
      FROM relationships AS r 
      WHERE r.followedUserId = ?
      UNION 
      SELECT r.followedUserId 
      FROM relationships AS r 
      WHERE r.followerUserId = ?
    `;

    // Query the database to get all friends (follower and followed)
    db.query(allFriendsQuery, [userId, userId], (err, data) => {
      if (err)
        return res.status(500).json({ error: "Error fetching relationships." });

      // Extract all followerUserIds and followedUserIds from the query result
      const excludedUserIds = data.map((entry) => entry.followerUserId);
      excludedUserIds.push(userId); // Exclude the current user as well

      // Modify the query logic to exclude only users that the current user is following
      const suggestionFriendsQuery = `
        SELECT DISTINCT u.id, u.profilePic, u.username 
        FROM users AS u
        WHERE u.id NOT IN (
          SELECT r.followedUserId 
          FROM relationships AS r 
          WHERE r.followerUserId = ?
        )
        AND u.id != ? 
        ORDER BY RAND() 
        LIMIT 5
      `;

      // Query the database to get suggested users
      db.query(suggestionFriendsQuery, [userId, userId], (err, info) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error fetching suggested users." });

        // Check if no suggestions were found
        if (info.length === 0) {
          // Check if there are any other users left to suggest
          const checkOtherUsersQuery = `
            SELECT COUNT(*) AS count
            FROM users 
            WHERE id NOT IN (
              SELECT r.followedUserId 
              FROM relationships AS r 
              WHERE r.followerUserId = ?
            )
            AND id != ?
          `;

          db.query(
            checkOtherUsersQuery,
            [userId, userId],
            (err, countResult) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "Error checking for more users." });

              const remainingUsersCount = countResult[0].count;
              if (remainingUsersCount === 0) {
                return res
                  .status(200)
                  .json({ message: "No more suggestions." });
              } else {
                return res.status(200).json([]);
              }
            }
          );
        } else {
          return res.status(200).json(info);
        }
      });
    });
  } catch (error) {
    console.error("Error in getSuggest controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
