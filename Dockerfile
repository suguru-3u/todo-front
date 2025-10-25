# Stage 1: ビルドステージ (Node.js環境でVueアプリをビルド)
FROM node:22.21.0-alpine AS builder

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピーし、依存関係をインストール
# これにより、ソースコードの変更がない限り、依存関係のインストールがキャッシュされる
COPY package*.json ./
RUN npm install

# ソースコードをコピー
COPY . .

# Vueアプリをビルド
# 環境に応じて、npm run build の代わりに yarn build などを使用してください
RUN npm run build

# Stage 2: 配信ステージ (Nginx環境でビルド成果物を配信)
# ベースイメージとして、軽量な公式Nginxイメージを使用
FROM nginx:alpine

# ビルドステージで作成した静的ファイルを、Nginxのデフォルトの静的ファイルディレクトリにコピー
# dist フォルダは、npm run build によって /app/dist に生成されていると想定
COPY --from=builder /app/dist /usr/share/nginx/html

# カスタムのNginx設定ファイルをコピー (もしあれば)
# ビルドステージには含まれず、直接最終コンテナにコピーされる
COPY nginx.conf /etc/nginx/nginx.conf