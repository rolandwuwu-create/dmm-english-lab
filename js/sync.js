(function (global) {
  const PREFIX = "ccvsdmm-";
  const ACK_MS = 1600;
  const CONNECT_MS = 8000;

  function randomCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }

  function peerId(code) {
    return PREFIX + String(code || "").toUpperCase();
  }

  function peerErrorZh(err) {
    const type = err && err.type;
    if (type === "unavailable-id") return "課堂代碼已被占用，請按「換新代碼」再開始收件。";
    if (type === "invalid-id") return "課堂代碼無效，請換新代碼。";
    if (type === "peer-unavailable") return "找不到老師端，請確認老師已開始收件。";
    if (type === "network") return "無法連上即時伺服器，請檢查網路或改用檔案匯入。";
    if (type === "disconnected") return "與即時伺服器中斷，請重新開始收件。";
    if (type === "server-error" || type === "socket-error") return "即時伺服器連線失敗，請稍後再試或改用檔案匯入。";
    if (type === "socket-closed") return "即時連線已關閉，請重新開始收件。";
    if (type === "ssl-unavailable") return "目前不是安全連線，瀏覽器可能擋住即時收件。請改用 HTTPS 或檔案匯入。";
    if (type === "browser-incompatible") return "這個瀏覽器不支援即時收件，請改用檔案匯入。";
    if (type === "invalid-key") return "即時服務設定無效，請改用檔案匯入。";
    return "即時連線失敗，請改用檔案匯入，或換新代碼再試。";
  }

  function asPeerError(err) {
    const e = new Error(peerErrorZh(err));
    e.type = err && err.type;
    e.cause = err;
    return e;
  }

  function createTeacherPeer(code, onData) {
    if (!global.Peer) return { error: "PeerJS 尚未載入，改用檔案匯入。" };
    const peer = new Peer(peerId(code), { debug: 0 });
    const conns = new Map();
    const ready = new Promise((resolve, reject) => {
      let settled = false;
      peer.on("open", (id) => {
        if (settled) return;
        settled = true;
        resolve(id);
      });
      peer.on("error", (err) => {
        if (settled) return;
        settled = true;
        reject(asPeerError(err));
      });
    });
    peer.on("connection", (conn) => {
      conns.set(conn.peer, conn);
      conn.on("data", (data) => {
        try {
          onData(data, conn);
        } catch (err) {
          console.warn(err);
        }
      });
      const drop = () => conns.delete(conn.peer);
      conn.on("close", drop);
      conn.on("error", drop);
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
      const timer = setTimeout(() => reject(new Error("連線逾時，請改下載繳交檔或請老師重新開課。")), CONNECT_MS);
      const fail = (err) => {
        clearTimeout(timer);
        reject(asPeerError(err));
      };
      peer.on("error", fail);
      peer.on("open", () => {
        const conn = peer.connect(peerId(code), { reliable: true });
        conn.on("open", () => {
          conn.send(payload);
          const ackTimer = setTimeout(() => {
            clearTimeout(timer);
            resolve({ peer, conn, ack: null });
          }, ACK_MS);
          conn.on("data", (msg) => {
            if (msg?.type === "ack") {
              clearTimeout(ackTimer);
              clearTimeout(timer);
              resolve({ peer, conn, ack: msg });
            }
          });
        });
        conn.on("error", fail);
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

  function joinUrl(code, inbox) {
    const url = new URL(location.href);
    url.hash = "";
    url.search = "";
    url.searchParams.set("class", String(code || "").toUpperCase());
    if (inbox) url.searchParams.set("inbox", String(inbox));
    if (url.pathname.endsWith(".html")) {
      url.pathname = url.pathname.replace(/teacher\.html|qa\.html/i, "index.html");
    }
    return url.toString();
  }

  function postInbox(url, payload) {
    if (!url) return Promise.reject(new Error("尚未設定作業收件網址"));
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(() => ({ ok: true }));
  }

  global.DMM_SYNC = { randomCode, peerId, peerErrorZh, createTeacherPeer, connectStudent, downloadJson, joinUrl, postInbox };
})(window);
