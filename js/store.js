(function (global) {
  const KEY = "dmm-lab-student-v1";
  const TEACHER_KEY = "dmm-lab-teacher-v1";

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

  function loadStudent() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blankStudent();
      return { ...blankStudent(), ...JSON.parse(raw) };
    } catch {
      return blankStudent();
    }
  }

  function saveStudent(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    return state;
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
