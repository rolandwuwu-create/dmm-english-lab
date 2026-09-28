"""第 1 支：假設語氣（Conditionals & Subjunctive Mood）

每個 scene 是一張投影片，joy 一次念完（一個 TTS 請求）；steps 依序播放，第 k 個 step 開始時，
data-s="k" 的元素才出現。say 裡的每一句是一條字幕，合起來就是 joy 念的稿。
think 是念完後留給學生想的秒數（畫面倒數）。
"""

TITLE = "假設語氣"
SLUG = "01-conditionals"
BRAND = "Joy 的英文文法教室 · 假設語氣"

SCENES = [
    # 1 開場
    {
        "layout": "hero",
        "html": """
<div class="ghost">If</div>
<div class="kicker">高中英文文法 ①</div>
<h1>假設語氣<br><span class="en hl">If I were you…</span></h1>
<div class="lead" data-s="2">口訣：<span class="mark"><b>時態往後退一格</b></span></div>
""",
        "steps": [
            {"say": [
                "各位同學好，我是 Joy。",
                "今天我們要來搞懂一個考試超常考，",
                "但很多人一看到就頭痛的文法：假設語氣。",
            ]},
            {"say": [
                "別擔心，看完這支影片，",
                "你只要記住一個關鍵：時態往後退一格。",
            ]},
        ],
    },
    # 2 條件句 vs 假設語氣
    {
        "html": """
<h2>什麼時候要用假設語氣？</h2>
<div class="card small" data-s="1">
  <span class="tag teal">條件句：真的有可能發生</span>
  <div class="en">If it <span class="hl2">rains</span> tomorrow, I <span class="hl2">will stay</span> home.</div>
  <div class="zh">明天如果下雨，我就待在家。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag coral">假設語氣：和事實相反</span>
  <div class="en">If I <span class="hl">were</span> a bird, I <span class="hl">would fly</span> to you.</div>
  <div class="zh">如果我是一隻鳥，我就會飛到你身邊。</div>
  <div class="fact">我不是鳥 <span class="en">(I am not a bird.)</span></div>
</div>
""",
        "steps": [
            {"say": [
                "先來看這個句子：",
                "If it rains tomorrow, I will stay home.",
                "明天如果下雨，我就待在家。",
                "明天下不下雨，誰也不知道，這是真的有可能發生的事，",
                "所以用一般的時態就好，這叫做條件句。",
            ]},
            {"say": [
                "再看這一句：",
                "If I were a bird, I would fly to you.",
                "如果我是一隻鳥，我就會飛到你身邊。",
                "可是事實上，我不是鳥，對吧？",
                "像這種和事實相反、或幾乎不可能發生的想像，",
                "英文就要用假設語氣。",
            ]},
        ],
    },
    # 3 核心：往後退一格
    {
        "html": """
<h2>秘訣：時態往後退一格</h2>
<div class="steps" data-s="1">
  <div class="pill"><span class="t">想講「現在」的相反</span><span class="v">現在</span></div>
  <div class="arrow">→</div>
  <div class="pill coral"><span class="t">動詞改用</span><span class="v">過去式</span></div>
</div>
<div class="steps" data-s="1">
  <div class="pill"><span class="t">想講「過去」的相反</span><span class="v">過去</span></div>
  <div class="arrow">→</div>
  <div class="pill coral"><span class="t">動詞改用</span><span class="v">had + p.p.</span></div>
</div>
<div class="lead" data-s="2">主要子句搭配：<b class="hl2">would / could / might / should</b></div>
""",
        "steps": [
            {"say": [
                "假設語氣最重要的秘訣，就是時態往後退一格。",
                "想講現在的相反，動詞就往後退到過去式；",
                "想講過去的相反，就再往後退到過去完成式，",
                "也就是 had 加過去分詞。",
            ]},
            {"say": [
                "退一格之後，聽起來就跟現實拉開了距離，",
                "讀的人一看就知道：喔，這只是假設，不是真的。",
                "另外，主要子句要搭配助動詞 would、could、might 或 should。",
            ]},
        ],
    },
    # 4 與現在事實相反
    {
        "html": """
<div class="kicker">第一種 · 與現在事實相反</div>
<div class="formula" data-s="1">
  <div class="part if"><small>If 子句</small>If + S + 過去式</div>
  <span class="comma">,</span>
  <div class="part main"><small>主要子句</small>S + would / could / might + V</div>
</div>
<div class="lead" data-s="1">be 動詞一律用 <b class="hl">were</b></div>
<div class="row">
  <div class="card small" data-s="2">
    <div class="en">If I <span class="hl">were</span> you, I <span class="hl2">would study</span> harder.</div>
    <div class="zh">如果我是你，我會更用功。</div>
    <div class="fact">我不是你</div>
  </div>
  <div class="card small" data-s="3">
    <div class="en">If I <span class="hl">had</span> more time, I <span class="hl2">could join</span> the club.</div>
    <div class="zh">如果我有多一點時間，我就能參加社團。</div>
    <div class="fact">我現在時間不夠</div>
  </div>
</div>
""",
        "steps": [
            {"say": [
                "第一種，與現在事實相反。",
                "公式是：If 加主詞加過去式動詞，",
                "逗點後面接主詞加 would、could 或 might，再加原形動詞。",
                "要特別注意，be 動詞不管主詞是誰，一律用 were。",
            ]},
            {"say": [
                "例如：If I were you, I would study harder.",
                "如果我是你，我會更用功。",
                "事實是，我不是你，所以用 were，不是 was。",
            ]},
            {"say": [
                "再一個：If I had more time, I could join the club.",
                "如果我有多一點時間，我就能參加社團。",
                "事實上，我現在時間不夠。",
                "雖然 had 是過去式，但講的是現在喔。",
            ]},
        ],
    },
    # 5 與過去事實相反
    {
        "html": """
<div class="kicker">第二種 · 與過去事實相反</div>
<div class="formula" data-s="1">
  <div class="part if"><small>If 子句</small>If + S + had + p.p.</div>
  <span class="comma">,</span>
  <div class="part main"><small>主要子句</small>S + would / could / might + have + p.p.</div>
</div>
<div class="card small" data-s="2">
  <div class="en">If I <span class="hl">had studied</span> harder, I <span class="hl2">would have passed</span> the test.</div>
  <div class="zh">如果我當初更用功，我就會通過考試了。</div>
  <div class="fact">我當時沒認真讀，結果沒過</div>
</div>
<div class="card small" data-s="3">
  <div class="en">If she <span class="hl">had left</span> earlier, she <span class="hl2">wouldn't have missed</span> the bus.</div>
  <div class="zh">如果她早點出門，就不會錯過公車了。</div>
</div>
""",
        "steps": [
            {"say": [
                "第二種，與過去事實相反。",
                "If 子句用 had 加過去分詞，",
                "主要子句用 would、could 或 might，加 have，再加過去分詞。",
            ]},
            {"say": [
                "例如：If I had studied harder, I would have passed the test.",
                "如果我當初更用功，我就會通過考試了。",
                "事實是，我沒有認真讀，結果沒過。",
                "這是在後悔過去已經發生的事。",
            ]},
            {"say": [
                "再一句：If she had left earlier, she wouldn't have missed the bus.",
                "如果她早點出門，就不會錯過公車了。",
            ]},
        ],
    },
    # 6 未來：should / were to
    {
        "html": """
<div class="kicker">第三種 · 未來的「萬一」與「不可能」</div>
<div class="card small" data-s="1">
  <span class="tag gold">萬一（可能性很低）· If + S + should + V</span>
  <div class="en">If it <span class="hl">should rain</span> tomorrow, the game <span class="hl2">will be</span> canceled.</div>
  <div class="zh">萬一明天下雨，比賽就會取消。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag coral">根本不可能 · If + S + were to + V</span>
  <div class="en">If the sun <span class="hl">were to rise</span> in the west, I <span class="hl2">would lend</span> you my phone.</div>
  <div class="zh">如果太陽從西邊升起，我就把手機借你。</div>
</div>
""",
        "steps": [
            {"say": [
                "第三種，談未來。",
                "如果是可能性很低、「萬一」的事，",
                "If 子句用 should 加原形動詞。",
                "例如：If it should rain tomorrow, the game will be canceled.",
                "萬一明天下雨，比賽就會取消。",
            ]},
            {"say": [
                "如果是根本不可能發生的事，就用 were to。",
                "例如：If the sun were to rise in the west, I would lend you my phone.",
                "如果太陽從西邊升起，我就把手機借你。",
                "意思就是：不可能啦！",
            ]},
        ],
    },
    # 7 混合假設
    {
        "html": """
<div class="kicker">進階 · 混合假設</div>
<h2>過去的事，影響到現在</h2>
<div class="formula" data-s="1">
  <div class="part if"><small>過去的假設</small>If + S + had + p.p.</div>
  <span class="comma">,</span>
  <div class="part main"><small>現在的結果</small>S + would + V (+ now)</div>
</div>
<div class="card small" data-s="2">
  <div class="en">If I <span class="hl">had eaten</span> breakfast this morning, I <span class="hl2">wouldn't be</span> hungry <span class="mark">now</span>.</div>
  <div class="zh">如果我今天早上有吃早餐，現在就不會餓了。</div>
</div>
""",
        "steps": [
            {"say": [
                "接下來是進階題：混合假設。",
                "當過去的事影響到現在，",
                "前半句講過去，後半句講現在。",
            ]},
            {"say": [
                "例如：If I had eaten breakfast this morning, I wouldn't be hungry now.",
                "如果我今天早上有吃早餐，現在就不會餓了。",
                "看到句尾的 now，就是提示你，",
                "後半句要用現在的假設：would 加原形動詞。",
            ]},
        ],
    },
    # 8 省略 if 倒裝
    {
        "html": """
<div class="kicker">考試最愛 · 省略 if 的倒裝</div>
<h2>把 <span class="hl">were / had / should</span> 移到句首</h2>
<div class="list">
  <div class="item" data-s="2"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">If I were</span> you → <span class="hl">Were</span> I you, I would say sorry.</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">If I had known</span> → <span class="hl">Had</span> I known the truth, I would have told you.</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">3</span><div class="body">
    <div class="en"><span class="strike">If you should need</span> → <span class="hl">Should</span> you need help, call me.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "考試還很愛考這個：",
                "把 if 省略，然後把 were、had、should 移到句首，形成倒裝。",
            ]},
            {"say": [
                "If I were you，變成 Were I you.",
                "If I had known the truth，變成 Had I known the truth.",
                "If you should need help，變成 Should you need help.",
                "只有這三個字可以這樣倒裝，記起來就不怕了。",
            ]},
        ],
    },
    # 9 I wish / as if
    {
        "html": """
<div class="kicker">一樣退一格 · I wish / as if</div>
<div class="row">
  <div class="card small" data-s="1">
    <span class="tag coral">現在的遺憾</span>
    <div class="en">I wish I <span class="hl">were</span> taller.</div>
    <div class="zh">真希望我再高一點。</div>
  </div>
  <div class="card small" data-s="1">
    <span class="tag coral">過去的遺憾</span>
    <div class="en">I wish I <span class="hl">had studied</span> harder.</div>
    <div class="zh">真希望我當初更用功。</div>
  </div>
</div>
<div class="card small" data-s="2">
  <span class="tag indigo">as if = 好像（其實不是）</span>
  <div class="en">He talks as if he <span class="hl">knew</span> everything.</div>
  <div class="zh">他講話好像什麼都懂。</div>
  <div class="fact">他其實沒有什麼都懂</div>
</div>
""",
        "steps": [
            {"say": [
                "除了 if，I wish 和 as if 後面也常用假設語氣，",
                "規則一樣是往後退一格。",
                "I wish I were taller. 真希望我再高一點，代表現在其實不高。",
                "I wish I had studied harder. 真希望我當初更用功，代表過去沒有。",
            ]},
            {"say": [
                "as if 表示「好像」。",
                "He talks as if he knew everything.",
                "他講話好像什麼都懂，言下之意，他其實沒有。",
            ]},
        ],
    },
    # 10 常見錯誤
    {
        "html": """
<div class="kicker">小心！三個常見錯誤</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">If I would have time</span> → If I <span class="hl">had</span> time, I would help you.</div>
    <div class="zh">would 不放進 if 子句</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">If I was you</span> → If I <span class="hl">were</span> you, …</div>
    <div class="zh">正式寫作和考試用 were</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">3</span><div class="body">
    <div class="en"><span class="strike">…, I would pass.</span> → If I had studied, I <span class="hl">would have passed</span>.</div>
    <div class="zh">講過去的事，主要子句用 would have + p.p.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": ["最後提醒三個常見錯誤。", "第一，would 不要放進 if 子句裡。"]},
            {"say": ["第二，正式寫作和考試裡，be 動詞請用 were。"]},
            {"say": ["第三，講過去的事，主要子句別忘了 would have 加過去分詞。"]},
        ],
    },
    # 11 小測驗
    {
        "html": """
<div class="kicker">小測驗 · 暫停想一想</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">If I <span class="blank"><span data-s="2">were</span></span> (be) a millionaire, I would travel around the world.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en">If he had taken my advice, he <span class="blank"><span data-s="4">wouldn't have made</span></span> (not make) that mistake.</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">3</span><div class="body">
    <div class="en"><span class="blank"><span data-s="6">Had</span></span> I known you were coming, I would have cleaned my room.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "來做個小測驗。",
                "第一題：If I 空格 a millionaire, I would travel around the world.",
                "空格要填 be 動詞的哪個形態？先暫停想一想。",
            ], "think": 4},
            {"say": ["答案是 were。和現在事實相反，be 動詞一律用 were。"]},
            {"say": [
                "第二題：If he had taken my advice, he 空格 that mistake.",
                "請用 not make 的正確形態。",
            ], "think": 5},
            {"say": [
                "答案是 would not have made。",
                "前半句 had taken 是過去的假設，",
                "後半句就要用 would have 加過去分詞。",
            ]},
            {"say": [
                "第三題：空格 I known you were coming, I would have cleaned my room.",
                "句首要填哪個字？",
            ], "think": 4},
            {"say": [
                "答案是 Had。這是省略 if 的倒裝，",
                "原本是 If I had known you were coming.",
            ]},
        ],
    },
    # 12 總結
    {
        "html": """
<div class="kicker">重點整理</div>
<table>
  <tr><th>要表達</th><th>If 子句</th><th>主要子句</th></tr>
  <tr data-s="1"><td>與現在相反</td><td class="i">過去式（were）</td><td class="m">would / could / might + V</td></tr>
  <tr data-s="1"><td>與過去相反</td><td class="i">had + p.p.</td><td class="m">would / could / might + have + p.p.</td></tr>
  <tr data-s="1"><td>未來的萬一</td><td class="i">should + V / were to + V</td><td class="m">will / would + V</td></tr>
</table>
<div class="big-note center" data-s="2">口訣：<span class="mark">時態往後退一格</span></div>
""",
        "steps": [
            {"say": [
                "最後幫大家整理重點。",
                "與現在相反，用過去式；",
                "與過去相反，用 had 加過去分詞；",
                "未來的萬一，用 should 或 were to。",
            ]},
            {"say": [
                "記住口訣：時態往後退一格。",
                "今天就上到這裡，下一支影片我們來學分詞構句。",
                "我們下次見，掰掰！",
            ]},
        ],
        "style": "warm, clear and encouraging high-school English teacher, cheerful sign-off at the end",
    },
]
