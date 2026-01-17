import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
  // Cookieを削除
  cookies.delete('token', { path: '/' });
  return json({ success: true });
}
