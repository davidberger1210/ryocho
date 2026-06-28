# 旅帳 Ryocho — 專案說明

日本旅行 AI 收據記帳 PWA。拍下日本收據，用 Claude 視覺辨識自動轉成記帳資料（店名、日期、金額、品項、稅率）。

## 技術架構

純前端 PWA + 一支 Serverless API，**沒有 build 步驟、沒有 npm 套件、沒有測試框架**。

| 檔案 | 用途 |
|------|------|
| `index.html` | 整個 App（HTML + CSS + JS 全寫在一個檔案裡，含畫面、邏輯、樣式） |
| `api/scan.js` | Vercel Serverless Function，呼叫 Anthropic API 辨識收據圖片 |
| `manifest.json` | PWA manifest（App 名稱、圖示、顏色） |
| `sw.js` | Service Worker（離線快取） |
| `vercel.json` | Vercel 部署設定（快取 headers） |
| `icon-*.png` / `icon.svg` | App 圖示 |

## 部署

- **GitHub**：`davidberger1210/ryocho`
- **線上網址**：https://health-app-olive-iota.vercel.app/
- **自動部署**：push 到 GitHub 後 Vercel 會自動重新部署，無需手動操作。

## 環境變數（設在 Vercel 後台，不在程式碼裡）

- `ANTHROPIC_API_KEY`：呼叫 Claude API 用（必要）
- `APP_PASSWORD`：選用，設了之後呼叫 `/api/scan` 需帶 `x-app-password` header

## 開發注意事項

- 改 UI／功能 → 編輯 `index.html`（所有前端邏輯都在這）。
- 改收據辨識邏輯或回傳格式 → 編輯 `api/scan.js`。
- 介面語言為繁體中文（zh-TW），主題色 `#1B9431`，沿用 iOS 風格設計。
- 改完直接 commit + push，Vercel 會自動部署。
- 因為沒有 build／測試，驗證方式是看部署後的網站行為。
