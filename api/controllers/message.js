import { db } from "../connectDB.js";
import moment from "moment/moment.js";

// send message to the user and DB
export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { content } = req.body;
    const senderId = req.user.id;

    // Query to find conversation between sender and receiver
    const conversationQuery = `SELECT c.id FROM conversations AS c 
                               JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
                               JOIN conversation_participants cp2 ON c.id = cp2.conversation_id  
                               WHERE cp1.userId = ? AND cp2.userId = ?`;

    // Use Promise to handle query results
    const [conversationResult] = await new Promise((resolve, reject) => {
      db.query(conversationQuery, [senderId, receiverId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    let conversationId;

    // Check if conversation exists
    if (!conversationResult || conversationResult?.length === 0) {
      // Create a new conversation
      const newConversationQuery =
        "INSERT INTO conversations (`createdAt`) VALUES (?)";
      const conversationValues = [
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];

      const insertConversationResult = await new Promise((resolve, reject) => {
        db.query(newConversationQuery, conversationValues, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      // Get the inserted conversation ID
      conversationId = insertConversationResult.insertId;

      // Insert participants
      const participantsQuery =
        "INSERT INTO conversation_participants (`conversation_id`, `userId`) VALUES (?, ?), (?, ?)";
      await new Promise((resolve, reject) => {
        db.query(
          participantsQuery,
          [conversationId, senderId, conversationId, receiverId],
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    } else {
      // Use existing conversation ID
      conversationId = conversationResult.id;
    }

    // Insert the new message into the message table
    const newMessageQuery =
      "INSERT INTO message (`content`, `senderId`, `receiverId`, `conversationId`, `createdAt`) VALUES (?, ?, ?, ?, ?)";
    const messageValues = [
      content,
      senderId,
      receiverId,
      conversationId,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    await new Promise((resolve, reject) => {
      db.query(newMessageQuery, messageValues, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Respond to the client that the message was sent successfully
    res.status(200).json({ message: "Message has been sent." });
  } catch (error) {
    console.log("Error in Send Message Controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const GetMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user.id;

    // Query to find the conversation between the two users
    const conversationQuery = `
      SELECT c.id FROM conversations AS c
      JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
      JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
      WHERE cp1.userId = ? AND cp2.userId = ?;
    `;

    const [conversationResult] = await new Promise((resolve, reject) => {
      db.query(conversationQuery, [senderId, receiverId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    // Check if a conversation was found
    if (!conversationResult || conversationResult.length === 0) {
      return res.status(404).json({ message: "Start a conversation now!" });
    }

    const conversationId = conversationResult.id;

    // Query to fetch messages in the conversation
    const messagesQuery = `
      SELECT * FROM message AS m 
      WHERE m.conversationId = ? 
      ORDER BY m.createdAt ASC;
    `;

    const messages = await new Promise((resolve, reject) => {
      db.query(messagesQuery, [conversationId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in Get Messages Controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* export const GetMessage = async (req,res)=>{
  try {
    
  } catch (error) {
    console.log("Error in Get Message Controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
} 
 */
export const UpdateMessage = async (req, res) => {
  try {
    const messageId = req.query.messageId;
    const content = req.body.content;

    if (!messageId || !content) {
      return res
        .status(400)
        .json({ error: "Message ID and content are required" });
    }

    // SQL query to update the message content
    const updateQuery = "UPDATE message SET `content`= ? WHERE id = ?";

    // Execute the query
    const updateResult = await new Promise((resolve, reject) => {
      db.query(updateQuery, [content, messageId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });

    // Check if the message was updated
    if (updateResult.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Message not found or no changes made" });
    }

    // Respond with success
    res.status(200).json({
      message: "Message updated successfully",
    });
  } catch (error) {
    console.log("Error in Update Message Controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const DeleteMessage = async (req, res) => {
  try {
    const messageId = req.query.messageId;
    const deleteQuery = "DELETE FROM message WHERE id = ?";
    const deleteResult = await new Promise((resolve, reject) => {
      db.query(deleteQuery, [messageId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
    res.status(200).json({
      message: "this message has been deleted successfully",
    });
  } catch (error) {
    onsole.log("Error in Delete Message Controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
