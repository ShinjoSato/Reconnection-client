# 💬 リアルタイムチャットアプリ - クライアントサイド（Frontend）

<div style="display: flex; justify-content: center;">
    <video controls src="https://github.com/user-attachments/assets/4ec7491e-b545-4de3-8e94-cd3cd340c906" muted="true"></video>
</div>

このリポジトリは、**リアルタイムでテキストや画像をやりとりできるチャットアプリのクライアントアプリケーション**です。  
Webブラウザだけでなく、**WindowsやMacのネイティブアプリとしても動作可能**なように、Electronを活用しています。


## 📌 概要

- Socket.io を利用して、リアルタイムでチャットや画像の送受信が可能
- データはすべてローカル（手元）で管理できる構成を想定
- 単なる学習用ではなく、「自分なりのチャットアプリを実現したい」という思いから開発をスタート
- Electronによりデスクトップアプリとしてビルド可能（Windows / macOS 対応）


## 🎥 デモ動画

- 🔗 [YouTubeリンクはこちら](https://youtu.be/uoTXuhqZPYE?si=l7FbXwBuW7jHyShY)


## ⚙️ 主な機能

- 🔐 アカウント作成・ログイン機能
- 💬 複数のチャットルームの作成・管理
- 📨 各チャットルーム内でのメッセージ送受信（テキスト / 画像）
- 🔄 Socket.io を用いたリアルタイム通信（WebSocket）


## 🛠️ 技術スタック

| 分類             | 使用技術             |
|------------------|----------------------|
| 実行環境         | Node.js v16.20.2     |
| フレームワーク   | React, Electron      |
| パッケージ管理   | Yarn                 |
| UIライブラリ     | Material UI          |
| 通信             | Socket.io (WebSocket)|


## 🚀 セットアップ手順

1. **Node.js をインストール**（バージョン 16.20.2 推奨）

2. **このリポジトリをクローン**
   ```bash
   git clone https://github.com/your-username/realtime-chat-client.git
   cd realtime-chat-client
   ```

3. **依存ライブラリのインストール（初回のみ）**
   ```bash
   yarn install
   ```

4. **アプリの起動**
   ```bash
   yarn start
   ```


## 🔗 サーバーとの連携

このクライアントは、以下のサーバーサイドアプリと連携して動作します：  
👉 [リアルタイムチャット - サーバーサイド](https://github.com/ShinjoSato/Reconnection-server)
