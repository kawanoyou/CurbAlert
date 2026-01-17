# モッテケ (MOTTEKE) - 要件定義書

## 📖 プロジェクト概要

### アプリ名
**モッテケ (MOTTEKE)**

### コンセプト
近所の不用品を地図上で簡単に譲渡・取引できるWebアプリ。
「家の前に置いておくから、持っていって（モッテケ）」という日本版Curb Alertを実現。

### ターゲットユーザー
- 引っ越しで不用品を処分したい人
- 近所で安く物を手に入れたい人
- 大型家具・家電を送料なしで取引したい人

### 主な差別化ポイント
- ✅ **地図がメイン** - ジモティーやメルカリにない「視覚的な距離感」
- ✅ **無料譲渡に特化** - 「ご自由にどうぞ」文化の促進
- ✅ **シンプルなUI** - 地図・出品・メッセージだけ

---

## 🛠️ 技術スタック

### フロントエンド + バックエンド
- **SvelteKit** (フルスタック)
- **Google Maps JavaScript API** (地図表示)
- **Turso (LibSQL)** (データベース)

### デプロイ
- **Vercel** (推奨)

### 開発ツール
- Node.js 18+
- npm

---

## 🗄️ データベース設計

### テーブル構成

#### 1. users テーブル
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rating REAL DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**カラム説明:**
- `id`: ユーザーID
- `name`: 表示名
- `email`: メールアドレス（ログイン用）
- `password_hash`: パスワードハッシュ（bcrypt）
- `rating`: 評価（1.0〜5.0）
- `review_count`: 評価件数
- `created_at`: 登録日時

#### 2. items テーブル
```sql
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK(category IN ('electronics', 'furniture', 'clothing', 'books', 'hobby', 'other')),
    lat REAL NOT NULL,
    lng REAL NOT NULL,
    display_lat REAL NOT NULL,
    display_lng REAL NOT NULL,
    address_display TEXT,
    status TEXT DEFAULT 'available' CHECK(status IN ('available', 'reserved', 'completed')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_items_display_location ON items(display_lat, display_lng);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category);
```

**カラム説明:**
- `id`: アイテムID
- `user_id`: 出品者ID
- `title`: タイトル（例: 洗濯機）
- `description`: 説明
- `category`: カテゴリ（electronics/furniture/clothing/books/hobby/other）
- `lat`, `lng`: 正確な位置（プライバシー保護のため非表示）
- `display_lat`, `display_lng`: 表示用位置（±50mランダムずらし）
- `address_display`: 表示用住所（「渋谷区神南1丁目付近」など）
- `status`: ステータス（available/reserved/completed）
- `created_at`: 投稿日時
- `updated_at`: 更新日時

#### 3. item_images テーブル
```sql
CREATE TABLE item_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE INDEX idx_item_images_item_id ON item_images(item_id);
```

**カラム説明:**
- `id`: 画像ID
- `item_id`: アイテムID
- `image_path`: 画像ファイルパス
- `display_order`: 表示順序
- `created_at`: 登録日時

#### 4. messages テーブル
```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id),
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE INDEX idx_messages_item_id ON messages(item_id);
CREATE INDEX idx_messages_users ON messages(sender_id, receiver_id);
```

**カラム説明:**
- `id`: メッセージID
- `item_id`: アイテムID
- `sender_id`: 送信者ID
- `receiver_id`: 受信者ID
- `message`: メッセージ内容
- `created_at`: 送信日時

---

## 📁 ディレクトリ構成

