import type { Locale } from "@/lib/i18n";

export type EntryCopy = {
  modeTitle: string;
  modeDesc: string;
  soloTitle: string;
  soloDesc: string;
  onlineTitle: string;
  onlineDesc: string;
  groupTitle: string;
  groupDesc: string;
  continueLabel: string;
  onlineName: string;
  onlineButton: string;
  waitingTitle: string;
  waitingDesc: string;
  groupHostTitle: string;
  groupHostDesc: string;
  groupJoinTitle: string;
  groupJoinDesc: string;
  roomCode: string;
  joinRoom: string;
};

const en: EntryCopy = {
  modeTitle: "How do you want to play?",
  modeDesc: "Pick the way that fits the moment. You can play alone, match with people online, or host a room for a group.",
  soloTitle: "Play Alone",
  soloDesc: "Jump into a game on your own and build your streak at your own pace.",
  onlineTitle: "Online PVP",
  onlineDesc: "Meet other players online and get dropped into a team game together.",
  groupTitle: "Host a game",
  groupDesc: "Open a room, share the code, and play with people around you.",
  continueLabel: "Continue",
  onlineName: "Your display name",
  onlineButton: "Find a game",
  waitingTitle: "Finding your table",
  waitingDesc: "You are in the queue. We will move you into the round as soon as another player joins.",
  groupHostTitle: "Open a room",
  groupHostDesc: "Start a room for your group and share the code or QR.",
  groupJoinTitle: "Join a room",
  groupJoinDesc: "Enter the code from your group leader to jump in.",
  roomCode: "Room code",
  joinRoom: "Join room",
};

const ko: EntryCopy = {
  modeTitle: "어떻게 플레이할까요?",
  modeDesc: "지금 상황에 맞는 방식을 고르세요. 혼자 플레이할 수도 있고, 온라인에서 다른 사람들과 만나거나, 직접 방을 열 수도 있어요.",
  soloTitle: "혼자 플레이",
  soloDesc: "혼자 바로 들어가서 내 속도로 연승을 쌓아보세요.",
  onlineTitle: "온라인 플레이",
  onlineDesc: "온라인에서 다른 플레이어를 만나 팀전으로 바로 들어갑니다.",
  groupTitle: "그룹 게임 열기",
  groupDesc: "방을 열고 코드를 공유해서 주변 사람들과 함께 플레이하세요.",
  continueLabel: "계속",
  onlineName: "표시 이름",
  onlineButton: "게임 찾기",
  waitingTitle: "같이 할 사람을 찾고 있어요",
  waitingDesc: "대기열에 들어갔어요. 다른 플레이어가 들어오면 바로 라운드로 이동합니다.",
  groupHostTitle: "방 열기",
  groupHostDesc: "그룹용 방을 만들고 코드나 QR을 공유하세요.",
  groupJoinTitle: "방 참가",
  groupJoinDesc: "리더가 준 코드를 입력하면 바로 참가할 수 있어요.",
  roomCode: "방 코드",
  joinRoom: "방 참가",
};

const fr: EntryCopy = {
  modeTitle: "Comment voulez-vous jouer ?",
  modeDesc: "Choisissez la formule qui colle au moment. Vous pouvez jouer seul, rejoindre des joueurs en ligne, ou ouvrir une salle pour votre groupe.",
  soloTitle: "Jouer en solo",
  soloDesc: "Lancez une partie seul et faites monter votre série à votre rythme.",
  onlineTitle: "Jouer en ligne",
  onlineDesc: "Rencontrez d'autres joueurs en ligne et entrez ensemble dans une partie en équipe.",
  groupTitle: "Ouvrir une partie de groupe",
  groupDesc: "Créez une salle, partagez le code, et jouez avec les personnes autour de vous.",
  continueLabel: "Continuer",
  onlineName: "Nom affiché",
  onlineButton: "Trouver une partie",
  waitingTitle: "Recherche de joueurs",
  waitingDesc: "Vous êtes dans la file. Dès qu'un autre joueur arrive, la manche démarre.",
  groupHostTitle: "Ouvrir une salle",
  groupHostDesc: "Créez une salle pour votre groupe et partagez le code ou le QR.",
  groupJoinTitle: "Rejoindre une salle",
  groupJoinDesc: "Entrez le code du leader du groupe pour participer.",
  roomCode: "Code de salle",
  joinRoom: "Rejoindre",
};

const zhCN: EntryCopy = {
  ...en,
  modeTitle: "你想怎么开始？",
  modeDesc: "按现在的场景来选。你可以自己玩、在线匹配别人，或者开一个房间给身边的人一起玩。",
  soloTitle: "单人玩",
  onlineTitle: "在线玩",
  groupTitle: "开一个团体房间",
  continueLabel: "继续",
  onlineName: "你的名字",
  onlineButton: "开始匹配",
  waitingTitle: "正在找人一起玩",
  waitingDesc: "你已经进入队列。只要另一位玩家加入，就会马上开始。",
  groupHostTitle: "创建房间",
  groupJoinTitle: "加入房间",
  roomCode: "房间代码",
  joinRoom: "加入房间",
};

const zhHK: EntryCopy = {
  ...en,
  modeTitle: "你想點樣開始？",
  modeDesc: "按而家嘅情況去揀。你可以自己玩、在線配對其他玩家，或者開房同身邊朋友一齊玩。",
  soloTitle: "單人玩",
  onlineTitle: "在線玩",
  groupTitle: "開一個群組房間",
  continueLabel: "繼續",
  onlineName: "顯示名稱",
  onlineButton: "開始配對",
  waitingTitle: "正在幫你搵人",
  waitingDesc: "你已經入咗隊列。另一位玩家一加入，就會立即開始。",
  groupHostTitle: "開房",
  groupJoinTitle: "入房",
  roomCode: "房間代碼",
  joinRoom: "加入房間",
};

const es: EntryCopy = {
  ...en,
  modeTitle: "¿Cómo quieres jugar?",
  modeDesc: "Elige la forma que mejor encaje ahora. Puedes jugar solo, entrar a una partida online, o abrir una sala para tu grupo.",
  soloTitle: "Jugar solo",
  onlineTitle: "Jugar online",
  groupTitle: "Abrir una partida de grupo",
  continueLabel: "Continuar",
  onlineName: "Tu nombre",
  onlineButton: "Buscar partida",
  waitingTitle: "Buscando mesa",
  waitingDesc: "Ya estás en la cola. En cuanto entre otra persona, empieza la ronda.",
  groupHostTitle: "Abrir sala",
  groupJoinTitle: "Entrar a una sala",
  roomCode: "Código de sala",
  joinRoom: "Entrar",
};

const copies: Record<Locale, EntryCopy> = {
  en,
  ko,
  fr,
  "zh-CN": zhCN,
  "zh-HK": zhHK,
  es,
};

export function getEntryCopy(locale: Locale): EntryCopy {
  return copies[locale] || en;
}
