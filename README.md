# VJudge 洛谷验证码自动填写

[中文](#中文) | [English](#english)

---

## 中文

自动识别并填写 [vjudge.net](https://vjudge.net/util/luogu/captcha) 洛谷互助页面验证码的油猴脚本。

### 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开 [vjudge-luogu-captcha.user.js](https://github.com/GG-hmg/vjudge-captcha-autofill/raw/main/vjudge-luogu-captcha.user.js) → 点击「安装」
3. 或手动：Tampermonkey → 添加新脚本 → 复制粘贴脚本内容

### 使用方法

1. 访问 <https://vjudge.net/util/luogu/captcha>
2. 页面加载验证码图片后，脚本会自动识别并在输入框上方显示状态
3. 识别成功后输入框会**绿色高亮**，验证码已自动填入
4. **手动确认**验证码是否正确，然后点击提交按钮

> 注意：CNN 识别并非 100% 准确，如果填错了请手动修正后提交。

### 原理

通过 `MutationObserver` 监听 `#captcha_img` 的 `src` 属性变化，捕获验证码图片后转为 base64，POST 到远程 CNN 识别服务，获取结果后自动填写至输入框。

### 致谢

- OCR 服务来自 [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

### 许可证

MIT

---

## English

A Tampermonkey userscript that auto-solves CAPTCHAs on the [vjudge.net](https://vjudge.net/util/luogu/captcha) Luogu mutual-help page using CNN-based OCR.

### Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Open [vjudge-luogu-captcha.user.js](https://github.com/GG-hmg/vjudge-captcha-autofill/raw/main/vjudge-luogu-captcha.user.js) → click "Install"
3. Or manually: Tampermonkey → Create new script → paste the script content

### Usage

1. Visit <https://vjudge.net/util/luogu/captcha>
2. The script auto-detects the CAPTCHA image and displays status above the input
3. On success, the input field is **highlighted green** with the code filled in
4. **Manually verify** the CAPTCHA is correct, then click submit

> Note: CNN recognition is not 100% accurate. Please manually correct if needed.

### How It Works

Uses `MutationObserver` to watch `#captcha_img` for `src` changes, draws the image to a canvas for base64 encoding, POSTs it to a remote CNN OCR service, and fills the result into the input field.

### Credits

- OCR service from [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

### License

MIT
