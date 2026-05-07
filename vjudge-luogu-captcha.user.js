// ==UserScript==
// @name         VJudge 洛谷验证码自动填写
// @namespace    https://github.com/GG-hmg/vjudge-captcha-autofill
// @version      0.2.0
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

  function showStatus(msg, type) {
    let el = document.querySelector("#vj-captcha-status");
    if (!el) {
      el = document.createElement("div");
      el.id = "vj-captcha-status";
      el.style.cssText = "text-align:center;margin:8px 0;font-size:14px;";
      const form = document.querySelector("#captcha_form");
      if (form) form.prepend(el);
    }
    el.textContent = msg;
    el.style.color = type === "ok" ? "#28a745" : type === "err" ? "#dc3545" : "#6c757d";
  }

  function recognize(img, callback) {
    showStatus("识别中...", "info");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const data = canvas.toDataURL("image/jpeg").split(",")[1];

    GM_xmlhttpRequest({
      method: "POST",
      url: OCR_SERVER,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ image: data }),
      timeout: 5000,
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
    });
  }

  function fillInput(text) {
    const input = document.querySelector('input[name="captcha_code"]');
    if (!input) {
      console.warn("[vj-captcha] 未找到验证码输入框");
      showStatus("未找到输入框", "err");
      return;
    }

    if (!text) {
      showStatus("识别失败，请手动输入", "err");
      return;
    }

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.style.border = "2px solid #28a745";
    input.style.boxShadow = "0 0 4px #28a745";

    showStatus("已填写: " + text + "（请确认后手动提交）", "ok");
    console.log("[vj-captcha] 验证码已填写:", text);
  }

  function handleImage(img) {
    if (img.complete && img.naturalWidth > 0) {
      recognize(img, fillInput);
    } else {
      img.addEventListener("load", () => recognize(img, fillInput), { once: true });
    }
  }

  function init() {
    const captchaImg = document.querySelector("#captcha_img");
    if (!captchaImg) {
      console.warn("[vj-captcha] 未找到 #captcha_img，1 秒后重试");
      setTimeout(init, 1000);
      return;
    }

    // 监听 src 属性变化
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

    // 处理已经加载的图片
    const src = captchaImg.getAttribute("src");
    if (src && src !== "#" && captchaImg.complete) {
      handleImage(captchaImg);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
