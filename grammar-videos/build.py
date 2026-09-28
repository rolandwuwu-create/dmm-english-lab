#!/usr/bin/env python3
"""Build one grammar video from a lesson file.

  python3 grammar-videos/build.py grammar-videos/lessons/01_conditionals.py

Narration is spoken by the replicated voice joy (tts/joy.py, needs
GEMINI_API_KEY; JOY_TTS_MODEL picks another TTS model for a draft). Clips are cached in build/<slug>/audio, so a rebuild only
pays for lines that changed. Output: out/<slug>.mp4 and out/<slug>.srt.
Needs: pip install playwright imageio-ffmpeg (Chromium from Playwright).
"""
import array
import hashlib
import importlib.util
import io
import json
import os
import re
import subprocess
import sys
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE / "tts"))
import joy  # noqa: E402

FPS = 30
SR = 24000
LEAD = 0.6       # silence before a slide's first line
GAP = 0.45       # between steps on the same slide
TAIL = 0.9       # after a slide's last line
DEFAULT_STYLE = "warm, clear and encouraging high-school English teacher, natural classroom pace"


def load_lesson(path):
    spec = importlib.util.spec_from_file_location("lesson", path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def join_lines(lines):
    text = ""
    for line in lines:
        if text and re.search(r"[A-Za-z0-9.,!?'\"]$", text):
            text += " "
        text += line
    return text


def pcm_from_wav(data):
    """Any WAV bytes -> 24 kHz mono 16-bit samples."""
    with wave.open(io.BytesIO(data)) as w:
        if (w.getframerate(), w.getnchannels(), w.getsampwidth()) == (SR, 1, 2):
            return array.array("h", w.readframes(w.getnframes()))
    out = subprocess.run([joy.ffmpeg(), "-v", "error", "-i", "pipe:0", "-f", "s16le",
                          "-ac", "1", "-ar", str(SR), "pipe:1"], input=data, capture_output=True, check=True)
    return array.array("h", out.stdout)


def voice_model():
    return json.loads(joy.ID_FILE.read_text())["model"]


def narration(cache, text, style):
    voice = json.loads(joy.ID_FILE.read_text())
    key = hashlib.sha1(json.dumps([text, style, voice["id"], joy.model()]).encode()).hexdigest()[:16]
    path = cache / f"{key}.wav"
    if not path.exists():
        print(f"  TTS: {text[:40]}…")
        path.write_bytes(joy.speak(text, style))
    return pcm_from_wav(path.read_bytes())


def weight(line):
    cjk = len(re.findall(r"[㐀-鿿]", line))
    latin = len(re.findall(r"[A-Za-z]", line))
    return cjk + 0.35 * latin + 0.6


def pauses(pcm, min_len=0.14):
    """Midpoints (s) of quiet stretches in the clip."""
    win = SR // 50  # 20 ms
    rms = []
    for i in range(0, len(pcm) - win, win):
        chunk = pcm[i:i + win]
        rms.append((sum(x * x for x in chunk) / win) ** 0.5)
    if not rms:
        return []
    quiet = max(rms) * 0.06
    mids, start = [], None
    for i, r in enumerate(rms + [quiet + 1]):
        if r < quiet and start is None:
            start = i
        elif r >= quiet and start is not None:
            if (i - start) * 0.02 >= min_len and start > 0:
                mids.append((start + i) / 2 * 0.02)
            start = None
    return mids


def caption_times(pcm, lines):
    """Start offsets of each caption line inside the clip, snapped to pauses."""
    total = len(pcm) / SR
    weights = [weight(line) for line in lines]
    estimates, acc = [], 0
    for w in weights[:-1]:
        acc += w
        estimates.append(acc / sum(weights) * total)
    candidates = pauses(pcm)
    starts, prev = [0.0], 0.0
    for est in estimates:
        near = [c for c in candidates if c > prev + 0.4 and abs(c - est) < 1.4]
        t = min(near, key=lambda c: abs(c - est)) if near else max(est, prev + 0.4)
        starts.append(t)
        prev = t
    return starts


def display(line):
    return re.sub(r"[，。；：、]$", "", line.strip())


def build_timeline(lesson, cache):
    """One TTS request per slide (the daily quota is per request); the clip is
    then cut at the pauses between steps so each step can get its own gap."""
    audio = array.array("h")
    segs = []  # (start_s, end_s, frame dict)
    subs = []  # (start_s, end_s, text)
    total = len(lesson.SCENES)

    def silence(sec):
        audio.extend([0] * int(round(sec * SR)))

    def now():
        return len(audio) / SR

    for i, scene in enumerate(lesson.SCENES):
        base = {"brand": lesson.BRAND, "html": scene["html"], "index": i, "total": total,
                "layout": scene.get("layout", "")}
        steps = scene["steps"]
        lines = [line for step in steps for line in step["say"]]
        pcm = narration(cache, join_lines(lines), scene.get("style", DEFAULT_STYLE))
        starts = [round(t * SR) for t in caption_times(pcm, lines)] + [len(pcm)]

        t = now()
        silence(LEAD)
        segs.append((t, now(), {**base, "step": 0, "caption": ""}))
        n = 0  # index of the step's first line in `lines`
        for k, step in enumerate(steps, start=1):
            count = len(step["say"])
            t0 = now()
            audio.extend(pcm[starts[n]:starts[n + count]])
            for j in range(count):
                a = t0 + (starts[n + j] - starts[n]) / SR
                b = t0 + (starts[n + j + 1] - starts[n]) / SR
                text = display(lines[n + j])
                segs.append((a, b, {**base, "step": k, "caption": text}))
                subs.append((a, b, text))
            for left in range(step.get("think", 0), 0, -1):
                t = now()
                silence(1.0)
                segs.append((t, now(), {**base, "step": k, "caption": f"想一想… {left}", "captionClass": "count"}))
            n += count
            last = k == len(steps)
            t = now()
            silence(TAIL if last else GAP)
            segs.append((t, now(), {**base, "step": k, "caption": "" if last else display(lines[n - 1])}))
    return audio, segs, subs


FONTS = ["Noto+Sans+TC:wght@400;500;700;900", "Nunito:wght@600;800;900"]


def ensure_fonts():
    """Install the slide fonts from Google Fonts if this machine lacks them."""
    have = subprocess.run(["fc-list", ":", "family"], capture_output=True, text=True).stdout
    if "Noto Sans TC" in have and "Nunito" in have:
        return
    import urllib.request
    target = Path.home() / ".fonts"
    target.mkdir(exist_ok=True)
    for fam in FONTS:
        req = urllib.request.Request(f"https://fonts.googleapis.com/css2?family={fam}",
                                     headers={"User-Agent": "Mozilla/4.0"})  # old UA -> plain TTF links
        css = urllib.request.urlopen(req).read().decode()
        for url in sorted(set(re.findall(r"https://[^)]+\.ttf", css))):
            (target / url.rsplit("/", 1)[-1]).write_bytes(urllib.request.urlopen(url).read())
    subprocess.run(["fc-cache", "-f"], check=True)
    print("  fonts installed")


def launch_browser(p):
    """Playwright's own Chromium, or a preinstalled one if versions don't match."""
    try:
        return p.chromium.launch()
    except Exception:
        for exe in (os.environ.get("CHROMIUM_PATH"), "/opt/pw-browsers/chromium"):
            if exe and Path(exe).exists():
                return p.chromium.launch(executable_path=exe)
        raise


def render_frames(segs, frames_dir):
    from playwright.sync_api import sync_playwright
    frames_dir.mkdir(parents=True, exist_ok=True)
    keys, files = {}, []
    with sync_playwright() as p:
        browser = launch_browser(p)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        page.goto((HERE / "template.html").as_uri())
        page.evaluate("document.fonts.ready")
        for _, _, frame in segs:
            key = json.dumps(frame, sort_keys=True, ensure_ascii=False)
            if key not in keys:
                path = frames_dir / f"f{len(keys):04d}.png"
                page.evaluate("f => window.show(f)", frame)
                page.evaluate("document.fonts.ready")
                page.screenshot(path=str(path))
                keys[key] = path
            files.append(keys[key])
        browser.close()
    print(f"  {len(keys)} frames rendered")
    return files


def srt_time(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    lesson = load_lesson(sys.argv[1])
    work = HERE / "build" / lesson.SLUG
    cache = work / "audio"
    cache.mkdir(parents=True, exist_ok=True)
    out = HERE / "out"
    out.mkdir(exist_ok=True)

    print(f"[{lesson.TITLE}] narration")
    audio, segs, subs = build_timeline(lesson, cache)
    wav_path = work / "narration.wav"
    with wave.open(str(wav_path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(audio.tobytes())

    print(f"[{lesson.TITLE}] slides")
    ensure_fonts()
    files = render_frames(segs, work / "frames")

    # Snap every boundary to the frame grid so the picture never drifts from the voice.
    lines = ["ffconcat version 1.0"]
    for (a, b, _), f in zip(segs, files):
        frames = round(b * FPS) - round(a * FPS)
        if frames > 0:
            lines += [f"file '{f}'", f"duration {frames / FPS:.6f}"]
    lines.append(f"file '{files[-1]}'")
    (work / "frames.ffconcat").write_text("\n".join(lines) + "\n")

    name = lesson.SLUG + ("" if joy.model() == voice_model() else "-" + joy.model())
    mp4 = out / f"{name}.mp4"
    print(f"[{lesson.TITLE}] encoding {mp4.name}")
    subprocess.run([
        joy.ffmpeg(), "-v", "error", "-y",
        "-f", "concat", "-safe", "0", "-i", str(work / "frames.ffconcat"),
        "-i", str(wav_path),
        "-vf", f"fps={FPS},format=yuv420p",
        "-af", "loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000",
        "-c:v", "libx264", "-preset", "medium", "-tune", "stillimage", "-crf", "20",
        "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart",
        str(mp4),
    ], check=True)

    srt = out / f"{name}.srt"
    srt.write_text("".join(f"{n}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n\n"
                           for n, (a, b, text) in enumerate(subs, 1)), encoding="utf-8")
    print(f"Done: {mp4} ({len(audio) / SR / 60:.1f} min), {srt.name}")


if __name__ == "__main__":
    main()
