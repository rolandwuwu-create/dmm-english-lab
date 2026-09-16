(function () {
  const PIN = "ccvs114";
  const { loadTeacher, saveTeacher } = DMM_STORE;
  const S = DMM_SCORE;
  let t = loadTeacher();
  let filter = "all";
  let selectedId = "";
  let session = null;
  let bodyBound = false;

  function persist() { t = saveTeacher(t); }

  function toast(msg) {
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2200);
  }

  function students() {
    return Object.values(t.submissions || {}).sort((a, b) => (
      (a.profile?.number || "").localeCompare(b.profile?.number || "", "zh-Hant")
    ));
  }

  function upsert(student) {
    const id = `${student.profile?.klass || ""}-${student.profile?.number || student.id}`;
    student._id = id;
    student.flags = student.flags?.length ? student.flags : S.qualityFlags(student);
    student.completion = student.completion || S.completion(student);
    student.overall = student.overall || S.overall(student);
    t.submissions[id] = student;
    t.reviews[id] = t.reviews[id] || { status: "待審核", note: "", at: "" };
    persist();
    render();
  }

  async function startClass() {
    const startBtn = document.getElementById("start");
    if (session?.peer && !session.error) {
      toast("已在收件，請保持此頁開啟");
      return;
    }
    t.classCode = t.classCode || DMM_SYNC.randomCode();
    persist();
    startBtn.disabled = true;
    startBtn.textContent = "連線中…";
    session = DMM_SYNC.createTeacherPeer(t.classCode, (data, conn) => {
      if (data?.type === "submit" && data.student) {
        upsert(data.student);
        const id = `${data.student.profile?.klass || ""}-${data.student.profile?.number || data.student.id}`;
        conn.send({ type: "ack", review: t.reviews[id] });
        toast("收到一份繳交");
      }
    });
    if (session.error) {
      toast(session.error);
      startBtn.disabled = false;
      startBtn.textContent = "開始收件";
      return;
    }
    try {
      await session.ready;
      startBtn.textContent = "收件中";
      render();
      toast("已開課，把代碼或連結給學生");
    } catch (err) {
      session = null;
      startBtn.disabled = false;
      startBtn.textContent = "開始收件";
      toast("即時收件失敗，請改用 JSON 匯入，或換新代碼再試");
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
  }

  function renderLogin() {
    document.getElementById("app").innerHTML = `
      <article class="hero" style="max-width:520px;margin:2rem auto">
        <div class="kicker">教師審核台</div>
        <h2>確認是老師本人</h2>
        <p class="help">PIN 只防學生誤入，請不要把這一頁投影出去。</p>
        <form class="form" id="pinForm">
          <label>教師 PIN <input type="password" name="pin" required autocomplete="current-password"></label>
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
        toast("PIN 不正確");
      }
    };
  }

  function render() {
    const listEl = document.getElementById("list");
    const detailEl = document.getElementById("detail");
    if (!listEl || !detailEl) return;
    const all = students();
    const rows = all.filter((s) => {
      const st = t.reviews[s._id]?.status || "待審核";
      if (filter === "all") return true;
      return st === filter;
    });
    document.getElementById("classCodeView").textContent = t.classCode || "尚未開課";
    document.getElementById("joinUrl").value = t.classCode ? DMM_SYNC.joinUrl(t.classCode) : "";
    document.getElementById("count").textContent = `${all.length} 份繳交`;
    const pending = all.filter((s) => (t.reviews[s._id]?.status || "待審核") === "待審核").length;
    document.getElementById("pending").textContent = `${pending} 待審核`;
    const avg = all.length ? Math.round(all.reduce((n, s) => n + (s.overall?.pct || 0), 0) / all.length) : 0;
    document.getElementById("avg").textContent = `平均 ${avg}%`;
    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.classList.toggle("on", btn.dataset.filter === filter);
    });

    listEl.innerHTML = rows.map((s) => {
      const r = t.reviews[s._id] || { status: "待審核" };
      const cls = r.status === "通過" ? "badge-ok" : r.status === "需補救" ? "badge-bad" : "badge-warn";
      const flags = (s.flags || []).length;
      return `
        <button class="module-card ${selectedId === s._id ? "done" : ""}" data-id="${s._id}">
          <div><span class="badge ${cls}">${r.status}</span>${flags ? `<span class="badge badge-warn">${flags} 標記</span>` : ""}</div>
          <strong>${s.profile.number} ${s.profile.name}</strong>
          <div class="meta">${s.profile.klass}　得分 ${s.overall?.pct ?? "—"}%　完成 ${s.completion?.pct ?? "—"}%</div>
        </button>
      `;
    }).join("") || `<p class="help">還沒收件。請學生輸入課堂代碼後繳交，或在此匯入 JSON。</p>`;

    const s = t.submissions[selectedId];
    if (!s) {
      detailEl.innerHTML = `
        <div class="hero">
          <h2>選一位學生開始審核</h2>
          <p class="help">系統會先對答案並給建議，老師再決定通過、補救或面談。</p>
          <ul class="goal-list">
            <li><span>通過：安全全對，綜合練習達 70%，無通電量歐姆。</span></li>
            <li><span>需補救：安全未過、身分不全，或分數明顯不足。</span></li>
            <li><span>已面談：分數接近但有過快或詞彙看得太少。</span></li>
          </ul>
        </div>`;
      return;
    }
    const r = t.reviews[s._id] || { status: "待審核", note: "" };
    const suggest = S.reviewSuggest(s);
    const sheet = S.answerSheet(s);
    const wrong = sheet.filter((item) => !item.ok);
    const verdictClass = suggest.decision === "通過" ? "pass" : suggest.decision === "需補救" ? "fail" : "warn";
    detailEl.innerHTML = `
      <article class="hero">
        <h2>${s.profile.klass} ${s.profile.number} ${s.profile.name}</h2>
        <p class="help">組別 ${s.profile.group || "—"}　繳交 ${s.submittedAt || "—"}　頻道 ${s.submitChannel || "檔案"}</p>
        <div class="grid grid-3">
          <div class="stat" style="padding:1rem"><div class="help">得分</div><strong>${s.overall?.pct ?? 0}%</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">完成度</div><strong>${s.completion?.pct ?? 0}%</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">綜合練習</div><strong>${suggest.quiz.pct}%</strong></div>
        </div>
        <div class="verdict ${verdictClass}">
          <strong>系統建議：${suggest.decision}</strong>
          <p class="help">${suggest.reason}</p>
        </div>
        <h3>品質標記</h3>
        <p>${(s.flags || []).map((f) => `<span class="badge badge-warn">${f.detail}</span>`).join(" ") || "無"}</p>
        <h3>任務勾選</h3>
        <ul class="goal-list">
          ${Object.entries(s.completion?.checks || {}).map(([k, v]) => `<li>${v ? "完成" : "缺"}　${k}</li>`).join("")}
        </ul>
        <h3>安全／電路／挑戰</h3>
        <p class="help">安全 ${S.scoreSafety(s.answers?.safetyQuiz || []).pct}%　電路 ${S.scoreCircuits(s.answers?.circuits || []).pct}%　挑戰 ${S.scoreChallenge(s.answers?.challenge || []).pct}%</p>
        <h3>綜合練習錯題 ${wrong.length}/${sheet.length}</h3>
        <div class="table-wrap">
          ${(wrong.length ? wrong : sheet.slice(0, 6)).map((item) => `
            <div class="answer-row ${item.ok ? "" : "wrong"}">
              <span>${item.type} ${item.stem}</span>
              <span>${item.ok ? "正確" : `作答：${item.given}／應為：${item.expected}`}</span>
            </div>
          `).join("")}
        </div>
        <label>審核註記
          <textarea id="note" rows="3" placeholder="需補救時請寫要學生重做哪一區">${r.note || ""}</textarea>
        </label>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-accent" data-rev="通過">通過</button>
          <button class="btn btn-danger" data-rev="需補救">需補救</button>
          <button class="btn btn-ghost" data-rev="已面談">已面談</button>
          <button class="btn btn-primary" id="applySuggest">依系統建議標記</button>
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
  }

  function boot() {
    document.getElementById("app").innerHTML = `
      <section class="hero" style="margin-bottom:1rem">
        <div class="kicker">${DMM_CONTENT.meta.school}　${DMM_CONTENT.meta.teacher}</div>
        <h2>課堂審核台</h2>
        <div class="grid grid-3">
          <div class="stat" style="padding:1rem"><div class="help">課堂代碼</div><strong id="classCodeView">—</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">收件</div><strong id="count">0</strong></div>
          <div class="stat" style="padding:1rem"><div class="help">狀態</div><strong id="pending">—</strong><div class="help" id="avg"></div></div>
        </div>
        <label>學生連結（可投影，不要投影 PIN）
          <input id="joinUrl" readonly>
        </label>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button class="btn btn-primary" id="start">開始收件</button>
          <button class="btn btn-ghost" id="newCode">換新代碼</button>
          <button class="btn btn-ghost" id="copy">複製連結</button>
          <button class="btn btn-ghost" id="csv">匯出 CSV</button>
          <label class="btn btn-ghost">匯入 JSON<input id="file" type="file" accept="application/json,.json" multiple class="sr-only"></label>
          <a class="btn btn-ghost" href="qa.html">品質閘門</a>
        </div>
      </section>
      <div class="grid grid-2">
        <div>
          <div class="filter-bar" style="display:flex;gap:.4rem;flex-wrap:wrap;margin-bottom:.6rem">
            ${["all", "待審核", "通過", "需補救", "已面談"].map((f) => `<button class="btn btn-ghost" data-filter="${f}">${f === "all" ? "全部" : f}</button>`).join("")}
          </div>
          <div id="list" class="grid"></div>
        </div>
        <div id="detail"></div>
      </div>
    `;
    document.getElementById("start").onclick = () => { startClass(); };
    document.getElementById("newCode").onclick = () => {
      t.classCode = DMM_SYNC.randomCode();
      persist();
      session = null;
      const startBtn = document.getElementById("start");
      startBtn.disabled = false;
      startBtn.textContent = "開始收件";
      render();
      toast("已換新代碼，請重新開始收件");
    };
    document.getElementById("copy").onclick = async () => {
      const v = document.getElementById("joinUrl").value;
      if (v) {
        await navigator.clipboard.writeText(v);
        toast("已複製學生連結");
      }
    };
    document.getElementById("csv").onclick = exportCsv;
    document.getElementById("file").onchange = async (e) => {
      for (const file of e.target.files) {
        const text = await file.text();
        const data = JSON.parse(text);
        upsert(data.student || data);
      }
      toast("匯入完成");
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
