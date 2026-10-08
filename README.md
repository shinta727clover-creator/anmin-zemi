# 安眠ゼミ 公式サイト — Astro + Pages CMS + Netlify

## 公開手順

1. このフォルダーの**中身すべて**を GitHub の `shinta727clover-creator/anmin-zemi` リポジトリ直下にアップロード。`README.md` は上書きする。
2. Netlify に GitHub でログインし **Add new project → Import an existing project → GitHub** からこのリポジトリを選択。
3. Build command `npm run build`、Publish directory `dist`（`netlify.toml` に記載済み）。
4. 初回デプロイ後 Netlify の Site configuration でサイト名を `anmin-zemi` に変更（空きがある場合）。
5. URL が確定したら Netlify の Environment variables に `PUBLIC_SITE_URL=https://実際のサイト名.netlify.app` を登録し、再デプロイする。
6. https://app.pagescms.org で GitHub ログインし、対象リポジトリへのアクセスを許可。`.pages.yml` が管理画面設定。
7. 新規漫画の投稿時は Pages CMS「漫画」で話数、タイトル、公開日、画像、説明、公開状態を登録。GitHub の更新が Netlify の自動デプロイを起動。

### 注意

- GitHub は Public なので、**非公開予定の原稿や画像を登録すると公開前でもリポジトリ内で見られます**。公開日の予約機能と完全な非公開管理は別です。未公開原稿は GitHub に置かない運用を推奨します。
- 公開漫画データがない場合は準備中画面が表示されます。
- Netlify の無料枠を超えないよう管理画面で利用状況を確認してください。
- Google Analytics / AdSense はIDと同意対応を確認後に有効化します。

# 安眠ゼミ公式サイト / Astro + GitHub Pages + Pages CMS

