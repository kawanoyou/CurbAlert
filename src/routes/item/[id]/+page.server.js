import { error } from '@sveltejs/kit';
import { getItemById } from '$lib/server/items.js';

export async function load({ params, locals }) {
  const itemId = parseInt(params.id);

  if (isNaN(itemId)) {
    throw error(404, 'アイテムが見つかりません');
  }

  const item = await getItemById(itemId);

  if (!item) {
    throw error(404, 'アイテムが見つかりません');
  }

  return {
    item,
    user: locals.user || null
  };
}
