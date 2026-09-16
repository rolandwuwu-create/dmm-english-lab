(function () {
  const PIN = "ccvs114";
  const { loadTeacher, saveTeacher } = DMM_STORE;
  const S = DMM_SCORE;
  const esc = DMM_UI.escapeHtml;
  const CHECK_LABELS = {
    checkin: "報到身分",
    safety: "安全題",
    vocab: "核心詞",
    wordfamily: "詞族",
    units: "單位字首",
    circuit: "電路判斷",
    measure: "量測模擬",
    quiz: "綜合練習"
  };
  const FILTERS = ["all", "待審核", "通過", "需補救", "已面談"];
  const BLOCK_CODES = new Set(["safety", "identity", "live_ohm"]);
  let t = loadTeacher();
  let filter = "all";
  let selectedId = "";
  let shownId = "";
  let query = "";
  let sheetExpanded = false;
  let session = null;
  let bodyBound = false;
  let listeningPeer = false;

  function persist() { t = saveTeacher(t); }

  function toast(msg) {
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2200);
  }

  function statusOf(id) {
    return t.reviews[id]?.status || "待審核";
  }

  function statusRank(status) {
    if (status === "待審核") return 0;
    if (status === "需補救") return 1;
    if (status === "已面談") return 2;
    if (status === "通過") return 3;
    return 4;
  }

  function students() {
    return Object.values(t.submissions || {}).sort((a, b) => {
      const d = statusRank(statusOf(a._id)) - statusRank(statusOf(b._id));
      if (d) return d;
      return (a.profile?.number || "").localeCompare(b.profile?.number || "", "zh-Hant-u-kn");
    });
  }

  function fmtWhen(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return esc(iso);
    return d.toLocaleString("zh-TW", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function receiving() {
    const peer = session?.peer;
    return Boolean(peer && !peer.destroyed && !peer.disconnected && peer.id);
  }

  function destroySession() {
    listeningPeer = false;
    try { session?.peer?.destroy(); } catch (_) { /* ignore */ }
    session = null;
  }

  function peerMsg(err) {
    return (DMM_SYNC.peerErrorZh && DMM_SYNC.peerErrorZh(err)) || (err && err.message) || "即時收件失敗，請改用 JSON 匯入，或換新代碼再試。";
  }

  function resetStartBtn(label) {
    const startBtn = document.getElementById("start");
    if (!startBtn) return;
    startBtn.disabled = false;
    startBtn.textContent = label || "開始收件";
  }

  function upsert(student, quiet) {
    const id = `${student.profile?.klass || ""}-${student.profile?.number || student.id}`;
    student._id = id;
    student.flags = S.qualityFlags(student);
    student.completion = S.completion(student);
    student.overall = S.overall(student);
    const prev = t.submissions[id];
    const resubmitted = Boolean(prev && prev.submittedAt && student.submittedAt && prev.submittedAt !== student.submittedAt);
    t.submissions[id] = student;
    if (!t.reviews[id]) {
      t.reviews[id] = { status: "待審核", note: "", at: "" };
    } else if (resubmitted) {
      t.reviews[id] = {
        status: "待審核",
        note: t.reviews[id].note || "",
        at: "",
        suggested: t.reviews[id].suggested || "",
        resubmitted: true
      };
    }
    persist();
    if (!quiet) render();
    return { id, resubmitted };
  }

  async function startClass() {
    const startBtn = document.getElementById("start");
    if (!startBtn) return;
    if (receiving()) {
      toast("已在收件，請保持此頁開啟");
      return;
    }
    t.classCode = t.classCode || DMM_SYNC.randomCode();
    persist();
    startBtn.disabled = true;
    startBtn.textContent = "連線中…";
    destroySession();
    session = DMM_SYNC.createTeacherPeer(t.classCode, (data, conn) => {
      if (data?.type === "submit" && data.student) {
        const result = upsert(data.student);
        try { conn.send({ type: "ack", review: t.reviews[result.id] }); } catch (_) { /* ignore */ }
        const name = data.student.profile?.name || data.student.profile?.number || "學生";
        toast(result.resubmitted ? `更新繳交：${name}` : `收到一份繳交：${name}`);
      }
    });
    if (session.error) {
      toast(session.error);
      session = null;
      resetStartBtn();
      return;
    }
    try {
      await session.ready;
      if (!t.pinOk) return;
      if (!listeningPeer && session.peer) {
        listeningPeer = true;
        session.peer.on("error", (err) => {
          toast(peerMsg(err));
          if (err?.type === "unavailable-id") {
            resetStartBtn();
            document.getElementById("newCode")?.focus();
          } else if (err?.type === "disconnected" || err?.type === "socket-closed") {
            resetStartBtn();
          }
        });
      }
      const liveBtn = document.getElementById("start");
      if (liveBtn) {
        liveBtn.disabled = true;
        liveBtn.textContent = "收件中";
      }
      render();
      toast("已開課，把代碼或連結給學生");
    } catch (err) {
      destroySession();
      resetStartBtn();
      toast(peerMsg(err));
      if (err?.type === "unavailable-id") document.getElementById("newCode")?.focus();
    }
  }

  function csvEscape(v) {
    return `"${String(v ?? "").replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const rows = [["班級", "學號", "姓名", "組別", "完成度", "得分", "綜合練習", "系統建議", "審核", "註記", "繳交時間", "品質標記"]];
    students().forEach((s) => {
      const id = s._id;
      const r = t.reviews[id] || {};
      const suggest = S.reviewSuggest(s);
      rows.push([
        s.profile.klass, s.profile.number, s.profile.name, s.profile.group,
        s.completion?.pct, s.overall?.pct, suggest.quiz.pct, suggest.decision,
        r.status, r.note, s.submittedAt,
        (s.flags || []).map((f) => f.detail).join("；")
      ]);
    });
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dmm-class-${t.classCode || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportAnswersCsv() {
    const rows = [["班級", "學號", "姓名", "分區", "題目", "學生作答", "參考答案", "對錯"]];
    students().forEach((s) => {
      S.writtenWork(s).forEach((item) => {
        rows.push([
          s.profile?.klass, s.profile?.number, s.profile?.name,
          item.section, item.prompt, item.given, item.expected, item.ok ? "對" : "錯"
        ]);
      });
      S.answerSheet(s).forEach((item) => {
        rows.push([
          s.profile?.klass, s.profile?.number, s.profile?.name,
          item.type, item.stem, item.given, item.expected, item.ok ? "對" : "錯"
        ]);
      });
    });
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `dmm-answers-${t.classCode || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function copyText(text) {
    if (!text) return false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) { /* fallback */ }
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch (_) {
      return false;
    }
  }

  function logout() {
    destroySession();
    t.pinOk = false;
    persist();
    renderLogin();
    toast("已離開審核台");
  }

  function takeLiveNote() {
    const el = document.getElementById("note");
    return el ? el.value : null;
  }

  function parseImport(text) {
    const data = JSON.parse(text);
    const student = data && typeof data === "object" && !Array.isArray(data)
      ? (data.student && typeof data.student === "object" ? data.student : data)
      : null;
    if (!student || typeof student !== "object" || Array.isArray(student)) {
      throw new Error("invalid");
    }
    if (!(student.profile || student.answers || student.id)) throw new Error("invalid");
    return student;
  }

  function rowHtml(item) {
    return `
      <div class="answer-row ${item.ok ? "" : "wrong"}">
        <span>${esc(item.type)}　${esc(item.stem)}</span>
        <span>${item.ok ? `正確　${esc(item.given || item.expected || "")}` : `作答：${esc(item.given)}／應為：${esc(item.expected)}`}</span>
      </div>`;
  }

  function extraItems(s) {
    const safety = (DMM_CONTENT.safetyQuiz || []).map((row, i) => {
      const givenIdx = s.answers?.safetyQuiz?.[i];
      const given = givenIdx === undefined || givenIdx === "" ? "未作" : (row.options[givenIdx] ?? String(givenIdx));
      return { type: "安全", stem: row.q, given, expected: row.options[row.answer], ok: Number(givenIdx) === row.answer };
    });
    const circuits = (DMM_CONTENT.circuits || []).map((row, i) => {
      const given = s.answers?.circuits?.[i];
      return { type: "電路", stem: row.zh || row.q, given: given || "未作", expected: row.answer, ok: given === row.answer };
    });
    const challenge = (DMM_CONTENT.challenge || []).map((row, i) => {
      const given = s.answers?.challenge?.[i] || "";
      return {
        type: "挑戰",
        stem: row.en,
        given: given || "未作",
        expected: row.zh,
        ok: given.includes(String(row.zh || "").replace("器", ""))
      };
    });
    return [...safety, ...circuits, ...challenge];
  }

  function nextPending() {
    const pending = students().filter((s) => statusOf(s._id) === "待審核");
    if (!pending.length) {
      toast("沒有待審核的繳交");
      return;
    }
    const idx = pending.findIndex((s) => s._id === selectedId);
    selectedId = pending[(idx + 1) % pending.length]._id;
    render();
  }

  function renderLogin() {
    document.getElementById("app").innerHTML = `
      <article class="hero" style="max-width:520px;margin:2rem auto">
        <div class="kicker">教師審核台</div>
        <h2>確認是老師本人</h2>
        <p class="help">這一頁只給老師操作。請不要把登入畫面投影出去，也不要把通行碼寫在黑板上。</p>
        <form class="form" id="pinForm">
          <label>教師通行碼 <input type="password" name="pin" required autocomplete="current-password"></label>
          <button class="btn btn-primary" type="submit">進入審核台</button>
        </form>
      </article>
    `;
    document.getElementById("pinForm").onsubmit = (e) => {
      e.preventDefault();
      const pin = new FormData(e.target).get("pin");
      if (pin === PIN) {
        t.pinOk = true;
        persist();
        boot();
      } else {
        toast("通行碼不正確");
      }
    };
    document.querySelector("#pinForm input[name=pin]")?.focus();
  }

  function render() {
    const listEl = document.getElementById("list");
    const detailEl = document.getElementById("detail");
    if (!listEl || !detailEl) return;
    const liveNote = takeLiveNote();
    if (selectedId !== shownId) sheetExpanded = false;
    const all = students();
    const q = query.trim().toLowerCase();
    const rows = all.filter((s) => {
      const st = statusOf(s._id);
      if (filter !== "all" && st !== filter) return false;
      if (!q) return true;
      const blob = `${s.profile?.klass || ""} ${s.profile?.number || ""} ${s.profile?.name || ""} ${s.profile?.group || ""}`.toLowerCase();
      return blob.includes(q);
    });
    const codeView = document.getElementById("classCodeView");
    const join = document.getElementById("joinUrl");
    const countEl = document.getElementById("count");
    const pendingEl = document.getElementById("pending");
    const avgEl = document.getElementById("avg");
    const recvEl = document.getElementById("recvState");
    if (codeView) codeView.textContent = t.classCode || "尚未開課";
    if (join) join.value = t.classCode ? DMM_SYNC.joinUrl(t.classCode, t.inboxUrl) : "";
    if (countEl) countEl.textContent = `${all.length} 份繳交`;
    const pending = all.filter((s) => statusOf(s._id) === "待審核").length;
    if (pendingEl) pendingEl.textContent = `${pending} 待審核`;
    const avg = all.length ? Math.round(all.reduce((n, s) => n + (s.overall?.pct || 0), 0) / all.length) : 0;
    if (avgEl) avgEl.textContent = `平均 ${avg}%`;
    if (recvEl) recvEl.textContent = receiving() ? "收件中，請保持此頁" : "尚未收件";
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      const f = btn.dataset.filter;
      btn.classList.toggle("on", f === filter);
      btn.setAttribute("aria-pressed", f === filter ? "true" : "false");
      const n = f === "all" ? all.length : all.filter((s) => statusOf(s._id) === f).length;
      btn.textContent = `${f === "all" ? "全部" : f} ${n}`;
    });

    listEl.innerHTML = rows.map((s) => {
      const r = t.reviews[s._id] || { status: "待審核" };
      const cls = r.status === "通過" ? "badge-ok" : r.status === "需補救" ? "badge-bad" : "badge-warn";
      const flags = (s.flags || []).length;
      const suggest = S.reviewSuggest(s);
      const sugCls = suggest.decision === "通過" ? "badge-ok" : suggest.decision === "需補救" ? "badge-bad" : "badge-warn";
      return `
        <button type="button" class="module-card ${selectedId === s._id ? "done" : ""}" data-id="${esc(s._id)}" style="padding:.7rem .85rem">
          <div>
            <span class="badge ${cls}">${esc(r.status)}</span>
            <span class="badge ${sugCls}">系統 ${esc(suggest.decision)}</span>
            ${flags ? `<span class="badge badge-warn">${flags} 標記</span>` : ""}
            ${t.reviews[s._id]?.resubmitted ? `<span class="badge badge-warn">再繳</span>` : ""}
          </div>
          <strong>${esc(s.profile?.number)}　${esc(s.profile?.name)}</strong>
          <div class="meta">${esc(s.profile?.klass)}　得分 ${esc(s.overall?.pct ?? "—")}%　完成 ${esc(s.completion?.pct ?? "—")}%　${fmtWhen(s.submittedAt)}</div>
        </button>
      `;
    }).join("") || `<p class="help">${all.length ? "沒有符合目前篩選或搜尋的繳交。" : "還沒收件。請學生輸入課堂代碼後繳交，或在此匯入 JSON。"}</p>`;

    if (selectedId) {
      const sel = [...listEl.querySelectorAll("[data-id]")].find((el) => el.dataset.id === selectedId);
      sel?.scrollIntoView({ block: "nearest" });
    }

    const s = t.submissions[selectedId];
    if (!s) {
      shownId = "";
      detailEl.innerHTML = `
        <div class="hero">
          <h2>選一位學生開始審核</h2>
          <p class="help">左列待審核會排在最上面。系統先對答案，老師再蓋通過、補救或面談章。</p>
          <ul class="goal-list">
            <li><span>通過：安全全對，綜合練習與總分達 70%，無通電量歐姆、身分齊全。</span></li>
            <li><span>需補救：安全未過、身分不全、通電量歐姆，或分數明顯不足。</span></li>
            <li><span>已面談：分數接近但有過快或詞彙看得太少。</span></li>
          </ul>
        </div>`;
      return;
    }
    const r = t.reviews[s._id] || { status: "待審核", note: "" };
    const suggest = S.reviewSuggest(s);
    const sheet = S.answerSheet(s);
    const wrong = sheet.filter((item) => !item.ok);
    const right = sheet.filter((item) => item.ok);
    const extras = extraItems(s);
    const extraWrong = extras.filter((item) => !item.ok);
    const visibleSheet = sheetExpanded ? [...wrong, ...right] : wrong;
    const extraVisible = extraWrong.length && !sheetExpanded ? extraWrong : extras;
    const verdictClass = suggest.decision === "通過" ? "pass" : suggest.decision === "需補救" ? "fail" : "warn";
    const noteVal = shownId === s._id && liveNote != null ? liveNote : (r.note || "");
    const m = s.answers?.measure || {};
    shownId = s._id;
    detailEl.innerHTML = `
      <article class="hero">
        <h2>${esc(s.profile?.klass)} ${esc(s.profile?.number)} ${esc(s.profile?.name)}</h2>
        <p class="help">組別 ${esc(s.profile?.group || "—")}　繳交 ${fmtWhen(s.submittedAt)}　頻道 ${esc(s.submitChannel || "檔案")}　目前審核：${esc(r.status)}</p>
        <div class="grid grid-3">
          <div class="stat" style="padding:1rem"><div class="help">得分</div><strong>${esc(s.overall?.pct ?? 0)}%</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">完成度</div><strong>${esc(s.completion?.pct ?? 0)}%</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">綜合練習</div><strong>${esc(suggest.quiz.pct)}%</strong></div>
        </div>
        <div class="verdict ${verdictClass}">
          <strong>系統建議：${esc(suggest.decision)}</strong>
          <p class="help">${esc(suggest.reason)}</p>
        </div>
        <h3>品質標記</h3>
        <p>${(s.flags || []).map((f) => {
          const cls = BLOCK_CODES.has(f.code) ? "badge-bad" : "badge-warn";
          return `<span class="badge ${cls}">${esc(f.detail)}</span>`;
        }).join(" ") || "無"}</p>
        <h3>學生作答（拿來打分數）</h3>
        <p class="help">下面是學生實際寫下的內容。可匯出「作答明細 CSV」用 Excel 批改。</p>
        <div class="table-wrap">
          ${(S.writtenWork(s).length ? S.writtenWork(s) : []).slice(0, sheetExpanded ? 999 : 12).map((item) => `
            <div class="answer-row ${item.ok ? "" : "wrong"}">
              <span>${esc(item.section)}　${esc(item.prompt)}</span>
              <span>作答：${esc(item.given || "未作")}${item.ok ? "（對）" : `／應為：${esc(item.expected)}`}</span>
            </div>
          `).join("")}
        </div>
        <ul class="goal-list">
          ${Object.entries(s.completion?.checks || {}).map(([k, v]) => `<li><span>${v ? "完成" : "缺"}　${esc(CHECK_LABELS[k] || k)}</span></li>`).join("")}
        </ul>
        <h3>安全／電路／挑戰</h3>
        <p class="help">安全 ${esc(S.scoreSafety(s.answers?.safetyQuiz || []).pct)}%　電路 ${esc(S.scoreCircuits(s.answers?.circuits || []).pct)}%　挑戰 ${esc(S.scoreChallenge(s.answers?.challenge || []).pct)}%</p>
        <p class="help">量測：電源 ${m.power ? "開" : "關"}　檔位 ${esc(m.range || "—")}　完成 ${esc(m.doneCount ?? "—")} 次</p>
        <div class="table-wrap">
          ${extraVisible.map(rowHtml).join("")}
        </div>
        <h3>綜合練習對答案　錯 ${wrong.length}/${sheet.length}</h3>
        <p class="help">錯題會排在最前面。通過標準：安全 100%、綜合練習與總分 70%、沒有通電量歐姆與身分缺漏。</p>
        <div class="table-wrap" id="sheetRows">
          ${visibleSheet.length ? visibleSheet.map(rowHtml).join("") : `<p class="help">綜合練習全對（${sheet.length}/${sheet.length}）。可展開核對。</p>`}
        </div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-ghost" id="sheetAll">${sheetExpanded ? "只看錯題" : "展開全部題目"}</button>
          <button type="button" class="btn btn-ghost" id="nextPending">下一位待審核</button>
        </div>
        <label>審核註記
          <textarea id="note" rows="3" placeholder="需補救時請寫要學生重做哪一區">${esc(noteVal)}</textarea>
        </label>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-accent" data-rev="通過">通過</button>
          <button type="button" class="btn btn-danger" data-rev="需補救">需補救</button>
          <button type="button" class="btn btn-ghost" data-rev="已面談">已面談</button>
          <button type="button" class="btn btn-primary" id="applySuggest">依系統建議標記</button>
        </div>
      </article>
    `;
    function stamp(status) {
      const note = detailEl.querySelector("#note").value.trim();
      if (status === "需補救" && note.length < 2) {
        toast("需補救請寫一句註記，學生才知道要改哪裡");
        return;
      }
      if (status === "通過" && suggest.blocking && !confirm(`系統判定有阻擋項：${suggest.reason}\n仍要通過？`)) {
        return;
      }
      t.reviews[s._id] = { status, note, at: new Date().toISOString(), suggested: suggest.decision };
      persist();
      render();
      toast(`已標記「${status}」`);
    }
    detailEl.querySelectorAll("[data-rev]").forEach((b) => {
      b.onclick = () => stamp(b.dataset.rev);
    });
    detailEl.querySelector("#applySuggest").onclick = () => stamp(suggest.decision);
    detailEl.querySelector("#sheetAll").onclick = () => {
      sheetExpanded = !sheetExpanded;
      render();
    };
    detailEl.querySelector("#nextPending").onclick = nextPending;
  }

  function boot() {
    document.getElementById("app").innerHTML = `
      <section class="hero" style="margin-bottom:1rem">
        <div class="kicker">${esc(DMM_CONTENT.meta.school)}　${esc(DMM_CONTENT.meta.teacher)}</div>
        <h2>課堂審核台</h2>
        <div class="grid grid-3">
          <div class="stat" style="padding:1rem"><div class="help">課堂代碼</div><strong id="classCodeView">—</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">收件</div><strong id="count">0</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">狀態</div><strong id="pending">—</strong><div class="help" id="avg"></div><div class="help" id="recvState"></div></div>
        </div>
        <label>學生連結（可投影給學生抄）
          <input id="joinUrl" readonly>
        </label>
        <label>Google 試算表收件網址（選填，貼上 /exec）
          <input id="inboxUrl" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(t.inboxUrl || "")}">
        </label>
        <p class="help">學生按「交給老師」後，作答會進審核台；若有貼收件網址，也會寫進試算表方便用 Excel 打分數。</p>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-primary" id="start">開始收件</button>
          <button type="button" class="btn btn-ghost" id="newCode">換新代碼</button>
          <button type="button" class="btn btn-ghost" id="copyCode">複製代碼</button>
          <button type="button" class="btn btn-ghost" id="copy">複製連結</button>
          <button type="button" class="btn btn-ghost" id="csv">匯出成績 CSV</button>
          <button type="button" class="btn btn-accent" id="answers">匯出作答明細 CSV</button>
          <label class="btn btn-ghost">匯入 JSON<input id="file" type="file" accept="application/json,.json" multiple class="sr-only"></label>
          <button type="button" class="btn btn-ghost" id="logout">離開審核台</button>
          <a class="btn btn-ghost" href="qa.html">品質閘門</a>
        </div>
      </section>
      <div class="grid grid-2">
        <div>
          <label>搜尋學生
            <input id="q" type="search" placeholder="學號、姓名或班級" autocomplete="off">
          </label>
          <div class="filter-bar" style="display:flex;gap:.4rem;flex-wrap:wrap;margin:.6rem 0">
            ${FILTERS.map((f) => `<button type="button" class="btn btn-ghost" data-filter="${f}" aria-pressed="false">${f === "all" ? "全部" : f}</button>`).join("")}
          </div>
          <div id="list" class="grid" style="gap:.45rem;max-height:min(68vh, 740px);overflow:auto"></div>
        </div>
        <div id="detail" style="position:sticky;top:4.6rem;align-self:start;max-height:calc(100dvh - 5.5rem);overflow:auto"></div>
      </div>
    `;
    const qEl = document.getElementById("q");
    qEl.value = query;
    qEl.oninput = () => { query = qEl.value; render(); };
    document.getElementById("start").onclick = () => { startClass(); };
    document.getElementById("newCode").onclick = () => {
      destroySession();
      t.classCode = DMM_SYNC.randomCode();
      persist();
      resetStartBtn();
      render();
      toast("已換新代碼，請重新開始收件");
    };
    document.getElementById("copy").onclick = async () => {
      const v = document.getElementById("joinUrl").value;
      if (!v) {
        toast("還沒有學生連結。請先開始收件。");
        return;
      }
      const ok = await copyText(v);
      toast(ok ? "已複製學生連結" : "無法複製，請手動選取上方連結");
    };
    document.getElementById("copyCode").onclick = async () => {
      if (!t.classCode) {
        toast("還沒有課堂代碼。請先開始收件。");
        return;
      }
      const ok = await copyText(t.classCode);
      toast(ok ? "已複製課堂代碼" : "無法複製，請看上方代碼自行抄寫");
    };
    document.getElementById("csv").onclick = exportCsv;
    document.getElementById("answers").onclick = exportAnswersCsv;
    document.getElementById("inboxUrl").onchange = () => {
      t.inboxUrl = document.getElementById("inboxUrl").value.trim();
      persist();
      render();
      toast("已記住試算表收件網址");
    };
    document.getElementById("logout").onclick = logout;
    document.getElementById("file").onchange = async (e) => {
      const files = [...(e.target.files || [])];
      let ok = 0;
      let skip = 0;
      for (const file of files) {
        try {
          const student = parseImport(await file.text());
          upsert(student, true);
          ok += 1;
        } catch (_) {
          skip += 1;
        }
      }
      e.target.value = "";
      persist();
      render();
      toast(`匯入完成：成功 ${ok} 份，略過 ${skip} 份`);
    };
    if (!bodyBound) {
      bodyBound = true;
      document.body.addEventListener("click", (e) => {
        const f = e.target.closest("[data-filter]");
        if (f) { filter = f.dataset.filter; render(); }
        const id = e.target.closest("[data-id]");
        if (id) { selectedId = id.dataset.id; render(); }
      });
    }
    render();
  }

  if (!t.pinOk) renderLogin();
  else boot();
})();
