import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from '$env/static/private';
import { getDb } from '$lib/server/db.js';

export const { handle: authHandle, signIn, signOut } = SvelteKitAuth({
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: AUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        const db = getDb();

        // ユーザーがデータベースに存在するか確認
        const existingUser = await db.execute({
          sql: 'SELECT * FROM users WHERE email = ?',
          args: [user.email],
        });

        if (existingUser.rows.length === 0) {
          // 新規ユーザーを作成
          await db.execute({
            sql: `
              INSERT INTO users (name, email, google_id, avatar_url, created_at)
              VALUES (?, ?, ?, ?, datetime('now'))
            `,
            args: [user.name, user.email, profile.sub, user.image],
          });
        } else {
          // 既存ユーザーのGoogle IDとアバター画像を更新
          await db.execute({
            sql: `
              UPDATE users
              SET google_id = ?, avatar_url = ?, updated_at = datetime('now')
              WHERE email = ?
            `,
            args: [profile.sub, user.image, user.email],
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        const db = getDb();
        const result = await db.execute({
          sql: 'SELECT id, name, email, avatar_url FROM users WHERE email = ?',
          args: [session.user.email],
        });

        if (result.rows.length > 0) {
          const user = result.rows[0];
          session.user.id = user.id;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.avatar_url = user.avatar_url;
        }
      }
      return session;
    },
  },
});
