import { json } from '@sveltejs/kit';
import { handleUpload } from '@vercel/blob/client';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST({ request, locals }) {
  try {
    // 認証チェック
    if (!locals.user) {
      return json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const body = await request.json();

    // クライアント側のアップロードハンドラー
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // ファイル名の検証とトークン生成前の処理
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
          tokenPayload: JSON.stringify({
            userId: locals.user.id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log(`Upload completed: ${blob.url}`);
      },
    });

    return json(jsonResponse);
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: '画像のアップロードに失敗しました' }, { status: 500 });
  }
}
