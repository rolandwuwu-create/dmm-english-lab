(function (global) {
  const C = () => global.DMM_CONTENT;

  function norm(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ");
  }

  function matchSpelling(input, answers) {
    const n = norm(input).replace(/\./g, "");
    return answers.some((a) => n === norm(a) || n === norm(a).replace(/\s+/g, ""));
  }

  function vocabMatches(input, item) {
    const n = norm(input);
    if (!n) return false;
    const keys = String(item.zh || "")
      .split(/[／、,，]/)
      .map((s) => norm(s).replace(/[()（）].*$/, "").trim())
      .filter((s) => s.length >= 2);
    return keys.some((k) => n === k);
  }

  function prefixOk(row, base, say) {
    const b = String(base || "").replace(/,/g, "").replace(/\s/g, "");
    const expected = String(row.base).replace(/,/g, "");
    const sayN = norm(say).replace(/-/g, " ");
    const expectSay = norm(row.say).replace(/-/g, " ");
    return b === expected && (sayN === expectSay || sayN.includes(expectSay.replace("ohms", "ohm")));
  }

  function scoreQuiz(answers) {
    const quiz = C().quiz;
    const result = {};
    let right = 0;
    let total = 0;
    result.type1 = quiz.type1.map((q, i) => {
      total += 1;
      const ok = matchSpelling(answers.type1?.[i] || "", q.answers);
      if (ok) right += 1;
      return ok;
    });
    ["type2", "type3", "type4", "type5", "type6"].forEach((key) => {
      result[key] = quiz[key].map((q, i) => {
        total += 1;
        const ok = Number(answers[key]?.[i]) === q.answer;
        if (ok) right += 1;
        return ok;
      });
    });
    return { result, right, total, pct: total ? Math.round((right / total) * 100) : 0 };
  }

  function quizAttempted(answers) {
    const quiz = C().quiz;
    let filled = 0;
    let need = 0;
    quiz.type1.forEach((_, i) => {
      need += 1;
      if (String(answers?.type1?.[i] || "").trim()) filled += 1;
    });
    ["type2", "type3", "type4", "type5", "type6"].forEach((key) => {
      quiz[key].forEach((_, i) => {
        need += 1;
        const v = answers?.[key]?.[i];
        if (v !== undefined && v !== "" && Number(v) >= 0) filled += 1;
      });
    });
    return filled >= Math.ceil(need * 0.5);
  }

  function scoreWordFamily(answers) {
    const rows = C().wordFamily;
    let right = 0;
    let total = 0;
    rows.forEach((row, i) => {
      ["or", "ance", "ive"].forEach((k) => {
        if (row.given.includes(k)) return;
        total += 1;
        if (norm(answers?.[i]?.[k]) === norm(row[k])) right += 1;
      });
    });
    return { right, total, pct: total ? Math.round((right / total) * 100) : 0 };
  }

  function scorePrefixes(answers) {
    const rows = C().prefixes;
    let right = 0;
    rows.forEach((row, i) => {
      if (prefixOk(row, answers?.[i]?.base, answers?.[i]?.say)) right += 1;
    });
    return { right, total: rows.length, pct: Math.round((right / rows.length) * 100) };
  }

  function scoreCircuits(answers) {
    const rows = C().circuits;
    let right = 0;
    rows.forEach((row, i) => {
      if (answers?.[i] === row.answer) right += 1;
    });
    return { right, total: rows.length, pct: Math.round((right / rows.length) * 100) };
  }

  function scoreChallenge(answers) {
    const rows = C().challenge;
    let right = 0;
    rows.forEach((row, i) => {
      if ((answers?.[i] || "").includes(row.zh.replace("器", ""))) right += 1;
    });
    return { right, total: rows.length, pct: Math.round((right / rows.length) * 100) };
  }

  function scoreSafety(answers) {
    const rows = C().safetyQuiz;
    let right = 0;
    rows.forEach((row, i) => {
      if (Number(answers?.[i]) === row.answer) right += 1;
    });
    return { right, total: rows.length, pct: Math.round((right / rows.length) * 100) };
  }

  function scoreVocab(answers) {
    const core = C().vocab.filter((v) => v.core);
    let right = 0;
    core.forEach((v) => {
      if (vocabMatches(answers?.[v.id], v)) right += 1;
    });
    return { right, total: core.length, pct: Math.round((right / core.length) * 100) };
  }

  function hasAny(val) {
    if (val == null) return false;
    if (typeof val === "string") return val.trim().length > 0;
    if (typeof val === "number") return Number.isFinite(val) && val >= 0;
    if (Array.isArray(val)) return val.some(hasAny);
    if (typeof val === "object") return Object.values(val).some(hasAny);
    return Boolean(val);
  }

  function learningMs(state) {
    const skip = new Set(["home", "checkin", "hub", "submit"]);
    return Object.entries(state.moduleTimes || {}).reduce((sum, [mod, ms]) => (
      skip.has(mod) ? sum : sum + Number(ms || 0)
    ), 0);
  }

  function qualityFlags(state) {
    const flags = [];
    const quiz = scoreQuiz(state.answers?.quiz || {});
    const safety = scoreSafety(state.answers?.safetyQuiz || {});
    const learned = learningMs(state);
    if (state.submittedAt && learned > 0 && learned < 60000 && quiz.pct >= 80) {
      flags.push({ code: "too_fast", detail: "學習模組不到 1 分鐘但綜合練習偏高" });
    }
    if (quizAttempted(state.answers?.quiz) && quiz.pct < 50) {
      flags.push({ code: "low_quiz", detail: `綜合練習 ${quiz.pct}%` });
    }
    if (safety.pct < 100) flags.push({ code: "safety", detail: "安全題未全對" });
    if (!state.profile?.name || !state.profile?.number) flags.push({ code: "identity", detail: "姓名或學號未填" });
    const viewedCore = C().vocab.filter((v) => v.core && state.viewed?.vocab?.[v.id]).length;
    if (viewedCore < 12) flags.push({ code: "vocab_thin", detail: `核心詞只看過 ${viewedCore}/18` });
    const m = state.answers?.measure || {};
    if (m.range === "ohm" && m.power) flags.push({ code: "live_ohm", detail: "通電時使用歐姆檔" });
    return flags;
  }

  function completion(state) {
    const checks = {
      checkin: Boolean(state.profile?.name && state.profile?.number && state.profile?.klass),
      safety: scoreSafety(state.answers?.safetyQuiz || {}).pct === 100,
      vocab: Object.keys(state.viewed?.vocab || {}).length >= 12,
      wordfamily: scoreWordFamily(state.answers?.wordFamily || {}).total > 0 && scoreWordFamily(state.answers?.wordFamily || {}).pct >= 50,
      units: scorePrefixes(state.answers?.prefixes || {}).pct >= 40,
      circuit: scoreCircuits(state.answers?.circuits || {}).pct >= 60,
      measure: Boolean(state.answers?.measure?.doneCount >= 2),
      quiz: quizAttempted(state.answers?.quiz)
    };
    const done = Object.values(checks).filter(Boolean).length;
    const total = Object.keys(checks).length;
    return { checks, done, total, pct: Math.round((done / total) * 100) };
  }

  function overall(state) {
    const a = state.answers || {};
    const parts = [];
    if (hasAny(a.safetyQuiz)) parts.push(scoreSafety(a.safetyQuiz));
    if (hasAny(a.vocabZh)) parts.push(scoreVocab(a.vocabZh));
    if (hasAny(a.wordFamily)) parts.push(scoreWordFamily(a.wordFamily));
    if (hasAny(a.prefixes)) parts.push(scorePrefixes(a.prefixes));
    if (hasAny(a.circuits)) parts.push(scoreCircuits(a.circuits));
    if (quizAttempted(a.quiz)) parts.push(scoreQuiz(a.quiz));
    if (hasAny(a.challenge)) parts.push(scoreChallenge(a.challenge));
    const right = parts.reduce((s, p) => s + p.right, 0);
    const total = parts.reduce((s, p) => s + p.total, 0);
    return { right, total, pct: total ? Math.round((right / total) * 100) : 0 };
  }

  function canSubmit(state) {
    const c = completion(state);
    return c.checks.checkin && c.checks.safety && c.pct >= 60;
  }

  function answerSheet(state) {
    const quiz = C().quiz;
    const answers = state.answers?.quiz || {};
    const items = [];
    quiz.type1.forEach((q, i) => {
      const given = answers.type1?.[i] || "";
      items.push({
        type: "題型一",
        stem: q.zh,
        given,
        expected: q.answers[0],
        ok: matchSpelling(given, q.answers)
      });
    });
    ["type2", "type3", "type4", "type5", "type6"].forEach((key, idx) => {
      const label = ["題型二", "題型三", "題型四", "題型五", "題型六"][idx];
      quiz[key].forEach((q, i) => {
        const givenIdx = answers[key]?.[i];
        items.push({
          type: label,
          stem: q.stem,
          given: givenIdx === undefined || givenIdx === "" ? "未作" : q.options[givenIdx],
          expected: q.options[q.answer],
          ok: Number(givenIdx) === q.answer
        });
      });
    });
    return items;
  }

  function reviewSuggest(state) {
    const flags = qualityFlags(state);
    const o = overall(state);
    const quiz = scoreQuiz(state.answers?.quiz || {});
    const safety = scoreSafety(state.answers?.safetyQuiz || {});
    const blocking = flags.filter((f) => ["safety", "identity", "live_ohm"].includes(f.code));
    let decision = "通過";
    let reason = "達課堂目標，且無阻擋標記。";
    if (blocking.length) {
      decision = "需補救";
      reason = blocking.map((f) => f.detail).join("；");
    } else if (!quizAttempted(state.answers?.quiz) || o.pct < 70 || quiz.pct < 70) {
      decision = "需補救";
      reason = `得分 ${o.pct}%／綜合練習 ${quiz.pct}%，未達 70%。`;
    } else if (flags.some((f) => f.code === "too_fast" || f.code === "vocab_thin" || f.code === "low_quiz")) {
      decision = "已面談";
      reason = "分數接近目標，但有異常標記，建議快速確認是否自己作答。";
    }
    return { decision, reason, blocking: blocking.length > 0, flags, overall: o, quiz, safety };
  }

  global.DMM_SCORE = {
    norm, matchSpelling, vocabMatches, prefixOk, scoreQuiz, quizAttempted,
    scoreWordFamily, scorePrefixes, scoreCircuits, scoreChallenge, scoreSafety,
    scoreVocab, qualityFlags, completion, overall, canSubmit, answerSheet, reviewSuggest
  };
})(window);