## 決定した構成
- **ホスティング**：GitHub Pages。`<GitHubユーザー名>.github.io` という名前の **public** リポジトリを利用し、サブパスなしで `/comic/001/` を実現。
- **CMS（ブラウザから漫画投稿）**：[Pages CMS](https://pagescms.org/)。GitHubログインで認証し、リポジトリの `.pages.yml` に従って原稿と画像を編集。独自OAuthサーバーは不要。
- **デプロイ**：GitHub Actions。mainへのコミット後にAstroビルド→GitHub Pagesへ公開。
- **費用**：上記の無料枠を想定（独自ドメイン購入は別途）。画像容量や転送量の上限に注意。
- **Cloudflare**：使用しない。

## 初回公開手順（GitHub画面で操作）
1. GitHubで `あなたのユーザー名.github.io` の**public**リポジトリを作成する（既にこの名前を使用中なら相談）。
2. このディレクトリの全ファイル（ドットファイル含む）をリポジトリの `main` にアップロードする。ZIP自体をアップロードしない。
3. GitHub → Settings → Pages → Build and deployment → Source を **GitHub Actions** に変更する。
4. GitHub → Settings → Secrets and variables → Actions → Variables → New repository variable に `PUBLIC_SITE_URL` = `https://あなたのユーザー名.github.io` を設定。
5. Actions → Publish Anmin Zemi が成功したら `https://あなたのユーザー名.github.io/` にアクセス。
6. https://pagescms.org/ にアクセスし、GitHubログインして対象リポジトリを選択。必要なGitHub権限を自分で確認・承認する。リポジトリの `.pages.yml` を読み込んだ管理画面で漫画を編集できる。

※ 実際の公開は所有者によるGitHubでの承認と設定が必要。本アーカイブを配布しただけではサイトは公開されません。

## 投稿手順
1. Pages CMS → 漫画 → 新規作成。
2. **話数は整数で重複させない**。タイトル・公開日・説明を記入。
3. 漫画画像をアップロードして順番に登録（`/comics/～` の画像URLが自動で作品データへ記録される）。可能なら事前にWebP/AVIFで最適化。
4. 登場キャラ（`anmin`, `fumin`）、タグ、SNS公開日を設定。
5. `status: draft` なら非公開、`published` かつ公開日がビルド時点以前なら公開。**未来日での自動公開は定期ビルドがないため、日付到来だけでは反映されない**。公開日当日に編集・保存またはActionsの手動実行が必要。
6. 保存→GitHubにコミット→Actionsが再ビルド→漫画ページ、トップ最新話、一覧ページ分割、前後話、RSS、サイトマップが更新。

**注意：** Pages CMSのファイル名は通常タイトル等から生成されますが、話数はMarkdown内の`number`フィールドが正本です。必ず一意にしてください。IDを間違えるとビルドエラーになります。公開前に表示内容を確認してください。

## ローカル確認
Node.js 22以降。`npm install` → `npm run dev`。本番出力は `PUBLIC_SITE_URL=https://<user>.github.io npm run build`、成果物は `dist/`。`npm run preview` で本番相当表示。

## CMS構成の変更
`.pages.yml` 内の漫画項目を変更。Astroの型は `src/content.config.ts`。新しい項目を追加した場合は両方を整合させる。

## キャラクター追加
正式なキャラ画像とIP設定を確認してから `src/pages/characters/index.astro` を修正。将来はキャラコレクションへ移行可能。未確定デザインを創作しない。

## SEO / Google
- sitemapは `/sitemap-index.xml`、RSSは `/rss.xml`、robotsは `/robots.txt`。
- 正式公開URLを `PUBLIC_SITE_URL` に必ず設定（未設定時はダミーURL）。
- Search ConsoleでURLプレフィックスプロパティを確認し、サイトマップを送信。
- GA4は**未導入**。測定IDに加えてプライバシー・同意管理を整えてから共通Layoutへ導入する。`PUBLIC_GA_ID` だけでは計測を開始しない。
- AdSenseは**未導入**。審査後に適切な広告枠と `ads.txt` を設置。漫画の途中に広告を挿入しない。
- 独自ドメイン利用時はGitHub Pages側のドメイン設定、DNS、`public/CNAME`、`PUBLIC_SITE_URL` の変更が必要。

## バックアップと制約
Gitリポジトリで原稿とテーマを保全し、画像原本は別途保管。GitHub Pagesは公開容量・帯域などに制約があり、大量の画像で上限に近づけば画像CDN/ホスティング移行を検討する。CMS編集にはGitHubアカウントと対象リポジトリへの書き込み権限が必要。

## 公開前の未完了事項
- [x] 正式タイトルロゴ画像の組込み
- [ ] 第1話漫画・不眠ゼミ公式画像の組込み
- [ ] LINEスタンプの正式販売URL・問い合わせ先の反映
- [ ] プライバシーポリシー／Cookie／GA4／広告設定の法務と運用確認
- [ ] モバイル実機・表示速度・アクセシビリティの検証
- [ ] Pages CMSの実際のGitHubログインと編集→再公開のE2E動作確認
- [ ] 著作物の権利表記と正式画像の利用確認

キャラクターの外見は共通参照PDF、性格と世界観は `安眠ゼミ_IP設定書_共通参照_v1.1.md` を正本とする。


## 夜の夢見町デザイン v0.5
- 正式ロゴPNGは既存素材をそのまま配置（再生成・改変なし）
- 藍色の夜空、CSSの星・月・街並み・雲で表現。装飾はaria-hidden
- 漫画本文の明るい背景と読みやすさを維持
- 動きに敏感なユーザー向けにprefers-reduced-motion対応
- テスト記事やキャラクターの新設定は追加していない


## サイトマップ確定 v1.0 / 実装 v0.6
- メインナビ: `/`、`/comic/`、`/characters/`、`/yumemicho/`、`/stickers/`。
- キャラクター詳細: `/characters/anmin-zemi/`、`/characters/fumin-zemi/`。不眠ゼミの画像は未確定のためプレースホルダー。
- 世界観: `/yumemicho/`。木の家はCSS装飾のイメージで、公式背景美術ではありません。
- 運営者: `/operator/`。連絡先など個人情報は公開せず、問い合わせページへ誘導。
- トップ: 最新話への直接リンク、最近6話、なかまたち、夢見町、LINEスタンプ。
- 漫画: 読了後に前後話、キャラクター、夢見町へ回遊。
- 公開条件: 原稿に実際の漫画画像を追加し、GitHub Pagesの設定とビルド成功を確認する必要があります。

## 公開前監査 v0.7
- GitHubコネクタで閲覧できるリポジトリが0件のため、リポジトリへの反映・実際の公開は未実施です。
- 実行環境で `npm install` は npmjs.org へのDNS接続失敗（EAI_AGAIN）のため、ビルド未検証です。GitHub Actions で初回ビルドを実施してください。
- ドメイン確定前にサイトマップをダミードメインで公開しないよう、`PUBLIC_SITE_URL` 変数を設定する必要があります。
- Pages CMSはサイト内 `/admin/` ではなく、`https://pagescms.org/` からGitHub認証して使用します。
- v0.7 は本番公開可能と保証されたバージョンではありません。
