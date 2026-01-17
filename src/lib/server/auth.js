import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { db } from './db.js';

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = '7d';

/**
 * パスワードをハッシュ化
 * @param {string} password - 平文パスワード
 * @returns {Promise<string>} ハッシュ化されたパスワード
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * パスワードを検証
 * @param {string} password - 平文パスワード
 * @param {string} hash - ハッシュ化されたパスワード
 * @returns {Promise<boolean>} 一致するかどうか
 */
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

/**
 * JWTトークンを生成
 * @param {object} user - ユーザー情報
 * @returns {string} JWTトークン
 */
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * JWTトークンを検証
 * @param {string} token - JWTトークン
 * @returns {object|null} デコードされたトークン情報、無効な場合はnull
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * ユーザーを作成
 * @param {string} name - 名前
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @returns {Promise<object>} 作成されたユーザー情報
 */
export async function createUser(name, email, password) {
  // メールアドレスの重複チェック
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email]
  });

  if (existing.rows.length > 0) {
    throw new Error('このメールアドレスは既に登録されています');
  }

  // パスワードをハッシュ化
  const passwordHash = await hashPassword(password);

  // ユーザーを作成
  const result = await db.execute({
    sql: 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    args: [name, email, passwordHash]
  });

  return {
    id: result.lastInsertRowid,
    name,
    email
  };
}

/**
 * ユーザーをメールアドレスで取得
 * @param {string} email - メールアドレス
 * @returns {Promise<object|null>} ユーザー情報、存在しない場合はnull
 */
export async function getUserByEmail(email) {
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  return result.rows[0] || null;
}

/**
 * ユーザーをIDで取得
 * @param {number} userId - ユーザーID
 * @returns {Promise<object|null>} ユーザー情報、存在しない場合はnull
 */
export async function getUserById(userId) {
  const result = await db.execute({
    sql: 'SELECT id, name, email, rating, review_count, created_at FROM users WHERE id = ?',
    args: [userId]
  });

  return result.rows[0] || null;
}

/**
 * ログイン処理
 * @param {string} email - メールアドレス
 * @param {string} password - パスワード
 * @returns {Promise<{user: object, token: string}>} ユーザー情報とトークン
 */
export async function login(email, password) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  const token = generateToken(user);

  // パスワードハッシュを除外
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token
  };
}
