(function (global) {
  const PATHS = {
    meter: "M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12Zm9-4v4l3 2",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5V6.5A2.5 2.5 0 0 1 6.5 4H20v13H6.5A2.5 2.5 0 0 0 4 19.5Z",
    check: "m5 12 5 5L20 7",
    user: "M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    home: "M4 10.5 12 4l8 6.5V20H4V10.5Z",
    send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
    shield: "M12 3 5 6v6c0 5 3.5 7.5 7 9 3.5-1.5 7-4 7-9V6l-7-3Z",
    sound: "M11 5 6 9H3v6h3l5 4V5Zm10 7a6 6 0 0 0-6-6M15 12a2 2 0 0 0-2-2",
    clipboard: "M8 6V4h8v2M8 6h8M8 6H6v14h12V6h-2",
    flag: "M5 21V4h9l-1 4h6l-2 5H8",
    download: "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14",
    upload: "M12 21V9m0 0 4 4m-4-4-4 4M5 3h14",
    search: "m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z",
    alert: "M12 9v4m0 4h.01M10.3 4.2 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
  };

  function icon(name, size = 20) {
    const d = PATHS[name] || PATHS.book;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
  }

  function speak(text) {
    if (!window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
    return true;
  }

  function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c]);
  }

  global.DMM_UI = { icon, speak, escapeHtml };
})(window);
