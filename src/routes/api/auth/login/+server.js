import { json } from '@sveltejs/kit';
import { login } from '$lib/server/auth.js';

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return json(
        { error: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    // ログイン処理
    const { user, token } = await login(email, password);

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
    console.error('Login error:', error);
    return json({ error: error.message }, { status: 401 });
  }
}