```
motteke/
├── src/
│   ├── routes/
│   │   ├── +page.svelte                    # トップページ（地図）
│   │   ├── +page.server.js                 # トップページのサーバーロジック
│   │   ├── item/
│   │   │   └── [id]/
│   │   │       ├── +page.svelte            # アイテム詳細
│   │   │       └── +page.server.js
│   │   ├── post/
│   │   │   ├── +page.svelte                # 出品フォーム
│   │   │   └── +page.server.js
│   │   ├── login/
│   │   │   ├── +page.svelte                # ログイン
│   │   │   └── +page.server.js
│   │   ├── register/
│   │   │   ├── +page.svelte                # 新規登録
│   │   │   └── +page.server.js
│   │   ├── messages/
│   │   │   ├── +page.svelte                # メッセージ一覧
│   │   │   └── +page.server.js
│   │   └── api/
│   │       ├── items/
│   │       │   └── +server.js              # アイテムAPI
│   │       ├── upload/
│   │       │   └── +server.js              # 画像アップロードAPI
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   │   └── +server.js          # ログインAPI
│   │       │   ├── register/
│   │       │   │   └── +server.js          # 登録API
│   │       │   └── logout/
│   │       │       └── +server.js          # ログアウトAPI
│   │       └── messages/
│   │           └── +server.js              # メッセージAPI
│   ├── lib/
│   │   ├── components/
│   │   │   ├── Map.svelte                  # 地図コンポーネント
│   │   │   ├── ItemCard.svelte             # アイテムカード
│   │   │   ├── Header.svelte               # ヘッダー
│   │   │   └── CategoryNav.svelte          # カテゴリナビ
│   │   ├── server/
│   │   │   ├── db.js                       # DB接続
│   │   │   ├── items.js                    # アイテムロジック
│   │   │   ├── auth.js                     # 認証ロジック
│   │   │   └── utils.js                    # ユーティリティ
│   │   └── stores/
│   │       ├── items.js                    # アイテムストア
│   │       └── user.js                     # ユーザーストア
│   ├── app.html
│   └── hooks.server.js                     # サーバーフック（認証チェック）
├── static/
│   └── uploads/                            # 画像アップロード先
├── .env
├── package.json
├── svelte.config.js
└── vite.config.js
```

---

## 🎯 機能要件

### MVP (Phase 1) - 必須機能

#### 1. トップページ（地図表示）
**URL:** `/`

**機能:**
- Google Maps APIで地図表示
- 現在地を自動取得してマップ中心に表示
- 出品アイテムをマーカーで表示
- マーカークリックでアイテム詳細へ遷移
- カテゴリフィルター（すべて/家電/家具/衣類/本/趣味）
- 距離フィルター（500m/1km/2km/5km）
- 画面下部にアイテムリスト表示（スクロール可能）

**表示項目:**
- ヘッダー: ロゴ、「出品する」ボタン、「ログイン」ボタン
- カテゴリナビ: 絵文字付きカテゴリボタン
- 地図: 全画面表示
- アイテムリスト: カード形式（画像、タイトル、距離、投稿時間）

#### 2. アイテム詳細ページ
**URL:** `/item/[id]`

**機能:**
- アイテムの詳細情報表示
- 画像スライダー（複数画像対応）
- 出品者情報表示（名前、評価）
- Google Mapsで位置表示（±50mずらし）
- 「ルート案内」ボタン（Google Maps連携）
- 「出品者に連絡」ボタン（ログイン必須）

**表示項目:**
- 画像（最大5枚、スワイプ可能）
- タイトル
- 説明
- カテゴリ
- 距離
- 投稿日時
- 出品者名・評価
- 地図
- アクションボタン

#### 3. 出品ページ
**URL:** `/post`

**機能:**
- ログイン必須（未ログインは/loginへリダイレクト）
- 出品フォーム
  - タイトル（必須、最大100文字）
  - 説明（必須、最大1000文字）
  - カテゴリ選択（必須）
  - 画像アップロード（最大5枚、JPEG/PNG、各5MB以下）
  - 位置情報取得（必須）
    - 現在地を自動取得
    - または住所入力でGeocoding API使用
- プレビュー機能
- 出品完了後、アイテム詳細ページへ遷移

**バリデーション:**
- タイトル: 必須、1〜100文字
- 説明: 必須、1〜1000文字
- カテゴリ: 必須
- 位置情報: 必須
- 画像: 任意、最大5枚、JPEG/PNG、各5MB以下

#### 4. ログインページ
**URL:** `/login`

**機能:**
- メールアドレス + パスワードでログイン
- JWT認証（Cookieに保存）
- 「新規登録はこちら」リンク
- ログイン成功後、元のページまたはトップへリダイレクト

**バリデーション:**
- メールアドレス: 必須、メール形式
- パスワード: 必須、8文字以上

#### 5. 新規登録ページ
**URL:** `/register`

**機能:**
- 新規ユーザー登録
- 必要情報: 名前、メールアドレス、パスワード
- パスワードはbcryptでハッシュ化
- 登録完了後、自動ログイン→トップへリダイレクト

**バリデーション:**
- 名前: 必須、2〜50文字
- メールアドレス: 必須、メール形式、重複チェック
- パスワード: 必須、8文字以上

#### 6. メッセージ機能（簡易版）
**URL:** `/messages`

**機能:**
- ログインユーザーのメッセージ一覧表示
- アイテムごとにスレッド表示
- リアルタイム更新なし（ページリロードで更新）

---

## 🔐 認証・セキュリティ

### 認証フロー
1. ユーザーがログイン
2. サーバーでパスワード検証
3. JWT生成（有効期限: 7日間）
4. JWTをHttpOnly Cookieに保存
5. 以降のリクエストでCookieからJWT検証

