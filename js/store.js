(function (global) {
  const KEY = "dmm-lab-student-v1";
  const TEACHER_KEY = "dmm-lab-teacher-v1";
  const CLASS_KEY = "dmm-lab-class-code";

  function uid() {
    return crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function blankStudent() {
    return {
      id: uid(),
      createdAt: new Date().toISOString(),
      profile: { klass: "", number: "", name: "", group: "", classCode: "" },
      moduleTimes: {},
      viewed: {},
      answers: {},
      scores: {},
      flags: [],
      review: { status: "未繳交", note: "", at: "" },
      submittedAt: "",
      submitChannel: ""
    };
  }

  function rememberedClassCode() {
    try {
      return String(localStorage.getItem(CLASS_KEY) || "").trim().toUpperCase();
    } catch {
      return "";
    }
  }

  function rememberClassCode(code) {
    const v = String(code || "").trim().toUpperCase();
    if (!v) return;
    try {
      localStorage.setItem(CLASS_KEY, v);
    } catch {
      /* quota or private mode */
    }
  }

  function mergeStudent(saved) {
    const blank = blankStudent();
    const src = saved && typeof saved === "object" ? saved : {};
    return {
      ...blank,
      ...src,
      profile: { ...blank.profile, ...(src.profile || {}) },
      moduleTimes: { ...blank.moduleTimes, ...(src.moduleTimes || {}) },
      viewed: { ...blank.viewed, ...(src.viewed || {}) },
      answers: { ...blank.answers, ...(src.answers || {}) },
      scores: { ...blank.scores, ...(src.scores || {}) },
      flags: Array.isArray(src.flags) ? src.flags : [],
      review: { ...blank.review, ...(src.review || {}) }
    };
  }

  function loadStudent() {
    try {
      const raw = localStorage.getItem(KEY);
      const state = raw ? mergeStudent(JSON.parse(raw)) : blankStudent();
      if (!state.profile.classCode) {
        const remembered = rememberedClassCode();
        if (remembered) state.profile.classCode = remembered;
      } else {
        rememberClassCode(state.profile.classCode);
      }
      return state;
    } catch {
      return blankStudent();
    }
  }

  function saveStudent(state) {
    try {
      if (state?.profile?.classCode) rememberClassCode(state.profile.classCode);
      state.lastSavedAt = new Date().toISOString();
      localStorage.setItem(KEY, JSON.stringify(state));
      return state;
    } catch (err) {
      const e = new Error("瀏覽器無法儲存進度，請檢查是否關閉了網站資料。");
      e.cause = err;
      throw e;
    }
  }

  function loadTeacher() {
    try {
      return JSON.parse(localStorage.getItem(TEACHER_KEY) || "null") || {
        classCode: "",
        pinOk: false,
        submissions: {},
        reviews: {}
      };
    } catch {
      return { classCode: "", pinOk: false, submissions: {}, reviews: {} };
    }
  }

  function saveTeacher(state) {
    localStorage.setItem(TEACHER_KEY, JSON.stringify(state));
    return state;
  }

  global.DMM_STORE = { uid, blankStudent, loadStudent, saveStudent, loadTeacher, saveTeacher };
})(window);
