import type { GenreName } from "@/lib/genres";
import type { Locale } from "@/lib/i18n";

export type GuideSlide = {
  icon: string;
  title: string;
  body: string;
  accent: string;
};

export type FlowCopy = {
  pickTitle: string;
  pickDesc: string;
  chooseDifficulty: string;
  starterLevel: string;
  currentLevel: string;
  streakLabel: string;
  missesLabel: string;
  loading: string;
  loadingSub: string;
  letsPlay: string;
  next: string;
  back: string;
  currentScore: string;
  clues: string;
  answerPrompt: string;
  hintPrompt: string;
  scoreHint: string;
  submitAnswer: string;
  askHint: string;
  giveUp: string;
  feed: string;
  winTitle: string;
  winBody: string;
  lossTitle: string;
  lossBody: string;
  playSame: string;
  trySomethingElse: string;
};

function lang(locale: Locale): Locale {
  return locale;
}

export function getFlowCopy(locale: Locale): FlowCopy {
  switch (lang(locale)) {
    case "ko":
      return {
        pickTitle: "오늘의 게임을 고르세요",
        pickDesc: "바로 감이 오는 장르 하나를 고르면, 처음일 때만 짧은 가이드를 보고 곧바로 플레이할 수 있어요.",
        chooseDifficulty: "시작 난이도",
        starterLevel: "첫 시작 레벨",
        currentLevel: "현재 레벨",
        streakLabel: "연승",
        missesLabel: "연속 실패",
        loading: "새 라운드를 준비하고 있어요",
        loadingSub: "단서와 비주얼을 다듬는 중입니다.",
        letsPlay: "게임 시작하기",
        next: "다음",
        back: "뒤로",
        currentScore: "현재 점수",
        clues: "단서",
        answerPrompt: "정답을 입력해 보세요",
        hintPrompt: "막히면 질문으로 힌트를 받아보세요",
        scoreHint: "힌트를 사용하면 정답 시 받을 포인트가 50%로 줄어듭니다.",
        submitAnswer: "정답 제출",
        askHint: "힌트 요청",
        giveUp: "이번 판 포기",
        feed: "이번 라운드 기록",
        winTitle: "정답입니다",
        winBody: "점수를 얻었어요. 같은 장르로 한 판 더 하거나, 홈으로 돌아가 다른 게임을 시도할 수 있습니다.",
        lossTitle: "이번 판은 놓쳤어요",
        lossBody: "연승은 끊겼고, 누적 실패에 따라 난이도가 조정될 수 있습니다. 같은 장르로 다시 감을 올리거나, 홈으로 돌아가 다른 게임을 시도해 보세요.",
        playSame: "비슷한 게임 한 판 더",
        trySomethingElse: "홈으로 돌아가기",
      };
    case "fr":
      return {
        pickTitle: "Choisissez votre jeu",
        pickDesc: "Choisissez le type qui vous attire, lisez le guide rapide si c'est votre première fois, puis lancez directement la partie.",
        chooseDifficulty: "Difficulté de départ",
        starterLevel: "Niveau de départ",
        currentLevel: "Niveau actuel",
        streakLabel: "Série",
        missesLabel: "Échecs d'affilée",
        loading: "Préparation de la prochaine manche",
        loadingSub: "Nous mettons en place les indices et les visuels.",
        letsPlay: "Lancer la partie",
        next: "Suivant",
        back: "Retour",
        currentScore: "Score actuel",
        clues: "Indices",
        answerPrompt: "Entrez votre réponse",
        hintPrompt: "Si vous bloquez, posez une question pour obtenir un indice",
        scoreHint: "Utiliser un indice réduit la récompense de la manche à 50%.",
        submitAnswer: "Envoyer la réponse",
        askHint: "Demander un indice",
        giveUp: "Abandonner cette manche",
        feed: "Fil de manche",
        winTitle: "Bonne réponse",
        winBody: "Vous avez gagné des points. Vous pouvez enchaîner avec une autre manche du même style ou revenir à l'accueil pour essayer autre chose.",
        lossTitle: "Cette manche vous échappe",
        lossBody: "Votre série s'arrête et la difficulté peut baisser après plusieurs échecs. Rejouez ce style ou revenez à l'accueil pour changer d'ambiance.",
        playSame: "Rejouer ce style",
        trySomethingElse: "Retour à l'accueil",
      };
    case "zh-CN":
      return {
        pickTitle: "选择你想玩的游戏",
        pickDesc: "挑一个最吸引你的类型。如果是第一次，我们会先给你一个很短的玩法说明，然后立刻开玩。",
        chooseDifficulty: "起始难度",
        starterLevel: "初始等级",
        currentLevel: "当前等级",
        streakLabel: "连胜",
        missesLabel: "连续失败",
        loading: "正在准备下一局",
        loadingSub: "线索和视觉内容正在整理中。",
        letsPlay: "开始游戏",
        next: "下一步",
        back: "返回",
        currentScore: "当前分数",
        clues: "线索",
        answerPrompt: "输入你的答案",
        hintPrompt: "卡住时可以提问换取提示",
        scoreHint: "使用提示后，本局答对只会获得 50% 分数。",
        submitAnswer: "提交答案",
        askHint: "请求提示",
        giveUp: "放弃这一局",
        feed: "本局记录",
        winTitle: "答对了",
        winBody: "你获得了分数。可以继续玩同类型新一局，或回到首页尝试别的游戏。",
        lossTitle: "这一局失手了",
        lossBody: "连胜已中断，连续失误较多时难度也可能下降。你可以再来同类型一局，或回到首页换一种玩法。",
        playSame: "再来一局同类型",
        trySomethingElse: "返回首页",
      };
    case "zh-HK":
      return {
        pickTitle: "揀一款你想玩的遊戲",
        pickDesc: "揀最吸引你的類型。如果是第一次，我們會先給你一段很短的玩法說明，之後立即開始。",
        chooseDifficulty: "起始難度",
        starterLevel: "初始等級",
        currentLevel: "目前等級",
        streakLabel: "連勝",
        missesLabel: "連續失敗",
        loading: "正在準備下一局",
        loadingSub: "線索與視覺內容正在整理中。",
        letsPlay: "開始遊戲",
        next: "下一步",
        back: "返回",
        currentScore: "目前分數",
        clues: "線索",
        answerPrompt: "輸入你的答案",
        hintPrompt: "卡住時可以發問換取提示",
        scoreHint: "用過提示後，答中本局只會得到 50% 分數。",
        submitAnswer: "提交答案",
        askHint: "索取提示",
        giveUp: "放棄呢一局",
        feed: "本局紀錄",
        winTitle: "你答對了",
        winBody: "你已經獲得分數。可以即場再玩同一類型，或者返回主頁試其他遊戲。",
        lossTitle: "今局未能破解",
        lossBody: "連勝已中斷，連續失誤多咗時難度亦可能下降。你可以即刻再玩同類型，或者返主頁試另一種遊戲。",
        playSame: "再玩同類一局",
        trySomethingElse: "返回主頁",
      };
    case "es":
      return {
        pickTitle: "Elige tu juego",
        pickDesc: "Escoge el tipo que más te llame. Si es tu primera vez, verás una guía breve antes de entrar directo en la partida.",
        chooseDifficulty: "Dificultad inicial",
        starterLevel: "Nivel inicial",
        currentLevel: "Nivel actual",
        streakLabel: "Racha",
        missesLabel: "Fallos seguidos",
        loading: "Preparando la siguiente ronda",
        loadingSub: "Estamos afinando pistas y visuales.",
        letsPlay: "Vamos a jugar",
        next: "Siguiente",
        back: "Atrás",
        currentScore: "Puntuación actual",
        clues: "Pistas",
        answerPrompt: "Escribe tu respuesta",
        hintPrompt: "Si te atascas, haz una pregunta para pedir una pista",
        scoreHint: "Si usas una pista, esa ronda solo paga el 50% de los puntos.",
        submitAnswer: "Enviar respuesta",
        askHint: "Pedir pista",
        giveUp: "Rendirse en esta ronda",
        feed: "Registro de la ronda",
        winTitle: "Respuesta correcta",
        winBody: "Has ganado puntos. Puedes jugar otra ronda del mismo estilo o volver al inicio para probar algo distinto.",
        lossTitle: "Esta ronda se escapó",
        lossBody: "La racha se corta y, si acumulas fallos, la dificultad puede bajar. Puedes volver a intentar este estilo o regresar al inicio.",
        playSame: "Otra del mismo estilo",
        trySomethingElse: "Volver al inicio",
      };
    default:
      return {
        pickTitle: "Pick Your Game",
        pickDesc: "Choose the format that feels the most fun right now. If it is your first time, you will get a short guide before the round begins.",
        chooseDifficulty: "Starting difficulty",
        starterLevel: "Starter level",
        currentLevel: "Current level",
        streakLabel: "Win streak",
        missesLabel: "Misses in a row",
        loading: "Building your next round",
        loadingSub: "We are putting the clues and visuals in place.",
        letsPlay: "Let's play the game",
        next: "Next",
        back: "Back",
        currentScore: "Current score",
        clues: "Clues",
        answerPrompt: "Type your answer",
        hintPrompt: "Need a nudge? Ask a question for a hint.",
        scoreHint: "Using a hint cuts the round reward to 50% if you solve it.",
        submitAnswer: "Submit answer",
        askHint: "Ask for hint",
        giveUp: "Give up this round",
        feed: "Round feed",
        winTitle: "You got it",
        winBody: "You earned points. You can jump straight into another round of the same style or head home and try something new.",
        lossTitle: "That round got away",
        lossBody: "Your streak resets, and enough misses can drop the difficulty. You can run it back in the same genre or head home for something different.",
        playSame: "Play another similar round",
        trySomethingElse: "Go back home",
      };
  }
}

