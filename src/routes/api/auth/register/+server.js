import { json } from '@sveltejs/kit';
import { createUser, generateToken } from '$lib/server/auth.js';

export async function POST({ request, cookies }) {
  try {
    const { name, email, password } = await request.json();

    // バリデーション
    if (!name || !email || !password) {
      return json(
        { error: 'すべての項目を入力してください' },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 50) {
      return json(
        { error: '名前は2文字以上50文字以内で入力してください' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        { error: 'パスワードは8文字以上で入力してください' },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json(
        { error: '正しいメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    // ユーザー作成
    const user = await createUser(name, email, password);

    // JWTトークンを生成
    const token = generateToken(user);

    // JWTをHttpOnly Cookieに保存
    cookies.set('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7日間
    });

    return json({ success: true, user });
  } catch (error) {
    console.error('Register error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}
