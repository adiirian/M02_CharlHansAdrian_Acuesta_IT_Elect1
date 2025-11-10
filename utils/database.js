import * as SQLite from 'expo-sqlite';

let db;

// Initialize database
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('auth.db');

    // Create users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        resetToken TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Get database instance
export const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase first.');
  }
  return db;
};

// Create new user
export const createUser = async (email, hashedPassword) => {
  try {
    const db = getDatabase();
    const result = await db.runAsync(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email.toLowerCase(), hashedPassword, 'user']
    );
    return result;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const db = getDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Update user password
export const updateUserPassword = async (email, newHashedPassword) => {
  try {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE users SET password = ? WHERE email = ?',
      [newHashedPassword, email.toLowerCase()]
    );
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

// Save reset token
export const saveResetToken = async (email, token) => {
  try {
    const db = getDatabase();
    await db.runAsync(
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
    const db = getDatabase();
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE email = ? AND resetToken = ?',
      [email.toLowerCase(), token]
    );
    return user !== null;
  } catch (error) {
    console.error('Error verifying reset token:', error);
    throw error;
  }
};

// Clear reset token
export const clearResetToken = async (email) => {
  try {
    const db = getDatabase();
    await db.runAsync(
      'UPDATE users SET resetToken = NULL WHERE email = ?',
      [email.toLowerCase()]
    );
    return true;
  } catch (error) {
    console.error('Error clearing reset token:', error);
    throw error;
  }
};

// Get all users (for debugging)
export const getAllUsers = async () => {
  try {
    const db = getDatabase();
    const users = await db.getAllAsync('SELECT id, email, role, createdAt FROM users');
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};
