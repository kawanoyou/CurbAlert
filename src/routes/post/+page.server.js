import { redirect } from '@sveltejs/kit';
import { createItem } from '$lib/server/items.js';

export async function load({ locals }) {
  // ログインチェック
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  return {
    user: locals.user
  };
}

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return { error: 'ログインが必要です' };
    }

    try {
      const formData = await request.formData();
      const title = formData.get('title');
      const description = formData.get('description');
      const category = formData.get('category');
      const lat = parseFloat(formData.get('lat'));
      const lng = parseFloat(formData.get('lng'));
      const address_display = formData.get('address_display') || '';
      const imagesJson = formData.get('images');
      const images = imagesJson ? JSON.parse(imagesJson) : [];

      // バリデーション
      if (!title || title.length < 1 || title.length > 100) {
        return { error: 'タイトルは1〜100文字で入力してください' };
      }

      if (!description || description.length < 1 || description.length > 1000) {
        return { error: '説明は1〜1000文字で入力してください' };
      }

      if (!category) {
        return { error: 'カテゴリを選択してください' };
      }

      if (isNaN(lat) || isNaN(lng)) {
        return { error: '位置情報を取得してください' };
      }

      // アイテムを作成
      const item = await createItem(
        {
          title,
          description,
          category,
          lat,
          lng,
          address_display,
          images
        },
        locals.user.id
      );

      throw redirect(302, `/item/${item.id}`);
    } catch (error) {
      if (error.status === 302) {
        throw error; // リダイレクトをそのまま投げる
      }
      console.error('Post item error:', error);
      return { error: error.message || '出品に失敗しました' };
    }
  }
};
