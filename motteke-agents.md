# モッテケ (MOTTEKE) - Agents Configuration

このファイルはClaude Codeがプロジェクトを効率的に実装するための設定ファイルです。

---

## 🎯 プロジェクト概要

**アプリ名:** モッテケ (MOTTEKE)
**目的:** 近所の不用品を地図上で簡単に譲渡・取引できるWebアプリ
**技術スタック:** SvelteKit + Google Maps API + Turso (SQLite)

---

## 📋 開発タスクリスト

### Phase 1: セットアップ（優先度: 最高）

- [ ] **Task 1.1: プロジェクト初期化**
  - SvelteKitプロジェクト作成
  - 必要なパッケージインストール
  - 環境変数設定 (.env)
  - 基本的なフォルダ構造作成

- [ ] **Task 1.2: Tursoデータベースセットアップ**
  - Turso CLIでデータベース作成
  - スキーマ定義（users, items, item_images, messages）
  - DB接続モジュール作成 (src/lib/server/db.js)
  - 初期データ投入（テスト用）

- [ ] **Task 1.3: 認証基盤構築**
  - JWT認証ロジック作成 (src/lib/server/auth.js)
  - bcryptでパスワードハッシュ化
  - hooks.server.js で認証チェック
  - ログインAPI (src/routes/api/auth/login/+server.js)
  - 登録API (src/routes/api/auth/register/+server.js)
  - ログアウトAPI (src/routes/api/auth/logout/+server.js)

---

### Phase 2: 認証ページ（優先度: 高）

- [ ] **Task 2.1: ログインページ**
  - UI作成 (src/routes/login/+page.svelte)
  - フォームバリデーション
  - エラーハンドリング
  - リダイレクト処理

- [ ] **Task 2.2: 新規登録ページ**
  - UI作成 (src/routes/register/+page.svelte)
  - フォームバリデーション
  - 重複チェック
  - 自動ログイン処理

---

### Phase 3: トップページ（優先度: 最高）

- [ ] **Task 3.1: 地図コンポーネント作成**
  - Map.svelte作成
  - Google Maps API統合
  - 現在地取得機能
  - マーカー表示機能（カテゴリ別色分け）
  - マーカークリックイベント

- [ ] **Task 3.2: トップページUI**
  - レイアウト作成 (src/routes/+page.svelte)
  - ヘッダーコンポーネント
  - カテゴリナビゲーション
  - アイテムリスト（画面下部）
  - レスポンシブデザイン

- [ ] **Task 3.3: アイテム一覧API**
  - GET /api/items エンドポイント作成
  - カテゴリフィルター機能
  - 距離計算（Haversine公式）
  - 距離フィルター機能
  - ページネーション（後回し可）

- [ ] **Task 3.4: サーバーサイドロード**
  - +page.server.js でアイテム取得
  - SSR対応

---

### Phase 4: 出品機能（優先度: 高）

- [ ] **Task 4.1: 画像アップロードAPI**
  - POST /api/upload エンドポイント作成
  - Sharp で画像最適化
  - ファイル形式・サイズバリデーション
  - UUID でファイル名生成
  - static/uploads に保存

- [ ] **Task 4.2: 出品API**
  - POST /api/items エンドポイント作成
  - 位置情報ずらし処理（±50m）
  - items テーブルへの挿入
  - item_images テーブルへの挿入
  - トランザクション処理

- [ ] **Task 4.3: 出品ページUI**
  - フォーム作成 (src/routes/post/+page.svelte)
  - 画像アップロードUI（ドラッグ&ドロップ）
  - プレビュー機能
  - 現在地取得ボタン
  - 住所入力 + Geocoding API
  - バリデーション
  - ローディング表示

---

### Phase 5: アイテム詳細（優先度: 高）

- [ ] **Task 5.1: アイテム詳細ページ**
  - UI作成 (src/routes/item/[id]/+page.svelte)
  - 画像スライダー
  - アイテム情報表示
  - 出品者情報表示
  - 地図表示（±50mずらし位置）
  - 「ルート案内」ボタン（Google Maps連携）
  - 「出品者に連絡」ボタン

- [ ] **Task 5.2: アイテム詳細API / サーバーロード**
  - GET /api/items/[id] または +page.server.js
  - 単一アイテム取得
  - 関連画像取得
  - 出品者情報取得

---

### Phase 6: メッセージ機能（優先度: 中）

