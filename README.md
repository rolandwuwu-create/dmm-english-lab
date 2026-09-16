# DMM English Lab

高雄市立中正高級工業職業學校資訊科吳東儒老師課堂用：三用電表與基本電性量測專業英文。

之後請在這個 GitHub 倉庫改：
https://github.com/rolandwuwu-create/dmm-english-lab

- 學生課堂：https://rolandwuwu-create.github.io/dmm-english-lab/
- 教師審核台：https://rolandwuwu-create.github.io/dmm-english-lab/teacher.html
- 品質閘門：https://rolandwuwu-create.github.io/dmm-english-lab/qa.html

學生打的每一格會**自動存在自己的手機／電腦**（關掉再開還在）。要讓老師打分數，學生還要按一次「交給老師」。

## 學生怎麼用

1. 打開網址（或掃描老師投影的連結）
2. 填班級、學號、姓名（第 1 關）
3. 按「下一關」一路做完
4. 最後按「交給老師打分數」

右上角會顯示「已自動儲存」。

## 老師怎麼收到作業、打分數

1. 打開教師審核台，PIN：`ccvs114`（不要投影）
2. 按「開始收件」，把學生連結投影出去（這一頁要開著）
3. 學生交進來後，點名字可看**每一題他寫了什麼**
4. 按「匯出作答明細 CSV」用 Excel 批改（有學生作答、參考答案、對錯）
5. 也可匯出成績 CSV，或標記通過／需補救／已面談

若教室網路擋即時連線：請學生按「下載我的作答檔」，老師在審核台「匯入 JSON」。

### 選配：寫進 Google 試算表

把 `google-inbox.gs` 貼到 Google 試算表的 Apps Script，部署成網頁應用程式，把 `/exec` 網址貼到審核台。之後學生繳交會多一列寫進試算表。

## 品質閘門

開啟 `qa.html`。必須全部自動檢查通過，才把網址發給學生。
