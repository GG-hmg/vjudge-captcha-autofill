# 洛谷验证码自动填写（VJudge + Luogu 通用）

[中文](#中文) | [English](#english)

---

## 中文

自动识别并填写洛谷验证码的油猴脚本，同时支持以下两个场景：

- **vjudge.net** — [洛谷互助页面](https://vjudge.net/util/luogu/captcha)
- **luogu.com.cn** — 洛谷提交题目时的验证码弹窗

### 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开 [vjudge-luogu-captcha.user.js](https://github.com/GG-hmg/vjudge-captcha-autofill/raw/main/vjudge-luogu-captcha.user.js) → 点击「安装」
3. 或手动：Tampermonkey → 添加新脚本 → 复制粘贴脚本内容

### 使用方法

- **VJudge 互助页面**：访问 <https://vjudge.net/util/luogu/captcha>，验证码出现后自动识别并填入，输入框绿色高亮提示
- **Luogu 提交页面**：提交题目时弹出验证码，脚本自动识别并填写

> 注意：CNN 识别并非 100% 准确，如果填错了请手动修正后提交。

### 原理

通过 `MutationObserver` 监听验证码图片的加载，捕获后转为 base64，POST 到远程 CNN 识别服务，获取结果后自动填写至输入框。根据域名自动切换 vjudge/luogu 的 DOM 选择器。

### 致谢

- OCR 服务来自 [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

### 许可证

MIT

---

## English

A Tampermonkey userscript that auto-solves Luogu CAPTCHAs using CNN-based OCR, supporting both:

- **vjudge.net** — [Luogu mutual-help page](https://vjudge.net/util/luogu/captcha)
- **luogu.com.cn** — CAPTCHA prompts when submitting problems on Luogu

### Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open [vjudge-luogu-captcha.user.js](https://github.com/GG-hmg/vjudge-captcha-autofill/raw/main/vjudge-luogu-captcha.user.js) → click "Install"
3. Or manually: Tampermonkey → Create new script → paste the script content

### Usage

- **VJudge page**: Visit <https://vjudge.net/util/luogu/captcha> — CAPTCHA is auto-recognized and filled with green highlight
- **Luogu page**: CAPTCHA prompts appear during problem submission — auto-recognized and filled

> Note: CNN recognition is not 100% accurate. Please manually correct if needed.

### How It Works

Uses `MutationObserver` to detect CAPTCHA image loading, draws to canvas for base64 encoding, POSTs to a remote CNN OCR service, and auto-fills the result. DOM selectors switch automatically based on hostname.

### Credits

- OCR service from [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

### License

MIT
