import { getOnlineUsers } from "./socket.js";
import { db } from "./connectDB.js";

export const getOnlineFriends = (req, res) => {
  try {
    const userId = req.query.id;

    const allFriendsQuery = `
      SELECT r.followerUserId AS friendId 
      FROM relationships AS r 
      WHERE r.followedUserId = ?
      UNION 
      SELECT r.followedUserId AS friendId 
      FROM relationships AS r 
      WHERE r.followerUserId = ?
    `;

    db.query(allFriendsQuery, [userId, userId], (err, data) => {
      if (err)
        return res.status(500).json({ error: "Error fetching relationships." });

      const onlineUsers = getOnlineUsers();

      // Get the IDs of online friends
      const onlineFriendIds = data
        .map((entry) => entry.friendId)
        .filter((friendId) => onlineUsers.has(friendId));

      if (onlineFriendIds.length === 0) {
        return res.status(200).json([]);
      }

      // Fetch details of online friends
      const onlineFriendsQuery = `
        SELECT id, username, profilePic
        FROM users
        WHERE id IN (?)
      `;

      db.query(onlineFriendsQuery, [onlineFriendIds], (err, friendsData) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Error fetching online friends details." });
        return res.status(200).json(friendsData);
      });
    });
  } catch (error) {
    console.error("Error in getOnlineFriends API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
