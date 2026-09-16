window.DMM_CONTENT = {
  meta: {
    school: "高雄市立中正高級工業職業學校",
    dept: "資訊科",
    teacher: "吳東儒",
    unitZh: "三用電表與基本電性量測",
    unitEn: "Multimeters and Basic Electrical Measurements",
    source: "基本電學實習 · 專業英文（PVQC 電機與電子類）",
    minutes: 100,
    coreCount: 18,
    totalCount: 36,
    passMark: 70,
    version: "2026.09.16.1"
  },
  goals: [
    "聽懂並依英文工作單完成電阻與電壓量測",
    "熟練 18 個必學核心詞，能辨識其餘 18 個進階詞",
    "用構詞規則猜 voltmeter、transformer、semiconductor",
    "完成紙本化 PVQC 六大題型，課堂目標 70%"
  ],
  safety: [
    {
      id: "s1",
      en: "Turn off the power supply before you change the wiring.",
      zh: "更改接線前，先關閉電源供應器。",
      why: "帶電改接線可能造成短路、元件燒毀或觸電。"
    },
    {
      id: "s2",
      en: "Connect the black lead to COM and the red lead to VΩ.",
      zh: "黑表筆接 COM，紅表筆接 VΩ。",
      why: "插錯孔會量到錯誤檔位；紅表筆誤插 10 A 孔再量電壓，可能熔斷電表保險絲。"
    },
    {
      id: "s3",
      en: "Never measure resistance on a live circuit.",
      zh: "絕不要在通電的電路上量電阻。",
      why: "歐姆檔會從表內送出測試電流，遇到外加電壓會燒表或熔斷保險絲。"
    },
    {
      id: "s4",
      en: "Do not touch the terminals.",
      zh: "量測時不要用手碰端子或裸露導體。",
      why: "端子可能帶電；人體電阻也會讓讀值失真。"
    }
  ],
  vocab: [
    { id: "multimeter", en: "multimeter / digital multimeter (DMM)", kk: "[ˋmʌltɪ͵mitɚ] / [ˋdɪdʒɪtl ˋmʌltɪ͵mitɚ]", zh: "三用電表／數位三用電表", cat: "instruments", core: true },
    { id: "analog", en: "analog multimeter", kk: "[ˋænəlɔg]", zh: "指針式三用電表", cat: "instruments", core: false },
    { id: "probe", en: "probe", kk: "[prob]", zh: "探棒", cat: "instruments", core: true },
    { id: "testlead", en: "test lead", kk: "[tɛst lid]", zh: "測試線、表筆", cat: "instruments", core: false },
    { id: "alligator", en: "alligator clip", kk: "[ˋælə͵getɚ klɪp]", zh: "鱷魚夾", cat: "instruments", core: false },
    { id: "terminal", en: "terminal", kk: "[ˋtɝmənl]", zh: "端子、接線端", cat: "instruments", core: true },
    { id: "breadboard", en: "breadboard", kk: "[ˋbrɛd͵bord]", zh: "麵包板", cat: "instruments", core: true },
    { id: "dcpower", en: "DC power supply", kk: "[di si ˋpaʊɚ səˋplaɪ]", zh: "直流電源供應器、直流電源", cat: "instruments", core: true },
    { id: "jumper", en: "jumper wire", kk: "[ˋdʒʌmpɚ waɪr]", zh: "跳線", cat: "instruments", core: false },
    { id: "voltage", en: "voltage", kk: "[ˋvoltɪdʒ]", zh: "電壓", cat: "quantities", core: true },
    { id: "volt", en: "volt (V)", kk: "[volt]", zh: "伏特（電壓單位）、伏特", cat: "quantities", core: true },
    { id: "current", en: "current", kk: "[ˋkɝənt]", zh: "電流", cat: "quantities", core: true },
    { id: "ampere", en: "ampere / amp (A)", kk: "[ˋæmpɪr]", zh: "安培（電流單位）、安培", cat: "quantities", core: true },
    { id: "resistance", en: "resistance", kk: "[rɪˋzɪstəns]", zh: "電阻", cat: "quantities", core: true },
    { id: "ohm", en: "ohm (Ω)", kk: "[om]", zh: "歐姆（電阻單位）、歐姆", cat: "quantities", core: true },
    { id: "power", en: "power", kk: "[ˋpaʊɚ]", zh: "功率", cat: "quantities", core: false },
    { id: "watt", en: "watt (W)", kk: "[wɑt]", zh: "瓦特（功率單位）、瓦特", cat: "quantities", core: false },
    { id: "reading", en: "reading", kk: "[ˋridɪŋ]", zh: "讀值、量測值、讀數", cat: "quantities", core: true },
    { id: "resistor", en: "resistor", kk: "[rɪˋzɪstɚ]", zh: "電阻器", cat: "components", core: true },
    { id: "capacitor", en: "capacitor", kk: "[kəˋpæsətɚ]", zh: "電容器", cat: "components", core: true },
    { id: "inductor", en: "inductor", kk: "[ɪnˋdʌktɚ]", zh: "電感器", cat: "components", core: false },
    { id: "diode", en: "diode", kk: "[ˋdaɪod]", zh: "二極體", cat: "components", core: true },
    { id: "led", en: "LED (light-emitting diode)", kk: "[laɪt ɪˋmɪtɪŋ ˋdaɪod]", zh: "發光二極體", cat: "components", core: false },
    { id: "switch", en: "switch", kk: "[swɪtʃ]", zh: "開關", cat: "components", core: false },
    { id: "fuse", en: "fuse", kk: "[fjuz]", zh: "保險絲、熔絲", cat: "components", core: false },
    { id: "pot", en: "potentiometer", kk: "[pə͵tɛnʃɪˋɑmətɚ]", zh: "可變電阻器、電位器", cat: "components", core: false },
    { id: "colorband", en: "color band", kk: "[ˋkʌlɚ bænd]", zh: "色環、色碼", cat: "components", core: false },
    { id: "series", en: "series circuit", kk: "[ˋsɪriz ˋsɝkɪt]", zh: "串聯電路、串聯", cat: "circuits", core: true },
    { id: "parallel", en: "parallel circuit", kk: "[ˋpærə͵lɛl ˋsɝkɪt]", zh: "並聯電路、並聯", cat: "circuits", core: true },
    { id: "short", en: "short circuit", kk: "[ʃɔrt ˋsɝkɪt]", zh: "短路", cat: "circuits", core: true },
    { id: "open", en: "open circuit", kk: "[ˋopən ˋsɝkɪt]", zh: "斷路、開路", cat: "circuits", core: false },
    { id: "ground", en: "ground", kk: "[graʊnd]", zh: "接地、地線", cat: "circuits", core: false },
    { id: "load", en: "load", kk: "[lod]", zh: "負載", cat: "circuits", core: false },
    { id: "polarity", en: "polarity", kk: "[poˋlærətɪ]", zh: "極性", cat: "circuits", core: false },
    { id: "continuity", en: "continuity", kk: "[͵kɑntəˋnjuətɪ]", zh: "導通（測試）、導通測試", cat: "circuits", core: false },
    { id: "schematic", en: "schematic", kk: "[skiˋmætɪk]", zh: "電路圖", cat: "circuits", core: false }
  ],
  categories: {
    instruments: "量測儀器 Instruments",
    quantities: "電性量與單位 Quantities & Units",
    components: "電子元件 Components",
    circuits: "電路與連接 Circuits"
  },
  sentences: [
    { en: "Set the multimeter to the ohm range.", zh: "把三用電表轉到歐姆檔。" },
    { en: "Connect the probes across the resistor.", zh: "把探棒跨接在電阻兩端。" },
    { en: "What is the resistance of R1?", zh: "R1 的電阻是多少？" },
    { en: "The reading is 4.7 kilo-ohms.", zh: "讀值是 4.7 千歐姆。" },
    { en: "Is this a series circuit or a parallel circuit?", zh: "這是串聯電路還是並聯電路？" },
    { en: "Turn off the power supply before you change the wiring.", zh: "更改接線前先關閉電源供應器。" }
  ],
  wordFamily: [
    { root: "resist", zh: "抵抗", or: "resistor", ance: "resistance", ive: "resistive", given: ["or", "ance"] },
    { root: "induct-", zh: "感應", or: "inductor", ance: "inductance", ive: "inductive", given: ["ance"] },
    { root: "capacit-", zh: "容量", or: "capacitor", ance: "capacitance", ive: "capacitive", given: ["ive"] },
    { root: "conduct", zh: "傳導", or: "conductor", ance: "conductance", ive: "conductive", given: [] }
  ],
  prefixes: [
    { given: "1 kΩ", base: "1000", unit: "Ω", say: "one kilo-ohm", hint: "kilo- 是 ×10³" },
    { given: "2.2 MΩ", base: "2200000", unit: "Ω", say: "two point two megaohms", hint: "mega- 是 ×10⁶" },
    { given: "15 mA", base: "0.015", unit: "A", say: "fifteen milliamps", hint: "milli- 是 ×10⁻³" },
    { given: "100 μF", base: "0.0001", unit: "F", say: "one hundred microfarads", hint: "micro- 是 ×10⁻⁶" },
    { given: "5 kW", base: "5000", unit: "W", say: "five kilowatts", hint: "kilo- 是 ×10³" }
  ],
  circuits: [
    { q: "The components are connected end to end.", options: ["series", "parallel"], answer: "series", zh: "頭尾相接 → 串聯" },
    { q: "The components share the same two nodes.", options: ["series", "parallel"], answer: "parallel", zh: "接到同一對節點 → 並聯" },
    { q: "The multimeter shows approximately 0 ohms between two points that should not be connected.", options: ["short", "open"], answer: "short", zh: "不該接通卻接近 0 Ω → 短路" }
  ],
  dialogue: [
    { who: "A", en: "What is the resistance of R1?", zh: "R1 的電阻是多少？" },
    { who: "B", en: "It is 4.7 kilo-ohms.", zh: "它是 4.7 千歐姆。" },
    { who: "A", en: "Please measure it and check the reading.", zh: "請量測並確認讀值。" },
    { who: "B", en: "The reading is 4.68 kilo-ohms. It is OK.", zh: "讀值是 4.68 千歐姆，結果正常。" }
  ],
  challenge: [
    { en: "voltmeter", zh: "電壓表" },
    { en: "transformer", zh: "變壓器" },
    { en: "semiconductor", zh: "半導體" }
  ],
  quiz: {
    type1: [
      { zh: "三用電表", answers: ["multimeter", "digital multimeter", "dmm", "multi meter", "digital multi meter"] },
      { zh: "電阻器", answers: ["resistor"] },
      { zh: "電容器", answers: ["capacitor"] },
      { zh: "探棒", answers: ["probe", "probes", "test probe"] },
      { zh: "電壓", answers: ["voltage"] },
      { zh: "電流", answers: ["current"] },
      { zh: "串聯電路", answers: ["series circuit", "series"] },
      { zh: "麵包板", answers: ["breadboard", "bread board"] }
    ],
    type2: [
      { stem: "inductor", options: ["電容器", "電感器", "電阻器", "二極體"], answer: 1 },
      { stem: "terminal", options: ["端子", "探棒", "負載", "極性"], answer: 0 },
      { stem: "continuity", options: ["連續劇", "導通測試", "接地", "短路"], answer: 1 },
      { stem: "DC power supply", options: ["交流電源", "直流電源供應器", "變壓器", "保險絲"], answer: 1 },
      { stem: "schematic", options: ["配線表", "電路圖", "規格表", "流程圖"], answer: 1 },
      { stem: "polarity", options: ["極性", "功率", "電位", "阻抗"], answer: 0 }
    ],
    type3: [
      { stem: "voltage", options: ["電阻", "電壓", "電流", "功率"], answer: 1 },
      { stem: "test lead", options: ["探棒", "跳線", "鱷魚夾", "測試線"], answer: 3 },
      { stem: "parallel circuit", options: ["串聯電路", "並聯電路", "短路", "斷路"], answer: 1 },
      { stem: "fuse", options: ["可變電阻器", "保險絲", "開關", "發光二極體"], answer: 1 },
      { stem: "ground", options: ["接地", "負載", "端子", "色環"], answer: 0 }
    ],
    type4: [
      { stem: "[volt]", options: ["volt", "watt", "vault", "bolt"], answer: 0 },
      { stem: "[æmp]", options: ["ohm", "amp", "arm", "home"], answer: 1 },
      { stem: "[ˋdaɪod]", options: ["diode", "triode", "dial", "dryad"], answer: 0 },
      { stem: "[ˋsɪriəs]", options: ["series", "serious", "serial", "cereal"], answer: 1 },
      { stem: "[kəˋpæsətəns]", options: ["capacitor", "capacity", "capacitive", "capacitance"], answer: 3 }
    ],
    type5: [
      { stem: "電容器", options: ["[kəˋpæsətɚ]", "[ˋkæpəsɪtɪ]", "[kəˋpæsətɪv]"], answer: 0 },
      { stem: "三用電表", options: ["[ˋmʌltɪplaɪ]", "[ˋmʌltɪ͵mitɚ]", "[ˋmɑnətɚ]"], answer: 1 },
      { stem: "電阻", options: ["[rɪˋzɪstɚ]", "[rɪˋzɪstəns]", "[rɪˋzɪstɪv]"], answer: 1 },
      { stem: "二極體", options: ["[ˋdaɪəl]", "[ˋdaɪod]", "[ˋtraɪod]"], answer: 1 }
    ],
    type6: [
      { stem: "potentiometer", options: ["[pə͵tɛnʃɪˋɑmətɚ]", "[poˋtɛnʃəl]", "[pə͵tɛnʃɪˋɑmɪtrɪ]"], answer: 0 },
      { stem: "breadboard", options: ["[ˋbrɛd͵bord]", "[ˋbrɪd͵bord]", "[ˋbrɛk͵bord]"], answer: 0 },
      { stem: "parallel circuit", options: ["[pəˋrɛl ˋsɝkɪt]", "[ˋpærə͵lɛl ˋsɝkɪt]", "[ˋpærə͵lɛl ˋsɝkjut]"], answer: 1 },
      { stem: "ampere", options: ["[æmˋpɪr]", "[ˋæmpɚ]", "[ˋæmpɪr]"], answer: 2 }
    ]
  },
  measureTasks: [
    {
      id: "t1",
      title: "Task 1 Resistance",
      en: "Make sure the power is off. Set the multimeter to the ohm range. Connect the probes across the resistor. Read the value.",
      zh: "先確認電源關閉，轉到歐姆檔，跨接電阻後讀值。",
      expect: { power: false, range: "ohm", target: "r1" }
    },
    {
      id: "t2",
      title: "Task 2 Voltage",
      en: "Set the DC power supply to 5 volts. Measure the voltage across the load.",
      zh: "電源設 5 伏特，量負載兩端電壓。",
      expect: { power: true, range: "volt", target: "load" }
    },
    {
      id: "t3",
      title: "Task 3 Series or Parallel",
      en: "Build the circuit on the breadboard. Is this a series circuit or a parallel circuit?",
      zh: "在麵包板上接好電路，判斷串聯或並聯。",
      expect: { topology: "series" }
    }
  ],
  safetyQuiz: [
    { q: "量電阻（歐姆檔）前，正確程序是？", options: ["先關閉電源供應器，並確認電路沒有外加電壓", "先把電源調到 5 V，讀值會比較穩定", "先轉到電流檔，確認有電流再量電阻"], answer: 0 },
    { q: "量電壓或電阻時，紅表筆應插入哪一個孔？", options: ["COM（公共端）", "VΩ（電壓／歐姆）", "10 A（大電流孔）"], answer: 1 },
    { q: "電路仍在通電時，可以使用歐姆檔嗎？", options: ["可以，讀值會比較接近標稱值", "不行，外加電壓會損壞電表或熔斷保險絲", "可以，只要先轉到最高歐姆檔再量"], answer: 1 }
  ]
};
