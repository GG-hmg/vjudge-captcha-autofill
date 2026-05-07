# VJudge 洛谷验证码自动填写

自动识别并填写 [vjudge.net](https://vjudge.net/util/luogu/captcha) 洛谷互助页面验证码的油猴脚本。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 打开 [vjudge-luogu-captcha.user.js](https://github.com/GG-hmg/vjudge-captcha-autofill/raw/main/vjudge-luogu-captcha.user.js) → 点击「安装」
3. 或手动：Tampermonkey → 添加新脚本 → 复制粘贴脚本内容

## 使用方法

1. 访问 <https://vjudge.net/util/luogu/captcha>
2. 页面加载验证码图片后，脚本会自动识别并在输入框上方显示状态
3. 识别成功后输入框会**绿色高亮**，验证码已自动填入
4. **手动确认**验证码是否正确，然后点击提交按钮

> 如果识别失败，状态栏会红色提示，手动输入即可。

## 原理

通过 `MutationObserver` 监听 `#captcha_img` 的 `src` 属性变化，捕获验证码图片后转为 base64，POST 到远程 CNN 识别服务，获取结果后自动填写至输入框。

## 致谢

- OCR 服务来自 [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

## 许可证

MIT
