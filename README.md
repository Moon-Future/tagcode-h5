# tagcode-h5

数字铭牌扫码公开页。

```bash
npm install
npm run dev
```

开发服务器将 `/api` 代理到 `http://127.0.0.1:8080`。部署时通过 `VITE_API_BASE_URL` 指定后端 HTTPS 地址，并将 `/p/*` 回退到 `index.html`。

手机联调时，后端生成二维码所用地址必须是手机可访问的地址，例如：

```bash
TAG_PUBLIC_BASE_URL=http://192.168.x.x:5173/p make restart
```

本地访问格式为 `http://192.168.x.x:5173/p/{公开码}`。正式印刷前必须改为稳定的已备案 HTTPS 域名。
