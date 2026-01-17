# モッテケ (MOTTEKE)

近所の不用品を地図上で簡単に譲渡・取引できるWebアプリ

## 🚀 セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定してください：

```env
# Google Maps API
PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Turso Database
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your_auth_token

# JWT認証
JWT_SECRET=your_jwt_secret_key_minimum_32_characters

# アプリ設定
PUBLIC_APP_URL=http://localhost:5173
```

#### Google Maps APIキーの取得

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. プロジェクトを作成
3. Maps JavaScript APIとGeocoding APIを有効化
4. APIキーを作成

#### Tursoデータベースの作成

```bash
# Turso CLIをインストール
curl -sSfL https://get.tur.so/install.sh | bash

# ログイン
turso auth login

# データベースを作成
turso db create motteke

# 接続情報を取得
turso db show motteke

# 認証トークンを作成
turso db tokens create motteke
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開いてアプリにアクセスできます。

## 📁 プロジェクト構成

```
motteke/
├── src/
│   ├── routes/              # ページとAPIルート
│   │   ├── +page.svelte     # トップページ
│   │   ├── login/           # ログインページ
│   │   ├── register/        # 新規登録ページ
│   │   ├── post/            # 出品ページ
│   │   ├── item/[id]/       # アイテム詳細ページ
│   │   └── api/             # APIエンドポイント
│   ├── lib/
│   │   ├── components/      # Svelteコンポーネント
│   │   ├── server/          # サーバーサイドコード
│   │   └── utils.js         # ユーティリティ関数
│   └── app.html             # HTMLテンプレート
├── static/
│   └── uploads/             # アップロードされた画像
└── package.json
```

## ✨ 主な機能

- ✅ ユーザー登録・ログイン（JWT認証）
- ✅ Google Mapsによる地図表示
- ✅ アイテムの出品（画像アップロード、位置情報）
- ✅ カテゴリフィルター
- ✅ アイテム詳細表示
- ✅ 距離計算とソート
- ✅ レスポンシブデザイン

## 🛠️ 技術スタック

- **フロントエンド**: SvelteKit
- **データベース**: Turso (LibSQL)
- **地図**: Google Maps JavaScript API
- **認証**: JWT + bcrypt
- **画像処理**: Sharp

## 📝 使い方

### 新規登録

1. 「新規登録」ボタンをクリック
2. 名前、メールアドレス、パスワードを入力
3. 登録完了後、自動的にログイン

### アイテムを出品

1. ログイン後、「出品する」ボタンをクリック
2. タイトル、説明、カテゴリを入力
3. 画像をアップロード（最大5枚）
4. 「現在地を取得」ボタンで位置情報を取得
5. 「出品する」ボタンをクリック

### アイテムを探す

1. トップページの地図上でマーカーをクリック
2. またはアイテムリストからアイテムを選択
3. カテゴリフィルターで絞り込み可能

## 🔒 セキュリティ

- パスワードはbcryptでハッシュ化
- JWTトークンはHttpOnly Cookieで保存
- 正確な位置情報は非表示（±50mランダムずらし）
- 画像アップロードはサイズと形式を検証
- SQLインジェクション対策（パラメータ化クエリ）

## 🚀 デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## 📚 ドキュメント

詳細な要件定義と開発ガイドラインについては、以下のファイルを参照してください：

- `motteke-requirements.md` - 要件定義書
- `motteke-agents.md` - 開発ガイドライン

## 📄 ライセンス

MIT