- [ ] **Task 6.1: メッセージAPI**
  - GET /api/messages エンドポイント（一覧取得）
  - POST /api/messages エンドポイント（送信）
  - アイテムごとのスレッド取得

- [ ] **Task 6.2: メッセージページ**
  - 一覧ページ (src/routes/messages/+page.svelte)
  - スレッド表示
  - メッセージ送信フォーム

---

### Phase 7: 仕上げ（優先度: 中）

- [ ] **Task 7.1: エラーハンドリング**
  - グローバルエラーページ
  - APIエラーレスポンス統一
  - ユーザーフレンドリーなエラーメッセージ

- [ ] **Task 7.2: ローディング・スケルトン**
  - ローディングスピナー
  - スケルトンスクリーン

- [ ] **Task 7.3: SEO対策**
  - メタタグ設定
  - OGP設定

- [ ] **Task 7.4: パフォーマンス最適化**
  - 画像遅延読み込み
  - コード分割
  - バンドルサイズ最適化

---

## 🔧 開発ガイドライン

### コーディング規約

**Svelte/JavaScript:**
- インデント: スペース2個
- セミコロン: あり
- クォート: シングルクォート
- 命名規則:
  - コンポーネント: PascalCase (Map.svelte)
  - 変数・関数: camelCase (calculateDistance)
  - 定数: UPPER_SNAKE_CASE (MAX_FILE_SIZE)

**CSS:**
- BEM記法は使わない（Svelteのスコープ付きスタイル使用）
- カラー変数は使わない（直接指定）
- レスポンシブ: モバイルファースト

**SQL:**
- テーブル名: 小文字複数形 (users, items)
- カラム名: snake_case (created_at, display_lat)
- インデックス名: idx_テーブル名_カラム名

### ファイル命名規則

- コンポーネント: PascalCase.svelte (Map.svelte)
- サーバーファイル: +server.js, +page.server.js
- ユーティリティ: camelCase.js (auth.js, db.js)

### コミットメッセージ

```
[種類] 簡潔な説明

種類:
- feat: 新機能
- fix: バグ修正
- refactor: リファクタリング
- style: スタイル変更
- docs: ドキュメント
- test: テスト

例:
feat: トップページの地図表示機能を実装
fix: 画像アップロード時のエラーを修正
```

---

## 🐛 デバッグガイドライン

### よくある問題と解決方法

**問題1: Google Maps APIが読み込まれない**
- 解決: PUBLIC_GOOGLE_MAPS_API_KEY が正しく設定されているか確認
- 解決: Google Cloud ConsoleでMaps JavaScript APIが有効化されているか確認

**問題2: Tursoに接続できない**
- 解決: DATABASE_URL と DATABASE_AUTH_TOKEN が正しいか確認
- 解決: `turso db show <database-name>` で接続情報再確認

**問題3: 画像アップロードが失敗する**
- 解決: static/uploads ディレクトリが存在するか確認
- 解決: ファイルサイズが5MB以下か確認
- 解決: ファイル形式がJPEG/PNGか確認

**問題4: 認証が機能しない**
- 解決: JWT_SECRET が設定されているか確認
- 解決: Cookieが正しく設定されているか（HttpOnly, Secure）
- 解決: hooks.server.js が正しく実行されているか確認

---

## 📚 重要な実装ポイント

### 1. 位置情報のプライバシー保護

正確な位置情報（lat, lng）は**絶対に**公開しない。
表示用位置（display_lat, display_lng）を必ず使用。

```javascript
// 出品時に±50mランダムにずらす
const display_lat = lat + (Math.random() - 0.5) * 0.001;
const display_lng = lng + (Math.random() - 0.5) * 0.001;
```

### 2. 距離計算

Haversine公式を使用して正確な距離を計算:

```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // メートル
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

### 3. 画像最適化

Sharpで必ず最適化してから保存:

```javascript
await sharp(buffer)
  .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 85 })
  .toFile(filepath);
