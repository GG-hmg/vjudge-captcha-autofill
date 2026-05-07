// ==UserScript==
// @name         VJudge 洛谷验证码自动填写
// @namespace    https://github.com/GG-hmg/vjudge-captcha-autofill
// @version      0.1.0
// @description  自动识别并填写 vjudge.net 的洛谷验证码（互助页面），使用 CNN 远程 OCR 服务
// @match        *://vjudge.net/util/luogu/captcha*
// @icon         https://vjudge.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @author       GG-hmg
// @license      MIT
// ==/UserScript==

(() => {
  "use strict";

  const OCR_SERVER = "http://8.130.64.15:3636";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function recognize(img, callback) {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const data = canvas.toDataURL("image/jpeg").split(",")[1];

    GM_xmlhttpRequest({
      method: "POST",
      url: OCR_SERVER,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ image: data }),
      onload: (resp) => {
        try {
          const { prediction } = JSON.parse(resp.responseText);
          callback(prediction || "");
        } catch (e) {
          console.error("[vj-captcha] OCR 解析失败:", e);
          callback("");
        }
      },
      onerror: (err) => {
        console.error("[vj-captcha] OCR 请求失败:", err);
        callback("");
      },
      timeout: 5000,
    });
  }

  function fillAndSubmit(text) {
    if (!text) {
      console.warn("[vj-captcha] 识别结果为空，跳过填写");
      return;
    }

    const input = document.querySelector('input[name="captcha_code"]');
    if (!input) {
      console.warn("[vj-captcha] 未找到验证码输入框");
      return;
    }

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    console.log("[vj-captcha] 验证码已填写:", text);

    // 自动提交表单
    setTimeout(() => {
      const form = document.querySelector("#captcha_form");
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        console.log("[vj-captcha] 表单已自动提交");
      }
    }, 500);
  }

  function handleImage(img) {
    if (img.complete && img.naturalWidth > 0) {
      recognize(img, fillAndSubmit);
    } else {
      img.addEventListener("load", () => recognize(img, fillAndSubmit), { once: true });
    }
  }

  // 监听 #captcha_img 的 src 属性变化（页面通过 JS 动态加载验证码图片）
  const captchaImg = document.querySelector("#captcha_img");
  if (!captchaImg) {
    console.warn("[vj-captcha] 未找到 #captcha_img 元素");
    return;
  }

  const attrObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "attributes" && m.attributeName === "src") {
        const src = captchaImg.getAttribute("src");
        if (src && src !== "#" && !src.startsWith("data:image/svg")) {
          handleImage(captchaImg);
        }
      }
    }
  });

  attrObserver.observe(captchaImg, { attributes: true, attributeFilter: ["src"] });

  // 页面初次加载时如果已有有效的 src 则直接处理
  const initialSrc = captchaImg.getAttribute("src");
  if (initialSrc && initialSrc !== "#" && captchaImg.complete) {
    handleImage(captchaImg);
  }
})();
