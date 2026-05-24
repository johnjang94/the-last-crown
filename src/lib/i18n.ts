export type Locale = "en" | "ko" | "fr" | "zh-CN" | "zh-HK" | "es";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh-CN", label: "Mandarin", flag: "🇨🇳" },
  { code: "zh-HK", label: "Cantonese", flag: "🇭🇰" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export type T = {
  home: string;
  connecting: string;
  back: string;
  close: string;
  save: string;
  next: string;
  continueBtn: string;

  installApp: string;
  installIosHint: string;
  alreadyInstalled: string;
  safariOnly: string;

  tagline: string;
  getStarted: string;
  resumeGame: string;
  howToPlay: string;
  joinRoom: string;
  difficulty: string;

  gameConditions: string;
  step1Group: string;
  step1Solo: string;
  solo: string;
  group: string;
  players: string;
  editParticipants: string;
  hostLabel: string;
  continueToGameType: string;

  step2: string;

  step3: string;
  writingRound: string;
  creatingImages: (done: number, total: number) => string;
  preparingVisual: string;
  startGame: string;

  passage: string;
  roundNotesTitle: string;
  note1: string;
  note2: string;
  note3: string;
  view3d: string;
  maze2d: string;
  clueKeywords: string;
  possibleAnswers: string;
  activity: string;
  lobbyBtn: string;
  bonusKeywords: string;
  additionalRevealed: string;
  finalRevealed: string;
  think: string;
  nextKeywordIn: string;
  bonusKeywordExcl: string;
  finalKeywordExcl: string;
  giveup: string;

  exitGameTitle: string;
  leaveConfirm: string;
  stay: string;
  leaveGame: string;

  noWinner: string;
  teamWins: (n: number) => string;
  playerWins: (name: string) => string;
  winner: string;
  newGame: string;
  crownedThisRound: string;
  winningScore: string;
  scoreGap: string;
  finalStandings: string;
  yourRound: string;
  personalSummaryWon: string;
  personalSummaryLost: string;
  yourScore: string;
  solutionLabel: string;

  joinRoomTitle: string;
  yourName: string;
  join: string;

  waitingForHost: string;
  playersInRoom: (n: number) => string;
  soloMode: string;
  groupMode: string;
  hostChoosingType: string;
  hostChoosingDiff: string;
  selectedLabel: (name: string) => string;

  yourFeed: string;
  teamFeed: string;
  askQuestion: string;
  questionPlaceholder: string;
  askQuestionBtn: string;
  attemptAnswer: string;
  howToAnswer: string;
  howToAnswerLine1: string;
  howToAnswerLine2: string;
  howToAnswerLine3: string;
  answerPlaceholder: string;
  attemptAnswerBtn: string;
  briefing: string;
  pts: string;

  scanTitle: string;
  startingCamera: string;
  pointAtQR: string;
  cameraPermissionError: string;
  cameraStartError: string;
  orEnterCode: string;

  editParticipantsTitle: string;

  iUnderstand: string;
  howToPlayStep: (step: number, total: number) => string;
  howToPlayDesc1: string;
  soloCardTitle: string;
  soloCardDesc: string;
  groupCardTitle: string;
  groupCardDesc: string;
  howToPlayDesc2: string;
  howToPlayDesc3: string;
  morePts: string;
  howToPlayDesc4: string;
  readyTitle: string;
  readyDesc: string;
  tutorialLibraryTitle: string;
  tutorialLibraryDesc: string;
  tutorialAutoTitle: string;
  tutorialAutoDesc: string;
  tutorialGoalLabel: string;
  tutorialHowItWorksLabel: string;
  tutorialTipLabel: string;
  tutorialScoringLabel: string;
  tutorialOpenGenre: string;
  tutorialStart: string;
  tutorialContinue: string;
  settingsMenu: string;
  language: string;
  changeLanguage: string;
  myProfile: string;
  notifications: string;
  displayName: string;
  displayNameHint: string;
  playerPlaceholder: string;
  gameHistory: string;
  noGamesRecorded: string;
  won: string;
  lost: string;
  onlinePvp: string;
  scoreWord: string;
  roomWord: string;
  participantsWord: string;
  delivery: string;
  email: string;
  textMessage: string;
  optOut: string;
  emailAddress: string;
  phoneNumber: string;
  pointsEarned: string;
  messagesFromOtherPlayers: string;
  badgeUnlocks: string;
  rankingUpdates: string;
  recentAlerts: string;
  alertDeliveryNotice: string;
  noNotificationsYet: string;
  openSettings: string;
  openHowToPlay: string;
  settingsPageTitle: string;
  settingsPageDesc: string;
  currentValue: (value: string) => string;
  notSet: string;
  savedShort: string;
  endGame: string;
  leaveWaitingHallTitle: string;
  leaveWaitingHallConfirm: string;
  waitingHallLeave: string;
  bonusClue: string;
  playersTab: string;
  chatTab: string;
  gameTab: string;
  feedTab: string;
  teamChatLabel: string;
  roomChatLabel: string;
  teamChatFrom: (name: string) => string;
  roomChatFrom: (name: string) => string;
  noTeamMessagesYet: string;
  noRoomMessagesYet: string;
  writeMessageToTeam: string;
  writeMessageToRoom: string;
  send: string;
  visualMatchHint: string;

  genreRiddles: string;
  genreRiddlesDesc: string;
  genreGuess: string;
  genreGuessDesc: string;
  genreVisualMatch: string;
  genreVisualMatchDesc: string;
  genreNumberToLetter: string;
  genreNumberToLetterDesc: string;

  diffEasy: string;
  diffEasyTagline: string;
  diffMedium: string;
  diffMediumTagline: string;
  diffHard: string;
  diffHardTagline: string;
  diffChallenger: string;
  diffChallengerTagline: string;
};

const en: T = {
  home: "← Home",
  connecting: "Connecting…",
  back: "Back",
  close: "Close",
  save: "Save",
  next: "Next",
  continueBtn: "Continue",

  installApp: "Install App",
  installIosHint: "Tap Share → Add to Home Screen",
  alreadyInstalled: "Installed ✓",
  safariOnly: "Safari only",

  tagline: "Who is ready to take the crown?",
  getStarted: "Get Started",
  resumeGame: "Resume Game",
  howToPlay: "How to play",
  joinRoom: "Join a Room",
  difficulty: "Difficulty",

  gameConditions: "Game Conditions",
  step1Group: "Step 1: choose whether this round is solo or group play, then invite players into the room.",
  step1Solo: "Step 1: solo mode selected — no other players needed. Continue to choose the game type.",
  solo: "Solo",
  group: "Group",
  players: "Players",
  editParticipants: "Edit Participants",
  hostLabel: "(host)",
  continueToGameType: "Continue to Game Type",

  step2: "Step 2: choose the kind of game you want to play.",

  step3: "Step 3: choose the difficulty level, then start the round.",
  writingRound: "Preparing the round",
  creatingImages: (done, total) => `Preparing visuals (${done} / ${total})`,
  preparingVisual: "Preparing visual…",
  startGame: "Start Game",

  passage: "Passage",
  roundNotesTitle: "Round Notes",
  note1: "All passages and visuals in this round are prepared for this game session.",
  note2: "Whoever has more points wins the game.",
  note3: "Hints are allowed, but using one cuts the round reward in half.",
  view3d: "3D View",
  maze2d: "2D Maze",
  clueKeywords: "Clue Keywords",
  possibleAnswers: "Possible Answers",
  activity: "Activity",
  lobbyBtn: "Lobby",
  bonusKeywords: "Bonus keywords",
  additionalRevealed: "Additional keyword revealed",
  finalRevealed: "Final keyword revealed",
  think: "Think",
  nextKeywordIn: "Next keyword in",
  bonusKeywordExcl: "Bonus keyword!",
  finalKeywordExcl: "Final keyword!",
  giveup: "I have no idea, cuckoo",

  exitGameTitle: "Exit game",
  leaveConfirm: "Are you sure you want to leave the game?",
  stay: "Stay",
  leaveGame: "Leave the Game",

  noWinner: "No winner",
  teamWins: (n) => `Team ${n} wins!`,
  playerWins: (name) => `${name} wins!`,
  winner: "Winner",
  newGame: "New Game",
  crownedThisRound: "Crowned This Round",
  winningScore: "Winning score",
  scoreGap: "Score gap",
  finalStandings: "Final standings",
  yourRound: "Your round",
  personalSummaryWon: "You finished on top and claimed the crown.",
  personalSummaryLost: "You stayed in the hunt until the final reveal.",
  yourScore: "Your score",
  solutionLabel: "Solution",

  joinRoomTitle: "Join Room",
  yourName: "Your name",
  join: "Join",

  waitingForHost: "Waiting for the game to start",
  playersInRoom: (n) => `${n} players are here`,
  soloMode: "Solo mode",
  groupMode: "Group mode",
  hostChoosingType: "The host is choosing the game type…",
  hostChoosingDiff: "The host is choosing the difficulty…",
  selectedLabel: (name) => `Selected: ${name}`,

  yourFeed: "Your feed",
  teamFeed: "Team feed",
  askQuestion: "Ask a question",
  questionPlaceholder: "Ask for a small push in the right direction",
  askQuestionBtn: "Ask for a hint",
  attemptAnswer: "Attempt an answer",
  howToAnswer: "How to answer",
  howToAnswerLine1: "Give your best answer using the passage, clues, and any revealed keywords.",
  howToAnswerLine2: "For number-to-letter and guess rounds, compare your answer with the choices carefully.",
  howToAnswerLine3: "For visual-match rounds, use the labeled maze to support your call.",
  answerPlaceholder: "Type the answer you want to submit",
  attemptAnswerBtn: "Send answer",
  briefing: "Briefing",
  pts: "pts",

  scanTitle: "Scan Room QR Code",
  startingCamera: "Starting camera…",
  pointAtQR: "Point at the QR code on the host screen",
  cameraPermissionError: "Camera permission denied. Please allow camera access and try again.",
  cameraStartError: "Could not start camera. Make sure you are on HTTPS or localhost.",
  orEnterCode: "Or enter room code",

  editParticipantsTitle: "Edit Participants",

  iUnderstand: "I understand",
  howToPlayStep: (step, total) => `How to Play — ${step} / ${total}`,
  howToPlayDesc1: "You can play by yourself, with other players who are online, or as a group. This is the mode selection step.",
  soloCardTitle: "Solo",
  soloCardDesc: "Go alone and chase the crown on your own pace.",
  groupCardTitle: "Group",
  groupCardDesc: "Talk it through together and see who reads the clues best.",
  howToPlayDesc2: "Next, you choose the kind of game you want to play: riddles, guess, visual-maze match, number-to-letter conversion, and more.",
  howToPlayDesc3: "Then you choose the level of challenge you want: easy, medium, hard, or challenger.",
  morePts: "Whoever has more points wins the game.",
  howToPlayDesc4: "After you choose the mode, type of game, and level of difficulty, the game begins. The passages and visuals are prepared for that round.",
  readyTitle: "Ready",
  readyDesc: "When you understand the setup, return home and start building the room.",
  tutorialLibraryTitle: "How to Play",
  tutorialLibraryDesc: "Pick a game type to see how it works before you jump in.",
  tutorialAutoTitle: "First time in this game type",
  tutorialAutoDesc: "Here is the quick read so the round feels intuitive right away.",
  tutorialGoalLabel: "Goal",
  tutorialHowItWorksLabel: "How it works",
  tutorialTipLabel: "What to watch for",
  tutorialScoringLabel: "Scoring",
  tutorialOpenGenre: "Open guide",
  tutorialStart: "Start round",
  tutorialContinue: "Got it",
  settingsMenu: "Settings",
  language: "Language",
  changeLanguage: "Change language",
  myProfile: "My Profile",
  notifications: "Notifications",
  displayName: "Display Name",
  displayNameHint: "Change your name from Settings → My Profile.",
  playerPlaceholder: "Player",
  gameHistory: "Game History",
  noGamesRecorded: "No games recorded yet.",
  won: "Won",
  lost: "Lost",
  onlinePvp: "Online PVP",
  scoreWord: "Score",
  roomWord: "Room",
  participantsWord: "Players",
  delivery: "Delivery",
  email: "Email",
  textMessage: "Text Message",
  optOut: "Opt-out",
  emailAddress: "Email address",
  phoneNumber: "Phone number",
  pointsEarned: "Points earned",
  messagesFromOtherPlayers: "Messages from other players",
  badgeUnlocks: "Badge unlocks",
  rankingUpdates: "Ranking updates",
  recentAlerts: "Recent Alerts",
  alertDeliveryNotice: "Alerts appear here. Email and text preferences are saved, but external delivery is not connected yet.",
  noNotificationsYet: "No notifications yet.",
  openSettings: "Game Settings",
  openHowToPlay: "How to Play",
  settingsPageTitle: "Game Settings",
  settingsPageDesc: "Backend credentials. Stored in the local SQLite database. Leave blank to keep existing.",
  currentValue: (value) => `Current: ${value}`,
  notSet: "Not set",
  savedShort: "Saved.",
  endGame: "End Game",
  leaveWaitingHallTitle: "Leave waiting hall",
  leaveWaitingHallConfirm: "Are you sure you want to end this game and go back to /start/online?",
  waitingHallLeave: "Leave this waiting hall",
  bonusClue: "Bonus clue",
  playersTab: "Players",
  chatTab: "Chat",
  gameTab: "Game",
  feedTab: "Feed",
  teamChatLabel: "Team",
  roomChatLabel: "Room",
  teamChatFrom: (name) => `Team chat from ${name}`,
  roomChatFrom: (name) => `Room chat from ${name}`,
  noTeamMessagesYet: "No team messages yet.",
  noRoomMessagesYet: "No room messages yet.",
  writeMessageToTeam: "Write a message to your team",
  writeMessageToRoom: "Write a message to the room",
  send: "Send",
  visualMatchHint: "Match the 3D maze scene to the labeled 2D maze board.",

  genreRiddles: "Riddles",
  genreRiddlesDesc: "Read the clue, discuss the twist, and guess the hidden answer.",
  genreGuess: "Final Pick",
  genreGuessDesc: "Follow the story, test the options, and make the final pick that still fits every clue.",
  genreVisualMatch: "Visual Match",
  genreVisualMatchDesc: "Compare a 3D maze view against a labeled 2D maze map.",
  genreNumberToLetter: "Codebreaker",
  genreNumberToLetterDesc: "Break the hidden pattern in the prompt and choose the answer that survives the code.",

  diffEasy: "Easy",
  diffEasyTagline: "Clear clues and a friendly warm-up.",
  diffMedium: "Medium",
  diffMediumTagline: "Balanced twists for steady teams.",
  diffHard: "Hard",
  diffHardTagline: "Sharper traps and trickier deductions.",
  diffChallenger: "The Challenger",
  diffChallengerTagline: "The boldest version of the crown.",
};

const ko: T = {
  home: "← 홈",
  connecting: "연결 중…",
  back: "뒤로",
  close: "닫기",
  save: "저장",
  next: "다음",
  continueBtn: "계속",

  installApp: "앱 설치",
  installIosHint: "공유 → 홈 화면에 추가",
  alreadyInstalled: "설치됨 ✓",
  safariOnly: "Safari 전용",

  tagline: "왕관을 차지할 준비가 됐나요?",
  getStarted: "시작하기",
  resumeGame: "게임 이어하기",
  howToPlay: "게임 방법",
  joinRoom: "방 참가",
  difficulty: "난이도",

  gameConditions: "게임 조건",
  step1Group: "1단계: 솔로 또는 그룹 플레이를 선택하고, 플레이어들을 방으로 초대하세요.",
  step1Solo: "1단계: 솔로 모드 선택 — 다른 플레이어 없이 바로 진행합니다.",
  solo: "솔로",
  group: "그룹",
  players: "플레이어",
  editParticipants: "참가자 편집",
  hostLabel: "(방장)",
  continueToGameType: "게임 유형 선택으로",

  step2: "2단계: 플레이할 게임 유형을 선택하세요.",

  step3: "3단계: 난이도를 선택하고 라운드를 시작하세요.",
  writingRound: "라운드 준비 중",
  creatingImages: (done, total) => `비주얼 준비 중 (${done} / ${total})`,
  preparingVisual: "비주얼 준비 중…",
  startGame: "게임 시작",

  passage: "지문",
  roundNotesTitle: "라운드 안내",
  note1: "이 라운드의 모든 지문과 비주얼은 이번 게임 세션을 위해 준비됩니다.",
  note2: "더 많은 점수를 가진 플레이어가 승리합니다.",
  note3: "힌트는 사용할 수 있지만, 쓰면 라운드 보상이 절반으로 줄어듭니다.",
  view3d: "3D 뷰",
  maze2d: "2D 미로",
  clueKeywords: "단서 키워드",
  possibleAnswers: "가능한 답변",
  activity: "활동 내역",
  lobbyBtn: "로비",
  bonusKeywords: "보너스 키워드",
  additionalRevealed: "추가 키워드 공개",
  finalRevealed: "최종 키워드 공개",
  think: "생각",
  nextKeywordIn: "다음 키워드까지",
  bonusKeywordExcl: "보너스 키워드!",
  finalKeywordExcl: "최종 키워드!",
  giveup: "모르겠어요, 포기",

  exitGameTitle: "게임 종료",
  leaveConfirm: "정말 게임을 떠나시겠습니까?",
  stay: "계속하기",
  leaveGame: "게임 나가기",

  noWinner: "승자 없음",
  teamWins: (n) => `팀 ${n} 승리!`,
  playerWins: (name) => `${name} 승리!`,
  winner: "승자",
  newGame: "새 게임",
  crownedThisRound: "이번 라운드의 왕관",
  winningScore: "우승 점수",
  scoreGap: "점수 차",
  finalStandings: "최종 순위",
  yourRound: "이번 라운드 기록",
  personalSummaryWon: "정상에 오르며 왕관을 차지했습니다.",
  personalSummaryLost: "마지막 공개까지 끝까지 추격했습니다.",
  yourScore: "내 점수",
  solutionLabel: "정답",

  joinRoomTitle: "방 참가",
  yourName: "이름",
  join: "참가",

  waitingForHost: "게임 시작을 기다리는 중",
  playersInRoom: (n) => `${n}명이 함께하고 있어요`,
  soloMode: "솔로 모드",
  groupMode: "그룹 모드",
  hostChoosingType: "방장이 게임 유형을 선택 중…",
  hostChoosingDiff: "방장이 난이도를 선택 중…",
  selectedLabel: (name) => `선택됨: ${name}`,

  yourFeed: "내 피드",
  teamFeed: "팀 피드",
  askQuestion: "질문하기",
  questionPlaceholder: "조금만 더 밀어주는 힌트를 받아보세요",
  askQuestionBtn: "힌트 요청",
  attemptAnswer: "답변 시도",
  howToAnswer: "답변 방법",
  howToAnswerLine1: "지문, 단서, 공개된 키워드를 활용해 최선의 답변을 제출하세요.",
  howToAnswerLine2: "숫자-글자 변환 및 추측 라운드에서는 보기와 신중히 비교하세요.",
  howToAnswerLine3: "비주얼 매치 라운드에서는 레이블된 미로를 참고하세요.",
  answerPlaceholder: "답변을 입력하세요",
  attemptAnswerBtn: "답변 제출",
  briefing: "상황 설명",
  pts: "점",

  scanTitle: "방 QR 코드 스캔",
  startingCamera: "카메라 시작 중…",
  pointAtQR: "호스트 화면의 QR 코드를 가리키세요",
  cameraPermissionError: "카메라 권한이 거부됐습니다. 카메라 접근을 허용하고 다시 시도해주세요.",
  cameraStartError: "카메라를 시작할 수 없습니다. HTTPS 또는 localhost인지 확인하세요.",
  orEnterCode: "또는 방 코드 입력",

  editParticipantsTitle: "참가자 편집",

  iUnderstand: "이해했습니다",
  howToPlayStep: (step, total) => `게임 방법 — ${step} / ${total}`,
  howToPlayDesc1: "혼자 플레이하거나, 온라인 플레이어와 함께 하거나, 그룹으로 플레이할 수 있습니다. 모드 선택 단계입니다.",
  soloCardTitle: "솔로",
  soloCardDesc: "혼자서 왕관을 향해 도전하세요.",
  groupCardTitle: "그룹",
  groupCardDesc: "함께 토론하며 단서를 가장 잘 읽는 사람을 찾으세요.",
  howToPlayDesc2: "다음으로 플레이할 게임 유형을 선택합니다: 수수께끼, 추측, 비주얼 미로 매칭, 숫자-글자 변환 등.",
  howToPlayDesc3: "이후 난이도를 선택합니다: 쉬움, 보통, 어려움, 또는 챌린저.",
  morePts: "더 많은 점수를 가진 플레이어가 승리합니다.",
  howToPlayDesc4: "모드, 게임 유형, 난이도를 선택하면 게임이 시작됩니다. 지문과 비주얼은 해당 라운드를 위해 준비됩니다.",
  readyTitle: "준비 완료",
  readyDesc: "설정을 이해했다면 홈으로 돌아가서 방을 만드세요.",
  tutorialLibraryTitle: "게임 방법",
  tutorialLibraryDesc: "들어가기 전에 게임 유형을 골라 진행 방식을 확인하세요.",
  tutorialAutoTitle: "이 게임은 처음이에요",
  tutorialAutoDesc: "바로 감이 오도록 짧게 설명해드릴게요.",
  tutorialGoalLabel: "목표",
  tutorialHowItWorksLabel: "진행 방식",
  tutorialTipLabel: "포인트",
  tutorialScoringLabel: "점수",
  tutorialOpenGenre: "가이드 보기",
  tutorialStart: "라운드 시작",
  tutorialContinue: "이해했어요",
  settingsMenu: "설정",
  language: "언어",
  changeLanguage: "언어 변경",
  myProfile: "내 프로필",
  notifications: "알림",
  displayName: "표시 이름",
  displayNameHint: "설정 → 내 프로필에서 이름을 바꿀 수 있어요.",
  playerPlaceholder: "플레이어",
  gameHistory: "게임 기록",
  noGamesRecorded: "아직 기록된 게임이 없어요.",
  won: "승리",
  lost: "패배",
  onlinePvp: "온라인 PVP",
  scoreWord: "점수",
  roomWord: "방",
  participantsWord: "플레이어",
  delivery: "전달 방식",
  email: "이메일",
  textMessage: "문자 메시지",
  optOut: "받지 않기",
  emailAddress: "이메일 주소",
  phoneNumber: "전화번호",
  pointsEarned: "획득 점수",
  messagesFromOtherPlayers: "다른 플레이어의 메시지",
  badgeUnlocks: "배지 해금",
  rankingUpdates: "순위 업데이트",
  recentAlerts: "최근 알림",
  alertDeliveryNotice: "알림은 이 목록에 표시됩니다. 이메일과 문자 설정은 저장되지만, 외부 발송은 아직 연결되지 않았습니다.",
  noNotificationsYet: "아직 알림이 없어요.",
  openSettings: "게임 설정",
  openHowToPlay: "게임 방법",
  settingsPageTitle: "게임 설정",
  settingsPageDesc: "백엔드 인증 정보입니다. 로컬 SQLite 데이터베이스에 저장됩니다. 비워 두면 기존 값을 유지합니다.",
  currentValue: (value) => `현재값: ${value}`,
  notSet: "설정 안 됨",
  savedShort: "저장됨.",
  endGame: "게임 종료",
  leaveWaitingHallTitle: "대기실 나가기",
  leaveWaitingHallConfirm: "이 게임을 끝내고 /start/online 으로 돌아가시겠어요?",
  waitingHallLeave: "이 대기실 나가기",
  bonusClue: "보너스 단서",
  playersTab: "플레이어",
  chatTab: "채팅",
  gameTab: "게임",
  feedTab: "피드",
  teamChatLabel: "팀",
  roomChatLabel: "방",
  teamChatFrom: (name) => `${name}님의 팀 채팅`,
  roomChatFrom: (name) => `${name}님의 방 채팅`,
  noTeamMessagesYet: "아직 팀 메시지가 없어요.",
  noRoomMessagesYet: "아직 방 메시지가 없어요.",
  writeMessageToTeam: "팀에게 보낼 메시지를 입력하세요",
  writeMessageToRoom: "방에 보낼 메시지를 입력하세요",
  send: "보내기",
  visualMatchHint: "3D 미로 장면을 라벨이 붙은 2D 미로 보드와 맞춰 보세요.",

  genreRiddles: "수수께끼",
  genreRiddlesDesc: "단서를 읽고 반전을 토론하며 숨겨진 답을 맞추세요.",
  genreGuess: "파이널 픽",
  genreGuessDesc: "스토리를 따라가며 보기들을 검증하고, 끝까지 남는 답을 최종 선택하세요.",
  genreVisualMatch: "비주얼 매치",
  genreVisualMatchDesc: "3D 미로 뷰와 레이블된 2D 미로 맵을 비교하세요.",
  genreNumberToLetter: "코드브레이커",
  genreNumberToLetterDesc: "문장 속 숨은 규칙을 해독하고 코드 끝에 남는 정답을 고르세요.",

  diffEasy: "쉬움",
  diffEasyTagline: "명확한 단서와 친근한 워밍업.",
  diffMedium: "보통",
  diffMediumTagline: "균형 잡힌 반전으로 안정적인 팀에 적합.",
  diffHard: "어려움",
  diffHardTagline: "더 날카로운 함정과 복잡한 추리.",
  diffChallenger: "챌린저",
  diffChallengerTagline: "왕관의 가장 도전적인 버전.",
};

const fr: T = {
  home: "← Accueil",
  connecting: "Connexion…",
  back: "Retour",
  close: "Fermer",
  save: "Enregistrer",
  next: "Suivant",
  continueBtn: "Continuer",

  installApp: "Installer l'application",
  installIosHint: "Partager → Sur l'écran d'accueil",
  alreadyInstalled: "Installée ✓",
  safariOnly: "Safari uniquement",

  tagline: "Qui est prêt à prendre la couronne ?",
  getStarted: "Commencer",
  resumeGame: "Reprendre la partie",
  howToPlay: "Comment jouer",
  joinRoom: "Rejoindre une salle",
  difficulty: "Difficulté",

  gameConditions: "Conditions de jeu",
  step1Group: "Étape 1 : choisissez solo ou groupe, puis invitez des joueurs dans la salle.",
  step1Solo: "Étape 1 : mode solo sélectionné — pas d'autres joueurs nécessaires. Passez au type de jeu.",
  solo: "Solo",
  group: "Groupe",
  players: "Joueurs",
  editParticipants: "Modifier les participants",
  hostLabel: "(hôte)",
  continueToGameType: "Continuer vers le type de jeu",

  step2: "Étape 2 : choisissez le type de jeu.",

  step3: "Étape 3 : choisissez le niveau de difficulté, puis démarrez.",
  writingRound: "Préparation de la manche",
  creatingImages: (done, total) => `Préparation des visuels (${done} / ${total})`,
  preparingVisual: "Préparation du visuel…",
  startGame: "Démarrer le jeu",

  passage: "Passage",
  roundNotesTitle: "Notes de manche",
  note1: "Tous les passages et visuels sont préparés pour cette partie.",
  note2: "Celui qui a le plus de points gagne.",
  note3: "Vous pouvez demander un indice, mais la manche ne rapporte alors que la moitié des points.",
  view3d: "Vue 3D",
  maze2d: "Labyrinthe 2D",
  clueKeywords: "Mots-clés indices",
  possibleAnswers: "Réponses possibles",
  activity: "Activité",
  lobbyBtn: "Lobby",
  bonusKeywords: "Mots-clés bonus",
  additionalRevealed: "Mot-clé supplémentaire révélé",
  finalRevealed: "Mot-clé final révélé",
  think: "Réflexion",
  nextKeywordIn: "Prochain mot-clé dans",
  bonusKeywordExcl: "Mot-clé bonus !",
  finalKeywordExcl: "Mot-clé final !",
  giveup: "Je n'ai aucune idée, j'abandonne",

  exitGameTitle: "Quitter le jeu",
  leaveConfirm: "Voulez-vous vraiment quitter le jeu ?",
  stay: "Rester",
  leaveGame: "Quitter le jeu",

  noWinner: "Pas de gagnant",
  teamWins: (n) => `L'équipe ${n} gagne !`,
  playerWins: (name) => `${name} gagne !`,
  winner: "Gagnant",
  newGame: "Nouveau jeu",
  crownedThisRound: "Couronné cette manche",
  winningScore: "Score gagnant",
  scoreGap: "Écart de points",
  finalStandings: "Classement final",
  yourRound: "Votre manche",
  personalSummaryWon: "Vous avez terminé en tête et pris la couronne.",
  personalSummaryLost: "Vous êtes resté dans la course jusqu'à la dernière révélation.",
  yourScore: "Votre score",
  solutionLabel: "Solution",

  joinRoomTitle: "Rejoindre la salle",
  yourName: "Votre nom",
  join: "Rejoindre",

  waitingForHost: "En attente du lancement",
  playersInRoom: (n) => `${n} joueurs sont là`,
  soloMode: "Mode solo",
  groupMode: "Mode groupe",
  hostChoosingType: "L'hôte choisit le type de jeu…",
  hostChoosingDiff: "L'hôte choisit la difficulté…",
  selectedLabel: (name) => `Sélectionné : ${name}`,

  yourFeed: "Votre fil",
  teamFeed: "Fil d'équipe",
  askQuestion: "Poser une question",
  questionPlaceholder: "Demandez un petit coup de pouce dans la bonne direction",
  askQuestionBtn: "Demander un indice",
  attemptAnswer: "Tenter une réponse",
  howToAnswer: "Comment répondre",
  howToAnswerLine1: "Donnez votre meilleure réponse en utilisant le passage, les indices et les mots-clés révélés.",
  howToAnswerLine2: "Pour les manches chiffres-lettres et devinettes, comparez avec les choix.",
  howToAnswerLine3: "Pour les manches visual-match, utilisez le labyrinthe étiqueté.",
  answerPlaceholder: "Tapez la réponse à soumettre",
  attemptAnswerBtn: "Soumettre la réponse",
  briefing: "Briefing",
  pts: "pts",

  scanTitle: "Scanner le QR de la salle",
  startingCamera: "Démarrage de la caméra…",
  pointAtQR: "Pointez vers le QR sur l'écran de l'hôte",
  cameraPermissionError: "Permission caméra refusée. Autorisez l'accès à la caméra et réessayez.",
  cameraStartError: "Impossible de démarrer la caméra. Vérifiez que vous êtes en HTTPS ou localhost.",
  orEnterCode: "Ou entrez le code de salle",

  editParticipantsTitle: "Modifier les participants",

  iUnderstand: "J'ai compris",
  howToPlayStep: (step, total) => `Comment jouer — ${step} / ${total}`,
  howToPlayDesc1: "Vous pouvez jouer seul, avec des joueurs en ligne, ou en groupe. C'est l'étape de sélection du mode.",
  soloCardTitle: "Solo",
  soloCardDesc: "Seul, partez à la conquête de la couronne à votre rythme.",
  groupCardTitle: "Groupe",
  groupCardDesc: "Discutez ensemble et voyez qui lit le mieux les indices.",
  howToPlayDesc2: "Ensuite, choisissez le type de jeu : énigmes, devinettes, labyrinthe visuel, conversion chiffres-lettres, etc.",
  howToPlayDesc3: "Puis choisissez le niveau de défi : facile, moyen, difficile ou challenger.",
  morePts: "Celui qui a le plus de points gagne.",
  howToPlayDesc4: "Après avoir choisi le mode, le type de jeu et la difficulté, le jeu commence. Les passages et visuels sont préparés pour cette manche.",
  readyTitle: "Prêt",
  readyDesc: "Quand vous comprenez la configuration, revenez à l'accueil pour créer la salle.",
  tutorialLibraryTitle: "Comment jouer",
  tutorialLibraryDesc: "Choisissez un type de jeu pour voir rapidement son fonctionnement avant de commencer.",
  tutorialAutoTitle: "Première fois sur ce type de jeu",
  tutorialAutoDesc: "Voici le guide rapide pour que la manche soit claire dès le départ.",
  tutorialGoalLabel: "Objectif",
  tutorialHowItWorksLabel: "Fonctionnement",
  tutorialTipLabel: "À surveiller",
  tutorialScoringLabel: "Score",
  tutorialOpenGenre: "Ouvrir le guide",
  tutorialStart: "Commencer la manche",
  tutorialContinue: "J'ai compris",
  settingsMenu: "Paramètres",
  language: "Langue",
  changeLanguage: "Changer de langue",
  myProfile: "Mon profil",
  notifications: "Notifications",
  displayName: "Nom affiché",
  displayNameHint: "Changez votre nom depuis Paramètres → Mon profil.",
  playerPlaceholder: "Joueur",
  gameHistory: "Historique des parties",
  noGamesRecorded: "Aucune partie enregistrée pour l'instant.",
  won: "Gagné",
  lost: "Perdu",
  onlinePvp: "PVP en ligne",
  scoreWord: "Score",
  roomWord: "Salle",
  participantsWord: "Joueurs",
  delivery: "Envoi",
  email: "E-mail",
  textMessage: "SMS",
  optOut: "Désactiver",
  emailAddress: "Adresse e-mail",
  phoneNumber: "Numéro de téléphone",
  pointsEarned: "Points gagnés",
  messagesFromOtherPlayers: "Messages des autres joueurs",
  badgeUnlocks: "Badges débloqués",
  rankingUpdates: "Mises à jour du classement",
  recentAlerts: "Alertes récentes",
  alertDeliveryNotice: "Les alertes apparaissent ici. Les préférences e-mail et SMS sont enregistrées, mais l'envoi externe n'est pas encore connecté.",
  noNotificationsYet: "Aucune notification pour le moment.",
  openSettings: "Paramètres du jeu",
  openHowToPlay: "Comment jouer",
  settingsPageTitle: "Paramètres du jeu",
  settingsPageDesc: "Identifiants du backend. Stockés dans la base SQLite locale. Laissez vide pour conserver la valeur actuelle.",
  currentValue: (value) => `Actuel : ${value}`,
  notSet: "Non défini",
  savedShort: "Enregistré.",
  endGame: "Terminer la partie",
  leaveWaitingHallTitle: "Quitter la salle d'attente",
  leaveWaitingHallConfirm: "Voulez-vous vraiment mettre fin à cette partie et revenir à /start/online ?",
  waitingHallLeave: "Quitter cette salle d'attente",
  bonusClue: "Indice bonus",
  playersTab: "Joueurs",
  chatTab: "Chat",
  gameTab: "Jeu",
  feedTab: "Fil",
  teamChatLabel: "Équipe",
  roomChatLabel: "Salle",
  teamChatFrom: (name) => `Chat d'équipe de ${name}`,
  roomChatFrom: (name) => `Chat de salle de ${name}`,
  noTeamMessagesYet: "Aucun message d'équipe pour le moment.",
  noRoomMessagesYet: "Aucun message de salle pour le moment.",
  writeMessageToTeam: "Écrire un message à votre équipe",
  writeMessageToRoom: "Écrire un message dans la salle",
  send: "Envoyer",
  visualMatchHint: "Faites correspondre la scène du labyrinthe 3D avec le plateau 2D étiqueté.",

  genreRiddles: "Énigmes",
  genreRiddlesDesc: "Lisez l'indice, discutez du twist et devinez la réponse cachée.",
  genreGuess: "Choix final",
  genreGuessDesc: "Suivez l'histoire, testez les options et faites le choix final qui tient encore après tous les indices.",
  genreVisualMatch: "Correspondance visuelle",
  genreVisualMatchDesc: "Comparez une vue de labyrinthe 3D avec une carte de labyrinthe 2D étiquetée.",
  genreNumberToLetter: "Décrypteur",
  genreNumberToLetterDesc: "Cassez le code caché dans l'énoncé et choisissez la réponse qui survit au décryptage.",

  diffEasy: "Facile",
  diffEasyTagline: "Des indices clairs pour une mise en route amicale.",
  diffMedium: "Moyen",
  diffMediumTagline: "Des rebondissements équilibrés pour des équipes stables.",
  diffHard: "Difficile",
  diffHardTagline: "Des pièges plus affûtés et des déductions plus complexes.",
  diffChallenger: "Le Challenger",
  diffChallengerTagline: "La version la plus audacieuse de la couronne.",
};

const zhCN: T = {
  ...en,
  home: "← 首页",
  connecting: "连接中…",
  installApp: "安装应用",
  safariOnly: "仅限 Safari",
  howToPlay: "玩法说明",
  joinRoom: "加入房间",
  difficulty: "难度",
  resumeGame: "继续游戏",
  gameConditions: "游戏设置",
  writingRound: "正在准备本局",
  creatingImages: (done, total) => `正在准备视觉内容 (${done} / ${total})`,
  preparingVisual: "正在准备视觉内容…",
  note1: "本局中的文字与视觉内容都会为当前游戏回合准备。",
  note3: "可以使用提示，但用了提示后，本局奖励会减半。",
  exitGameTitle: "退出游戏",
  leaveConfirm: "确定要离开这局游戏吗？",
  noWinner: "暂无胜者",
  newGame: "新游戏",
  joinRoomTitle: "加入房间",
  yourName: "你的名字",
  waitingForHost: "等待游戏开始",
  playersInRoom: (n) => `现在有 ${n} 位玩家`,
  hostChoosingType: "主持人正在选择游戏类型…",
  hostChoosingDiff: "主持人正在选择难度…",
  askQuestion: "提问",
  questionPlaceholder: "想要一个更明确的方向时，可以在这里提问",
  askQuestionBtn: "请求提示",
  attemptAnswer: "提交答案",
  attemptAnswerBtn: "发送答案",
  tutorialLibraryTitle: "玩法说明",
  tutorialLibraryDesc: "选择一种游戏类型，先快速了解玩法再开始。",
  tutorialAutoTitle: "这是你第一次体验这种玩法",
  tutorialAutoDesc: "先看一段快速说明，马上进入状态。",
  tutorialGoalLabel: "目标",
  tutorialHowItWorksLabel: "玩法",
  tutorialTipLabel: "提示",
  tutorialScoringLabel: "得分",
  tutorialOpenGenre: "查看说明",
  tutorialStart: "开始游戏",
  tutorialContinue: "知道了",
  settingsMenu: "设置",
  language: "语言",
  changeLanguage: "切换语言",
  myProfile: "我的资料",
  notifications: "通知",
  displayName: "显示名称",
  displayNameHint: "可以在 设置 → 我的资料 中修改名字。",
  playerPlaceholder: "玩家",
  gameHistory: "游戏记录",
  noGamesRecorded: "还没有任何对局记录。",
  won: "胜利",
  lost: "失败",
  onlinePvp: "在线 PVP",
  scoreWord: "分数",
  roomWord: "房间",
  participantsWord: "玩家",
  delivery: "接收方式",
  email: "电子邮件",
  textMessage: "短信",
  optOut: "不接收",
  emailAddress: "电子邮件地址",
  phoneNumber: "电话号码",
  pointsEarned: "获得分数",
  messagesFromOtherPlayers: "其他玩家的消息",
  badgeUnlocks: "徽章解锁",
  rankingUpdates: "排名更新",
  recentAlerts: "最近通知",
  alertDeliveryNotice: "通知会显示在这里。邮件和短信偏好会被保存，但外部发送功能暂未接通。",
  openSettings: "游戏设置",
  openHowToPlay: "玩法说明",
  settingsPageTitle: "游戏设置",
  settingsPageDesc: "后端凭证会存储在本地 SQLite 数据库中。留空即可保留现有值。",
  currentValue: (value) => `当前值：${value}`,
  notSet: "未设置",
  savedShort: "已保存。",
  endGame: "结束游戏",
  leaveWaitingHallTitle: "离开等候区",
  leaveWaitingHallConfirm: "确定要结束这局游戏并返回 /start/online 吗？",
  waitingHallLeave: "离开这个等候区",
  bonusClue: "额外线索",
  playersTab: "玩家",
  chatTab: "聊天",
  gameTab: "游戏",
  feedTab: "动态",
  teamChatLabel: "队伍",
  roomChatLabel: "房间",
  teamChatFrom: (name) => `${name} 发来的队伍聊天`,
  roomChatFrom: (name) => `${name} 发来的房间聊天`,
  noTeamMessagesYet: "队伍里还没有消息。",
  noRoomMessagesYet: "房间里还没有消息。",
  writeMessageToTeam: "给队友写一条消息",
  writeMessageToRoom: "给房间写一条消息",
  send: "发送",
  visualMatchHint: "把 3D 迷宫场景和带标签的 2D 迷宫板对应起来。",
  genreRiddles: "谜语",
  genreGuess: "最终选择",
  genreVisualMatch: "视觉匹配",
  genreNumberToLetter: "破译者",
};

const zhHK: T = {
  ...en,
  home: "← 主頁",
  connecting: "連線中…",
  installApp: "安裝 App",
  safariOnly: "只限 Safari",
  howToPlay: "玩法說明",
  joinRoom: "加入房間",
  difficulty: "難度",
  resumeGame: "繼續遊戲",
  gameConditions: "遊戲設定",
  writingRound: "正在準備本局",
  creatingImages: (done, total) => `正在準備視覺內容 (${done} / ${total})`,
  preparingVisual: "正在準備視覺內容…",
  note1: "本局的文字與視覺內容都會為目前回合準備。",
  note3: "可以用提示，但一用提示，本局獎勵就會減半。",
  exitGameTitle: "離開遊戲",
  leaveConfirm: "你確定要離開這局遊戲嗎？",
  noWinner: "未有勝者",
  newGame: "新遊戲",
  joinRoomTitle: "加入房間",
  yourName: "你的名字",
  waitingForHost: "等候遊戲開始",
  playersInRoom: (n) => `而家有 ${n} 位玩家`,
  hostChoosingType: "主持人正在揀遊戲類型…",
  hostChoosingDiff: "主持人正在揀難度…",
  askQuestion: "發問",
  questionPlaceholder: "想有人推你一把時，可以喺度發問",
  askQuestionBtn: "索取提示",
  attemptAnswer: "提交答案",
  attemptAnswerBtn: "送出答案",
  tutorialLibraryTitle: "玩法說明",
  tutorialLibraryDesc: "先選一種遊戲類型，快速了解玩法再開始。",
  tutorialAutoTitle: "你第一次玩這種玩法",
  tutorialAutoDesc: "先看一段快速說明，再正式開始。",
  tutorialGoalLabel: "目標",
  tutorialHowItWorksLabel: "玩法",
  tutorialTipLabel: "提示",
  tutorialScoringLabel: "得分",
  tutorialOpenGenre: "查看說明",
  tutorialStart: "開始遊戲",
  tutorialContinue: "明白了",
  settingsMenu: "設定",
  language: "語言",
  changeLanguage: "切換語言",
  myProfile: "我的資料",
  notifications: "通知",
  displayName: "顯示名稱",
  displayNameHint: "可以喺 設定 → 我的資料 修改名稱。",
  playerPlaceholder: "玩家",
  gameHistory: "遊戲紀錄",
  noGamesRecorded: "暫時未有任何對局紀錄。",
  won: "勝出",
  lost: "落敗",
  onlinePvp: "線上 PVP",
  scoreWord: "分數",
  roomWord: "房間",
  participantsWord: "玩家",
  delivery: "接收方式",
  email: "電郵",
  textMessage: "短訊",
  optOut: "不接收",
  emailAddress: "電郵地址",
  phoneNumber: "電話號碼",
  pointsEarned: "獲得分數",
  messagesFromOtherPlayers: "其他玩家訊息",
  badgeUnlocks: "徽章解鎖",
  rankingUpdates: "排名更新",
  recentAlerts: "最近通知",
  alertDeliveryNotice: "通知會顯示喺呢度。電郵同短訊偏好會保存，但外部發送功能未接通。",
  openSettings: "遊戲設定",
  openHowToPlay: "玩法說明",
  settingsPageTitle: "遊戲設定",
  settingsPageDesc: "後端憑證會儲存在本機 SQLite 資料庫。留空即可保留現有值。",
  currentValue: (value) => `目前值：${value}`,
  notSet: "未設定",
  savedShort: "已儲存。",
  endGame: "結束遊戲",
  leaveWaitingHallTitle: "離開等候區",
  leaveWaitingHallConfirm: "你確定要結束呢局遊戲並返回 /start/online 嗎？",
  waitingHallLeave: "離開呢個等候區",
  bonusClue: "額外線索",
  playersTab: "玩家",
  chatTab: "聊天",
  gameTab: "遊戲",
  feedTab: "動態",
  teamChatLabel: "隊伍",
  roomChatLabel: "房間",
  teamChatFrom: (name) => `${name} 嘅隊伍聊天`,
  roomChatFrom: (name) => `${name} 嘅房間聊天`,
  noTeamMessagesYet: "隊伍暫時未有訊息。",
  noRoomMessagesYet: "房間暫時未有訊息。",
  writeMessageToTeam: "輸入一段訊息俾隊友",
  writeMessageToRoom: "輸入一段訊息去房間",
  send: "送出",
  visualMatchHint: "將 3D 迷宮場景同有標示嘅 2D 迷宮板配對。",
  genreRiddles: "謎語",
  genreGuess: "最終抉擇",
  genreVisualMatch: "視覺配對",
  genreNumberToLetter: "破碼者",
};

const es: T = {
  ...en,
  home: "← Inicio",
  connecting: "Conectando…",
  installApp: "Instalar app",
  safariOnly: "Solo Safari",
  howToPlay: "Cómo jugar",
  joinRoom: "Unirse a una sala",
  difficulty: "Dificultad",
  resumeGame: "Reanudar partida",
  gameConditions: "Configuración del juego",
  writingRound: "Preparando la ronda",
  creatingImages: (done, total) => `Preparando visuales (${done} / ${total})`,
  preparingVisual: "Preparando visual…",
  note1: "Los textos y visuales de esta ronda se preparan para esta sesión de juego.",
  note3: "Puedes pedir una pista, pero eso deja la recompensa de la ronda en la mitad.",
  exitGameTitle: "Salir del juego",
  leaveConfirm: "¿Seguro que quieres salir de esta partida?",
  noWinner: "Sin ganador",
  newGame: "Nueva partida",
  joinRoomTitle: "Unirse a la sala",
  yourName: "Tu nombre",
  waitingForHost: "Esperando a que empiece la partida",
  playersInRoom: (n) => `${n} jugadores ya están dentro`,
  hostChoosingType: "La persona anfitriona está eligiendo el tipo de juego…",
  hostChoosingDiff: "La persona anfitriona está eligiendo la dificultad…",
  askQuestion: "Hacer una pregunta",
  questionPlaceholder: "Pide una pequeña pista si necesitas empuje",
  askQuestionBtn: "Pedir pista",
  attemptAnswer: "Intentar respuesta",
  attemptAnswerBtn: "Enviar respuesta",
  tutorialLibraryTitle: "Cómo jugar",
  tutorialLibraryDesc: "Elige un tipo de juego para ver rápidamente cómo funciona antes de empezar.",
  tutorialAutoTitle: "Es tu primera vez en este tipo de juego",
  tutorialAutoDesc: "Aquí tienes la guía rápida para entrar en ritmo enseguida.",
  tutorialGoalLabel: "Objetivo",
  tutorialHowItWorksLabel: "Cómo funciona",
  tutorialTipLabel: "Qué conviene mirar",
  tutorialScoringLabel: "Puntuación",
  tutorialOpenGenre: "Abrir guía",
  tutorialStart: "Empezar partida",
  tutorialContinue: "Entendido",
  settingsMenu: "Ajustes",
  language: "Idioma",
  changeLanguage: "Cambiar idioma",
  myProfile: "Mi perfil",
  notifications: "Notificaciones",
  displayName: "Nombre visible",
  displayNameHint: "Cambia tu nombre desde Ajustes → Mi perfil.",
  playerPlaceholder: "Jugador",
  gameHistory: "Historial de partidas",
  noGamesRecorded: "Todavía no hay partidas registradas.",
  won: "Ganó",
  lost: "Perdió",
  onlinePvp: "PVP online",
  scoreWord: "Puntuación",
  roomWord: "Sala",
  participantsWord: "Jugadores",
  delivery: "Entrega",
  email: "Correo",
  textMessage: "Mensaje de texto",
  optOut: "No recibir",
  emailAddress: "Correo electrónico",
  phoneNumber: "Número de teléfono",
  pointsEarned: "Puntos ganados",
  messagesFromOtherPlayers: "Mensajes de otros jugadores",
  badgeUnlocks: "Desbloqueo de insignias",
  rankingUpdates: "Actualizaciones del ranking",
  recentAlerts: "Alertas recientes",
  alertDeliveryNotice: "Las alertas aparecerán aquí. Las preferencias de correo y texto se guardan, pero el envío externo todavía no está conectado.",
  openSettings: "Ajustes del juego",
  openHowToPlay: "Cómo jugar",
  settingsPageTitle: "Ajustes del juego",
  settingsPageDesc: "Credenciales del backend. Se guardan en la base local SQLite. Déjalo en blanco para mantener el valor actual.",
  currentValue: (value) => `Actual: ${value}`,
  notSet: "Sin configurar",
  savedShort: "Guardado.",
  endGame: "Terminar partida",
  leaveWaitingHallTitle: "Salir de la sala de espera",
  leaveWaitingHallConfirm: "¿Seguro que quieres terminar esta partida y volver a /start/online?",
  waitingHallLeave: "Salir de esta sala de espera",
  bonusClue: "Pista extra",
  playersTab: "Jugadores",
  chatTab: "Chat",
  gameTab: "Juego",
  feedTab: "Actividad",
  teamChatLabel: "Equipo",
  roomChatLabel: "Sala",
  teamChatFrom: (name) => `Chat de equipo de ${name}`,
  roomChatFrom: (name) => `Chat de sala de ${name}`,
  noTeamMessagesYet: "Todavía no hay mensajes del equipo.",
  noRoomMessagesYet: "Todavía no hay mensajes en la sala.",
  writeMessageToTeam: "Escribe un mensaje para tu equipo",
  writeMessageToRoom: "Escribe un mensaje para la sala",
  send: "Enviar",
  visualMatchHint: "Relaciona la escena del laberinto 3D con el tablero 2D etiquetado.",
  genreRiddles: "Adivinanzas",
  genreGuess: "Elección final",
  genreVisualMatch: "Emparejamiento visual",
  genreNumberToLetter: "Codebreaker",
};

export const translations: Record<Locale, T> = {
  en,
  ko,
  fr,
  "zh-CN": zhCN,
  "zh-HK": zhHK,
  es,
};

export function getGenreDisplay(name: string, t: T): { name: string; description: string } {
  const map: Record<string, { name: string; description: string }> = {
    Riddles: { name: t.genreRiddles, description: t.genreRiddlesDesc },
    "Final Pick": { name: t.genreGuess, description: t.genreGuessDesc },
    "Visual Match": { name: t.genreVisualMatch, description: t.genreVisualMatchDesc },
    Codebreaker: { name: t.genreNumberToLetter, description: t.genreNumberToLetterDesc },
  };
  return map[name] ?? { name, description: "" };
}

export function getDifficultyDisplay(value: string, t: T): { label: string; tagline: string } {
  const map: Record<string, { label: string; tagline: string }> = {
    easy: { label: t.diffEasy, tagline: t.diffEasyTagline },
    medium: { label: t.diffMedium, tagline: t.diffMediumTagline },
    hard: { label: t.diffHard, tagline: t.diffHardTagline },
    challenger: { label: t.diffChallenger, tagline: t.diffChallengerTagline },
  };
  return map[value] ?? { label: value, tagline: "" };
}
