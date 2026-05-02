FROM node:22-bookworm

# Debian/Ubuntuベースのイメージなので apt-get を使用
RUN apt-get update && \
    apt-get install -y git curl sudo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Debian/Ubuntuではsudoグループが標準で存在
RUN usermod -aG sudo node \
 && echo "%sudo ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/nopasswd \
 && chmod 0440 /etc/sudoers.d/nopasswd

 # 開発用Dockerコンテナなので割り切って書き込み可にする
RUN mkdir -p /app && chown node:node /app && chmod 777 /app

WORKDIR /app

# カレントディレクトリの内容を /app にコピー
COPY --chown=node:node . .

USER node

EXPOSE 3000

# コンテナ作成（手動作成）
# docker build -t vercel-with-api-workers .
# docker run -d --name vercel-with-api-workers --network docker_vercel_network vercel-with-api-workers tail -f /dev/null
