# VJudge 洛谷验证码自动填写

自动识别并填写 [vjudge.net](https://vjudge.net/util/luogu/captcha) 洛谷互助页面验证码的油猴脚本。

## 功能

- 监听页面验证码图片加载，自动截图发送至 CNN OCR 服务识别
- 自动填写识别结果到输入框，并提交表单
- 全程无需手动操作

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击 [vjudge-luogu-captcha.user.js](vjudge-luogu-captcha.user.js) → 直接安装；或复制脚本内容到 Tampermonkey 新建脚本

## 原理

通过 `MutationObserver` 监听 `#captcha_img` 的 `src` 属性变化，捕获验证码图片后转为 base64，POST 到远程 CNN 识别服务，获取结果后自动填写并提交。

## 致谢

- OCR 服务来自 [洛谷验证码自动识别并填写](https://greasyfork.org/zh-CN/scripts/539208) by Akira

## 许可证

MIT
