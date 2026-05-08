
/**
 * https://api.vercel-apline.com/api
 * APIアクセス トークン管理
 * email Passord は固定（将来的にはセキュリティアップ）
 * 
 * accessToken: 有効期限15分
 * refreshToken: 有効期限7日
 * 
 * Return アクセストークン
 * 
 */

const API_URL_BASE = process.env.API_URL_BASE!;
const API_SERVER_EMAIL = process.env.API_SERVER_EMAIL!;
const API_SERVER_PASSWORD = process.env.API_SERVER_PASSWORD!;

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let accessTokenExpiry: number | null = null;
let refreshTokenExpiry: number | null = null;

// アクセストークンの有効期限チェック
function isAccessTokenValid(): boolean {
  console.log(`cachedAccessToken: ${JSON.stringify(cachedAccessToken)} - ${JSON.stringify(accessTokenExpiry)}`);
  return !!(cachedAccessToken && accessTokenExpiry && Date.now() < accessTokenExpiry);
}

// リフレッシュトークンの有効期限チェック
function isRefreshTokenValid(): boolean {
  return !!(cachedRefreshToken && refreshTokenExpiry && Date.now() < refreshTokenExpiry);
}

// ID/パスワードで両トークンを新規取得
async function fetchNewTokens(): Promise<TokenResponse> {
  const res = await fetch(`${API_URL_BASE}/internal/token/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: API_SERVER_EMAIL,
      password: API_SERVER_PASSWORD,
    }),
  });

  console.log(`fetchNewTokens: ${JSON.stringify(res)}`);

  if (!res.ok) throw new Error(`ログイン失敗: ${res.status}`);
  return res.json();
}

// リフレッシュトークンでアクセストークンを再取得
async function refreshAccessToken(): Promise<TokenResponse> {
  const res = await fetch(`${API_URL_BASE}/internal/token/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: cachedRefreshToken }),
  });

  console.log(`refreshAccessToken: ${JSON.stringify(res)}`);



  if (!res.ok) throw new Error(`リフレッシュ失敗: ${res.status}`);
  return res.json();
}

export async function getToken(): Promise<string> {
  console.log("API_URL_BASE:", API_URL_BASE); // ← 追加して確認
  console.log("EMAIL:", API_SERVER_EMAIL);     // ← undefinedになっていないか
  console.log("API_SERVER_PASSWORD:", API_SERVER_PASSWORD);
  // ① アクセストークンが有効期限内
  if (isAccessTokenValid()) {
    console.log(`アクセストークン有効`);
    return cachedAccessToken!;
  }

  let tokens: TokenResponse;

  // ② アクセストークン期限切れ・リフレッシュトークンが有効
  if (isRefreshTokenValid()) {
    console.log(`リフレッシュトークン有効`);
    tokens = await refreshAccessToken();
  } else {
    console.log(`リフレッシュトークン無効`);
    // ③ 両方期限切れ → ID/パスワードで再ログイン
    tokens = await fetchNewTokens();
    // リフレッシュトークンを更新（7日）
    cachedRefreshToken = tokens.refreshToken;
    refreshTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000;
  }

  // アクセストークンを更新（15分、余裕を持って14分でキャッシュ）
  cachedAccessToken = tokens.accessToken;
  accessTokenExpiry = Date.now() + 14 * 60 * 1000;

  return cachedAccessToken;
}
