"""第 5 支：關係子句（Relative Clauses）

格式同 01_conditionals.py。
"""

TITLE = "關係子句"
SLUG = "05-relative-clauses"
BRAND = "Joy 的英文小教室 · 關係子句"

SCENES = [
    # 1 開場
    {
        "layout": "hero",
        "html": """
<div class="ghost">who</div>
<div class="kicker">高中英文文法 ⑤</div>
<h1>關係子句<br><span class="en hl">a friend who…</span></h1>
<div class="lead" data-s="2">口訣：<span class="mark"><b>先找先行詞，再看它在子句裡當什麼</b></span></div>
""",
        "steps": [
            {"say": [
                "各位同學好，我是 Joy。",
                "今天是這個系列的最後一支影片，我們要學關係子句。",
            ]},
            {"say": [
                "關係子句就像一個長長的形容詞，",
                "可以把兩個句子合成一句，讓描述更精準。",
            ]},
        ],
    },
    # 2 什麼是關係子句
    {
        "html": """
<h2>兩句合成一句</h2>
<div class="card small" data-s="1">
  <div class="en">I have a friend. <span class="hl2">She</span> lives in Japan.</div>
  <div class="zh">我有一個朋友。她住在日本。</div>
</div>
<div class="card small" data-s="2">
  <div class="en">I have a <span class="mark">friend</span> <span class="hl">who</span> lives in Japan.</div>
  <div class="zh">我有一個住在日本的朋友。</div>
  <div class="lead"><span class="mark">friend</span> = 先行詞　·　<b class="hl">who</b> = 關係代名詞（代替 she）</div>
</div>
""",
        "steps": [
            {"say": [
                "先看兩個句子：I have a friend. She lives in Japan.",
                "我有一個朋友，她住在日本。",
            ]},
            {"say": [
                "用關係代名詞 who 代替 she，就能合成一句：",
                "I have a friend who lives in Japan.",
                "我有一個住在日本的朋友。",
                "被修飾的名詞 friend，叫做先行詞。",
            ]},
        ],
    },
    # 3 選擇表
    {
        "html": """
<div class="kicker">關係代名詞怎麼選？</div>
<table>
  <tr><th>先行詞</th><th>主格</th><th>受格</th><th>所有格</th></tr>
  <tr data-s="2"><td>人</td><td class="i">who</td><td class="i">whom / who</td><td class="m" rowspan="2">whose</td></tr>
  <tr data-s="2"><td>事物</td><td class="i">which</td><td class="i">which</td></tr>
  <tr data-s="2"><td>人、事物</td><td class="i">that</td><td class="i">that</td><td class="m">—</td></tr>
</table>
""",
        "steps": [
            {"say": [
                "關係代名詞要怎麼選？看兩件事：",
                "先行詞是人還是事物，以及它在子句裡當什麼角色。",
            ]},
            {"say": [
                "先行詞是人，用 who 或 whom；是事物，用 which；",
                "that 則是人和事物都可以用。",
                "表示「誰的」，一律用 whose。",
            ]},
        ],
    },
    # 4 主格
    {
        "html": """
<div class="kicker">主格 · 在子句裡當主詞</div>
<div class="card small" data-s="1">
  <div class="en">The man <span class="hl">who</span> <span class="hl2">is talking</span> to the teacher is my uncle.</div>
  <div class="zh">正在跟老師說話的那個人是我叔叔。</div>
  <div class="fact">who 是 is talking 的主詞</div>
</div>
<div class="card small" data-s="2">
  <div class="en">This is the bus <span class="hl">which</span> <span class="hl2">goes</span> to the station.</div>
  <div class="zh">這是開往車站的公車。</div>
</div>
""",
        "steps": [
            {"say": [
                "關係代名詞在子句裡當主詞，叫做主格。",
                "The man who is talking to the teacher is my uncle.",
                "正在跟老師說話的那個人是我叔叔。",
                "who 就是 is talking 的主詞。",
            ]},
            {"say": [
                "事物就用 which：This is the bus which goes to the station.",
                "這是開往車站的公車。",
            ]},
        ],
    },
    # 5 受格
    {
        "html": """
<div class="kicker">受格 · 在子句裡當受詞（可以省略）</div>
<div class="card small" data-s="1">
  <div class="en">The girl <span class="hl">whom</span> I <span class="hl2">met</span> yesterday is Amy.</div>
  <div class="zh">我昨天遇到的女孩是 Amy。</div>
  <div class="fact">whom 是 met 的受詞</div>
</div>
<div class="card small" data-s="2">
  <div class="en">The girl <span class="strike">whom</span> I met yesterday is Amy.</div>
  <div class="zh">受格關係代名詞可以省略，口語非常常見</div>
</div>
""",
        "steps": [
            {"say": [
                "如果關係代名詞在子句裡當受詞，就是受格。",
                "The girl whom I met yesterday is Amy.",
                "我昨天遇到的女孩是 Amy。",
                "whom 是 met 的受詞。",
            ]},
            {"say": [
                "受格的關係代名詞可以省略：",
                "The girl I met yesterday is Amy.",
                "在口語中非常常見。",
            ]},
        ],
    },
    # 6 所有格 whose
    {
        "html": """
<div class="kicker">所有格 · whose = …的</div>
<div class="card small" data-s="1">
  <div class="en">I have a friend <span class="hl">whose father</span> is a doctor.</div>
  <div class="zh">我有一個朋友，他的爸爸是醫生。</div>
</div>
<div class="card small" data-s="2">
  <div class="en">This is the house <span class="hl">whose roof</span> is red.</div>
  <div class="zh">這就是那棟紅色屋頂的房子。</div>
</div>
""",
        "steps": [
            {"say": [
                "whose 表示「…的」。",
                "I have a friend whose father is a doctor.",
                "我有一個朋友，他的爸爸是醫生。",
                "whose father 就是「他的爸爸」。",
            ]},
            {"say": [
                "事物也可以用 whose：",
                "This is the house whose roof is red.",
                "這就是那棟紅色屋頂的房子。",
            ]},
        ],
    },
    # 7 關係副詞
    {
        "html": """
<div class="kicker">關係副詞 · 地點、時間、原因</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">地</span><div class="body">
    <div class="en">This is the school <span class="hl">where</span> I studied.</div>
    <div class="zh">這是我讀過的學校。</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">時</span><div class="body">
    <div class="en">I remember the day <span class="hl">when</span> we first met.</div>
    <div class="zh">我記得我們第一次見面的那一天。</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">因</span><div class="body">
    <div class="en">That's the reason <span class="hl">why</span> he left.</div>
    <div class="zh">那就是他離開的原因。</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "如果先行詞是地點、時間或原因，就用關係副詞：where、when、why。",
                "This is the school where I studied.",
                "這是我讀過的學校。",
            ]},
            {"say": [
                "I remember the day when we first met.",
                "我記得我們第一次見面的那一天。",
                "That's the reason why he left.",
                "那就是他離開的原因。",
            ]},
        ],
    },
    # 8 限定 vs 非限定
    {
        "html": """
<div class="kicker">有沒有逗點，意思不一樣</div>
<div class="card small" data-s="1">
  <span class="tag teal">限定：沒有逗點</span>
  <div class="en">My brother <span class="hl">who lives in Taipei</span> is a teacher.</div>
  <div class="zh">我不只一個哥哥，住台北的那個是老師。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag coral">非限定：有逗點，補充說明</span>
  <div class="en">My brother<span class="hl">,</span> who lives in Taipei<span class="hl">,</span> is a teacher.</div>
  <div class="zh">我只有一個哥哥，順便補充他住台北。</div>
</div>
<div class="lead" data-s="2">逗點後面 <b class="hl">不能用 that</b></div>
""",
        "steps": [
            {"say": [
                "關係子句前面有沒有逗點，意思不一樣。",
                "沒有逗點是限定用法，用來限定是哪一個。",
                "My brother who lives in Taipei is a teacher.",
                "暗示我不只一個哥哥，住台北的那個是老師。",
            ]},
            {"say": [
                "有逗點是補充說明：My brother, who lives in Taipei, is a teacher.",
                "我只有一個哥哥，順便補充他住在台北。",
                "記得：逗點後面不能用 that。",
            ]},
        ],
    },
    # 9 常見錯誤
    {
        "html": """
<div class="kicker">小心！三個常見錯誤</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">the school where I visited</span> → This is the school <span class="hl">which</span> I visited.</div>
    <div class="zh">visited 後面缺受詞，要用關係代名詞</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">The man who he lives next door</span> → The man who lives next door is kind.</div>
    <div class="zh">who 已經是主詞，不要再多一個 he</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">3</span><div class="body">
    <div class="en"><span class="strike">My mother, that is a nurse, …</span> → My mother, <span class="hl">who</span> is a nurse, …</div>
    <div class="zh">逗點後面不能用 that</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "接著看三個常見錯誤。",
                "第一，This is the school which I visited.",
                "visited 後面缺受詞，所以要用關係代名詞 which，不能用 where。",
            ]},
            {"say": [
                "第二，The man who lives next door is kind.",
                "who 已經是子句的主詞，後面不要再多一個 he。",
            ]},
            {"say": [
                "第三，My mother, who is a nurse. 逗點後面不能用 that，要用 who。",
            ]},
        ],
    },
    # 10 小測驗
    {
        "html": """
<div class="kicker">小測驗 · 暫停想一想</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">The boy <span class="blank"><span data-s="2">who</span></span> is playing the piano is my cousin.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en">I have a friend <span class="blank"><span data-s="4">whose</span></span> mother is a singer.</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">3</span><div class="body">
    <div class="en">This is the town <span class="blank"><span data-s="6">where</span></span> I was born.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "來做個小測驗。",
                "第一題：The boy 空格 is playing the piano is my cousin.",
                "先暫停想一想。",
            ], "think": 4},
            {"say": ["答案是 who，用 that 也可以。先行詞是人，在子句裡當主詞。"]},
            {"say": ["第二題：I have a friend 空格 mother is a singer."], "think": 4},
            {"say": ["答案是 whose。他的媽媽是歌手，表示所有，用 whose。"]},
            {"say": ["第三題：This is the town 空格 I was born."], "think": 4},
            {"say": ["答案是 where。先行詞是地點，I was born 已經是完整的句子，用關係副詞 where。"]},
        ],
    },
    # 11 總結
    {
        "html": """
<div class="kicker">重點整理</div>
<table>
  <tr><th>先行詞</th><th>用</th></tr>
  <tr data-s="1"><td>人</td><td class="i">who（主格）· whom（受格）</td></tr>
  <tr data-s="1"><td>事物</td><td class="i">which</td></tr>
  <tr data-s="1"><td>人、事物</td><td class="i">that（逗點後不能用）· whose（…的）</td></tr>
  <tr data-s="1"><td>地點 / 時間 / 原因</td><td class="m">where / when / why</td></tr>
</table>
<div class="big-note center" data-s="2"><span class="mark">先找先行詞，再看它在子句裡當什麼</span></div>
""",
        "steps": [
            {"say": [
                "最後幫大家整理重點。",
                "先行詞是人，用 who 或 whom；是事物，用 which；",
                "that 人和事物都能用，但逗點後面不行；表示「…的」用 whose；",
                "地點、時間、原因，用 where、when、why。",
            ]},
            {"say": [
                "記住口訣：先找先行詞，再看它在子句裡當什麼。",
                "五支影片的文法都學完了，恭喜大家！",
                "記得多練習，我們下次見，掰掰！",
            ]},
        ],
        "style": "warm, clear and encouraging high-school English teacher, cheerful sign-off at the end",
    },
]