### セキュリティ対策
- パスワードはbcryptでハッシュ化（salt rounds: 10）
- JWT秘密鍵は環境変数で管理
- HttpOnly Cookie使用（XSS対策）
- CSRF対策（SvelteKitのデフォルト機能使用）
- 画像アップロードはファイル形式・サイズ検証
- SQLインジェクション対策（パラメータ化クエリ使用）

---

## 🗺️ Google Maps API仕様

### 使用API
1. **Maps JavaScript API**
   - 地図表示
   - マーカー表示
   - 現在地取得

2. **Geocoding API**
   - 住所→座標変換（出品時の住所入力）

### API Key管理
- 環境変数 `PUBLIC_GOOGLE_MAPS_API_KEY` で管理
- APIキーの制限設定:
  - HTTPリファラー制限（本番ドメインのみ）
  - API制限（Maps JavaScript API、Geocoding APIのみ）

### 地図の仕様
- デフォルト中心: 渋谷区（lat: 35.6812, lng: 139.7671）
- デフォルトズーム: 15
- マーカー色:
  - 📦 家電: 青
  - 🪑 家具: 緑
  - 👕 衣類: 黄
  - 📚 本: 赤
  - 🎮 趣味: 紫
  - その他: グレー

---

## 🎨 UI/UX仕様

### デザインコンセプト
- シンプル・直感的
- モバイルファースト
- 地図がメイン（全画面表示）

### カラースキーム
- プライマリカラー: #667eea（紫）
- セカンダリカラー: #764ba2（濃い紫）
- 背景: #ffffff（白）
- テキスト: #333333
- グレー: #e0e0e0

### フォント
- 日本語: -apple-system, BlinkMacSystemFont, "Segoe UI", "Hiragino Sans"
- 英語・数字: 同上

### レスポンシブ
- モバイル: 〜768px
- タブレット: 768px〜1024px
- デスクトップ: 1024px〜

---

## 🚀 非機能要件

### パフォーマンス
- 初回ロード: 3秒以内
- 地図表示: 1秒以内
- 画像アップロード: 10秒以内（5MB × 5枚）

### 対応ブラウザ
- Chrome 最新版
- Safari 最新版
- Firefox 最新版
- Edge 最新版

### 対応デバイス
- スマートフォン（iOS/Android）
- タブレット
- デスクトップ

---

## 📊 データ仕様

### 距離計算
Haversine公式を使用:
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // 地球の半径（メートル）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

### プライバシー保護
正確な位置情報（lat, lng）は非公開。
表示用位置（display_lat, display_lng）は±50mランダムにずらす:
```javascript
const display_lat = lat + (Math.random() - 0.5) * 0.001; // 約±50m
const display_lng = lng + (Math.random() - 0.5) * 0.001;
```

### 画像処理
- アップロード時にSharpで最適化
- 最大幅: 1200px
- 品質: JPEG 85%
- ファイル名: UUID生成

---

## 🧪 テスト要件

### 最低限のテスト
1. ユーザー登録・ログイン
2. 出品（画像アップロード含む）
3. アイテム一覧表示
4. アイテム詳細表示
5. カテゴリフィルター
6. 距離計算

---

## 📝 環境変数

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

---

## 🎯 開発の優先順位

### Phase 1（MVP - 2週間）
1. プロジェクトセットアップ
2. データベース作成
3. 認証機能（ログイン・新規登録）
4. トップページ（地図表示）
5. 出品機能
6. アイテム詳細ページ

### Phase 2（拡張機能 - 1週間）
7. メッセージ機能
8. プロフィールページ
9. 評価システム

### Phase 3（改善 - 継続）
10. 通知機能
11. 検索機能強化
12. パフォーマンス最適化

---

## 📚 参考資料

### 競合サービス
- ジモティー: https://jmty.jp/
- キャロット: https://www.karrotmarket.com/

### 技術ドキュメント
- SvelteKit: https://kit.svelte.dev/
- Google Maps API: https://developers.google.com/maps
- Turso: https://docs.turso.tech/
- Vercel: https://vercel.com/docs

---

## ✅ 完成の定義

以下がすべて動作すること:
1. ユーザーが新規登録・ログインできる
2. ログインユーザーが商品を出品できる（画像アップロード含む）
3. トップページで地図上にマーカーが表示される
4. マーカーをクリックするとアイテム詳細が見れる
5. カテゴリフィルターが機能する
6. 距離が正しく表示される
7. レスポンシブデザインが機能する（モバイル・デスクトップ）
