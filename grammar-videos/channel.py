#!/usr/bin/env python3
"""Render YouTube artwork for 「Joy 的英文小教室」 into out/youtube/.

  python3 grammar-videos/channel.py

avatar.png (800×800), banner.png (2560×1440, text inside the 1546×423
safe area), and a 1280×720 thumbnail per lesson.
"""
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build  # noqa: E402

OUT = HERE / "out" / "youtube"

BASE_CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #fbf7f0; color: #1f2a44; font-family: "Nunito", "Noto Sans TC", sans-serif;
       -webkit-font-smoothing: antialiased; overflow: hidden; }
.zh { font-family: "Noto Sans TC", sans-serif; }
"""

AVATAR = """
<style>
body { width: 800px; height: 800px; background: #f0603f; display: grid; place-items: center; }
.bubble { position: relative; width: 560px; height: 420px; background: #fbf7f0; border-radius: 120px;
          display: grid; place-items: center; margin-top: -40px; }
.word { font: 900 250px/1 "Nunito"; color: #1f2a44; letter-spacing: -6px; margin-top: -20px; }
.word b { color: #f0603f; }
.sub { position: absolute; bottom: 128px; font: 900 64px "Noto Sans TC"; color: #fff; letter-spacing: 8px; }
</style>
<div class="bubble"><div class="word">J<b>o</b>y</div></div>
<div class="sub">英文小教室</div>
"""

BANNER = """
<style>
body { width: 2560px; height: 1440px; position: relative;
       background: radial-gradient(circle at 20% 30%, #ffe7df 0, transparent 40%),
                   radial-gradient(circle at 85% 70%, #e4e8ff 0, transparent 40%), #fbf7f0; }
.deco { position: absolute; font: 900 360px/1 "Nunito"; color: #f0603f; opacity: .07; }
.safe { position: absolute; left: 507px; top: 508px; width: 1546px; height: 423px;
        display: flex; align-items: center; gap: 56px; }
.logo { flex: none; width: 250px; height: 250px; border-radius: 64px; background: #f0603f; color: #fff;
        display: grid; place-items: center; font: 900 170px/1 "Nunito"; }
.title { font: 900 128px/1.1 "Noto Sans TC"; }
.title .en { font-family: "Nunito"; color: #f0603f; }
.tag { margin-top: 26px; font: 700 46px "Noto Sans TC"; color: #6b7288; }
.chips { margin-top: 26px; display: flex; gap: 16px; }
.chips span { font: 700 34px "Noto Sans TC"; padding: 8px 24px; border-radius: 999px; background: #fff;
              border: 3px solid #e8e1d4; }
</style>
<div class="deco" style="left:120px;top:120px">If</div>
<div class="deco" style="right:140px;top:140px">-ing</div>
<div class="deco" style="left:260px;bottom:120px">who</div>
<div class="deco" style="right:220px;bottom:100px">until</div>
<div class="safe">
  <div class="logo">J</div>
  <div>
    <div class="title"><span class="en">Joy</span> 的英文小教室</div>
    <div class="tag">高中英文文法 · 一次一個觀念，講到你懂</div>
    <div class="chips"><span>假設語氣</span><span>分詞構句</span><span>分詞片語</span><span>not until</span><span>關係子句</span></div>
  </div>
</div>
"""

THUMBS = {
    "01-conditionals": ("①", "假設語氣", "If I <b>were</b> you…", "時態往後退一格"),
    "02-participial-constructions": ("②", "分詞構句", "<b>Walking</b> home, I…", "三步驟秒懂"),
    "03-participial-phrases": ("③", "分詞片語", "bor<b>ing</b> vs bor<b>ed</b>", "V-ing 還是 p.p.？"),
    "04-not-until": ("④", "not until", "<b>Not until</b> … did …", "直到…才…"),
    "05-relative-clauses": ("⑤", "關係子句", "a friend <b>who</b>…", "who / which / whose"),
}

THUMB = """
<style>
body { width: 1280px; height: 720px; position: relative; padding: 64px 72px; }
.band { position: absolute; right: 0; top: 0; bottom: 0; width: 420px; background: #f0603f; }
.no { position: absolute; right: 70px; top: 40px; font: 900 300px/1 "Noto Sans TC"; color: #fff; opacity: .95; }
.brand { display: flex; align-items: center; gap: 14px; font: 900 34px "Noto Sans TC"; color: #6b7288; }
.brand i { width: 52px; height: 52px; border-radius: 14px; background: #f0603f; color: #fff; font: 900 34px "Nunito";
           font-style: normal; display: grid; place-items: center; }
.title { margin-top: 40px; font: 900 150px/1.05 "Noto Sans TC"; color: #1f2a44; letter-spacing: 2px; }
.title.en { font-family: "Nunito"; font-size: 140px; }
.ex { margin-top: 30px; display: inline-block; background: #fff; border: 4px solid #1f2a44; border-radius: 22px;
      padding: 12px 30px; font: 900 56px "Nunito"; color: #1f2a44; }
.ex b { color: #f0603f; }
.hook { position: absolute; left: 72px; bottom: 60px; font: 900 54px "Noto Sans TC"; color: #1f2a44;
        background: linear-gradient(transparent 55%, #f5b82e 55%); }
.side { position: absolute; right: 60px; bottom: 60px; width: 300px; text-align: center; color: #fff;
        font: 900 46px/1.3 "Noto Sans TC"; }
</style>
<div class="band"></div>
<div class="no">{no}</div>
<div class="brand"><i>J</i>Joy 的英文小教室</div>
<div class="title{title_class}">{title}</div>
<div class="ex">{ex}</div>
<div class="hook">{hook}</div>
<div class="side">高中英文<br>文法</div>
"""


def shot(page, html, size, path):
    page.set_viewport_size({"width": size[0], "height": size[1]})
    page.set_content(f"<!doctype html><meta charset='utf-8'><style>{BASE_CSS}</style>{html}")
    page.evaluate("document.fonts.ready")
    page.screenshot(path=str(path))
    print(f"  {path.relative_to(HERE)}")


def main():
    from playwright.sync_api import sync_playwright
    build.ensure_fonts()
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = build.launch_browser(p)
        page = browser.new_page()
        shot(page, AVATAR, (800, 800), OUT / "avatar.png")
        shot(page, BANNER, (2560, 1440), OUT / "banner.png")
        for slug, (no, title, ex, hook) in THUMBS.items():
            html = (THUMB.replace("{no}", no).replace("{title}", title).replace("{ex}", ex)
                    .replace("{hook}", hook).replace("{title_class}", "" if any("一" <= c <= "鿿" for c in title) else " en"))
            shot(page, html, (1280, 720), OUT / f"{slug}-thumbnail.png")
        browser.close()


if __name__ == "__main__":
    main()
