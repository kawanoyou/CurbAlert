import { json } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import sharp from 'sharp';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST({ request, locals }) {
  try {
    // 認証チェック
    if (!locals.user) {
      return json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return json({ error: 'ファイルが選択されていません' }, { status: 400 });
    }

    // デバッグ用ログ
    console.log(`File size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    console.log(`Max size: ${MAX_FILE_SIZE} bytes (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)} MB)`);

    // ファイルサイズチェック
    if (file.size > MAX_FILE_SIZE) {
      console.log(`File size ${file.size} exceeds maximum ${MAX_FILE_SIZE}`);
      return json({ error: `ファイルサイズは10MB以下にしてください（現在: ${(file.size / 1024 / 1024).toFixed(2)}MB）` }, { status: 400 });
    }

    // ファイルタイプチェック
    if (!ALLOWED_TYPES.includes(file.type)) {
      return json({ error: 'JPEG、PNG、WebP形式の画像のみアップロード可能です' }, { status: 400 });
    }

    // ファイルをバッファに読み込む
    const buffer = Buffer.from(await file.arrayBuffer());

    // Sharpで画像を最適化
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Vercel Blobにアップロード
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(fileName, optimizedBuffer, {
      access: 'public',
      contentType: 'image/jpeg'
    });

    console.log(`Uploaded to Vercel Blob: ${blob.url}`);

    return json({ success: true, url: blob.url, fileName: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: '画像のアップロードに失敗しました' }, { status: 500 });
  }
}
