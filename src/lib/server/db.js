import { createClient } from '@libsql/client';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';

// データベースクライアントの作成
const dbConfig = {
  url: DATABASE_URL
};

// ローカルファイルでない場合（TursoやリモートDB）のみauthTokenを設定
if (DATABASE_AUTH_TOKEN) {
  dbConfig.authToken = DATABASE_AUTH_TOKEN;
}

export const db = createClient(dbConfig);

// データベースクライアントを取得する関数
export function getDb() {
  return db;
}

// データベース初期化（スキーマ作成）
export async function initDatabase() {
  try {
    // usersテーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        google_id TEXT UNIQUE,
        avatar_url TEXT,
        rating REAL DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // itemsテーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL CHECK(category IN ('electronics', 'furniture', 'clothing', 'books', 'hobby', 'other')),
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        display_lat REAL NOT NULL,
        display_lng REAL NOT NULL,
        address_display TEXT,
        status TEXT DEFAULT 'available' CHECK(status IN ('available', 'reserved', 'completed')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // itemsテーブルのインデックス
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_items_display_location ON items(display_lat, display_lng)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_items_status ON items(status)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)`);

    // item_imagesテーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS item_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        image_path TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
      )
    `);

    await db.execute(`CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON item_images(item_id)`);

    // messagesテーブル
    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES items(id),
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (receiver_id) REFERENCES users(id)
      )
    `);

    await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_item_id ON messages(item_id)`);
    await db.execute(`CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(sender_id, receiver_id)`);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