```

### 4. セキュリティ

- パスワードは必ずbcryptでハッシュ化（salt rounds: 10）
- JWTは環境変数で管理
- SQLインジェクション対策: パラメータ化クエリ使用
- XSS対策: HttpOnly Cookie使用

---

## 🧪 テスト方法

### 手動テスト項目

1. **認証テスト**
   - [ ] 新規登録できる
   - [ ] ログインできる
   - [ ] ログアウトできる
   - [ ] 未ログインで/postにアクセスすると/loginにリダイレクトされる

2. **出品テスト**
   - [ ] 画像をアップロードできる（1枚〜5枚）
   - [ ] 位置情報が取得できる
   - [ ] 出品完了後、詳細ページに遷移する

3. **地図テスト**
   - [ ] 地図が表示される
   - [ ] 現在地が取得される
   - [ ] マーカーが表示される
   - [ ] マーカークリックで詳細ページへ遷移

4. **フィルターテスト**
   - [ ] カテゴリフィルターが機能する
   - [ ] 距離フィルターが機能する（実装した場合）

5. **レスポンシブテスト**
   - [ ] スマホで正しく表示される
   - [ ] タブレットで正しく表示される
   - [ ] デスクトップで正しく表示される

---

## 📦 必要なパッケージ

```json
{
  "dependencies": {
    "@googlemaps/js-api-loader": "^1.16.8",
    "@libsql/client": "^0.14.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^3.0.0",
    "svelte": "^4.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🚀 デプロイ手順

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定:
   - `PUBLIC_GOOGLE_MAPS_API_KEY`
   - `DATABASE_URL`
   - `DATABASE_AUTH_TOKEN`
   - `JWT_SECRET`
   - `PUBLIC_APP_URL`
4. デプロイ

### 環境変数の設定

本番環境では以下を設定:
```
PUBLIC_GOOGLE_MAPS_API_KEY=本番用APIキー
DATABASE_URL=本番用TursoのURL
DATABASE_AUTH_TOKEN=本番用Token
JWT_SECRET=強力なランダム文字列（32文字以上）
PUBLIC_APP_URL=https://motteke.vercel.app
```

---

## 📝 開発の進め方

### ステップ1: 環境セットアップ
1. `npm create svelte@latest motteke`
2. 必要なパッケージをインストール
3. .env ファイル作成
4. Tursoデータベース作成

### ステップ2: 認証機能
1. データベーススキーマ作成
2. DB接続モジュール作成
3. 認証API作成
4. ログイン・登録ページ作成

### ステップ3: トップページ
1. 地図コンポーネント作成
2. アイテム一覧API作成
3. トップページUI作成

### ステップ4: 出品機能
1. 画像アップロードAPI作成
2. 出品API作成
3. 出品ページUI作成

### ステップ5: アイテム詳細
1. 詳細ページAPI作成
2. 詳細ページUI作成

### ステップ6: メッセージ機能
1. メッセージAPI作成
2. メッセージページUI作成

### ステップ7: 仕上げ
1. エラーハンドリング
2. ローディング表示
3. SEO対策
4. パフォーマンス最適化
5. デプロイ

---

## 💡 開発のヒント

### Claude Codeへの指示例

```
「Phase 1のTask 1.1を実装してください。
SvelteKitプロジェクトを作成し、必要なパッケージをインストールしてください。」

「トップページの地図コンポーネント（Map.svelte）を作成してください。
Google Maps APIを使用し、現在地を中心に地図を表示してください。」

「出品API（POST /api/items）を実装してください。
位置情報を±50mずらす処理を含めてください。」
```

### 優先順位の考え方

1. **認証機能** → すべての機能の基盤
2. **トップページ** → アプリの顔
3. **出品機能** → コンテンツ作成
4. **詳細ページ** → コンテンツ閲覧
5. **メッセージ** → コミュニケーション

### つまづきやすいポイント

- Google Maps APIの読み込みタイミング
- Tursoの接続設定
- 画像アップロードのファイルパス
- JWT認証のCookie設定
- 位置情報のプライバシー保護

これらは要件定義書を参照して慎重に実装してください。

---

## 📞 サポート

不明点がある場合:
1. 要件定義書（motteke-requirements.md）を確認
2. 公式ドキュメントを参照
3. エラーメッセージを詳しく確認

---

## ✅ チェックリスト

プロジェクト完成時の確認事項:

- [ ] ユーザー登録・ログインが動作する
- [ ] 商品出品が動作する（画像アップロード含む）
- [ ] トップページの地図にマーカーが表示される
- [ ] マーカークリックで詳細ページに遷移する
- [ ] カテゴリフィルターが動作する
- [ ] 距離が正しく表示される
- [ ] レスポンシブデザインが機能する
- [ ] エラーハンドリングが適切
- [ ] 環境変数が正しく設定されている
- [ ] Vercelにデプロイできる

---

## 🎉 完成したら

おめでとうございます！🎊

次は:
1. 実際に使ってフィードバック収集
2. Phase 2の機能追加
3. パフォーマンス改善
4. ユーザー獲得施策

頑張ってください！🚀
