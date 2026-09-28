#!/usr/bin/env python3
"""Write the YouTube upload sheet (titles, descriptions with chapters, tags)
to out/youtube/upload.md, one copy-paste block per video.

  python3 grammar-videos/youtube.py

Chapter times come from the same timeline build.py uses, read from the
narration cache, so run build.py first (no new TTS requests are made).
"""
import glob
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build  # noqa: E402

CHANNEL = "Joy 的英文小教室"
PLAYLIST = "高中英文文法｜Joy 的英文小教室"

META = {
    "01-conditionals": {
        "title": "假設語氣一次搞懂！If I were you 為什麼用 were？｜高中英文文法 ①",
        "intro": "假設語氣只要記住一個口訣：時態往後退一格！\n"
                 "這支影片從條件句和假設語氣的差別講起，帶你搞懂與現在、過去、未來事實相反的句型，"
                 "還有混合假設、省略 if 的倒裝、I wish 和 as if，最後用小測驗檢查你學會了沒。",
        "tags": ["假設語氣", "if 假設句", "與事實相反", "I wish", "as if", "倒裝句", "混合假設"],
    },
    "02-participial-constructions": {
        "title": "分詞構句三步驟秒懂！V-ing 還是 p.p.？｜高中英文文法 ②",
        "intro": "分詞構句只要三步驟：刪連接詞 → 刪主詞 → 動詞改分詞！\n"
                 "這支影片教你判斷主動用 V-ing、被動用過去分詞，還有 Having p.p.、否定 not、"
                 "保留連接詞、獨立分詞構句和 with 的用法，以及最常見的懸垂分詞錯誤。",
        "tags": ["分詞構句", "現在分詞", "過去分詞", "Having p.p.", "獨立分詞構句", "懸垂分詞"],
    },
    "03-participial-phrases": {
        "title": "分詞片語：boring 還是 bored？分詞當形容詞一次搞懂｜高中英文文法 ③",
        "intro": "口訣：主動進行用 V-ing，被動完成用 p.p.！\n"
                 "這支影片教你分詞當形容詞的位置、分詞片語其實是關係子句的簡化、"
                 "最常考的情緒形容詞（boring / bored），還有分詞當受詞補語。",
        "tags": ["分詞片語", "分詞當形容詞", "情緒形容詞", "boring bored", "interesting interested", "關係子句簡化"],
    },
    "04-not-until": {
        "title": "not until 直到…才…｜倒裝句、強調句一次學會｜高中英文文法 ④",
        "intro": "not until 意思是「直到…才…」，考試最愛考它的三種寫法！\n"
                 "這支影片用時間線解釋為什麼要用否定，再教你 Not until 放句首的倒裝、"
                 "助動詞怎麼選，以及 It was not until … that … 的強調句型。",
        "tags": ["not until", "直到才", "倒裝句", "強調句", "It was not until", "句型改寫"],
    },
    "05-relative-clauses": {
        "title": "關係子句 who / which / whose / where 怎麼選？｜高中英文文法 ⑤",
        "intro": "口訣：先找先行詞，再看它在子句裡當什麼！\n"
                 "這支影片教你關係代名詞的主格、受格、所有格，關係副詞 where / when / why，"
                 "限定與非限定（有沒有逗點）的差別，以及三個最常見的錯誤。",
        "tags": ["關係子句", "關係代名詞", "關係副詞", "who which whose", "where when why", "非限定用法"],
    },
}

COMMON_TAGS = ["高中英文", "英文文法", "學測英文", "分科測驗", "英文教學", CHANNEL]


def stamp(t):
    t = int(t)
    return f"{t // 60}:{t % 60:02d}"


def main():
    parts = [
        f"# {CHANNEL} · YouTube 上傳資料\n",
        "每支影片在 YouTube Studio 按「建立 → 上傳影片」，照下面填：\n",
        "- **影片檔**：`out/<slug>.mp4`　**縮圖**：`out/youtube/<slug>-thumbnail.png`",
        "- **播放清單**：" + PLAYLIST,
        "- **目標觀眾**：否，這不是為兒童打造的內容",
        "- **類別**：教育　**影片語言**：中文（台灣）",
        "- **字幕**（選填，畫面上已有字幕）：字幕 → 上傳檔案 → 有時間碼 → `out/<slug>.srt`",
        "- **瀏覽權限**：公開\n",
        "頻道自訂 → 品牌宣傳：大頭照 `out/youtube/avatar.png`，橫幅 `out/youtube/banner.png`\n",
    ]
    for path in sorted(glob.glob(str(HERE / "lessons" / "*.py"))):
        lesson = build.load_lesson(path)
        meta = META[lesson.SLUG]
        _, _, _, chapters = build.build_timeline(lesson, HERE / "build" / lesson.SLUG / "audio")
        desc = [meta["intro"], "", "📌 章節"]
        desc += [f"{stamp(t)} {title}" for t, title in chapters]
        desc += ["", f"🎧 {CHANNEL}：高中英文文法系列，一次一個觀念，講到你懂。",
                 "#高中英文 #英文文法 #" + lesson.TITLE.replace(" ", "")]
        parts += [
            f"---\n\n## {lesson.TITLE}（`{lesson.SLUG}`）\n",
            "**標題**\n", "```", meta["title"], "```\n",
            "**說明**\n", "```", "\n".join(desc), "```\n",
            "**標籤**\n", "```", ", ".join(meta["tags"] + COMMON_TAGS), "```\n",
        ]
    out = HERE / "out" / "youtube" / "upload.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main()
