(function () {
  const C = DMM_CONTENT;
  const S = DMM_SCORE;
  const out = [];
  let groupName = "內容";

  function group(name) { groupName = name; }

  function assert(name, cond, detail) {
    out.push({ group: groupName, name, ok: Boolean(cond), detail: cond ? "" : String(detail || "條件不成立") });
  }

  function perfectQuiz() {
    return {
      type1: C.quiz.type1.map((q) => q.answers[0]),
      type2: C.quiz.type2.map((q) => q.answer),
      type3: C.quiz.type3.map((q) => q.answer),
      type4: C.quiz.type4.map((q) => q.answer),
      type5: C.quiz.type5.map((q) => q.answer),
      type6: C.quiz.type6.map((q) => q.answer)
    };
  }

  function readyStudent() {
    const ready = DMM_STORE.blankStudent();
    ready.profile = { klass: "資一甲", number: "01", name: "測試", group: "A", classCode: "ABC123" };
    ready.answers.safetyQuiz = C.safetyQuiz.map((q) => q.answer);
    ready.viewed.vocab = Object.fromEntries(C.vocab.filter((v) => v.core).map((v) => [v.id, true]));
    ready.answers.vocabZh = Object.fromEntries(C.vocab.filter((v) => v.core).map((v) => [v.id, v.zh.split("／")[0].split("、")[0]]));
    ready.answers.wordFamily = C.wordFamily.map((r) => ({ or: r.or, ance: r.ance, ive: r.ive }));
    ready.answers.prefixes = C.prefixes.map((r) => ({ base: r.base, say: r.say }));
    ready.answers.circuits = C.circuits.map((r) => r.answer);
    ready.answers.measure = { doneCount: 3, power: false, range: "ohm" };
    ready.answers.quiz = perfectQuiz();
    ready.answers.challenge = C.challenge.map((c) => c.zh);
    ready.moduleTimes = { safety: 120000, vocab: 180000, quiz: 240000, measure: 90000 };
    return ready;
  }

  group("教案內容");
  assert("36 個詞彙", C.vocab.length === 36, C.vocab.length);
  assert("18 個核心詞", C.vocab.filter((v) => v.core).length === 18);
  assert("詞彙 id 不重複", new Set(C.vocab.map((v) => v.id)).size === C.vocab.length);
  assert("每個詞都有英文、中文、音標", C.vocab.every((v) => v.en && v.zh && v.kk && v.id));
  assert("音標沒有 OCR 殘字 W", C.vocab.every((v) => !/[W]/.test(v.kk)));
  assert("教師署名正確", C.meta.teacher === "吳東儒" && C.meta.school.includes("中正"));
  assert("安全口令 4 則", C.safety.length === 4);
  assert("安全過關 3 題", C.safetyQuiz.length === 3);
  assert("構詞 4 列", C.wordFamily.length === 4);
  assert("單位 5 題", C.prefixes.length === 5);
  assert("電路 3 題", C.circuits.length === 3);
  assert("量測任務 3 項", C.measureTasks.length === 3);
  assert("題型數量 8/6/5/5/4/4", [
    C.quiz.type1.length, C.quiz.type2.length, C.quiz.type3.length,
    C.quiz.type4.length, C.quiz.type5.length, C.quiz.type6.length
  ].join("/") === "8/6/5/5/4/4");
  ["type2", "type3", "type4", "type5", "type6"].forEach((key) => {
    assert(`${key} 答案都在選項範圍內`, C.quiz[key].every((q) => q.answer >= 0 && q.answer < q.options.length));
  });
  assert("題型二答案 BABBBA", C.quiz.type2.map((q) => q.answer).join(",") === "1,0,1,1,1,0");
  assert("題型三答案 BDBBA", C.quiz.type3.map((q) => q.answer).join(",") === "1,3,1,1,0");
  assert("題型四答案 ABABD", C.quiz.type4.map((q) => q.answer).join(",") === "0,1,0,1,3");
  assert("題型五答案 ABBB", C.quiz.type5.map((q) => q.answer).join(",") === "0,1,1,1");
  assert("題型六答案 AABC", C.quiz.type6.map((q) => q.answer).join(",") === "0,0,1,2");
  assert("量電阻任務要求關電", C.measureTasks[0].expect.power === false && C.measureTasks[0].expect.range === "ohm");

  group("計分正確性");
  assert("拼寫忽略大小寫", S.matchSpelling("BREADBOARD", ["breadboard"]));
  assert("三用電表接受 DMM", S.matchSpelling("DMM", C.quiz.type1[0].answers));
  assert("核心詞接受斜線後的中文", S.vocabMatches("數位三用電表", C.vocab[0]));
  assert("1 kΩ 換算", S.prefixOk(C.prefixes[0], "1000", "one kilo-ohm"));
  assert("2.2 MΩ 換算", S.prefixOk(C.prefixes[1], "2,200,000", "two point two megaohms"));
  assert("滿分卷為 100%", S.scoreQuiz(perfectQuiz()).pct === 100);
  const blankQuiz = { type1: [], type2: [], type3: [], type4: [], type5: [], type6: [] };
  assert("空白綜合練習不是 100%", S.scoreQuiz(blankQuiz).pct === 0);
  assert("空白綜合練習未作答", S.quizAttempted(blankQuiz) === false);
  const empty = DMM_STORE.blankStudent();
  assert("空白卷不可繳交", S.canSubmit(empty) === false);
  assert("空白卷綜合練習未完成", S.completion(empty).checks.quiz === false);
  const ready = readyStudent();
  assert("完整卷可繳交", S.canSubmit(ready) === true);
  assert("完整卷完成度 100%", S.completion(ready).pct === 100);
  assert("完整卷得分 100%", S.overall(ready).pct === 100);
  assert("完整卷建議通過", S.reviewSuggest(ready).decision === "通過");

  const noSafety = readyStudent();
  noSafety.answers.safetyQuiz = [1, 0, 0];
  assert("安全未過不可繳交", S.canSubmit(noSafety) === false);
  assert("安全未過建議補救", S.reviewSuggest(noSafety).decision === "需補救");

  const liveOhm = readyStudent();
  liveOhm.answers.measure = { doneCount: 3, power: true, range: "ohm" };
  assert("通電量歐姆會標記", S.qualityFlags(liveOhm).some((f) => f.code === "live_ohm"));
  assert("通電量歐姆建議補救", S.reviewSuggest(liveOhm).decision === "需補救");

  const thin = readyStudent();
  thin.viewed.vocab = { probe: true };
  assert("核心詞看得太少會標記", S.qualityFlags(thin).some((f) => f.code === "vocab_thin"));

  const sheet = S.answerSheet(ready);
  assert("對答案表涵蓋全部綜合題", sheet.length === 32);
  assert("滿分卷對答案全對", sheet.every((item) => item.ok));

  group("頁面結構");
  async function pageTests() {
    if (location.protocol === "file:") {
      assert("請用本機或網站伺服器開啟（file:// 無法審核頁面）", false, location.href);
      return;
    }
    const files = ["index.html", "teacher.html", "qa.html", "css/app.css", "js/app.js", "js/teacher.js"];
    const texts = {};
    for (const file of files) {
      const res = await fetch(file);
      texts[file] = await res.text();
      assert(`讀得到 ${file}`, res.ok, res.status);
    }
    const student = new DOMParser().parseFromString(texts["index.html"], "text/html");
    const teacher = new DOMParser().parseFromString(texts["teacher.html"], "text/html");
    assert("學生頁語言 zh-Hant", student.documentElement.lang === "zh-Hant");
    assert("學生頁有 viewport", Boolean(student.querySelector("meta[name=viewport]")));
    assert("學生頁有 #app", Boolean(student.getElementById("app")));
    assert("底部導覽 5 鍵", student.querySelectorAll("[data-nav]").length === 5);
    assert("學生頁不含教師 PIN", !texts["index.html"].includes("ccvs114"));
    assert("學生頁載入 PeerJS 與計分", texts["index.html"].includes("peerjs") && texts["index.html"].includes("score.js"));
    assert("教師頁連到品質檢查", texts["teacher.html"].includes("qa.html"));
    assert("教師腳本含審核狀態與系統建議", texts["js/teacher.js"].includes("需補救") && texts["js/teacher.js"].includes("reviewSuggest"));
    assert("觸控目標至少 44px", texts["css/app.css"].includes("min-height: 44px") || texts["css/app.css"].includes("min-height:44px"));
    assert("主色為工科藍", /--color-primary:\s*#1e4e8c/i.test(texts["css/app.css"]));
    assert("選擇題用 data-qkey 記錄", texts["js/app.js"].includes("data-qkey"));
    assert("教師台在 render 內才抓列表", /function render\(\)[\s\S]*getElementById\("list"\)/.test(texts["js/teacher.js"]));
  }

  function render() {
    const failed = out.filter((x) => !x.ok);
    const grouped = {};
    out.forEach((x) => {
      grouped[x.group] = grouped[x.group] || [];
      grouped[x.group].push(x);
    });
    const root = document.getElementById("results");
    const gateClass = failed.length ? "fail" : "pass";
    root.innerHTML = `
      <article class="qa-banner ${gateClass}">
        <div class="kicker">上架品質閘門</div>
        <h2>${failed.length ? "未通過，請先修好再給學生用" : "品質閘門通過，可以上課堂"}</h2>
        <p>${out.filter((x) => x.ok).length}/${out.length} 項自動檢查通過${failed.length ? `，失敗 ${failed.length} 項` : ""}。</p>
      </article>
      ${Object.entries(grouped).map(([name, items]) => `
        <section class="hero qa-group">
          <h3>${name}　${items.filter((x) => x.ok).length}/${items.length}</h3>
          <ul class="goal-list">
            ${items.map((x) => `
              <li>
                <span class="badge ${x.ok ? "badge-ok" : "badge-bad"}">${x.ok ? "PASS" : "FAIL"}</span>
                <span>${x.name}${x.ok ? "" : `　${x.detail}`}</span>
              </li>
            `).join("")}
          </ul>
        </section>
      `).join("")}
      <section class="hero">
        <h3>課堂使用前再看一眼</h3>
        <ul>
          <li>手機 375px：報到欄位與按鈕可點、無左右滑動</li>
          <li>教師台：錯誤 PIN 進不去；正確 PIN 可開課、匯入 JSON、標記通過／需補救</li>
          <li>學生繳交：未報到或安全未過時按鈕應停用</li>
          <li>聽發音：Chrome／Edge 可讀英文詞</li>
        </ul>
        <p class="help">自動閘門只保證內容與計分。版面與即時連線仍需用真實瀏覽器點過。</p>
        <p><a class="btn btn-ghost" href="teacher.html">回審核台</a> <a class="btn btn-ghost" href="index.html">學生課堂</a></p>
      </section>
    `;
    document.title = failed.length ? `品質檢查失敗 ${failed.length}` : "品質檢查通過";
    window.DMM_QA = { passed: failed.length === 0, failed: failed.length, total: out.length, results: out };
  }

  pageTests()
    .catch((err) => assert("頁面結構檢查發生錯誤", false, err.message))
    .finally(render);
})();
