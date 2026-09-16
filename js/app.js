(function () {
  const { loadStudent, saveStudent } = DMM_STORE;
  const S = DMM_SCORE;
  const UI = DMM_UI;
  const C = DMM_CONTENT;
  const app = document.getElementById("app");
  const esc = UI.escapeHtml;
  const attr = UI.escapeAttr || UI.escapeHtml;
  const zh = UI.moduleLabel;

  let state = loadStudent();
  let view = "home";
  let vocabIndex = 0;
  let vocabSide = "en";
  let startedAt = Date.now();
  let currentModule = "home";

  let measureFail = null;

  const params = new URLSearchParams(location.search);
  const urlClass = String(params.get("class") || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  if (urlClass && urlClass !== state.profile.classCode) {
    state.profile.classCode = urlClass;
    persist();
  }

  function persist() {
    try {
      state = saveStudent(state);
    } catch (err) {
      toast(err.message || "無法儲存進度");
    }
    header();
    return state;
  }

  function toast(msg) {
    document.querySelectorAll(".toast").forEach((n) => n.remove());
    const n = document.createElement("div");
    n.className = "toast";
    n.setAttribute("role", "status");
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2600);
  }

  function say(text) {
    if (!UI.speak(text)) toast("此電腦無法朗讀英文，請看畫面上的句子自己唸。");
  }

  function isCheckedIn() {
    return S.completion(state).checks.checkin;
  }

  function checkinBanner() {
    if (isCheckedIn()) return "";
    return `
      <div class="verdict warn" role="status">
        <strong>尚未報到</strong>
        <p class="help">可以先練習；繳交前請先填班級、學號、姓名，老師才能對到人。</p>
        <div style="margin-top:.5rem"><button class="btn btn-ghost" type="button" data-go="checkin">去報到</button></div>
      </div>
    `;
  }

  function recordScore(key, sc) {
    state.scores = state.scores || {};
    state.scores[key] = {
      right: sc.right,
      total: sc.total,
      pct: sc.pct,
      result: sc.result,
      at: new Date().toISOString()
    };
    persist();
  }

  function enter(mod) {
    if (!routes[mod]) {
      toast("沒有這個單元");
      return;
    }
    if (currentModule && currentModule !== mod) {
      const spent = Date.now() - startedAt;
      state.moduleTimes[currentModule] = (state.moduleTimes[currentModule] || 0) + spent;
    }
    currentModule = mod;
    startedAt = Date.now();
    view = mod;
    persist();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function pctBar() {
    return S.completion(state).pct;
  }

  function optionLetter(i) {
    return String.fromCharCode(65 + i);
  }

  function header() {
    const who = document.getElementById("who");
    const fill = document.getElementById("progFill");
    const label = document.getElementById("progLabel");
    if (who) {
      if (state.profile.name) {
        who.textContent = [state.profile.klass, state.profile.number, state.profile.name].filter(Boolean).join(" ");
      } else if (state.profile.classCode) {
        who.textContent = `尚未報到 · ${state.profile.classCode}`;
      } else {
        who.textContent = "尚未報到";
      }
    }
    const pct = pctBar();
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `完成 ${pct}%`;
    const track = document.getElementById("progTrack");
    if (track) {
      track.setAttribute("aria-valuenow", String(pct));
      track.setAttribute("aria-label", `課堂完成 ${pct}%`);
    }
  }

  function layout(inner) {
    header();
    app.innerHTML = inner;
    app.querySelectorAll("[data-say]").forEach((b) => {
      b.onclick = () => say(b.dataset.say);
    });
  }

  function dockView(v) {
    if (v === "home") return "home";
    if (v === "submit") return "submit";
    if (v === "vocab" || v === "wordfamily" || v === "units") return "vocab";
    if (v === "measure" || v === "circuit" || v === "dialogue" || v === "challenge") return "measure";
    return "hub";
  }

  function bindGradeForm(id, fn) {
    const form = document.getElementById(id);
    if (!form) return;
    form.onsubmit = (e) => {
      e.preventDefault();
      fn();
    };
  }

  function saveClassCode(raw) {
    const code = String(raw || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    if (!code) {
      toast("請輸入老師公布的課堂代碼");
      return false;
    }
    state.profile.classCode = code;
    persist();
    toast("已記住課堂代碼");
    return true;
  }

  const TARGET_ZH = { r1: "R1", load: "負載 load", series: "串聯 series", parallel: "並聯 parallel" };
  const RANGE_ZH = { off: "OFF", volt: "VOLT（電壓檔）", ohm: "OHM（歐姆檔）" };

  function measureState() {
    const m = state.answers.measure || {};
    return {
      power: Boolean(m.power),
      range: m.range || "off",
      target: m.target || "r1",
      topology: m.topology || "",
      done: Array.isArray(m.done) ? m.done.slice() : [],
      doneCount: Number(m.doneCount || 0),
      fail: measureFail
    };
  }

  function meterReading(m) {
    if (m.range === "ohm" && m.power) return "ERROR  帶電不可量 Ω";
    if (m.range === "ohm" && m.target === "r1") return "0.992 kΩ";
    if (m.range === "ohm" && m.target === "series") return "5.68 kΩ";
    if (m.range === "ohm" && m.target === "parallel") return "0.824 kΩ";
    if (m.range === "volt" && m.power && m.target === "load") return "5.01 V";
    if (m.range === "volt" && !m.power) return "0.00 V";
    return "----";
  }

  function measureFailReasons(task, m) {
    const expect = task.expect || {};
    const reasons = [];
    if (m.range === "ohm" && m.power) {
      reasons.push("電路仍通電，不可使用歐姆檔（live ohm 會損壞電表）");
    }
    if (expect.power !== undefined && Boolean(m.power) !== Boolean(expect.power)) {
      reasons.push(expect.power ? "電源應為 ON，目前是 OFF" : "電源應為 OFF，目前仍是 ON");
    }
    if (expect.range !== undefined && m.range !== expect.range) {
      reasons.push(`檔位應為 ${RANGE_ZH[expect.range] || expect.range}，目前是 ${RANGE_ZH[m.range] || m.range}`);
    }
    if (expect.target !== undefined && m.target !== expect.target) {
      reasons.push(`探棒應接到 ${TARGET_ZH[expect.target] || expect.target}，目前是 ${TARGET_ZH[m.target] || m.target}`);
    }
    if (expect.topology !== undefined) {
      if (!m.topology) reasons.push("請先選擇這是 series 還是 parallel");
      else if (m.topology !== expect.topology) {
        reasons.push(`電路應判斷為 ${expect.topology}，目前選的是 ${m.topology}`);
      }
    }
    return reasons;
  }

  function home() {
    const code = state.profile.classCode || "";
    layout(`
      <section class="hero-grid">
        <article class="hero">
          <div class="kicker">${esc(C.meta.school)} · ${esc(C.meta.dept)}</div>
          <h2>${esc(C.meta.unitZh)}</h2>
          <p>${esc(C.meta.unitEn)}　教師 ${esc(C.meta.teacher)}　建議 ${esc(C.meta.minutes)} 分鐘</p>
          <ul class="goal-list">
            ${C.goals.map((g) => `<li>${UI.icon("check", 18)}<span>${esc(g)}</span></li>`).join("")}
          </ul>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap">
            <button class="btn btn-primary" type="button" data-go="checkin">開始／繼續上課</button>
            <button class="btn btn-ghost" type="button" data-go="hub">學習地圖</button>
          </div>
        </article>
        <aside class="hero">
          <strong>課堂怎麼用</strong>
          <p class="help">1. 報到　2. 安全口令　3. 依地圖完成任務　4. 繳交後等老師審核。英文指令請按「聽」自己跟讀，不必等老師唸。</p>
          <p class="help">課堂代碼：<b>${code ? esc(code) : "請輸入老師公布的代碼"}</b></p>
          <form class="form" id="classCodeForm">
            <label>課堂代碼
              <input id="classCode" name="classCode" value="${attr(code)}" maxlength="8" autocomplete="off" enterkeyhint="done">
            </label>
            <button class="btn btn-accent" type="submit" id="saveCode">記住代碼</button>
          </form>
        </aside>
      </section>
    `);
    bindGradeForm("classCodeForm", () => {
      if (saveClassCode(document.getElementById("classCode").value)) home();
    });
  }

  function checkin() {
    const p = state.profile;
    layout(`
      <article class="hero">
        <div class="kicker">報到</div>
        <h2>先讓老師認得出你</h2>
        <form class="form" id="checkinForm">
          <label>班級 <input name="klass" required value="${attr(p.klass)}" placeholder="例如 資一甲" autocomplete="organization"></label>
          <label>學號 <input name="number" required value="${attr(p.number)}" inputmode="numeric" autocomplete="off"></label>
          <label>姓名 <input name="name" required value="${attr(p.name)}" autocomplete="name"></label>
          <label>組別 <input name="group" value="${attr(p.group)}" placeholder="選填" autocomplete="off"></label>
          <label>課堂代碼 <input name="classCode" value="${attr(p.classCode)}" placeholder="老師公布的 6 碼" maxlength="8" autocomplete="off"></label>
          <button class="btn btn-primary" type="submit">進入學習地圖</button>
        </form>
      </article>
    `);
    document.getElementById("checkinForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const klass = String(fd.get("klass") || "").trim();
      const number = String(fd.get("number") || "").trim();
      const name = String(fd.get("name") || "").trim();
      if (!klass || !number || !name) {
        toast("班級、學號、姓名都要填");
        return;
      }
      state.profile = {
        klass,
        number,
        name,
        group: String(fd.get("group") || "").trim(),
        classCode: String(fd.get("classCode") || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
      };
      persist();
      toast("報到完成");
      enter("hub");
    };
  }

  function hub() {
    const c = S.completion(state);
    const o = S.overall(state);
    const items = [
      ["checkin", "報到", "班級、學號、姓名", c.checks.checkin],
      ["safety", "安全口令", "先過這關才能量測", c.checks.safety],
      ["vocab", "核心詞彙", "18 個必學＋18 個進階", c.checks.vocab],
      ["wordfamily", "構詞解碼", "resistor / resistance / resistive", c.checks.wordfamily],
      ["units", "單位換算", "kilo / mega / milli / micro", c.checks.units],
      ["circuit", "電路判讀", "series / parallel / short", c.checks.circuit],
      ["measure", "英文工作單", "關電、檔位、探棒、讀值", c.checks.measure],
      ["dialogue", "量測對話", "聽、跟讀、寫中文", false],
      ["challenge", "進階挑戰", "沒教過的三個詞", false],
      ["quiz", "綜合練習", "PVQC 六大題型紙本化", c.checks.quiz],
      ["submit", "繳交與審核", "回傳學習紀錄給老師", false]
    ];
    layout(`
      <section class="grid grid-3" style="margin-bottom:1rem">
        <div class="stat" style="padding:1rem"><div class="help">地圖完成度</div><strong>${c.pct}%</strong></div>
        <div class="stat" style="padding:1rem"><div class="help">目前得分</div><strong>${o.pct}%</strong><div class="help">${o.right}/${o.total}</div></div>
        <div class="stat" style="padding:1rem"><div class="help">審核狀態</div><strong>${esc(state.review.status)}</strong><div class="help">${esc(state.review.note || "尚未回傳")}</div></div>
      </section>
      ${checkinBanner()}
      <section class="grid grid-2">
        ${items.map(([id, title, meta, done]) => `
          <button class="module-card ${done ? "done" : ""}" type="button" data-go="${id}">
            <div><span class="badge ${done ? "badge-ok" : "badge-core"}">${done ? "已完成" : "進行中"}</span></div>
            <strong>${esc(title)}</strong>
            <div class="meta">${esc(meta)}</div>
          </button>
        `).join("")}
      </section>
    `);
  }

  function gradeSafety() {
    const answers = C.safetyQuiz.map((_, i) => {
      const el = app.querySelector(`input[name="s${i}"]:checked`);
      return el ? Number(el.value) : -1;
    });
    state.answers.safetyQuiz = answers;
    persist();
    const sc = S.scoreSafety(answers);
    recordScore("safety", sc);
    const msg = document.getElementById("safetyMsg");
    if (sc.pct === 100) {
      if (msg) msg.textContent = "安全過關，可以開始量測。";
      toast("安全過關");
    } else {
      if (msg) msg.textContent = `還有錯，目前 ${sc.right}/${sc.total}。請再看一次口令。`;
      toast(`安全口令 ${sc.right}/${sc.total}，尚未過關`);
    }
  }

  function safety() {
    const picked = state.answers.safetyQuiz || [];
    layout(`
      <article class="hero">
        <div class="kicker">實習安全</div>
        <h2>英文安全口令</h2>
        <p class="help">自己按「聽英文」跟讀。過關三題全對才能算完成。</p>
        <div class="grid">
          ${C.safety.map((s) => `
            <div class="task">
              <strong>${esc(s.en)}</strong>
              <p>${esc(s.zh)}</p>
              <p class="help">${esc(s.why)}</p>
              <button class="btn btn-ghost" type="button" data-say="${attr(s.en)}">${UI.icon("sound", 18)} 聽英文</button>
            </div>
          `).join("")}
        </div>
        <h3>過關三題</h3>
        <form class="form" id="safetyForm">
          ${C.safetyQuiz.map((q, i) => `
            <fieldset>
              <legend>${esc(q.q)}</legend>
              ${q.options.map((op, j) => `
                <label class="choice"><input type="radio" name="s${i}" value="${j}" ${String(picked[i]) === String(j) ? "checked" : ""}> ${esc(op)}</label>
              `).join("")}
            </fieldset>
          `).join("")}
          <button class="btn btn-primary" type="submit">檢查</button>
          <p id="safetyMsg" class="help"></p>
        </form>
      </article>
    `);
    bindGradeForm("safetyForm", gradeSafety);
  }

  function vocab() {
    const list = C.vocab;
    const item = list[vocabIndex];
    state.viewed.vocab = state.viewed.vocab || {};
    state.viewed.vocab[item.id] = true;
    persist();
    const zhGuess = state.answers.vocabZh || {};
    const coreSeen = Object.keys(state.viewed.vocab).filter((id) => list.find((v) => v.id === id)?.core).length;
    layout(`
      ${checkinBanner()}
      <article class="hero">
        <div class="kicker">${esc(C.categories[item.cat])}　${vocabIndex + 1}/${list.length}</div>
        <div class="flash" id="flash" role="button" tabindex="0">
          ${item.core ? `<span class="badge star">必學核心</span>` : `<span class="badge">進階辨識</span>`}
          <div class="en">${esc(vocabSide === "en" ? item.en : item.zh)}</div>
          <div class="kk">${esc(item.kk)}</div>
          <div class="help">${vocabSide === "en" ? "點卡片看中文" : "點卡片看英文"}</div>
        </div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.8rem 0">
          <button class="btn btn-ghost" type="button" id="prev">上一張</button>
          <button class="btn btn-primary" type="button" id="say">${UI.icon("sound", 18)} 聽發音</button>
          <button class="btn btn-ghost" type="button" id="next">下一張</button>
        </div>
        <form id="vocabForm">
          <label>寫出這個英文的中文（核心詞會計分）
            <input id="zhIn" value="${attr(zhGuess[item.id] || "")}" placeholder="例如：探棒" autocomplete="off" enterkeyhint="next">
          </label>
          <p class="help">按 Enter 會存檔並到下一張。已看過 ${Object.keys(state.viewed.vocab).length} / ${list.length} 詞，核心 ${coreSeen}/18</p>
        </form>
      </article>
    `);
    const flip = () => {
      vocabSide = vocabSide === "en" ? "zh" : "en";
      vocab();
    };
    document.getElementById("flash").onclick = flip;
    document.getElementById("flash").onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    };
    document.getElementById("say").onclick = () => say(item.en.replace(" / ", ", "));
    document.getElementById("prev").onclick = () => { vocabIndex = (vocabIndex + list.length - 1) % list.length; vocabSide = "en"; vocab(); };
    document.getElementById("next").onclick = () => { vocabIndex = (vocabIndex + 1) % list.length; vocabSide = "en"; vocab(); };
    const zhIn = document.getElementById("zhIn");
    const saveZh = () => {
      state.answers.vocabZh = state.answers.vocabZh || {};
      state.answers.vocabZh[item.id] = zhIn.value.trim();
      persist();
    };
    zhIn.oninput = saveZh;
    bindGradeForm("vocabForm", () => {
      saveZh();
      vocabIndex = (vocabIndex + 1) % list.length;
      vocabSide = "en";
      vocab();
    });
  }

  function wordfamily() {
    const a = state.answers.wordFamily || C.wordFamily.map(() => ({}));
    layout(`
      <article class="hero">
        <h2>構詞解碼</h2>
        <p class="help">-or 是「…器」，-ance 是性質，-ive 是「…性的」。</p>
        <form id="wfForm">
          <div class="table-wrap">
            <table>
              <thead><tr><th>字根</th><th>…器 (-or)</th><th>…性質 (-ance)</th><th>…性的 (-ive)</th></tr></thead>
              <tbody>
                ${C.wordFamily.map((row, i) => `
                  <tr>
                    <td>${esc(row.root)}<div class="help">${esc(row.zh)}</div></td>
                    ${["or", "ance", "ive"].map((k) => `<td>${
                      row.given.includes(k)
                        ? `<strong>${esc(row[k])}</strong>`
                        : `<input data-wf="${i}.${k}" value="${attr(a[i]?.[k] || "")}" autocomplete="off">`
                    }</td>`).join("")}
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <button class="btn btn-primary" type="submit" id="gradeWf">對答案</button>
          <p id="wfMsg" class="help"></p>
        </form>
      </article>
    `);
    app.querySelectorAll("[data-wf]").forEach((input) => {
      input.oninput = () => {
        const [i, k] = input.dataset.wf.split(".");
        state.answers.wordFamily = Array.isArray(state.answers.wordFamily)
          ? state.answers.wordFamily
          : C.wordFamily.map(() => ({}));
        state.answers.wordFamily[Number(i)] = state.answers.wordFamily[Number(i)] || {};
        state.answers.wordFamily[Number(i)][k] = input.value;
        persist();
      };
    });
    bindGradeForm("wfForm", () => {
      const sc = S.scoreWordFamily(state.answers.wordFamily || {});
      recordScore("wordfamily", sc);
      document.getElementById("wfMsg").textContent = `對了 ${sc.right}/${sc.total}（${sc.pct}%）`;
      toast(`構詞 ${sc.right}/${sc.total}`);
    });
  }

  function units() {
    const a = state.answers.prefixes || C.prefixes.map(() => ({}));
    layout(`
      <article class="hero">
        <h2>單位字首</h2>
        <form id="pxForm">
          <div class="table-wrap">
            <table>
              <thead><tr><th>數值</th><th>換成基本單位</th><th>英文讀法</th></tr></thead>
              <tbody>
                ${C.prefixes.map((row, i) => `
                  <tr>
                    <td>${esc(row.given)}<div class="help">${esc(row.hint)}</div></td>
                    <td><input data-px="${i}.base" value="${attr(a[i]?.base || "")}" placeholder="${attr(row.unit)}" autocomplete="off"></td>
                    <td><input data-px="${i}.say" value="${attr(a[i]?.say || "")}" placeholder="English" autocomplete="off"></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
          <button class="btn btn-primary" type="submit" id="gradePx">對答案</button>
          <p id="pxMsg" class="help"></p>
        </form>
      </article>
    `);
    app.querySelectorAll("[data-px]").forEach((input) => {
      input.oninput = () => {
        const [i, k] = input.dataset.px.split(".");
        state.answers.prefixes = Array.isArray(state.answers.prefixes)
          ? state.answers.prefixes
          : C.prefixes.map(() => ({}));
        state.answers.prefixes[Number(i)] = state.answers.prefixes[Number(i)] || {};
        state.answers.prefixes[Number(i)][k] = input.value;
        persist();
      };
    });
    bindGradeForm("pxForm", () => {
      const sc = S.scorePrefixes(state.answers.prefixes || {});
      recordScore("units", sc);
      document.getElementById("pxMsg").textContent = `對了 ${sc.right}/${sc.total}`;
      toast(`單位換算 ${sc.right}/${sc.total}`);
    });
  }

  function circuit() {
    const a = state.answers.circuits || [];
    layout(`
      <article class="hero">
        <h2>電路判讀</h2>
        <form id="cForm">
          ${C.circuits.map((row, i) => `
            <div class="task">
              <p>${i + 1}. ${esc(row.q)}</p>
              <div class="grid grid-2">
                ${row.options.map((op) => `
                  <button class="choice ${a[i] === op ? "selected" : ""}" type="button" data-c="${i}" data-v="${attr(op)}">${esc(op)} circuit</button>
                `).join("")}
              </div>
            </div>
          `).join("")}
          <button class="btn btn-primary" type="submit" id="gradeC">對答案</button>
          <p id="cMsg" class="help"></p>
        </form>
      </article>
    `);
    app.querySelectorAll("[data-c]").forEach((b) => {
      b.onclick = () => {
        state.answers.circuits = state.answers.circuits || [];
        state.answers.circuits[Number(b.dataset.c)] = b.dataset.v;
        persist();
        circuit();
      };
    });
    bindGradeForm("cForm", () => {
      const sc = S.scoreCircuits(state.answers.circuits || []);
      recordScore("circuit", sc);
      document.getElementById("cMsg").textContent = `${sc.right}/${sc.total}　${C.circuits.map((r) => r.zh).join("／")}`;
      toast(`電路判讀 ${sc.right}/${sc.total}`);
    });
  }

  function measure() {
    const m = measureState();
    const reading = meterReading(m);
    layout(`
      ${checkinBanner()}
      <article class="hero">
        <h2>English Work Order</h2>
        <p class="help">英文工作單：先調電表再按「我完成了」。狀態不符工作單時不會過關。</p>
        <div class="lab">
          <div class="meter" aria-live="polite">
            <div class="help meter-label">DIGITAL MULTIMETER</div>
            <div class="meter-screen">${esc(reading)}</div>
            <div class="knob-row">
              ${[
                ["off", "OFF 關"],
                ["volt", "VOLT 電壓"],
                ["ohm", "OHM 歐姆"]
              ].map(([r, label]) => `<button class="seg ${m.range === r ? "on" : ""}" type="button" data-range="${r}">${label}</button>`).join("")}
            </div>
            <div class="probe-row">
              <button class="seg ${m.power ? "on" : ""}" type="button" data-power="1">電源 ${m.power ? "ON" : "OFF"}</button>
              ${[
                ["r1", "R1"],
                ["load", "load 負載"],
                ["series", "series 串聯"],
                ["parallel", "parallel 並聯"]
              ].map(([t, label]) => `<button class="seg ${m.target === t ? "on" : ""}" type="button" data-target="${t}">${label}</button>`).join("")}
            </div>
          </div>
          <div class="grid">
            ${C.measureTasks.map((t) => `
              <div class="task">
                <strong>${esc(t.title)}</strong>
                <p>${esc(t.en)}</p>
                <p class="help">${esc(t.zh)}</p>
                <button class="btn btn-ghost" type="button" data-say="${attr(t.en)}">聽指令</button>
                <button class="btn btn-primary" type="button" data-done="${attr(t.id)}">我完成了</button>
                ${m.done.includes(t.id) ? `<span class="badge badge-ok">已勾</span>` : ""}
                ${m.fail && m.fail.id === t.id ? `<p class="error">${esc((m.fail.reasons || []).join("；"))}</p>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
        <label>Task 3 這是什麼電路？
          <select id="topo">
            <option value="" ${m.topology ? "" : "selected"}>請選擇</option>
            <option value="series" ${m.topology === "series" ? "selected" : ""}>series circuit 串聯</option>
            <option value="parallel" ${m.topology === "parallel" ? "selected" : ""}>parallel circuit 並聯</option>
          </select>
        </label>
      </article>
    `);
    app.querySelectorAll("[data-range]").forEach((b) => {
      b.onclick = () => { m.range = b.dataset.range; m.fail = null; saveMeasure(m); };
    });
    app.querySelector("[data-power]").onclick = () => { m.power = !m.power; m.fail = null; saveMeasure(m); };
    app.querySelectorAll("[data-target]").forEach((b) => {
      b.onclick = () => { m.target = b.dataset.target; m.fail = null; saveMeasure(m); };
    });
    app.querySelectorAll("[data-done]").forEach((b) => {
      b.onclick = () => {
        const task = C.measureTasks.find((t) => t.id === b.dataset.done);
        if (!task) {
          toast("找不到這個任務");
          return;
        }
        const reasons = measureFailReasons(task, m);
        if (reasons.length) {
          m.fail = { id: task.id, reasons };
          saveMeasure(m);
          toast(reasons[0]);
          return;
        }
        m.fail = null;
        m.done = Array.from(new Set([...(m.done || []), task.id]));
        m.doneCount = m.done.length;
        saveMeasure(m);
        toast("電表狀態符合工作單，已勾任務");
      };
    });
    document.getElementById("topo").onchange = (e) => {
      m.topology = e.target.value;
      m.fail = null;
      saveMeasure(m);
    };
  }

  function saveMeasure(m) {
    measureFail = m.fail || null;
    state.answers.measure = {
      power: Boolean(m.power),
      range: m.range || "off",
      target: m.target || "r1",
      topology: m.topology || "",
      done: Array.isArray(m.done) ? m.done.slice() : [],
      doneCount: Math.max(Number(m.doneCount || 0), (m.done || []).length)
    };
    persist();
    measure();
  }

  function dialogue() {
    const a = state.answers.dialogue || [];
    layout(`
      <article class="hero">
        <h2>量測對話</h2>
        <p class="help">先聽英文，再寫中文。不必等老師帶讀。</p>
        <form id="dForm">
          ${C.dialogue.map((d, i) => `
            <div class="task">
              <strong>${esc(d.who)}：${esc(d.en)}</strong>
              <button class="btn btn-ghost" type="button" data-say="${attr(d.en)}">聽</button>
              <label>中文
                <input data-d="${i}" value="${attr(a[i] || "")}" placeholder="寫出中文" autocomplete="off">
              </label>
            </div>
          `).join("")}
          <button class="btn btn-primary" type="submit" id="gradeD">對答案</button>
          <p id="dMsg" class="help"></p>
        </form>
      </article>
    `);
    app.querySelectorAll("[data-d]").forEach((input) => {
      input.oninput = () => {
        state.answers.dialogue = state.answers.dialogue || [];
        state.answers.dialogue[Number(input.dataset.d)] = input.value;
        persist();
      };
    });
    bindGradeForm("dForm", () => {
      let n = 0;
      C.dialogue.forEach((d, i) => {
        if ((state.answers.dialogue?.[i] || "").replace(/\s/g, "").includes(d.zh.slice(0, 4))) n += 1;
      });
      document.getElementById("dMsg").textContent = `接近正確 ${n}/${C.dialogue.length}。完整中文：${C.dialogue.map((d) => d.zh).join("／")}`;
      toast(`對話 ${n}/${C.dialogue.length}`);
    });
  }

  function challenge() {
    const a = state.answers.challenge || [];
    layout(`
      <article class="hero">
        <h2>沒教過，用規則猜</h2>
        <form id="chForm">
          ${C.challenge.map((row, i) => `
            <label>${esc(row.en)}
              <input data-ch="${i}" value="${attr(a[i] || "")}" placeholder="中文意思" autocomplete="off">
            </label>
          `).join("")}
          <button class="btn btn-primary" type="submit" id="gradeCh">看答案</button>
          <p id="chMsg" class="help"></p>
        </form>
      </article>
    `);
    app.querySelectorAll("[data-ch]").forEach((input) => {
      input.oninput = () => {
        state.answers.challenge = state.answers.challenge || [];
        state.answers.challenge[Number(input.dataset.ch)] = input.value;
        persist();
      };
    });
    bindGradeForm("chForm", () => {
      const sc = S.scoreChallenge(state.answers.challenge || []);
      recordScore("challenge", sc);
      document.getElementById("chMsg").textContent = `${sc.right}/${sc.total}。答案：${C.challenge.map((c) => c.zh).join("、")}`;
      toast(`進階挑戰 ${sc.right}/${sc.total}`);
    });
  }

  function quiz() {
    const a = state.answers.quiz || { type1: [], type2: [], type3: [], type4: [], type5: [], type6: [] };
    const titles = {
      type2: "題型二　看英文選中文",
      type3: "題型三　看英文選中文",
      type4: "題型四　看音標選英文",
      type5: "題型五　看中文選音標",
      type6: "題型六　看英文選音標"
    };
    const block = (key, title, render) => `
      <section class="task"><h3>${title}</h3>${C.quiz[key].map(render).join("")}</section>
    `;
    layout(`
      ${checkinBanner()}
      <article class="hero">
        <h2>綜合練習（可獨立完成）</h2>
        <p class="help">正式 PVQC 聽力改為文字／KK 音標。課堂目標 70%。</p>
        ${block("type1", "題型一　看中文拼英文", (q, i) => `<label>${i + 1}. ${esc(q.zh)}<input data-q="type1.${i}" value="${attr(a.type1[i] || "")}" autocomplete="off"></label>`)}
        ${["type2", "type3", "type4", "type5", "type6"].map((key) => block(key, titles[key], (q, i) => `
          <p>${i + 1}. ${esc(q.stem)}</p>
          <div class="grid">
            ${q.options.map((op, j) => `<label class="choice"><input type="radio" name="${key}-${i}" data-qkey="${key}" data-qidx="${i}" value="${j}" ${String(a[key]?.[i]) === String(j) ? "checked" : ""}> (${optionLetter(j)}) ${esc(op)}</label>`).join("")}
          </div>
        `)).join("")}
        <button class="btn btn-primary" type="button" id="gradeQ">送出練習並計分</button>
        <p id="qMsg" class="help">${state.scores?.quiz ? `上次得分 ${state.scores.quiz.pct}%（${state.scores.quiz.right}/${state.scores.quiz.total}）` : ""}</p>
      </article>
    `);
    app.querySelectorAll("[data-q]").forEach((input) => {
      input.oninput = () => {
        const [k, i] = input.dataset.q.split(".");
        state.answers.quiz = state.answers.quiz || a;
        state.answers.quiz[k] = state.answers.quiz[k] || [];
        state.answers.quiz[k][Number(i)] = input.value;
        persist();
      };
    });
    app.querySelectorAll("input[type=radio][data-qkey]").forEach((input) => {
      input.onchange = () => {
        const key = input.dataset.qkey;
        const idx = Number(input.dataset.qidx);
        state.answers.quiz = state.answers.quiz || a;
        state.answers.quiz[key] = state.answers.quiz[key] || [];
        state.answers.quiz[key][idx] = Number(input.value);
        persist();
      };
    });
    document.getElementById("gradeQ").onclick = () => {
      state.answers.quiz = state.answers.quiz || a;
      app.querySelectorAll("input[type=radio][data-qkey]:checked").forEach((el) => {
        const key = el.dataset.qkey;
        const idx = Number(el.dataset.qidx);
        state.answers.quiz[key] = state.answers.quiz[key] || [];
        state.answers.quiz[key][idx] = Number(el.value);
      });
      persist();
      const sc = S.scoreQuiz(state.answers.quiz);
      state.scores = state.scores || {};
      state.scores.quiz = { ...sc, at: new Date().toISOString() };
      persist();
      document.getElementById("qMsg").textContent = `得分 ${sc.pct}%（${sc.right}/${sc.total}）${sc.pct >= 70 ? "，達到課堂目標。" : "，請回詞彙區再練。"}`;
      toast(`綜合練習 ${sc.pct}%`);
    };
  }

  async function submitView() {
    const c = S.completion(state);
    const o = S.overall(state);
    const flags = S.qualityFlags(state);
    const ready = S.canSubmit(state);
    const suggest = S.reviewSuggest(state);
    layout(`
      <article class="hero">
        <h2>繳交學習紀錄</h2>
        ${checkinBanner()}
        <p>完成度 ${c.pct}%　得分 ${o.pct}%　審核：${esc(state.review.status)}</p>
        <div class="verdict ${suggest.decision === "通過" ? "pass" : suggest.decision === "需補救" ? "fail" : "warn"}">
          <strong>繳交前預檢：${esc(suggest.decision)}</strong>
          <p class="help">${esc(suggest.reason)}</p>
        </div>
        <ul class="goal-list">
          ${Object.entries(c.checks).map(([k, v]) => `<li>${v ? UI.icon("check") : UI.icon("alert")}<span>${esc(zh(k))} ${v ? "通過" : "未完成"}</span></li>`).join("")}
        </ul>
        ${flags.length ? `<p class="help">品質標記：${flags.map((f) => esc(f.detail)).join("、")}</p>` : `<p class="help">未發現明顯異常。</p>`}
        ${ready ? "" : `<p class="error">至少要完成報到、安全過關，且地圖完成度達 60% 才能繳交。</p>`}
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="btn btn-primary" type="button" id="sendNow" ${ready ? "" : "disabled"}>即時送給老師</button>
          <button class="btn btn-ghost" type="button" id="dl">下載繳交檔</button>
        </div>
        <p id="subMsg" class="help">${state.submittedAt ? `上次繳交 ${esc(state.submittedAt)}` : ""}</p>
      </article>
    `);
    const payload = {
      type: "submit",
      student: {
        ...state,
        flags,
        completion: c,
        overall: o,
        submittedAt: new Date().toISOString()
      }
    };
    document.getElementById("dl").onclick = () => {
      if (!isCheckedIn()) {
        toast("請先報到，老師才能對到人");
        return;
      }
      const num = String(state.profile.number || "student").replace(/[^\w\u4e00-\u9fff-]/g, "") || "student";
      DMM_SYNC.downloadJson(`${num}-dmm.json`, payload.student);
      toast("已下載，交給老師匯入");
    };
    document.getElementById("sendNow").onclick = async () => {
      const btn = document.getElementById("sendNow");
      if (!S.canSubmit(state)) {
        toast("尚未達到繳交條件");
        return;
      }
      btn.disabled = true;
      btn.textContent = "傳送中…";
      try {
        if (!state.profile.classCode) throw new Error("尚未填課堂代碼");
        const sent = await DMM_SYNC.connectStudent(state.profile.classCode, payload);
        state.submittedAt = payload.student.submittedAt;
        state.submitChannel = "live";
        state.review = sent.ack?.review
          ? { ...state.review, ...sent.ack.review }
          : { ...state.review, status: "待審核" };
        persist();
        document.getElementById("subMsg").textContent = "已送到老師端。老師批改後，可再繳交一次以更新狀態。";
        toast("繳交成功");
      } catch (err) {
        const msg = `${err.message || err} 請改下載繳交檔。`;
        const box = document.getElementById("subMsg");
        if (box) box.textContent = msg;
        toast(String(err.message || err));
        btn.disabled = false;
        btn.textContent = "即時送給老師";
      }
    };
  }

  const routes = { home, checkin, hub, safety, vocab, wordfamily, units, circuit, measure, dialogue, challenge, quiz, submit: submitView };

  function render() {
    app.onclick = null;
    const dock = dockView(view);
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const on = el.dataset.nav === dock;
      el.classList.toggle("active", on);
      if (on) el.setAttribute("aria-current", "page");
      else el.removeAttribute("aria-current");
    });
    (routes[view] || home)();
  }

  document.body.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) enter(go.dataset.go);
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => enter(el.dataset.nav));
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) persist();
  });

  render();
})();
