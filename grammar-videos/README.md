# 高中英文文法教學影片

五支獨立影片：假設語氣、分詞構句、分詞片語、not until 的用法、關係子句。

## 配音：Gemini 3.8 Flash TTS 複製聲音「joy」

joy 是用 Voice replication 從老師本人的錄音複製的聲音，存在 Google AI 專案裡（保存 1 年）。

### 需要兩段錄音（同一個人、成年、本人的聲音）

放在 `grammar-videos/tts/private/`（這個資料夾不會上傳到 GitHub）。手機錄的 m4a/mp3 可以直接用，腳本會自動轉成 24 kHz 單聲道 WAV。

1. **參考錄音**：10–30 秒、安靜環境、自然講話。建議用上課的語氣中英夾雜講一段，例如講解一個例句。
2. **同意錄音**：同一個人清楚念出下面這句（擇一語言，逐字）：
   - 英文：I am the owner of this voice and I consent to Google using this voice to create a synthetic voice model.
   - 中文：我是此声音的拥有者并授权谷歌使用此声音创建语音合成模型

### 建立 joy

1. 用有額度的 Google 帳號到 https://aistudio.google.com/apikey 建立 API key，設成環境變數 `GEMINI_API_KEY`（不要寫進任何檔案或 commit）
2. 執行（只要做一次；重跑不會重複建立，要換錄音就加 `--replace`）：

   ```
   python3 grammar-videos/tts/joy.py create --source grammar-videos/tts/private/reference.m4a --consent grammar-videos/tts/private/consent.m4a
   ```

   成功後會產生 `tts/joy.voice-id.json`（聲音 ID）。
3. 試講一句：

   ```
   python3 grammar-videos/tts/joy.py say "Not until midnight did he finish his homework." test.wav --style "cheerful and encouraging"
   ```

也可以直接在 Google AI Studio 的 Voice Replication 頁面錄音建立，再把拿到的 `voice_...` ID 填進 `tts/joy.voice-id.json`。

## 做影片

```
pip install playwright imageio-ffmpeg
python3 grammar-videos/build.py grammar-videos/lessons/01_conditionals.py
```

- 講稿與投影片：`lessons/*.py`（每個 scene 是一張投影片，joy 一次念完一張）
- 版型：`template.html`（1920×1080，字型 Noto Sans TC + Nunito，缺字型會自動下載）
- 輸出：`out/<slug>.mp4` 與字幕檔 `out/<slug>.srt`（不進 git）
- 配音快取在 `build/<slug>/audio`，改稿後重跑只會重念改過的投影片
- Tier 1 的 `gemini-3.8-flash-tts` 每天限 100 次請求；一支影片約 12 次

## YouTube（Joy 的英文小教室）

```
python3 grammar-videos/channel.py   # 大頭照、橫幅、每支影片的縮圖 → out/youtube/
python3 grammar-videos/youtube.py   # 標題、說明（含章節時間）、標籤 → out/youtube/upload.md
```

上傳要在 YouTube Studio 手動做：未經 Google 審核的 API 專案上傳的影片會被鎖成私人，無法公開。
