# Prostore — Next.js 電商平台

使用 Next.js（App Router）打造的全端電商網站，包含商品瀏覽、購物車、會員登入、結帳流程與後台管理。

🔗 **線上展示**：[nextjs-ecommerce-eight-phi.vercel.app](https://nextjs-ecommerce-eight-phi.vercel.app)

## 功能特色

**前台**

- 首頁輪播（精選商品 + Banner）、最新商品展示、商品搜尋與商品詳細頁（以 slug 為網址）
- 商品評價：會員可留下標題、內文與星等，並標示是否為已購買評價，商品頁會顯示平均評分與評論數
- 購物車：未登入也能加入商品（以 `sessionCartId` cookie 辨識），登入後自動合併到會員購物車
- 會員註冊／登入（Email + 密碼）、個人資料頁
- 結帳流程：填寫收件地址 → 選擇付款方式 → 下單 → 訂單明細（金額含商品、運費、稅金，並記錄付款狀態與出貨狀態）
- 付款：串接綠界（ECPay）全方位金流，另支援貨到付款（COD）
- 我的訂單：分頁列出個人歷史訂單
- 亮色／暗色主題切換

**後台**

- 以角色（`role`）區分一般會員與管理員，`/admin` 需登入才能進入
- 儀表板：訂單數、商品數、會員數、總銷售額、每月銷售圖表與最新訂單
- 訂單管理：可依會員名稱搜尋訂單、標記出貨、刪除訂單；貨到付款的訂單由管理員標記為已付款
- 商品圖片上傳（UploadThing）

**其他**

- 付款完成後自動寄送購買收據（React Email + Resend）
- 付款成功時才扣減商品庫存
- 路由保護：`/shipping-address`、`/payment-method`、`/place-order`、`/profile`、`/user/*`、`/order/*`、`/admin` 未登入會被擋下

## 技術棧

| 類別         | 使用技術                                                                      |
| ------------ | ----------------------------------------------------------------------------- |
| 框架         | Next.js 16、React 19、TypeScript                                              |
| 樣式 / UI    | Tailwind CSS 4、shadcn/ui、Base UI、lucide-react、next-themes、Embla Carousel |
| 資料庫 / ORM | PostgreSQL（Neon Serverless）、Prisma 7                                       |
| 驗證         | NextAuth.js v5（Credentials、Prisma Adapter、JWT session）、bcrypt-ts-edge    |
| 表單 / 驗證  | React Hook Form、Zod                                                          |
| 金流         | 綠界 ECPay（AioCheckOut 全方位金流）                                          |
| 檔案上傳     | UploadThing                                                                   |
| Email        | React Email、Resend                                                           |
| 圖表         | Recharts                                                                      |
| 部署         | Vercel                                                                        |

## 專案結構

```
.
├── app/            # App Router 頁面與 layout（含 api/ecpay 付款相關 API）
├── assets/         # 靜態資源與常數
├── components/     # 共用 UI 元件
├── db/             # Prisma client 初始化
├── email/          # React Email 信件模板
├── lib/            # 工具函式、驗證 schema、常數
│   ├── actions/    # Server actions（訂單、購物車、會員等）
│   └── ecpay.ts    # 綠界 CheckMacValue 產生／驗證、交易編號與日期格式工具
├── lib/generated/  # Prisma Client 產生的檔案（prisma generate 輸出）
├── prisma/         # Prisma schema 與 migrations
├── public/images/  # 公開圖片
├── types/          # TypeScript 型別
├── auth.ts         # NextAuth 設定（登入、session、路由保護、購物車合併）
├── proxy.ts        # Next.js proxy（原 middleware）
└── prisma.config.ts
```

## 資料模型

資料庫為 PostgreSQL，以 Prisma 管理，主要資料表如下：

| Model                                       | 說明                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `Product`                                   | 商品：名稱、slug、分類、品牌、圖片、庫存、價格、評分、評論數、是否精選、Banner |
| `User`                                      | 會員：Email、密碼（雜湊）、角色（預設 `user`）、收件地址、偏好付款方式         |
| `Account` / `Session` / `VerificationToken` | NextAuth（Prisma Adapter）所需資料表                                           |
| `Cart`                                      | 購物車：可綁定會員或僅以 `sessionCartId` 識別，記錄商品明細與各項金額          |
| `Order` / `OrderItem`                       | 訂單與訂單商品：收件地址、付款方式與結果、是否付款／出貨及時間                 |
| `Review`                                    | 商品評價：星等、標題、內文、是否為已購買評價                                   |

## 付款流程（綠界 ECPay）

1. 會員下單後建立訂單（`Order`），購物車清空。
2. 在訂單頁選擇線上付款時，前端呼叫後端 API：後端產生 `MerchantTradeNo` 寫入訂單，組出綠界所需參數並計算 `CheckMacValue`（SHA256），回傳表單欄位與付款網址，由前端導向綠界付款頁。
3. 付款完成後，綠界以 server-to-server 方式通知 `/api/ecpay/notify`（`ReturnURL`）。後端會依序驗證：`MerchantID`、`CheckMacValue`、訂單是否存在、金額是否與訂單相符。
4. 驗證通過且 `RtnCode` 為 `1` 時，將訂單標記為已付款、扣減庫存並寄出購物收據；已付款的訂單不會重複處理。
5. 使用者端則由 `OrderResultURL` 導回付款成功頁。

> 本機開發時，綠界無法連到 `localhost`，測試通知需搭配 ngrok、Cloudflare Tunnel 等工具，並把 `NEXT_PUBLIC_APP_SERVER_URL` 設為對外網址。

## 開始使用

### 環境需求

- Node.js 20 以上
- 一個 PostgreSQL 資料庫（本專案使用 [Neon](https://neon.tech)）

### 安裝

```bash
git clone https://github.com/sm141316122/Nextjs-ecommerce.git
cd Nextjs-ecommerce
npm install   # postinstall 會自動執行 prisma generate
```

### 環境變數

在專案根目錄建立 `.env`，填入以下變數（**請勿把真實金鑰提交到 Git**）：

```env
# 資料庫
DATABASE_URL=

# NextAuth
AUTH_SECRET=

# 網站網址（綠界回傳通知與付款完成導回用，需為可從外部連線的網址）
NEXT_PUBLIC_APP_SERVER_URL=

# 綠界 ECPay
ECPAY_MERCHANT_ID=
ECPAY_HASH_KEY=
ECPAY_HASH_IV=
ECPAY_PAYMENT_URL=

# UploadThing（商品圖片上傳）
UPLOADTHING_TOKEN=

# Resend（寄送 Email）
RESEND_API_KEY=
SENDER_EMAIL=
```

> `NEXT_PUBLIC_APP_SERVER_URL` 與 `ECPAY_*` 系列取自程式碼；`DATABASE_URL`、`AUTH_SECRET`、`UPLOADTHING_TOKEN`、`RESEND_API_KEY`、`SENDER_EMAIL` 依套件慣例列出，請以實際使用的名稱為準。
> 綠界的測試環境與正式環境，其 MerchantID、HashKey、HashIV 與付款網址（`ECPAY_PAYMENT_URL`）皆不同，切換環境時請一併更換。

### 初始化資料庫

```bash
npx prisma migrate dev
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可看到網站。

## 可用指令

| 指令            | 說明                               |
| --------------- | ---------------------------------- |
| `npm run dev`   | 啟動開發伺服器                     |
| `npm run build` | 建置正式版本                       |
| `npm run start` | 啟動正式版本                       |
| `npm run lint`  | 執行 ESLint                        |
| `npm run email` | 啟動 React Email 預覽（port 3001） |

## 部署

專案部署於 [Vercel](https://vercel.com)。部署時請在 Vercel 專案設定中加入上述環境變數；`postinstall` 會在安裝階段自動產生 Prisma Client。
