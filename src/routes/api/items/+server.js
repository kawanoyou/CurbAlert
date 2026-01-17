import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db.js';

export async function GET({ url }) {
  try {
    const category = url.searchParams.get('category');
    const lat = parseFloat(url.searchParams.get('lat'));
    const lng = parseFloat(url.searchParams.get('lng'));
    const maxDistance = parseFloat(url.searchParams.get('maxDistance')) || 5000; // デフォルト5km

    let sql = `
      SELECT
        items.*,
        users.name as user_name,
        users.rating as user_rating,
        (SELECT image_path FROM item_images WHERE item_id = items.id ORDER BY display_order LIMIT 1) as image_path
      FROM items
      JOIN users ON items.user_id = users.id
      WHERE items.status = 'available'
    `;
    const args = [];

    // カテゴリフィルター
    if (category && category !== 'all') {
      sql += ' AND items.category = ?';
      args.push(category);
    }

    sql += ' ORDER BY items.created_at DESC LIMIT 100';

    const result = await db.execute({ sql, args });
    let items = result.rows;

    // 距離フィルター（ユーザー位置が提供されている場合）
    if (!isNaN(lat) && !isNaN(lng)) {
      items = items.map(item => {
        const distance = calculateDistance(
          lat,
          lng,
          item.display_lat,
          item.display_lng
        );
        return { ...item, distance };
      }).filter(item => item.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    }

    return json({ items });
  } catch (error) {
    console.error('Error fetching items:', error);
    return json({ error: 'アイテムの取得に失敗しました' }, { status: 500 });
  }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // メートル
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
