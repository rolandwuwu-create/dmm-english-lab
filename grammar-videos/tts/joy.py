#!/usr/bin/env python3
"""Gemini 3.8 Flash TTS voice "joy", replicated from the teacher's own recordings.

Needs GEMINI_API_KEY in the environment (API key from the Google account
that holds the quota). Recordings in other formats (m4a, mp3, ...) are
converted to 24 kHz mono 16-bit WAV with ffmpeg (system ffmpeg, or
`pip install imageio-ffmpeg`).

  python3 joy.py create --source private/reference.m4a --consent private/consent.m4a
  python3 joy.py say "Hello!" out.wav [--style "cheerful and encouraging"]
"""
import argparse
import base64
import json
import os
import shutil
import struct
import subprocess
import sys
import tempfile
import urllib.error
import urllib.parse
import urllib.request
import wave
from pathlib import Path

API = "https://generativelanguage.googleapis.com/v1beta"
MODEL = "gemini-3.8-flash-tts"
NAME = "joy"
HERE = Path(__file__).resolve().parent
ID_FILE = HERE / "joy.voice-id.json"


def call(method, path, body=None, query=None):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY is not set.")
    url = API + path + ("?" + urllib.parse.urlencode(query, doseq=True) if query else "")
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "x-goog-api-key": key,
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=300) as res:
            return json.load(res)
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {path} -> HTTP {e.code}\n{e.read().decode(errors='replace')}")


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("ffmpeg not found. Install it, or: pip install imageio-ffmpeg")


def to_wav_b64(path, min_s=None, max_s=None):
    """Return the recording as base64 24 kHz mono 16-bit WAV, checking its length."""
    path = Path(path)
    if not path.exists():
        sys.exit(f"Recording not found: {path}")
    with tempfile.TemporaryDirectory() as tmp:
        out = Path(tmp) / "a.wav"
        subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", str(path),
                        "-ac", "1", "-ar", "24000", "-sample_fmt", "s16", str(out)], check=True)
        with wave.open(str(out)) as w:
            secs = w.getnframes() / w.getframerate()
        print(f"{path.name}: {secs:.1f} s")
        if min_s and secs < min_s or max_s and secs > max_s:
            sys.exit(f"{path.name} must be {min_s}-{max_s} seconds of clean speech (is {secs:.1f} s).")
        return base64.b64encode(out.read_bytes()).decode()


def find_existing():
    res = call("GET", "/voices", query={"type": "replicated", "search": NAME})
    return next((v for v in res.get("voices", []) if v.get("display_name") == NAME), None)


def to_wav_bytes(b64):
    raw = base64.b64decode(b64)
    if not raw.startswith(b"RIFF"):  # bare 16-bit mono PCM at 24 kHz
        raw = (b"RIFF" + struct.pack("<I", 36 + len(raw)) + b"WAVEfmt "
               + struct.pack("<IHHIIHH", 16, 1, 1, 24000, 48000, 2, 16)
               + b"data" + struct.pack("<I", len(raw)) + raw)
    return raw


def create(args):
    voice = find_existing()
    if voice and not args.replace:
        print(f"Voice '{NAME}' already exists: {voice['id']} (use --replace to rebuild it)")
    else:
        source = to_wav_b64(args.source, 10, 30)
        consent = to_wav_b64(args.consent)
        if voice:
            call("DELETE", f"/voices/{voice['id']}")
            print(f"Deleted old voice {voice['id']}")
        res = call("POST", "/voices", {"store": True, "voice": {
            "model": MODEL,
            "type": "replicated",
            "display_name": NAME,
            "replicated": {
                "source_audio": {"mime_type": "audio/wav", "data": source},
                "consent_audio": {"mime_type": "audio/wav", "data": consent},
            },
        }})
        voice = res.get("voice", res)
        print(f"Created voice '{NAME}': {voice['id']}")
    ID_FILE.write_text(json.dumps({"display_name": NAME, "id": voice["id"], "model": MODEL}, indent=2) + "\n")


def audio_data(res):
    if res.get("output_audio", {}).get("data"):
        return res["output_audio"]["data"]
    chunks = [c["data"] for step in res.get("steps", []) if step.get("type") == "model_output"
              for c in step.get("content", []) if c.get("type") == "audio"]
    if not chunks:
        sys.exit("No audio in response:\n" + json.dumps(res)[:2000])
    return chunks[-1]


def model():
    """TTS model to speak with; JOY_TTS_MODEL overrides the one joy was built on."""
    return os.environ.get("JOY_TTS_MODEL") or json.loads(ID_FILE.read_text())["model"]


def speak(text, style=None):
    """Return WAV bytes of joy reading text verbatim."""
    if not ID_FILE.exists():
        sys.exit("Voice joy has no saved id yet. Run: python3 joy.py create --source ... --consent ...")
    joy = json.loads(ID_FILE.read_text())
    part = {"type": "text", "text": text}
    if style:
        part["annotations"] = [{"type": "speech_metadata", "style": style}]
    res = call("POST", "/interactions", {
        "model": model(),
        "input": [{"type": "user_input", "content": [part]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": joy["id"]}]},
    })
    return to_wav_bytes(audio_data(res))


def say(args):
    Path(args.out).write_bytes(speak(args.text, args.style))
    print(f"Saved {args.out}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(required=True)
    c = sub.add_parser("create", help="replicate voice joy from recordings (idempotent)")
    c.add_argument("--source", required=True, help="10-30 s of clean natural speech")
    c.add_argument("--consent", required=True, help="same speaker reading the consent statement")
    c.add_argument("--replace", action="store_true", help="delete an existing joy and rebuild it")
    c.set_defaults(fn=create)
    s = sub.add_parser("say", help="synthesize text with joy")
    s.add_argument("text")
    s.add_argument("out")
    s.add_argument("--style", help="situational delivery, e.g. 'cheerful and encouraging'")
    s.set_defaults(fn=say)
    args = p.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
