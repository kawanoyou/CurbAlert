import { verifyToken, getUserById } from '$lib/server/auth.js';
import { initDatabase } from '$lib/server/db.js';
import { sequence } from '@sveltejs/kit/hooks';
import { authHandle } from './auth.js';

// データベースを初期化（アプリ起動時に1回だけ実行）
let dbInitialized = false;

async function authenticationHandle({ event, resolve }) {
  // データベース初期化
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  // Auth.jsのセッションを確認
  const session = await event.locals.auth();

  if (session?.user) {
    // Auth.jsからのユーザー情報を使用
    event.locals.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      avatar_url: session.user.avatar_url,
    };
  } else {
    // 既存のJWTトークン認証をフォールバックとして使用
    const token = event.cookies.get('token');

    if (token) {
      // トークンを検証
      const decoded = verifyToken(token);

      if (decoded && decoded.userId) {
        try {
          // ユーザー情報を取得
          const user = await getUserById(decoded.userId);
          if (user) {
            event.locals.user = user;
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }
  }

  return await resolve(event);
}

// Auth.jsのhandleと既存の認証handleを順番に実行
export const handle = sequence(authHandle, authenticationHandle);