export function getGuideSlides(locale: Locale, genre: GenreName): GuideSlide[] {
  const l = lang(locale);
  const guides: Record<GenreName, GuideSlide[]> = {
    Riddles: [
      {
        icon: "🧩",
        title:
          l === "ko" ? "단어의 방향을 바꿔보세요" :
          l === "fr" ? "Changez d'angle sur les mots" :
          l === "zh-CN" ? "试着换个角度理解文字" :
          l === "zh-HK" ? "試下用另一個角度理解字眼" :
          l === "es" ? "Cambia el ángulo de la pista" :
          "Change your angle on the clue",
        body:
          l === "ko" ? "Riddles 는 첫 느낌보다 해석의 전환이 중요합니다. 너무 당연한 답처럼 보이면 한 번 더 비틀어 생각해 보세요." :
          l === "fr" ? "Dans Riddles, le bon réflexe est rarement le premier. Si la réponse semble trop évidente, cherchez le changement de perspective." :
          l === "zh-CN" ? "在谜语局里，第一直觉往往不够。若答案太直接，通常还差一个视角转换。" :
          l === "zh-HK" ? "喺謎語局入面，第一直覺通常未夠。如果答案太直接，多數仲差一個角度轉換。" :
          l === "es" ? "En este modo, la primera idea rara vez es la mejor. Si la respuesta parece demasiado obvia, cambia de perspectiva." :
          "Riddles work best when you challenge the first obvious answer. If the clue feels too direct, the twist is usually in the wording.",
        accent: "from-amber-300/20 via-rose-300/10 to-transparent",
      },
      {
        icon: "✨",
        title:
          l === "ko" ? "단서끼리 모순이 없는지 보세요" :
          l === "fr" ? "Vérifiez que tout tient ensemble" :
          l === "zh-CN" ? "确认所有线索都说得通" :
          l === "zh-HK" ? "確認所有線索都講得通" :
          l === "es" ? "Comprueba que todo encaje" :
          "Make every clue fit",
        body:
          l === "ko" ? "정답은 모든 단서와 동시에 맞아떨어져야 합니다. 하나라도 어색하면 아직 정답이 아닐 가능성이 큽니다." :
          l === "fr" ? "La bonne réponse doit tenir face à chaque indice en même temps. Si un détail bloque, continuez à chercher." :
          l === "zh-CN" ? "真正的答案必须同时解释所有线索。只要有一个细节别扭，就还没到位。" :
          l === "zh-HK" ? "真正答案一定要同時解釋晒所有線索。只要有一個位唔順，就未係最好答案。" :
          l === "es" ? "La respuesta correcta tiene que sostenerse con todas las pistas a la vez. Si una falla, sigue buscando." :
          "The winning answer is the one that keeps working after every clue. If one detail breaks it, keep searching.",
        accent: "from-sky-300/20 via-cyan-300/10 to-transparent",
      },
      {
        icon: "👑",
        title:
          l === "ko" ? "확신이 생기면 바로 제출하세요" :
          l === "fr" ? "Répondez dès que tout s'aligne" :
          l === "zh-CN" ? "一旦确定就立刻提交" :
          l === "zh-HK" ? "一有把握就立即提交" :
          l === "es" ? "Envíala en cuanto todo encaje" :
          "Submit once it locks in",
        body:
          l === "ko" ? "힌트 질문은 점수를 깎지만, 정답을 맞히면 점수를 얻습니다. 감이 왔을 때는 과감하게 정답을 내는 편이 유리합니다." :
          l === "fr" ? "Les indices coûtent des points, mais une bonne réponse en rapporte. Quand tout se met en place, allez-y." :
          l === "zh-CN" ? "提问会扣分，但答对会加分。感觉已经对上时，就果断提交。" :
          l === "zh-HK" ? "發問會扣分，但答中會加分。當你覺得答案對晒位，就放膽提交。" :
          l === "es" ? "Las pistas cuestan puntos, pero acertar te da puntos. Cuando todo encaje, lánzate." :
          "Hints cost points, but solving earns them back. Once the answer feels stable, trust it and submit.",
        accent: "from-emerald-300/20 via-lime-300/10 to-transparent",
      },
    ],
    "Final Pick": [
      {
        icon: "🎯",
        title:
          l === "ko" ? "정답을 찾기보다 오답을 지우세요" :
          l === "fr" ? "Éliminez avant de choisir" :
          l === "zh-CN" ? "先排除，再决定" :
          l === "zh-HK" ? "先排除，再決定" :
          l === "es" ? "Descarta antes de elegir" :
          "Eliminate before you commit",
        body:
          l === "ko" ? "Final Pick 은 후보를 하나씩 지워나갈수록 쉬워집니다. 모든 단서를 동시에 버티는 선택지만 남겨 보세요." :
          l === "fr" ? "Ce mode devient plus clair quand vous éliminez les options fragiles. Gardez seulement celles qui survivent à tous les indices." :
          l === "zh-CN" ? "这个模式越排除越清楚。只留下能同时撑住所有线索的选项。" :
          l === "zh-HK" ? "呢個模式愈排除愈清楚。只留下可以同時撐得住所有線索嘅選項。" :
          l === "es" ? "Este modo mejora cuando vas descartando opciones débiles. Quédate solo con las que resisten todas las pistas." :
          "This format gets easier when you stop hunting for the answer and start crossing off what cannot possibly fit.",
        accent: "from-fuchsia-300/20 via-rose-300/10 to-transparent",
      },
      {
        icon: "🗂️",
        title:
          l === "ko" ? "지문과 선택지를 같이 읽으세요" :
          l === "fr" ? "Lisez le texte contre les choix" :
          l === "zh-CN" ? "让题面和选项互相验证" :
          l === "zh-HK" ? "用題面同選項互相驗證" :
          l === "es" ? "Cruza el texto con las opciones" :
          "Cross-check the prompt and the options",
        body:
          l === "ko" ? "이 장르는 이야기만 읽어선 부족하고, 선택지만 봐도 부족합니다. 둘을 같이 놓고 모순을 찾는 방식이 좋습니다." :
          l === "fr" ? "Le bon choix n'est pas juste plausible. C'est celui qui reste cohérent avec l'histoire et les options disponibles." :
          l === "zh-CN" ? "真正的答案不只是看起来合理，而是题面和选项一起看时依然最稳的那个。" :
          l === "zh-HK" ? "真正嘅答案唔只係似樣，而係題面同選項一齊睇都最穩陣嗰個。" :
          l === "es" ? "La opción correcta no es solo la más plausible: es la que sigue encajando cuando comparas texto y respuestas posibles." :
          "The best answer is not just plausible. It is the option that still feels strongest after you test it against every detail in the prompt.",
        accent: "from-sky-300/20 via-indigo-300/10 to-transparent",
      },
      {
        icon: "🚀",
        title:
          l === "ko" ? "애매하면 힌트, 확실하면 제출" :
          l === "fr" ? "Indice si besoin, réponse si c'est net" :
          l === "zh-CN" ? "不稳就问，稳了就答" :
          l === "zh-HK" ? "未穩就問，穩陣就答" :
          l === "es" ? "Si dudas, pide pista; si lo ves claro, responde" :
          "Use hints surgically",
        body:
          l === "ko" ? "힌트는 판단을 정리할 때만 쓰는 편이 좋습니다. 이미 하나만 남았다면 바로 정답을 시도해 보세요." :
          l === "fr" ? "Utilisez l'indice pour départager deux options proches. Si une seule option tient déjà, tentez votre chance." :
          l === "zh-CN" ? "提示最适合在两三个候选摇摆时使用。如果只剩一个像样选项，就直接提交。" :
          l === "zh-HK" ? "提示最適合用喺兩三個候選之間未分清嗰陣。如果只剩一個站得住腳，就直接提交。" :
          l === "es" ? "La pista sirve mejor cuando dudas entre dos o tres opciones. Si solo queda una fuerte, responde ya." :
          "A hint is best when you are stuck between two live options. If only one answer is still standing, go for it.",
        accent: "from-emerald-300/20 via-cyan-300/10 to-transparent",
      },
    ],
    "Visual Match": [
      {
        icon: "🌀",
        title:
          l === "ko" ? "큰 모양부터 맞춰보세요" :
          l === "fr" ? "Repérez les grandes formes d'abord" :
          l === "zh-CN" ? "先看大结构" :
          l === "zh-HK" ? "先睇大輪廓" :
          l === "es" ? "Empieza por las formas grandes" :
          "Start with the big shapes",
        body:
          l === "ko" ? "Visual Match 에서는 작은 차이보다 큰 구조가 중요합니다. 길의 굽이, 막다른 길, 넓게 열린 구간부터 확인하세요." :
          l === "fr" ? "Dans ce mode, les grands virages et les impasses parlent plus fort que les petits détails décoratifs." :
          l === "zh-CN" ? "在这个模式里，大弯道、死路和开阔区域比细小装饰更重要。" :
          l === "zh-HK" ? "喺呢個模式，大彎位、死路同開闊區域比細節裝飾更重要。" :
          l === "es" ? "En este modo, los giros grandes, callejones sin salida y zonas abiertas importan más que los detalles pequeños." :
          "In Visual Match, big turns, dead ends, and open spaces matter more than tiny details. Lock in the structure first.",
        accent: "from-violet-300/20 via-sky-300/10 to-transparent",
      },
      {
        icon: "🧭",
        title:
          l === "ko" ? "시점을 바꿔서 상상하세요" :
          l === "fr" ? "Imaginez le changement de point de vue" :
          l === "zh-CN" ? "把视角转换过来想" :
          l === "zh-HK" ? "試下喺腦入面轉換視角" :
          l === "es" ? "Imagina el cambio de perspectiva" :
          "Translate the perspective",
        body:
          l === "ko" ? "3D 장면과 2D 보드는 같은 구조를 다른 시점에서 보여줍니다. 보이는 길을 평면으로 눌러 본다는 느낌으로 비교하면 쉽습니다." :
          l === "fr" ? "La scène 3D et la carte 2D racontent le même plan sous deux angles. Essayez d'aplatir mentalement le trajet." :
          l === "zh-CN" ? "3D 场景和 2D 地图其实是同一个结构。把眼前路线在脑中“压平”后再去对应会更快。" :
          l === "zh-HK" ? "3D 場景同 2D 地圖其實係同一個結構。將眼前路線喺腦入面「壓平」再對照會快好多。" :
          l === "es" ? "La escena 3D y el tablero 2D muestran el mismo recorrido desde ángulos distintos. Intenta “aplanar” mentalmente el camino." :
          "The 3D scene and the 2D board are the same path viewed differently. Mentally flatten the route before you compare.",
        accent: "from-cyan-300/20 via-blue-300/10 to-transparent",
      },
      {
        icon: "💡",
        title:
          l === "ko" ? "애매한 두 후보만 끝까지 비교하세요" :
          l === "fr" ? "Terminez le duel entre les deux meilleures options" :
          l === "zh-CN" ? "最后只比较最像的两个" :
          l === "zh-HK" ? "最後只比較最似嘅兩個" :
          l === "es" ? "Acaba comparando solo las dos mejores" :
          "Narrow it down fast",
        body:
          l === "ko" ? "처음부터 정답 하나를 찍기보다, 가장 비슷한 두 개만 남기는 방식이 효율적입니다. 그 뒤엔 세부 차이가 답을 줍니다." :
          l === "fr" ? "Vous n'avez pas besoin de tout résoudre d'un coup. Réduisez à deux cartes plausibles, puis laissez les détails trancher." :
          l === "zh-CN" ? "不用一开始就锁定答案。先缩到两个最像的候选，再让细节替你做决定。" :
          l === "zh-HK" ? "唔使一開始就鎖死答案。先縮到兩個最似嘅候選，再用細節分勝負。" :
          l === "es" ? "No hace falta acertar de golpe. Quédate con dos opciones fuertes y deja que los detalles decidan." :
          "You do not need the exact answer immediately. Shrink the board to two believable matches and let the last details break the tie.",
        accent: "from-amber-300/20 via-lime-300/10 to-transparent",
      },
    ],
    Codebreaker: [
      {
        icon: "🔐",
        title:
          l === "ko" ? "규칙을 먼저 찾으세요" :
          l === "fr" ? "Trouvez la règle avant le mot" :
          l === "zh-CN" ? "先找规则，再找答案" :
          l === "zh-HK" ? "先搵規則，再搵答案" :
          l === "es" ? "Encuentra la regla antes de la palabra" :
          "Find the rule before the answer",
        body:
          l === "ko" ? "이 장르는 단어를 바로 읽는 게임이 아니라, 변환 규칙을 먼저 읽는 게임에 가깝습니다. 숫자와 글자가 어떻게 이어지는지부터 보세요." :
          l === "fr" ? "Ici, l'important n'est pas le mot final au départ, mais la logique qui transforme les chiffres en lettres." :
          l === "zh-CN" ? "这一类不是直接猜词，而是先读懂数字和字母之间的转换逻辑。" :
          l === "zh-HK" ? "呢一類唔係直接估字，而係先睇明數字同字母之間嘅轉換邏輯。" :
          l === "es" ? "Aquí no conviene lanzarse a la palabra final. Primero hay que descubrir la regla que une números y letras." :
          "This mode is less about guessing the final word and more about spotting the conversion rule that unlocks it.",
        accent: "from-slate-300/20 via-zinc-300/10 to-transparent",
      },
      {
        icon: "🧪",
        title:
          l === "ko" ? "작게 시험해 보세요" :
          l === "fr" ? "Testez la logique sur un petit morceau" :
          l === "zh-CN" ? "先拿一小段试验" :
          l === "zh-HK" ? "先攞一小段試驗" :
          l === "es" ? "Prueba la lógica en una parte pequeña" :
          "Test small before you trust it",
        body:
          l === "ko" ? "떠오른 규칙을 전체에 바로 적용하지 말고, 짧은 조각 하나로 먼저 검증해 보세요. 한 번 어긋나면 다른 규칙일 가능성이 큽니다." :
          l === "fr" ? "Une bonne règle doit fonctionner tout de suite sur un exemple court. Si elle casse, changez d'approche." :
          l === "zh-CN" ? "不要一下子套满整题，先拿一小块验证。只要有一处对不上，通常就该换思路。" :
          l === "zh-HK" ? "唔好一嚟就套落成題，先攞一小段驗證。只要有一處對唔上，多數就要換方向。" :
          l === "es" ? "No apliques la regla a todo de golpe. Pruébala primero en un tramo corto; si falla, cambia de idea." :
          "Do not run your idea across the whole puzzle immediately. Try it on one small slice first and switch quickly if it breaks.",
        accent: "from-rose-300/20 via-orange-300/10 to-transparent",
      },
      {
        icon: "✅",
        title:
          l === "ko" ? "스토리까지 맞아야 정답입니다" :
          l === "fr" ? "Le code doit aussi coller à l'histoire" :
          l === "zh-CN" ? "解码后还要符合题意" :
          l === "zh-HK" ? "解碼之後都要符合題意" :
          l === "es" ? "El código también tiene que encajar con la historia" :
          "The decode still has to fit the clue",
        body:
          l === "ko" ? "변환이 성공했더라도 이야기와 어울리지 않으면 정답이 아닐 수 있습니다. 코드와 문맥 두 쪽을 모두 통과해야 합니다." :
          l === "fr" ? "Une conversion correcte n'est pas suffisante si le résultat ne colle pas au récit. Il faut valider le code et le sens." :
          l === "zh-CN" ? "就算编码规则对了，结果也必须和题面故事对得上。规则和语境都要通过。" :
          l === "zh-HK" ? "就算轉換規則啱，結果都要同題面故事對得上。規則同語境都要過關。" :
          l === "es" ? "Aunque la conversión parezca correcta, la respuesta también tiene que encajar con la historia. Deben cuadrar la regla y el sentido." :
          "Even a valid conversion is not enough if the result does not fit the story clue. The code and the context both need to agree.",
        accent: "from-emerald-300/20 via-teal-300/10 to-transparent",
      },
    ],
  };

  return guides[genre];
}
