"""第 4 支：not until 的用法

格式同 01_conditionals.py。
"""

TITLE = "not until 的用法"
SLUG = "04-not-until"
BRAND = "Joy 的英文小教室 · not until"

SCENES = [
    # 1 開場
    {
        "layout": "hero",
        "html": """
<div class="ghost">until</div>
<div class="kicker">高中英文文法 ④</div>
<h1>not until<br><span class="hl">直到…才…</span></h1>
<div class="lead" data-s="2">一個意思，<span class="mark"><b>三種寫法：一般句、倒裝句、強調句</b></span></div>
""",
        "steps": [
            {"say": [
                "各位同學好，我是 Joy。",
                "今天要學的是一個考試很愛考的句型：not until，",
                "意思是「直到…才…」。",
            ]},
            {"say": [
                "它還有兩種變身：倒裝句和強調句，",
                "我們今天一次搞懂。",
            ]},
        ],
    },
    # 2 基本句型
    {
        "html": """
<div class="kicker">基本句型</div>
<div class="formula" data-s="1">
  <div class="part if"><small>否定</small>S + not + V</div>
  <div class="part main"><small>時間 / 子句</small>until + …</div>
</div>
<div class="card small" data-s="1">
  <div class="en">He <span class="hl">didn't</span> go to bed <span class="hl2">until midnight</span>.</div>
  <div class="zh">他直到半夜才去睡覺。</div>
</div>
<div class="card small" data-s="2">
  <div class="en">I <span class="hl">didn't</span> know the truth <span class="hl2">until he told me</span>.</div>
  <div class="zh">直到他告訴我，我才知道真相。</div>
</div>
""",
        "steps": [
            {"say": [
                "基本句型是：主詞加否定的動詞，再加 until 和時間或子句。",
                "He didn't go to bed until midnight.",
                "他直到半夜才去睡覺。",
            ]},
            {"say": [
                "後面也可以接一個子句：",
                "I didn't know the truth until he told me.",
                "直到他告訴我，我才知道真相。",
            ]},
        ],
    },
    # 3 為什麼要否定
    {
        "html": """
<h2>中文說「才」，英文為什麼用否定？</h2>
<div class="timeline" data-s="1">
  <div class="before"><span>半夜以前：一直<b>沒有</b>去睡 ✗</span></div>
  <div class="at"><span><span class="en">midnight</span><br>去睡了 ✓</span></div>
</div>
<div class="card small" data-s="2">
  <span class="tag gold">持續性動詞（wait、stay）用肯定</span>
  <div class="en">I <span class="hl2">waited</span> until ten.</div>
  <div class="zh">我一直等到十點。</div>
</div>
""",
        "steps": [
            {"say": [
                "為什麼中文說「才」，英文卻要用否定呢？",
                "想像一條時間線：在半夜之前，他一直「沒有」去睡；",
                "到了半夜，他才去睡。",
                "所以 not until 的重點是：在那個時間點之前，事情都沒有發生。",
            ]},
            {"say": [
                "要注意，如果動詞本身是持續的，例如 wait、stay，",
                "就直接用肯定句：I waited until ten.",
                "我一直等到十點。",
            ]},
        ],
    },
    # 4 倒裝
    {
        "html": """
<div class="kicker">寫法二 · Not until 放句首要倒裝</div>
<div class="formula" data-s="1">
  <div class="part if"><small>移到句首</small>Not until + 時間 / 子句</div>
  <span class="comma">,</span>
  <div class="part main"><small>主要子句倒裝</small>助動詞 + S + 原形 V</div>
</div>
<div class="card small" data-s="2">
  <div class="en"><span class="hl">Not until midnight</span> <span class="hl2">did he go</span> to bed.</div>
  <div class="zh">他直到半夜才去睡覺。</div>
</div>
<div class="card small" data-s="3">
  <div class="en"><span class="hl">Not until he told me</span> <span class="hl2">did I know</span> the truth.</div>
  <div class="zh">until 後面的 he told me 不倒裝，倒裝的是主要子句。</div>
</div>
""",
        "steps": [
            {"say": [
                "把 not until 移到句首，後面的主要子句就要倒裝：",
                "助動詞放到主詞前面，動詞變回原形。",
            ]},
            {"say": [
                "Not until midnight did he go to bed.",
                "原本的 didn't 拆開，not 跟著 until 跑到句首，did 移到 he 前面。",
            ]},
            {"say": [
                "注意，倒裝的是主要子句，不是 until 後面的子句。",
                "Not until he told me did I know the truth.",
                "he told me 維持原樣，後面的 I knew 才變成 did I know。",
            ]},
        ],
    },
    # 5 助動詞怎麼選
    {
        "html": """
<div class="kicker">倒裝時，助動詞怎麼選？</div>
<table>
  <tr><th>原本的動詞</th><th>倒裝用</th><th>例句</th></tr>
  <tr data-s="1"><td>一般動詞過去式</td><td class="i">did</td><td class="m">… did he go to bed.</td></tr>
  <tr data-s="2"><td>一般動詞現在式</td><td class="i">do / does</td><td class="m">… do you know its value.</td></tr>
  <tr data-s="3"><td>be 動詞</td><td class="i">am / is / are / was / were</td><td class="m">… was I aware of it.</td></tr>
</table>
""",
        "steps": [
            {"say": [
                "倒裝時的助動詞，要看原本的動詞來決定。",
                "一般動詞過去式，就用 did。",
            ]},
            {"say": [
                "現在式就用 do 或 does。",
                "Not until you lose your health do you know its value.",
                "直到失去健康，你才知道它的價值。",
            ]},
            {"say": [
                "如果是 be 動詞，就直接把 be 動詞移到主詞前面。",
                "Not until then was I aware of the problem.",
                "直到那時，我才意識到這個問題。",
            ]},
        ],
    },
    # 6 強調句
    {
        "html": """
<div class="kicker">寫法三 · 強調句型</div>
<div class="formula" data-s="1">
  <div class="part if"><small>強調的時間</small>It is / was not until …</div>
  <div class="part main"><small>正常語序、肯定句</small>that + S + V</div>
</div>
<div class="card small" data-s="1">
  <div class="en"><span class="hl">It was not until</span> midnight <span class="hl2">that</span> he went to bed.</div>
  <div class="zh">他直到半夜才去睡覺。</div>
</div>
<div class="list" data-s="2">
  <div class="item"><span class="no">1</span><div class="body"><div class="zh">that 後面用正常語序，不倒裝</div></div></div>
  <div class="item"><span class="no">2</span><div class="body"><div class="zh">that 後面是肯定句（not 已經跑到前面了）</div></div></div>
</div>
""",
        "steps": [
            {"say": [
                "第三種寫法是強調句型：",
                "It was not until midnight that he went to bed.",
            ]},
            {"say": [
                "注意兩個重點：",
                "第一，that 後面用正常的語序，不用倒裝；",
                "第二，that 後面是肯定句，因為 not 已經跑到前面去了。",
            ]},
        ],
    },
    # 7 三種寫法比較
    {
        "html": """
<div class="kicker">三種寫法，意思都一樣</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">He <span class="hl">didn't</span> go to bed <span class="hl">until</span> midnight.</div>
    <div class="zh">一般句：最常用</div>
  </div></div>
  <div class="item" data-s="1"><span class="no">2</span><div class="body">
    <div class="en"><span class="hl">Not until</span> midnight <span class="hl2">did he go</span> to bed.</div>
    <div class="zh">倒裝句：最正式</div>
  </div></div>
  <div class="item" data-s="1"><span class="no">3</span><div class="body">
    <div class="en"><span class="hl">It was not until</span> midnight <span class="hl2">that</span> he went to bed.</div>
    <div class="zh">強調句：特別強調時間點</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "我們把三種寫法放在一起比較。",
                "意思完全一樣，都是：他直到半夜才去睡覺。",
                "一般句最常用，倒裝句最正式，",
                "強調句則是把時間點特別強調出來。",
                "考試常常要你在這三種寫法之間改寫喔。",
            ]},
        ],
    },
    # 8 常見錯誤
    {
        "html": """
<div class="kicker">小心！三個常見錯誤</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en"><span class="strike">Not until midnight he went to bed.</span></div>
    <div class="zh">忘記倒裝 → Not until midnight <b>did he go</b> to bed.</div>
  </div></div>
  <div class="item" data-s="2"><span class="no">2</span><div class="body">
    <div class="en"><span class="strike">Not until midnight did he went to bed.</span></div>
    <div class="zh">did 後面要用原形 → did he <b>go</b></div>
  </div></div>
  <div class="item" data-s="3"><span class="no">3</span><div class="body">
    <div class="en"><span class="strike">It was not until midnight that he didn't go to bed.</span></div>
    <div class="zh">that 後面不要再否定 → that he <b>went</b> to bed</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": ["接著看三個常見錯誤。", "第一，not until 放句首，卻忘記倒裝。"]},
            {"say": ["第二，倒裝時用了 did，後面的動詞卻忘了改回原形。"]},
            {"say": ["第三，強調句的 that 後面又用了否定。記得 that 後面是肯定句。"]},
        ],
    },
    # 9 小測驗
    {
        "html": """
<div class="kicker">小測驗 · 暫停想一想</div>
<div class="list">
  <div class="item" data-s="1"><span class="no">1</span><div class="body">
    <div class="en">Not until the teacher came in <span class="blank"><span data-s="2">did</span></span> the students stop talking.</div>
  </div></div>
  <div class="item" data-s="3"><span class="no">2</span><div class="body">
    <div class="en">Not until then <span class="blank"><span data-s="4">was</span></span> I aware of the danger.</div>
  </div></div>
  <div class="item" data-s="5"><span class="no">3</span><div class="body">
    <div class="en">It was not until 2020 <span class="blank"><span data-s="6">that</span></span> she learned to drive.</div>
  </div></div>
</div>
""",
        "steps": [
            {"say": [
                "來做個小測驗。",
                "第一題：Not until the teacher came in 空格 the students stop talking.",
                "空格要填什麼？先暫停想一想。",
            ], "think": 4},
            {"say": ["答案是 did。stop 是一般動詞過去式的句子，倒裝用 did，後面 stop 用原形。"]},
            {"say": ["第二題：Not until then 空格 I aware of the danger."], "think": 4},
            {"say": ["答案是 was。aware 前面需要 be 動詞，倒裝就把 was 移到主詞前面。"]},
            {"say": ["第三題：It was not until 2020 空格 she learned to drive."], "think": 4},
            {"say": ["答案是 that。這是強調句型，It was not until 加時間，再加 that。"]},
        ],
    },
    # 10 總結
    {
        "html": """
<div class="kicker">重點整理</div>
<table>
  <tr><th>寫法</th><th>句型</th></tr>
  <tr data-s="1"><td>一般句</td><td class="i">S + not + V + until …</td></tr>
  <tr data-s="1"><td>倒裝句</td><td class="i">Not until … + 助動詞 + S + 原形 V</td></tr>
  <tr data-s="1"><td>強調句</td><td class="i">It is / was not until … that + S + V</td></tr>
</table>
<div class="big-note center" data-s="2"><span class="mark">倒裝在主要子句，that 後面是肯定句</span></div>
""",
        "steps": [
            {"say": [
                "最後幫大家整理重點。",
                "not until 有三種寫法：一般句、倒裝句、強調句。",
                "倒裝的是主要子句，強調句的 that 後面是正常語序的肯定句。",
            ]},
            {"say": [
                "下一支影片，也是這個系列的最後一支，我們來學關係子句。",
                "我們下次見，掰掰！",
            ]},
        ],
        "style": "warm, clear and encouraging high-school English teacher, cheerful sign-off at the end",
    },
]
