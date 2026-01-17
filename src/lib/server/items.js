import { db } from './db.js';
import { obfuscateLocation } from './utils.js';

/**
 * アイテムを作成
 * @param {object} itemData - アイテム情報
 * @param {number} userId - ユーザーID
 * @returns {Promise<object>} 作成されたアイテム情報
 */
export async function createItem(itemData, userId) {
  const { title, description, category, lat, lng, address_display, images } = itemData;

  // 位置情報をずらす
  const { display_lat, display_lng } = obfuscateLocation(lat, lng);

  // アイテムを作成
  const result = await db.execute({
    sql: `INSERT INTO items (user_id, title, description, category, lat, lng, display_lat, display_lng, address_display)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, title, description, category, lat, lng, display_lat, display_lng, address_display]
  });

  const itemId = result.lastInsertRowid;

  // 画像を保存
  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      await db.execute({
        sql: 'INSERT INTO item_images (item_id, image_path, display_order) VALUES (?, ?, ?)',
        args: [itemId, images[i], i]
      });
    }
  }

  return {
    id: itemId,
    ...itemData,
    display_lat,
    display_lng
  };
}

/**
 * アイテムをIDで取得
 * @param {number} itemId - アイテムID
 * @returns {Promise<object|null>} アイテム情報
 */
export async function getItemById(itemId) {
  const result = await db.execute({
    sql: `
      SELECT
        items.*,
        users.name as user_name,
        users.rating as user_rating,
        users.review_count as user_review_count
      FROM items
      JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `,
    args: [itemId]
  });

  if (result.rows.length === 0) {
    return null;
  }

  const item = result.rows[0];

  // 画像を取得
  const imagesResult = await db.execute({
    sql: 'SELECT image_path FROM item_images WHERE item_id = ? ORDER BY display_order',
    args: [itemId]
  });

  item.images = imagesResult.rows.map(row => row.image_path);

  return item;
}

/**
 * アイテムのステータスを更新
 * @param {number} itemId - アイテムID
 * @param {string} status - 新しいステータス
 * @param {number} userId - ユーザーID（権限チェック用）
 * @returns {Promise<boolean>} 成功したかどうか
 */
export async function updateItemStatus(itemId, status, userId) {
  // アイテムの所有者チェック
  const item = await db.execute({
    sql: 'SELECT user_id FROM items WHERE id = ?',
    args: [itemId]
  });

  if (item.rows.length === 0 || item.rows[0].user_id !== userId) {
    throw new Error('このアイテムを更新する権限がありません');
  }

  await db.execute({
    sql: 'UPDATE items SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [status, itemId]
  });

  return true;
}
