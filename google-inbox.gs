/**
 * 把學生作答寫進這份 Google 試算表，方便老師用 Excel 打分數。
 *
 * 設定（做一次）：
 * 1. 開新的 Google 試算表
 * 2. 擴充功能 → Apps Script，貼上本檔全部內容
 * 3. 部署 → 新增部署 → 類型選「網頁應用程式」
 *    - 執行身分：我
 *    - 存取權：任何人
 * 4. 把部署後的 /exec 網址貼到教師審核台「Google 試算表收件網址」
 * 5. 再按「開始收件」並把學生連結給學生
 */
function doPost(e) {
  const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
  const wrap = JSON.parse(raw);
  const s = wrap.student || wrap;
  const p = s.profile || {};
  const g = s.gradeRow || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("繳交");
  if (!sheet) sheet = ss.insertSheet("繳交");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "時間", "班級", "學號", "姓名", "組別", "完成度", "得分", "綜合練習", "安全",
      "核心詞作答", "構詞", "單位", "電路", "對話", "挑戰", "安全作答", "題型一", "選擇題"
    ]);
  }
  sheet.appendRow([
    new Date(),
    p.klass || g.klass || "",
    p.number || g.number || "",
    p.name || g.name || "",
    p.group || g.group || "",
    g.completion || "",
    g.score || "",
    g.quiz || "",
    g.safety || "",
    g.vocab || "",
    g.wordFamily || "",
    g.units || "",
    g.circuits || "",
    g.dialogue || "",
    g.challenge || "",
    g.safetyAnswers || "",
    g.quizType1 || "",
    g.quizChoice || ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("DMM inbox OK");
}
