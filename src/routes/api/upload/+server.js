import { json } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const UPLOAD_DIR = 'static/uploads';
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

    // アップロードディレクトリを作成（存在しない場合）
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // ファイル名を生成
    const fileExtension = path.extname(file.name) || '.jpg';
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // ファイルをバッファに読み込む
    const buffer = Buffer.from(await file.arrayBuffer());

    // Sharpで画像を最適化
    await sharp(buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(filePath);

    // 公開URLを返す
    const publicUrl = `/uploads/${fileName}`;

    return json({ success: true, url: publicUrl, fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return json({ error: '画像のアップロードに失敗しました' }, { status: 500 });
  }
}
