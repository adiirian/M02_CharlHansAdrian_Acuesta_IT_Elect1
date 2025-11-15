import * as SQLite from 'expo-sqlite';

let db = null;

// Initialize database and create tables
export const initDatabase = async () => {
  try {
    // Open database
    db = await SQLite.openDatabaseAsync('auth.db');

    // Create users table with name field
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        resetToken TEXT,
        profile_picture TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create messages table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

// Create a new user
export const createUser = async (email, hashedPassword, name) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [email.toLowerCase(), hashedPassword, name]
    );
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const database = getDatabase();
    const user = await database.getFirstAsync(
      'SELECT id, email, name, password, role, resetToken, profile_picture, createdAt FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return user;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (email, newHashedPassword) => {
  try {
    const database = getDatabase();
    await database.runAsync(
      'UPDATE users SET password = ? WHERE email = ?',
      [newHashedPassword, email.toLowerCase()]
    );
    return true;
  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// Save reset token
export const saveResetToken = async (email, token) => {
  try {
    const database = getDatabase();
    await database.runAsync(
      'UPDATE users SET resetToken = ? WHERE email = ?',
      [token, email.toLowerCase()]
    );
    return true;
  } catch (error) {
    console.error('Error saving reset token:', error);
    throw error;
  }
};

// Verify reset token
export const verifyResetToken = async (email, token) => {
  try {
    const database = getDatabase();
    const user = await database.getFirstAsync(
      'SELECT resetToken FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return user && user.resetToken === token;
  } catch (error) {
    console.error('Error verifying reset token:', error);
    throw error;
  }
};

// Clear reset token
export const clearResetToken = async (email) => {
  try {
    const database = getDatabase();
    await database.runAsync(
      'UPDATE users SET resetToken = NULL WHERE email = ?',
      [email.toLowerCase()]
    );
    return true;
  } catch (error) {
    console.error('Error clearing reset token:', error);
    throw error;
  }
};

// Get all users (without passwords)
export const getAllUsers = async () => {
  try {
    const database = getDatabase();
    const users = await database.getAllAsync(
      'SELECT id, email, name, role, profile_picture, createdAt FROM users'
    );
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

// Get all users excluding a specific user (without passwords)
export const getAllUsersExcluding = async (excludeUserId) => {
  try {
    const database = getDatabase();
    const users = await database.getAllAsync(
      'SELECT id, email, name, role, profile_picture, createdAt FROM users WHERE id != ?',
      [excludeUserId]
    );
    return users;
  } catch (error) {
    console.error('Error getting all users excluding:', error);
    throw error;
  }
};

// Update user profile picture
export const updateUserProfilePicture = async (userId, profilePictureUri) => {
  try {
    const database = getDatabase();
    await database.runAsync(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profilePictureUri, userId]
    );
    return true;
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw error;
  }
};

// Insert a new message
export const insertMessage = async (senderId, receiverId, message) => {
  try {
    const database = getDatabase();
    const result = await database.runAsync(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [senderId, receiverId, message]
    );
    return result;
  } catch (error) {
    console.error('Error inserting message:', error);
    throw error;
  }
};

// Get messages between two users
export const getMessagesBetween = async (userId1, userId2) => {
  try {
    const database = getDatabase();
    const messages = await database.getAllAsync(
      `SELECT m.id, m.sender_id, m.receiver_id, m.message, m.timestamp,
              u1.email as sender_email, u1.name as sender_name,
              u2.email as receiver_email, u2.name as receiver_name
       FROM messages m
       JOIN users u1 ON m.sender_id = u1.id
       JOIN users u2 ON m.receiver_id = u2.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.timestamp ASC`,
      [userId1, userId2, userId2, userId1]
    );
    return messages;
  } catch (error) {
    console.error('Error getting messages between users:', error);
    throw error;
  }
};
