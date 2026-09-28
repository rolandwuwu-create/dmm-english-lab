"""第 3 支：分詞片語（Participial Phrases：分詞當形容詞）

格式同 01_conditionals.py。
"""

TITLE = "分詞片語"
SLUG = "03-participial-phrases"
BRAND = "Joy 的英文小教室 · 分詞片語"

SCENES = [
    # 1 開場
    {
        "layout": "hero",
        "html": """
<div class="ghost">-ed</div>
<div class="kicker">高中英文文法 ③</div>
<h1>分詞片語<br><span class="en hl">the boy standing there</span></h1>
<div class="lead" data-s="2">口訣：<span class="mark"><b>主動進行用 V-ing，被動完成用 p.p.</b></span></div>
""",
        "steps": [
            {"say": [
                "各位同學好，我是 Joy。",
                "上一支影片我們學了分詞構句，今天來學它的好朋友：分詞片語。",
            ]},
            {"say": [
                "分詞片語就像形容詞，專門用來修飾名詞。",
                "只要記住一句口訣：主動進行用 V-ing，被動完成用過去分詞。",
            ]},
        ],
    },
    # 2 分詞放名詞前
    {
        "html": """
<h2>分詞可以當形容詞</h2>
<div class="row">
  <div class="card" data-s="1">
    <span class="tag coral">V-ing · 主動、進行</span>
    <div class="en">a <span class="hl">sleeping</span> baby</div>
    <div class="zh">一個正在睡覺的嬰兒</div>
    <div class="fact">嬰兒自己在睡</div>
  </div>
  <div class="card" data-s="2">
    <span class="tag indigo">p.p. · 被動、完成</span>
    <div class="en">a <span class="hl2">broken</span> window</div>
    <div class="zh">一扇被打破的窗戶</div>
    <div class="fact">窗戶是被打破的</div>
  </div>
</div>
""",
        "steps": [
            {"say": [
                "先從最簡單的開始。",
                "分詞可以直接放在名詞前面，當形容詞用。",
                "a sleeping baby，一個正在睡覺的嬰兒。",
                "嬰兒自己在睡覺，是主動、進行，所以用 V-ing。",
            ]},
            {"say": [
                "a broken window，一扇被打破的窗戶。",
                "窗戶是被人打破的，是被動、完成，所以用過去分詞。",
            ]},
        ],
    },
    # 3 片語放名詞後
    {
        "html": """
<div class="kicker">一個字放前面，一整串放後面</div>
<div class="card small" data-s="1">
  <div class="en">The boy <span class="hl">standing by the door</span> is my brother.</div>
  <div class="zh">站在門邊的男孩是我哥哥。</div>
</div>
<div class="card small" data-s="2">
  <div class="en">I bought a book <span class="hl2">written in English</span>.</div>
  <div class="zh">我買了一本用英文寫的書。</div>
</div>
""",
        "steps": [
            {"say": [
                "如果分詞後面還帶著其他字，變成一整個片語，",
                "就要放在名詞的後面。",
                "例如：The boy standing by the door is my brother.",
                "站在門邊的男孩是我哥哥。",
            ]},
            {"say": [
                "再看：I bought a book written in English.",
                "我買了一本用英文寫的書。",
                "書是被寫的，所以用 written。",
            ]},
        ],
    },
    # 4 關係子句的簡化
    {
        "html": """
<div class="kicker">其實是關係子句的簡化</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">the boy <span class="strike">who is</span> <span class="hl">standing</span> by the door</div>
    <div class="zh">刪掉「關係代名詞 + be 動詞」</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en">a book <span class="strike">which was</span> <span class="hl2">written</span> in English</div>
    <div class="zh">被動的 be + p.p.，刪掉後留下 p.p.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">3</span><div class="body">
    <div class="en">students <span class="strike">who want</span> → students <span class="hl">wanting</span> to join the club</div>
    <div class="zh">沒有 be 動詞：把動詞改成 V-ing</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "其實分詞片語，就是關係子句的簡化。",
                "The boy who is standing by the door，",
                "把 who is 刪掉，就變成 The boy standing by the door.",
            ]},
            {"say": [
                "a book which was written in English，",
                "把 which was 刪掉，就是 a book written in English.",
            ]},
            {"say": [
                "如果關係子句裡沒有 be 動詞，就把動詞改成 V-ing。",
                "students who want to join the club，",
                "變成 students wanting to join the club，想參加社團的學生。",
                "關係子句我們在第五支影片會詳細介紹。",
            ]},
        ],
    },
    # 5 情緒形容詞
    {
        "html": """
<div class="kicker">最常考的陷阱 · 情緒形容詞</div>
<div class="row">
  <div class="card small" data-s="1">
    <span class="tag coral">V-ing = 令人…的</span>
    <div class="en">The movie is <span class="hl">boring</span>.</div>
    <div class="zh">這部電影很無聊。</div>
  </div>
  <div class="card small" data-s="1">
    <span class="tag indigo">p.p. = 感到…的</span>
    <div class="en">I am <span class="hl2">bored</span>.</div>
    <div class="zh">我覺得很無聊。</div>
  </div>
</div>
<div class="lead" data-s="2">interesting / interested · exciting / excited · surprising / surprised</div>
<div class="card small" data-s="3">
  <div class="en"><span class="strike">I am boring.</span> → 我是個很無聊的人 😅</div>
</div>
""",
        "steps": [
            {"say": [
                "分詞最常考的陷阱，就是情緒形容詞。",
                "V-ing 表示「令人…的」，用來形容帶來這種感覺的人或事物；",
                "過去分詞表示「感到…的」，形容有這種感覺的人。",
                "The movie is boring. 這部電影很無聊。",
                "I am bored. 我覺得很無聊。",
            ]},
            {"say": [
                "interesting 和 interested、exciting 和 excited、",
                "surprising 和 surprised，都是一樣的道理。",
            ]},
            {"say": [
                "如果你說 I am boring，",
                "意思就變成：我是個很無聊的人喔！",
            ]},
        ],
    },
    # 6 分詞當受詞補語
    {
        "html": """
<div class="kicker">分詞當補語 · 說明受詞的狀態</div>
<div class="card small" data-s="1">
  <span class="tag coral">受詞主動 → V-ing</span>
  <div class="en">I saw him <span class="hl">crossing</span> the street.</div>
  <div class="zh">我看到他正在過馬路。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag indigo">受詞被動 → p.p.</span>
  <div class="en">I had my hair <span class="hl2">cut</span> yesterday.</div>
  <div class="zh">我昨天去剪了頭髮。（頭髮是被剪的）</div>
</div>
""",
        "steps": [
            {"say": [
                "分詞也能放在受詞後面，補充說明受詞的狀態。",
                "I saw him crossing the street.",
                "我看到他正在過馬路。",
                "他自己在過馬路，所以用 V-ing。",
            ]},
            {"say": [
                "I had my hair cut yesterday.",
                "我昨天去剪了頭髮。",
                "頭髮是被剪的，所以用過去分詞 cut。",
            ]},
        ],
    },
    # 7 常見錯誤
    {
        "html": """
<div class="kicker">小心！三個常見錯誤</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">The girl sat next to me</span> → The girl <span class="hl">sitting</span> next to me is Amy.</div>
    <div class="zh">女孩自己坐著，是主動，用 V-ing</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">the language speaking</span> → The language <span class="hl">spoken</span> in Brazil is Portuguese.</div>
    <div class="zh">語言是被說的，用 p.p.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">3</span><div class="body">
    <div class="en"><span class="strike">I am interesting in music.</span> → I am <span class="hl">interested</span> in music.</div>
    <div class="zh">「感到」有興趣，用 p.p.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "接著提醒三個常見錯誤。",
                "第一，The girl sitting next to me is Amy. 坐在我旁邊的女孩是 Amy。",
                "女孩自己坐著，是主動，要用 sitting。",
            ]},
            {"say": [
                "第二，The language spoken in Brazil is Portuguese. 巴西說的語言是葡萄牙語。",
                "語言是被說的，要用 spoken。",
            ]},
            {"say": [
                "第三，I am interested in music. 我對音樂有興趣。",
                "是我感到有興趣，要用 interested。",
            ]},
        ],
    },
    # 8 小測驗
    {
        "html": """
<div class="kicker">小測驗 · 暫停想一想</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">The man <span class="blank"><span data-s="2">wearing</span></span> (wear) a black hat is my teacher.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en">English is a language <span class="blank"><span data-s="4">spoken</span></span> (speak) all over the world.</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">3</span><div class="body">
    <div class="en">The students were <span class="blank"><span data-s="6">excited</span></span> (excite) about the school trip.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "來做個小測驗。",
                "第一題：The man 空格 a black hat is my teacher.",
                "請用 wear 的正確形態。先暫停想一想。",
            ], "think": 4},
            {"say": ["答案是 wearing。那個人自己戴著帽子，是主動，用 V-ing。"]},
            {"say": [
                "第二題：English is a language 空格 all over the world.",
                "請用 speak 的正確形態。",
            ], "think": 4},
            {"say": ["答案是 spoken。英語是被說的，是被動，用過去分詞。"]},
            {"say": [
                "第三題：The students were 空格 about the school trip.",
                "請用 excite 的正確形態。",
            ], "think": 4},
            {"say": ["答案是 excited。學生感到興奮，用過去分詞。"]},
        ],
    },
    # 9 總結
    {
        "html": """
<div class="kicker">重點整理</div>
<table>
  <tr><th>分詞</th><th>意思</th><th>例子</th></tr>
  <tr data-s="1"><td>V-ing</td><td class="i">主動、進行、令人…的</td><td class="m">a sleeping baby · boring</td></tr>
  <tr data-s="1"><td>p.p.</td><td class="i">被動、完成、感到…的</td><td class="m">a broken window · bored</td></tr>
</table>
<div class="lead" data-s="1">一個字放名詞前，一整串放名詞後</div>
<div class="big-note center" data-s="2">口訣：<span class="mark">主動進行 V-ing，被動完成 p.p.</span></div>
""",
        "steps": [
            {"say": [
                "最後幫大家整理重點。",
                "V-ing 表示主動、進行，或是令人怎麼樣的；",
                "過去分詞表示被動、完成，或是感到怎麼樣的。",
                "一個字放名詞前面，一整串放名詞後面。",
            ]},
            {"say": [
                "記住口訣：主動進行用 V-ing，被動完成用過去分詞。",
                "下一支影片，我們來學 not until 的用法。",
                "我們下次見，掰掰！",
            ]},
        ],
        "style": "warm, clear and encouraging high-school English teacher, cheerful sign-off at the end",
    },
]
