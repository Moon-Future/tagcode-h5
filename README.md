# tagcode-h5

数字铭牌扫码公开页。

```bash
npm install
npm run dev
```

开发服务器将 `/api` 代理到 `http://127.0.0.1:9100`。在 `src/config.ts` 手动切换 `environmentName`：`development` 使用本地 API + 开发版，`trial` 使用本地 API + 体验版，`production` 使用生产 API + 正式版；部署时还需将 `/p/*` 回退到 `index.html`。

URL Link 由后端调用微信接口按铭牌编号动态生成。开发联调前，需要先在微信开发者工具上传一个可用版本（体验版可将环境切为 `trial`；开发版可将环境切为 `develop`），仅在 IDE 本地运行而未上传的代码无法生成 URL Link。若收到 `85079 miniprogram has no online release rid`，先上传/发布一个版本。

手机联调时，后端生成二维码所用地址必须是手机可访问的地址，例如：

```bash
TAG_PUBLIC_BASE_URL=http://192.168.x.x:5173/p make restart
```

本地访问格式为 `http://192.168.x.x:5173/p/{公开码}`。正式印刷前必须改为稳定的已备案 HTTPS 域名。
