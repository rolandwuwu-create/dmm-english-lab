"""第 2 支：分詞構句（Participial Constructions）

格式同 01_conditionals.py。
"""

TITLE = "分詞構句"
SLUG = "02-participial-constructions"
BRAND = "Joy 的英文小教室 · 分詞構句"

SCENES = [
    # 1 開場
    {
        "layout": "hero",
        "html": """
<div class="ghost">-ing</div>
<div class="kicker">高中英文文法 ②</div>
<h1>分詞構句<br><span class="en hl">Walking home, I…</span></h1>
<div class="lead" data-s="2">三步驟：<span class="mark"><b>刪連接詞 → 刪主詞 → 動詞改分詞</b></span></div>
""",
        "steps": [
            {"say": [
                "各位同學好，我是 Joy。",
                "今天要學的，是讓句子變得更精簡、更有文采的文法：分詞構句。",
            ]},
            {"say": [
                "只要學會三個步驟，",
                "你就能把兩個句子漂亮地合在一起。",
            ]},
        ],
    },
    # 2 什麼是分詞構句
    {
        "html": """
<h2>什麼是分詞構句？</h2>
<div class="card small" data-s="1">
  <span class="tag indigo">原本：副詞子句 + 主要子句</span>
  <div class="en"><span class="hl2">When I walked</span> home, I saw an old friend.</div>
  <div class="zh">我走路回家時，遇到一位老朋友。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag coral">分詞構句：更簡潔</span>
  <div class="en"><span class="hl">Walking</span> home, I saw an old friend.</div>
  <div class="zh">意思一樣，但少了連接詞和重複的主詞。</div>
</div>
""",
        "steps": [
            {"say": [
                "先看這個句子：",
                "When I walked home, I saw an old friend.",
                "我走路回家時，遇到一位老朋友。",
            ]},
            {"say": [
                "把它改成：Walking home, I saw an old friend.",
                "意思一樣，但更簡潔。",
                "這就是分詞構句：把副詞子句，簡化成以分詞開頭的結構。",
            ]},
        ],
    },
    # 3 三步驟
    {
        "html": """
<div class="kicker">改寫三步驟</div>
<div class="card small">
  <div class="en">Because she was tired, she went to bed early.</div>
</div>
<div class="list">
  <div class="item" data-s="2"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">Because</span> she was tired, …</div>
    <div class="zh">刪掉連接詞</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">Because she</span> was tired, …</div>
    <div class="zh">前後主詞相同，刪掉前面的主詞</div>
  </div></div>
  <div class="item" data-s="4"><span class="no">3</span><div class="body">
    <div class="en"><span class="hl">Being</span> tired, she went to bed early.</div>
    <div class="zh">動詞改成分詞：was → being</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">★</span><div class="body">
    <div class="en"><span class="strike">Being</span> <span class="hl">Tired</span>, she went to bed early.</div>
    <div class="zh">being 通常可以省略</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "改寫只要三個步驟。",
                "我們以 Because she was tired, she went to bed early. 為例。",
            ]},
            {"say": ["第一步，刪掉連接詞 because。"]},
            {"say": ["第二步，前後兩個主詞都是 she，所以刪掉前面的 she。"]},
            {"say": [
                "第三步，把動詞改成分詞：was 變成 being。",
                "得到：Being tired, she went to bed early.",
            ]},
            {"say": [
                "而 being 通常可以省略，",
                "變成：Tired, she went to bed early. 她因為很累，所以早早就去睡了。",
            ]},
        ],
    },
    # 4 主動 V-ing / 被動 p.p.
    {
        "html": """
<div class="kicker">V-ing 還是 p.p.？看主詞和動作的關係</div>
<div class="card small" data-s="1">
  <span class="tag coral">主動 → V-ing</span>
  <div class="en"><span class="hl">Hearing</span> the news, she burst into tears.</div>
  <div class="zh">聽到消息，她突然哭了出來。（她自己聽到）</div>
</div>
<div class="card small" data-s="2">
  <span class="tag indigo">被動 → p.p.</span>
  <div class="en"><span class="hl2">Written</span> in simple English, the book is easy to read.</div>
  <div class="zh">這本書是用簡單英文寫的，所以很好讀。（書是被寫的）</div>
</div>
""",
        "steps": [
            {"say": [
                "分詞要用 V-ing 還是過去分詞，關鍵在主詞和動作的關係。",
                "主詞自己做動作，是主動，用 V-ing。",
                "例如：Hearing the news, she burst into tears.",
                "聽到消息，她突然哭了出來。",
                "是她自己聽到，所以用 Hearing。",
            ]},
            {"say": [
                "如果主詞是被動作的，就用過去分詞。",
                "例如：Written in simple English, the book is easy to read.",
                "這本書是用簡單英文寫的，所以很好讀。",
                "書是被寫的，所以用 Written。",
            ]},
        ],
    },
    # 5 Having p.p.
    {
        "html": """
<div class="kicker">動作先發生 · Having + p.p.</div>
<div class="formula" data-s="1">
  <div class="part if"><small>先發生的動作</small>Having + p.p.</div>
  <span class="comma">,</span>
  <div class="part main"><small>後發生的動作</small>S + V</div>
</div>
<div class="card small" data-s="2">
  <div class="en"><span class="hl">Having finished</span> my homework, I went out to play basketball.</div>
  <div class="zh">寫完功課之後，我出去打籃球。</div>
  <div class="fact">先寫完功課，才去打球</div>
</div>
""",
        "steps": [
            {"say": [
                "如果前面的動作，比主要子句的動作更早完成，",
                "就用 having 加過去分詞。",
            ]},
            {"say": [
                "例如：Having finished my homework, I went out to play basketball.",
                "寫完功課之後，我出去打籃球。",
                "先寫完功課，才去打球，所以用 Having finished。",
            ]},
        ],
    },
    # 6 否定
    {
        "html": """
<div class="kicker">否定 · not 放在分詞前面</div>
<div class="formula" data-s="1">
  <div class="part if"><small>否定的分詞構句</small>Not + V-ing / p.p.</div>
</div>
<div class="card small" data-s="2">
  <div class="en"><span class="hl">Not knowing</span> what to do, he asked the teacher for help.</div>
  <div class="zh">不知道該怎麼辦，他向老師求助。</div>
</div>
<div class="lead" data-s="2"><span class="strike">Knowing not</span>　→　<b class="hl">Not knowing</b></div>
""",
        "steps": [
            {"say": ["否定的分詞構句，只要把 not 放在分詞前面。"]},
            {"say": [
                "例如：Not knowing what to do, he asked the teacher for help.",
                "不知道該怎麼辦，他向老師求助。",
                "記得 not 要放在最前面喔。",
            ]},
        ],
    },
    # 7 保留連接詞
    {
        "html": """
<div class="kicker">意思更清楚 · 保留連接詞</div>
<div class="lead" data-s="1">常保留：<b class="hl2">when / while / after / before</b></div>
<div class="card small" data-s="2">
  <div class="en"><span class="hl2">While</span> <span class="hl">doing</span> my homework, I listened to music.</div>
  <div class="zh">我一邊寫功課，一邊聽音樂。</div>
</div>
<div class="card small" data-s="3">
  <div class="en"><span class="hl2">After</span> <span class="hl">finishing</span> dinner, we took a walk.</div>
  <div class="zh">吃完晚餐後，我們去散步。</div>
</div>
""",
        "steps": [
            {"say": [
                "有時候為了讓意思更清楚，可以保留連接詞，",
                "像是 when、while、after、before。",
            ]},
            {"say": [
                "例如：While doing my homework, I listened to music.",
                "我一邊寫功課，一邊聽音樂。",
            ]},
            {"say": [
                "還有：After finishing dinner, we took a walk.",
                "吃完晚餐後，我們去散步。",
            ]},
        ],
    },
    # 8 獨立分詞構句 / with
    {
        "html": """
<div class="kicker">主詞不同 · 獨立分詞構句</div>
<div class="card small" data-s="1">
  <span class="tag gold">主詞不同，要保留主詞</span>
  <div class="en"><span class="mark">The weather</span> <span class="hl">being</span> nice, <span class="mark">we</span> went hiking.</div>
  <div class="zh">天氣很好，我們就去爬山了。</div>
</div>
<div class="card small" data-s="2">
  <span class="tag indigo">with + 受詞 + 分詞</span>
  <div class="en">He sat there with his eyes <span class="hl2">closed</span>.</div>
  <div class="zh">他閉著眼睛坐在那裡。（眼睛是被閉上的）</div>
</div>
""",
        "steps": [
            {"say": [
                "如果前後的主詞不同，就不能刪掉主詞，要保留下來，",
                "這叫做獨立分詞構句。",
                "例如：The weather being nice, we went hiking.",
                "天氣很好，我們就去爬山了。",
                "天氣和我們是不同的主詞，所以 the weather 要留著。",
            ]},
            {"say": [
                "另外，with 加受詞加分詞，也很常見。",
                "He sat there with his eyes closed.",
                "他閉著眼睛坐在那裡。",
                "眼睛是被閉上的，所以用 closed。",
            ]},
        ],
    },
    # 9 常見錯誤
    {
        "html": """
<div class="kicker">小心！兩個常見錯誤</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">Walking into the room, the lights turned on.</span></div>
    <div class="en">→ Walking into the room, <span class="hl">I</span> turned on the lights.</div>
    <div class="zh">分詞的主詞要和主要子句的主詞一致（燈不會走路）</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">Seeing from the mountain, …</span></div>
    <div class="en">→ <span class="hl">Seen</span> from the mountain, the city looks beautiful.</div>
    <div class="zh">城市是「被看」的，要用過去分詞</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "最常見的錯誤是：分詞的主詞，跟主要子句的主詞不一致。",
                "例如：Walking into the room, the lights turned on.",
                "這句話變成燈走進房間，很奇怪吧？",
                "要改成：Walking into the room, I turned on the lights.",
            ]},
            {"say": [
                "第二個錯誤是主被動搞錯。",
                "Seen from the mountain, the city looks beautiful.",
                "從山上看，這座城市很美。",
                "城市是被看的，所以要用 Seen，不是 Seeing。",
            ]},
        ],
    },
    # 10 小測驗
    {
        "html": """
<div class="kicker">小測驗 · 暫停想一想</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="blank"><span data-s="2">Feeling</span></span> (feel) sick, Tom stayed home.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en"><span class="blank"><span data-s="4">Built</span></span> (build) in 1900, the house is very old.</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">3</span><div class="body">
    <div class="en"><span class="blank"><span data-s="6">Not knowing</span></span> (not know) the answer, I kept silent.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "來做個小測驗。",
                "第一題：空格 sick, Tom stayed home.",
                "請用 feel 的正確形態。先暫停想一想。",
            ], "think": 4},
            {"say": ["答案是 Feeling。Tom 自己覺得不舒服，是主動，用 V-ing。"]},
            {"say": [
                "第二題：空格 in 1900, the house is very old.",
                "請用 build 的正確形態。",
            ], "think": 4},
            {"say": ["答案是 Built。房子是被蓋的，是被動，用過去分詞。"]},
            {"say": [
                "第三題：空格 the answer, I kept silent.",
                "請用 not know 的正確形態。",
            ], "think": 4},
            {"say": ["答案是 Not knowing。否定的分詞構句，not 要放在分詞前面。"]},
        ],
    },
    # 11 總結
    {
        "html": """
<div class="kicker">重點整理</div>
<table class="compact">
  <tr><th>情況</th><th>用法</th><th>例句</th></tr>
  <tr data-s="1"><td>主動</td><td class="i">V-ing</td><td class="m">Hearing the news, …</td></tr>
  <tr data-s="1"><td>被動</td><td class="i">p.p.</td><td class="m">Written in English, …</td></tr>
  <tr data-s="1"><td>動作先發生</td><td class="i">Having + p.p.</td><td class="m">Having finished, …</td></tr>
  <tr data-s="1"><td>否定</td><td class="i">Not + 分詞</td><td class="m">Not knowing, …</td></tr>
  <tr data-s="1"><td>主詞不同</td><td class="i">保留主詞</td><td class="m">The weather being nice, …</td></tr>
</table>
<div class="big-note center" data-s="2">口訣：<span class="mark">刪連接詞 → 刪主詞 → 改分詞</span></div>
""",
        "steps": [
            {"say": [
                "最後幫大家整理重點。",
                "主動用 V-ing，被動用過去分詞；",
                "動作先發生，用 having 加過去分詞；",
                "否定就把 not 放在前面；",
                "主詞不同，要保留主詞。",
            ]},
            {"say": [
                "記住三步驟：刪連接詞、刪主詞、動詞改分詞。",
                "下一支影片，我們來學分詞片語。",
                "我們下次見，掰掰！",
            ]},
        ],
        "style": "warm, clear and encouraging high-school English teacher, cheerful sign-off at the end",
    },
]
