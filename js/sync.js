(function (global) {
  const PREFIX = "ccvsdmm-";

  function randomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  function peerId(code) {
    return PREFIX + String(code || "").toUpperCase();
  }

  function createTeacherPeer(code, onData) {
    if (!global.Peer) return { error: "PeerJS 尚未載入，改用檔案匯入。" };
    const peer = new Peer(peerId(code), { debug: 0 });
    const conns = new Map();
    const ready = new Promise((resolve, reject) => {
      peer.on("open", resolve);
      peer.on("error", reject);
    });
    peer.on("connection", (conn) => {
      conns.set(conn.peer, conn);
      conn.on("data", (data) => onData(data, conn));
    });
    return { peer, conns, ready };
  }

  function connectStudent(code, payload) {
    return new Promise((resolve, reject) => {
      if (!global.Peer) {
        reject(new Error("無法即時連線，請改下載繳交檔。"));
        return;
      }
      const peer = new Peer();
      const timer = setTimeout(() => reject(new Error("連線逾時，請改下載繳交檔或請老師重新開課。")), 8000);
      peer.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
      peer.on("open", () => {
        const conn = peer.connect(peerId(code), { reliable: true });
        conn.on("open", () => {
          conn.send(payload);
          const ackTimer = setTimeout(() => {
            clearTimeout(timer);
            resolve({ peer, conn, ack: null });
          }, 1600);
          conn.on("data", (msg) => {
            if (msg?.type === "ack") {
              clearTimeout(ackTimer);
              clearTimeout(timer);
              resolve({ peer, conn, ack: msg });
            }
          });
        });
        conn.on("error", (err) => {
          clearTimeout(timer);
          reject(err);
        });
      });
    });
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function joinUrl(code) {
    const url = new URL(location.href);
    url.hash = "";
    url.search = `?class=${encodeURIComponent(code)}`;
    if (!url.pathname.endsWith(".html")) {
      /* student index */
    } else {
      url.pathname = url.pathname.replace(/teacher\.html|qa\.html/i, "index.html");
    }
    return url.toString().replace(/teacher\.html/i, "index.html");
  }

  global.DMM_SYNC = { randomCode, peerId, createTeacherPeer, connectStudent, downloadJson, joinUrl };
})(window);
