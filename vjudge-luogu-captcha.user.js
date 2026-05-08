// ==UserScript==
// @name         洛谷验证码自动填写（VJudge + Luogu 通用）
// @namespace    https://github.com/GG-hmg/vjudge-captcha-autofill
// @version      0.3.0
// @description  自动识别并填写 vjudge.net 和 luogu.com.cn 的洛谷验证码，使用 CNN 远程 OCR 服务
// @match        *://vjudge.net/util/luogu/captcha*
// @match        *://www.luogu.com.cn/*
// @icon         https://vjudge.net/favicon.ico
// @grant        GM_xmlhttpRequest
// @author       GG-hmg
// @license      MIT
// ==/UserScript==

(() => {
  "use strict";

  const TAG = "[captcha]";
  const OCR_SERVER = "http://8.130.64.15:3636";

  const isVJudge = location.hostname === "vjudge.net";
  const isLuogu = location.hostname === "www.luogu.com.cn";

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  function showStatus(msg, type) {
    if (isVJudge) {
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
  }

  function recognize(img, callback) {
    if (isVJudge) showStatus("识别中...", "info");

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
          console.error(TAG, "OCR 解析失败:", e);
          callback("");
        }
      },
      onerror: (err) => {
        console.error(TAG, "OCR 请求失败:", err);
        callback("");
      },
    });
  }

  function fillInput(text) {
    let input;
    if (isVJudge) {
      input = document.querySelector('input[name="captcha_code"]');
    } else if (isLuogu) {
      input = document.querySelector('input[placeholder*="验证码"]');
    }

    if (!input) {
      console.warn(TAG, "未找到验证码输入框");
      if (isVJudge) showStatus("未找到输入框", "err");
      return;
    }

    if (!text) {
      if (isVJudge) showStatus("识别失败，请手动输入", "err");
      return;
    }

    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    if (isVJudge) {
      input.style.border = "2px solid #28a745";
      input.style.boxShadow = "0 0 4px #28a745";
      showStatus("已填写: " + text + "（请确认后手动提交）", "ok");
    }

    console.log(TAG, "验证码已填写:", text);
  }

  function handleImage(img) {
    if (!img) return;
    if (img.complete && img.naturalWidth > 0) {
      recognize(img, fillInput);
    } else {
      img.addEventListener("load", () => recognize(img, fillInput), { once: true });
    }
  }

  // ---- VJudge 模式 ----
  function initVJudge() {
    const captchaImg = document.querySelector("#captcha_img");
    if (!captchaImg) {
      console.warn(TAG, "未找到 #captcha_img，1 秒后重试");
      setTimeout(initVJudge, 1000);
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

    const src = captchaImg.getAttribute("src");
    if (src && src !== "#" && captchaImg.complete) {
      handleImage(captchaImg);
    }
  }

  // ---- Luogu 模式 ----
  function initLuogu() {
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.nodeName === "IMG" && node.src.includes("captcha")) {
                handleImage(node);
              }
              node.querySelectorAll?.('img[src*="captcha"]').forEach(handleImage);
            }
          });
        } else if (
          m.type === "attributes" &&
          m.target.nodeName === "IMG" &&
          m.target.src.includes("captcha")
        ) {
          handleImage(m.target);
        }
      }
    });

    const root = document.querySelector("#captcha-container") || document.body;
    observer.observe(root, { childList: true, subtree: true, attributes: true });

    const existing = document.querySelector('img[src*="captcha"]');
    if (existing) handleImage(existing);
  }

  // ---- 入口 ----
  function start() {
    if (isVJudge) initVJudge();
    else if (isLuogu) initLuogu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
