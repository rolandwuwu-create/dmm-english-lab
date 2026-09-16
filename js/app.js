(function () {
  const { loadStudent, saveStudent } = DMM_STORE;
  const S = DMM_SCORE;
  const UI = DMM_UI;
  const C = DMM_CONTENT;
  const app = document.getElementById("app");
  let state = loadStudent();
  let view = "home";
  let vocabIndex = 0;
  let vocabSide = "en";
  let startedAt = Date.now();
  let currentModule = "home";

  const params = new URLSearchParams(location.search);
  if (params.get("class") && !state.profile.classCode) {
    state.profile.classCode = params.get("class").toUpperCase();
    persist();
  }

  function persist() {
    state = saveStudent(state);
  }

  function toast(msg) {
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 2400);
  }

  function enter(mod) {
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
    document.getElementById("who").textContent = state.profile.name
      ? `${state.profile.klass} ${state.profile.number} ${state.profile.name}`
      : "尚未報到";
    document.getElementById("progFill").style.width = `${pctBar()}%`;
    document.getElementById("progLabel").textContent = `完成 ${pctBar()}%`;
  }

  function layout(inner) {
    header();
    app.innerHTML = inner;
  }

  function home() {
    layout(`
      <section class="hero-grid">
        <article class="hero">
          <div class="kicker">${C.meta.school} · ${C.meta.dept}</div>
          <h2>${C.meta.unitZh}</h2>
          <p>${C.meta.unitEn}　教師 ${C.meta.teacher}　建議 ${C.meta.minutes} 分鐘</p>
          <ul class="goal-list">
            ${C.goals.map((g) => `<li>${UI.icon("check", 18)}<span>${g}</span></li>`).join("")}
          </ul>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap">
            <button class="btn btn-primary" data-go="checkin">開始／繼續上課</button>
            <button class="btn btn-ghost" data-go="hub">學習地圖</button>
          </div>
        </article>
        <aside class="hero">
          <strong>課堂怎麼用</strong>
          <p class="help">1. 填班級學號　2. 先做安全　3. 依地圖完成任務　4. 繳交後等老師審核</p>
          <p class="help">課堂代碼：<b>${state.profile.classCode || "請輸入老師公布的代碼"}</b></p>
          <label>課堂代碼
            <input id="classCode" value="${state.profile.classCode || ""}" maxlength="8" autocomplete="off">
          </label>
          <button class="btn btn-accent" id="saveCode">記住代碼</button>
        </aside>
      </section>
    `);
  }

  function checkin() {
    const p = state.profile;
    layout(`
      <article class="hero">
        <div class="kicker">報到</div>
        <h2>先讓老師認得出你</h2>
        <form class="form" id="checkinForm">
          <label>班級 <input name="klass" required value="${p.klass}" placeholder="例如 資一甲"></label>
          <label>學號 <input name="number" required value="${p.number}" inputmode="numeric"></label>
          <label>姓名 <input name="name" required value="${p.name}"></label>
          <label>組別 <input name="group" value="${p.group}" placeholder="選填"></label>
          <label>課堂代碼 <input name="classCode" value="${p.classCode}" placeholder="老師公布的 6 碼"></label>
          <button class="btn btn-primary" type="submit">進入學習地圖</button>
        </form>
      </article>
    `);
    document.getElementById("checkinForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.profile = {
        klass: fd.get("klass").trim(),
        number: fd.get("number").trim(),
        name: fd.get("name").trim(),
        group: fd.get("group").trim(),
        classCode: String(fd.get("classCode") || "").trim().toUpperCase()
      };
      persist();
      enter("hub");
    };
  }

  function hub() {
    const c = S.completion(state);
    const o = S.overall(state);
    const items = [
      ["safety", "安全口令", "先過這關才能量測", c.checks.safety],
      ["vocab", "核心詞彙", "18 個必學＋18 個進階", c.checks.vocab],
      ["wordfamily", "構詞解碼", "resistor / resistance / resistive", c.checks.wordfamily],
      ["units", "單位換算", "kilo / mega / milli / micro", c.checks.units],
      ["circuit", "電路判讀", "series / parallel / short", c.checks.circuit],
      ["measure", "英文工作單", "關電、檔位、探棒、讀值", c.checks.measure],
      ["dialogue", "量測對話", "聽、跟讀、寫中文"],
      ["challenge", "進階挑戰", "沒教過的三個詞"],
      ["quiz", "綜合練習", "PVQC 六大題型紙本化", c.checks.quiz],
      ["submit", "繳交與審核", "回傳學習紀錄給老師"]
    ];
    layout(`
      <section class="grid grid-3" style="margin-bottom:1rem">
        <div class="stat" style="padding:1rem"><div class="help">地圖完成度</div><strong>${c.pct}%</strong></div>
        <div class="stat" style="padding:1rem"><div class="help">目前得分</div><strong>${o.pct}%</strong><div class="help">${o.right}/${o.total}</div></div>
        <div class="stat" style="padding:1rem"><div class="help">審核狀態</div><strong>${state.review.status}</strong><div class="help">${state.review.note || "尚未回傳"}</div></div>
      </section>
      <section class="grid grid-2">
        ${items.map(([id, title, meta, done]) => `
          <button class="module-card ${done ? "done" : ""}" data-go="${id}">
            <div><span class="badge ${done ? "badge-ok" : "badge-core"}">${done ? "已完成" : "進行中"}</span></div>
            <strong>${title}</strong>
            <div class="meta">${meta}</div>
          </button>
        `).join("")}
      </section>
    `);
  }

  function safety() {
    const picked = state.answers.safetyQuiz || [];
    layout(`
      <article class="hero">
        <div class="kicker">安 E5</div>
        <h2>英文安全口令</h2>
        <div class="grid">
          ${C.safety.map((s) => `
            <div class="task">
              <strong>${s.en}</strong>
              <p>${s.zh}</p>
              <p class="help">${s.why}</p>
              <button class="btn btn-ghost" data-say="${s.en}">${UI.icon("sound", 18)} 聽英文</button>
            </div>
          `).join("")}
        </div>
        <h3>過關三題</h3>
        <div class="form" id="safetyForm">
          ${C.safetyQuiz.map((q, i) => `
            <fieldset>
              <legend>${q.q}</legend>
              ${q.options.map((op, j) => `
                <label class="choice"><input type="radio" name="s${i}" value="${j}" ${String(picked[i]) === String(j) ? "checked" : ""}> ${op}</label>
              `).join("")}
            </fieldset>
          `).join("")}
          <button class="btn btn-primary" id="gradeSafety">檢查</button>
          <p id="safetyMsg" class="help"></p>
        </div>
      </article>
    `);
    app.onclick = (e) => {
      const b = e.target.closest("[data-say]");
      if (b) UI.speak(b.dataset.say);
    };
    document.getElementById("gradeSafety").onclick = () => {
      const answers = C.safetyQuiz.map((_, i) => {
        const el = app.querySelector(`input[name="s${i}"]:checked`);
        return el ? Number(el.value) : -1;
      });
      state.answers.safetyQuiz = answers;
      persist();
      const sc = S.scoreSafety(answers);
      const msg = document.getElementById("safetyMsg");
      if (sc.pct === 100) {
        msg.textContent = "安全過關，可以開始量測。";
        toast("安全過關");
      } else {
        msg.textContent = `還有錯，目前 ${sc.right}/${sc.total}。請再看一次口令。`;
      }
    };
  }

  function vocab() {
    const list = C.vocab;
    const item = list[vocabIndex];
    state.viewed.vocab = state.viewed.vocab || {};
    state.viewed.vocab[item.id] = true;
    persist();
    const zhGuess = state.answers.vocabZh || {};
    layout(`
      <article class="hero">
        <div class="kicker">${C.categories[item.cat]}　${vocabIndex + 1}/${list.length}</div>
        <div class="flash" id="flash">
          ${item.core ? `<span class="badge star">必學核心</span>` : `<span class="badge">進階辨識</span>`}
          <div class="en">${vocabSide === "en" ? item.en : item.zh}</div>
          <div class="kk">${item.kk}</div>
          <div class="help">${vocabSide === "en" ? "點卡片看中文" : "點卡片看英文"}</div>
        </div>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.8rem 0">
          <button class="btn btn-ghost" id="prev">上一張</button>
          <button class="btn btn-primary" id="say">${UI.icon("sound", 18)} 聽發音</button>
          <button class="btn btn-ghost" id="next">下一張</button>
        </div>
        <label>寫出這個英文的中文（核心詞會計分）
          <input id="zhIn" value="${zhGuess[item.id] || ""}" placeholder="例如：探棒">
        </label>
        <div class="help">已看過 ${Object.keys(state.viewed.vocab).length} / ${list.length} 詞，核心 ${Object.keys(state.viewed.vocab).filter((id) => list.find((v) => v.id === id)?.core).length}/18</div>
      </article>
    `);
    document.getElementById("flash").onclick = () => {
      vocabSide = vocabSide === "en" ? "zh" : "en";
      vocab();
    };
    document.getElementById("say").onclick = () => UI.speak(item.en.replace(" / ", ", "));
    document.getElementById("prev").onclick = () => { vocabIndex = (vocabIndex + list.length - 1) % list.length; vocabSide = "en"; vocab(); };
    document.getElementById("next").onclick = () => { vocabIndex = (vocabIndex + 1) % list.length; vocabSide = "en"; vocab(); };
    document.getElementById("zhIn").onchange = (e) => {
      state.answers.vocabZh = state.answers.vocabZh || {};
      state.answers.vocabZh[item.id] = e.target.value.trim();
      persist();
    };
  }

  function wordfamily() {
    const a = state.answers.wordFamily || C.wordFamily.map(() => ({}));
    layout(`
      <article class="hero">
        <h2>構詞解碼</h2>
        <p class="help">-or 是「…器」，-ance 是性質，-ive 是「…性的」。</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>字根</th><th>…器 (-or)</th><th>…性質 (-ance)</th><th>…性的 (-ive)</th></tr></thead>
            <tbody>
              ${C.wordFamily.map((row, i) => `
                <tr>
                  <td>${row.root}<div class="help">${row.zh}</div></td>
                  ${["or", "ance", "ive"].map((k) => `<td>${
                    row.given.includes(k)
                      ? `<strong>${row[k]}</strong>`
                      : `<input data-wf="${i}.${k}" value="${a[i]?.[k] || ""}">`
                  }</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary" id="gradeWf">對答案</button>
        <p id="wfMsg" class="help"></p>
      </article>
    `);
    app.querySelectorAll("[data-wf]").forEach((input) => {
      input.oninput = () => {
        const [i, k] = input.dataset.wf.split(".");
        state.answers.wordFamily = state.answers.wordFamily || C.wordFamily.map(() => ({}));
        state.answers.wordFamily[Number(i)][k] = input.value;
        persist();
      };
    });
    document.getElementById("gradeWf").onclick = () => {
      const sc = S.scoreWordFamily(state.answers.wordFamily || {});
      document.getElementById("wfMsg").textContent = `對了 ${sc.right}/${sc.total}（${sc.pct}%）`;
    };
  }

  function units() {
    const a = state.answers.prefixes || C.prefixes.map(() => ({}));
    layout(`
      <article class="hero">
        <h2>單位字首</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>數值</th><th>換成基本單位</th><th>英文讀法</th></tr></thead>
            <tbody>
              ${C.prefixes.map((row, i) => `
                <tr>
                  <td>${row.given}<div class="help">${row.hint}</div></td>
                  <td><input data-px="${i}.base" value="${a[i]?.base || ""}" placeholder="${row.unit}"></td>
                  <td><input data-px="${i}.say" value="${a[i]?.say || ""}" placeholder="English"></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <button class="btn btn-primary" id="gradePx">對答案</button>
        <p id="pxMsg" class="help"></p>
      </article>
    `);
    app.querySelectorAll("[data-px]").forEach((input) => {
      input.oninput = () => {
        const [i, k] = input.dataset.px.split(".");
        state.answers.prefixes = state.answers.prefixes || C.prefixes.map(() => ({}));
        state.answers.prefixes[Number(i)][k] = input.value;
        persist();
      };
    });
    document.getElementById("gradePx").onclick = () => {
      const sc = S.scorePrefixes(state.answers.prefixes || {});
      document.getElementById("pxMsg").textContent = `對了 ${sc.right}/${sc.total}`;
    };
  }

  function circuit() {
    const a = state.answers.circuits || [];
    layout(`
      <article class="hero">
        <h2>電路判讀</h2>
        ${C.circuits.map((row, i) => `
          <div class="task">
            <p>${i + 1}. ${row.q}</p>
            <div class="grid grid-2">
              ${row.options.map((op) => `
                <button class="choice ${a[i] === op ? "selected" : ""}" data-c="${i}" data-v="${op}">${op} circuit</button>
              `).join("")}
            </div>
          </div>
        `).join("")}
        <button class="btn btn-primary" id="gradeC">對答案</button>
        <p id="cMsg" class="help"></p>
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
    document.getElementById("gradeC").onclick = () => {
      const sc = S.scoreCircuits(state.answers.circuits || []);
      document.getElementById("cMsg").textContent = `${sc.right}/${sc.total}　${C.circuits.map((r) => r.zh).join("／")}`;
    };
  }

  function measure() {
    const m = state.answers.measure || { power: false, range: "off", target: "r1", topology: "series", done: [] };
    const reading = (() => {
      if (m.range === "ohm" && m.power) return "ERROR  帶電不可量 Ω";
      if (m.range === "ohm" && m.target === "r1") return "0.992 kΩ";
      if (m.range === "ohm" && m.target === "series") return "5.68 kΩ";
      if (m.range === "ohm" && m.target === "parallel") return "0.824 kΩ";
      if (m.range === "volt" && m.power && m.target === "load") return "5.01 V";
      if (m.range === "volt" && !m.power) return "0.00 V";
      return "----";
    })();
    layout(`
      <article class="hero">
        <h2>English Work Order</h2>
        <div class="lab">
          <div class="meter" aria-live="polite">
            <div class="help" style="color:#99f6e4">DIGITAL MULTIMETER</div>
            <div class="meter-screen">${reading}</div>
            <div class="knob-row">
              ${["off", "volt", "ohm"].map((r) => `<button class="seg ${m.range === r ? "on" : ""}" data-range="${r}">${r.toUpperCase()}</button>`).join("")}
            </div>
            <div class="probe-row">
              <button class="seg ${m.power ? "on" : ""}" data-power="1">Power ${m.power ? "ON" : "OFF"}</button>
              ${["r1", "load", "series", "parallel"].map((t) => `<button class="seg ${m.target === t ? "on" : ""}" data-target="${t}">${t}</button>`).join("")}
            </div>
          </div>
          <div class="grid">
            ${C.measureTasks.map((t) => `
              <div class="task">
                <strong>${t.title}</strong>
                <p>${t.en}</p>
                <p class="help">${t.zh}</p>
                <button class="btn btn-ghost" data-say="${t.en}">聽指令</button>
                <button class="btn btn-primary" data-done="${t.id}">我完成了</button>
                ${m.done?.includes(t.id) ? `<span class="badge badge-ok">已勾</span>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
        <label>Task 3 這是什麼電路？
          <select id="topo">
            <option value="series" ${m.topology === "series" ? "selected" : ""}>series circuit</option>
            <option value="parallel" ${m.topology === "parallel" ? "selected" : ""}>parallel circuit</option>
          </select>
        </label>
      </article>
    `);
    app.querySelectorAll("[data-range]").forEach((b) => b.onclick = () => { m.range = b.dataset.range; saveMeasure(m); });
    app.querySelector("[data-power]").onclick = () => { m.power = !m.power; saveMeasure(m); };
    app.querySelectorAll("[data-target]").forEach((b) => b.onclick = () => { m.target = b.dataset.target; saveMeasure(m); });
    app.querySelectorAll("[data-say]").forEach((b) => b.onclick = () => UI.speak(b.dataset.say));
    app.querySelectorAll("[data-done]").forEach((b) => b.onclick = () => {
      m.done = Array.from(new Set([...(m.done || []), b.dataset.done]));
      m.doneCount = m.done.length;
      saveMeasure(m);
      toast("已記錄此任務");
    });
    document.getElementById("topo").onchange = (e) => { m.topology = e.target.value; saveMeasure(m); };
  }

  function saveMeasure(m) {
    state.answers.measure = m;
    persist();
    measure();
  }

  function dialogue() {
    const a = state.answers.dialogue || [];
    layout(`
      <article class="hero">
        <h2>量測對話</h2>
        ${C.dialogue.map((d, i) => `
          <div class="task">
            <strong>${d.who}：${d.en}</strong>
            <button class="btn btn-ghost" data-say="${d.en}">聽</button>
            <label>中文
              <input data-d="${i}" value="${a[i] || ""}" placeholder="寫出中文">
            </label>
          </div>
        `).join("")}
        <button class="btn btn-primary" id="gradeD">對答案</button>
        <p id="dMsg" class="help"></p>
      </article>
    `);
    app.querySelectorAll("[data-say]").forEach((b) => b.onclick = () => UI.speak(b.dataset.say));
    app.querySelectorAll("[data-d]").forEach((input) => {
      input.oninput = () => {
        state.answers.dialogue = state.answers.dialogue || [];
        state.answers.dialogue[Number(input.dataset.d)] = input.value;
        persist();
      };
    });
    document.getElementById("gradeD").onclick = () => {
      let n = 0;
      C.dialogue.forEach((d, i) => {
        if ((state.answers.dialogue?.[i] || "").replace(/\s/g, "").includes(d.zh.slice(0, 4))) n += 1;
      });
      document.getElementById("dMsg").textContent = `接近正確 ${n}/${C.dialogue.length}。完整中文：${C.dialogue.map((d) => d.zh).join("／")}`;
    };
  }

  function challenge() {
    const a = state.answers.challenge || [];
    layout(`
      <article class="hero">
        <h2>沒教過，用規則猜</h2>
        ${C.challenge.map((row, i) => `
          <label>${row.en}
            <input data-ch="${i}" value="${a[i] || ""}" placeholder="中文意思">
          </label>
        `).join("")}
        <button class="btn btn-primary" id="gradeCh">看答案</button>
        <p id="chMsg" class="help"></p>
      </article>
    `);
    app.querySelectorAll("[data-ch]").forEach((input) => {
      input.oninput = () => {
        state.answers.challenge = state.answers.challenge || [];
        state.answers.challenge[Number(input.dataset.ch)] = input.value;
        persist();
      };
    });
    document.getElementById("gradeCh").onclick = () => {
      const sc = S.scoreChallenge(state.answers.challenge || []);
      document.getElementById("chMsg").textContent = `${sc.right}/${sc.total}。答案：${C.challenge.map((c) => c.zh).join("、")}`;
    };
  }

  function quiz() {
    const a = state.answers.quiz || { type1: [], type2: [], type3: [], type4: [], type5: [], type6: [] };
    const block = (key, title, render) => `
      <section class="task"><h3>${title}</h3>${C.quiz[key].map(render).join("")}</section>
    `;
    layout(`
      <article class="hero">
        <h2>綜合練習（可獨立完成）</h2>
        <p class="help">正式 PVQC 聽力改為文字／KK 音標。課堂目標 70%。</p>
        ${block("type1", "題型一　看中文拼英文", (q, i) => `<label>${i + 1}. ${q.zh}<input data-q="type1.${i}" value="${a.type1[i] || ""}"></label>`)}
        ${["type2", "type3", "type4", "type5", "type6"].map((key, idx) => block(key, ["題型二　看英文選中文", "題型三　看英文選中文", "題型四　看音標選英文", "題型五　看中文選音標", "題型六　看英文選音標"][idx], (q, i) => `
          <p>${i + 1}. ${q.stem}</p>
          <div class="grid">
            ${q.options.map((op, j) => `<label class="choice"><input type="radio" name="${key}-${i}" data-qkey="${key}" data-qidx="${i}" value="${j}" ${String(a[key]?.[i]) === String(j) ? "checked" : ""}> (${optionLetter(j)}) ${op}</label>`).join("")}
          </div>
        `)).join("")}
        <button class="btn btn-primary" id="gradeQ">送出練習並計分</button>
        <p id="qMsg" class="help"></p>
      </article>
    `);
    app.querySelectorAll("[data-q]").forEach((input) => {
      input.oninput = () => {
        const [k, i] = input.dataset.q.split(".");
        state.answers.quiz = state.answers.quiz || a;
        state.answers.quiz[k][Number(i)] = input.value;
        persist();
      };
    });
    app.querySelectorAll("input[type=radio]").forEach((input) => {
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
      ["type2", "type3", "type4", "type5", "type6"].forEach((key) => {
        C.quiz[key].forEach((_, i) => {
          const el = app.querySelector(`input[name="${key}-${i}"]:checked`);
          state.answers.quiz = state.answers.quiz || a;
          if (el) state.answers.quiz[key][i] = Number(el.value);
        });
      });
      persist();
      const sc = S.scoreQuiz(state.answers.quiz);
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
        <p>完成度 ${c.pct}%　得分 ${o.pct}%　審核：${state.review.status}</p>
        <div class="verdict ${suggest.decision === "通過" ? "pass" : suggest.decision === "需補救" ? "fail" : "warn"}">
          <strong>繳交前預檢：${suggest.decision}</strong>
          <p class="help">${suggest.reason}</p>
        </div>
        <ul class="goal-list">
          ${Object.entries(c.checks).map(([k, v]) => `<li>${v ? UI.icon("check") : UI.icon("alert")}<span>${k} ${v ? "通過" : "未完成"}</span></li>`).join("")}
        </ul>
        ${flags.length ? `<p class="help">品質標記：${flags.map((f) => f.detail).join("、")}</p>` : `<p class="help">未發現明顯異常。</p>`}
        ${ready ? "" : `<p class="error">至少要完成報到、安全過關，且地圖完成度達 60% 才能繳交。</p>`}
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <button class="btn btn-primary" id="sendNow" ${ready ? "" : "disabled"}>即時送給老師</button>
          <button class="btn btn-ghost" id="dl">下載繳交檔</button>
        </div>
        <p id="subMsg" class="help">${state.submittedAt ? `上次繳交 ${state.submittedAt}` : ""}</p>
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
      DMM_SYNC.downloadJson(`${state.profile.number || "student"}-dmm.json`, payload.student);
      toast("已下載，交給老師匯入");
    };
    document.getElementById("sendNow").onclick = async () => {
      const btn = document.getElementById("sendNow");
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
        document.getElementById("subMsg").textContent = `${err.message || err} 請改下載繳交檔。`;
        btn.disabled = false;
        btn.textContent = "即時送給老師";
      }
    };
  }

  const routes = { home, checkin, hub, safety, vocab, wordfamily, units, circuit, measure, dialogue, challenge, quiz, submit: submitView };

  function render() {
    app.onclick = null;
    document.querySelectorAll("[data-nav]").forEach((el) => {
      el.classList.toggle("active", el.dataset.nav === view || (view === "checkin" && el.dataset.nav === "hub"));
    });
    (routes[view] || home)();
  }

  document.body.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]");
    if (go) enter(go.dataset.go);
    if (e.target.closest("#saveCode")) {
      state.profile.classCode = document.getElementById("classCode").value.trim().toUpperCase();
      persist();
      toast("已記住課堂代碼");
    }
  });

  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => enter(el.dataset.nav));
  });

  render();
})();
