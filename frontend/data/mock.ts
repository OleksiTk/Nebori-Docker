export type VideoItem = {
  id: string;
  title: string;
  author: string;
  views: string;
  date: string;
  duration: string;
  tags: string[];
};

export const videos: VideoItem[] = [
  { id: "v101", title: "Огляд патчу Expedition 2.1", author: "IronBand", views: "14 тис.", date: "2 дні тому", duration: "18:42", tags: ["news", "patch"] },
  { id: "v102", title: "Турнір загону: фінальна гра", author: "BorealFox", views: "9.3 тис.", date: "4 дні тому", duration: "27:10", tags: ["esports", "tactics"] },
  { id: "v103", title: "Nebori Devlog #3: нові функції", author: "Nebori Team", views: "3.1 тис.", date: "6 днів тому", duration: "11:09", tags: ["devlog", "platform"] },
  { id: "v104", title: "Гайд по швидкому фарму токенів", author: "TokenCrafter", views: "22 тис.", date: "1 тиждень тому", duration: "9:50", tags: ["guide", "tokens"] },
  { id: "v105", title: "Підбірка кращих кліпів спільноти", author: "Community Hub", views: "7.8 тис.", date: "1 тиждень тому", duration: "16:20", tags: ["community", "clips"] },
  { id: "v106", title: "Топ-5 каналів для новачків", author: "ScoutLine", views: "5.4 тис.", date: "8 днів тому", duration: "12:11", tags: ["channels", "newbies"] },
  { id: "v107", title: "Снайперські позиції на карті Outpost", author: "DeltaNox", views: "31 тис.", date: "9 днів тому", duration: "14:39", tags: ["guide", "map"] },
  { id: "v108", title: "Розбір PvP-білду через підтримку", author: "KiteForm", views: "12 тис.", date: "10 днів тому", duration: "21:04", tags: ["build", "pvp"] },
  { id: "v109", title: "Щоденник клану: тиждень рейдів", author: "Raid Signals", views: "4.2 тис.", date: "11 днів тому", duration: "31:25", tags: ["clan", "raids"] },
  { id: "v110", title: "Як набрати перші 500 підписників", author: "Creator Lab", views: "18 тис.", date: "12 днів тому", duration: "8:43", tags: ["creator", "growth"] },
  { id: "v111", title: "Кращі моменти сезону #12", author: "FlashCaps", views: "66 тис.", date: "2 тижні тому", duration: "24:50", tags: ["highlights", "season"] },
  { id: "v112", title: "Рейтинг команд Східного дивізіону", author: "MetaBoard", views: "8.1 тис.", date: "2 тижні тому", duration: "13:18", tags: ["ranking", "esports"] },
  { id: "v113", title: "ЛОР світу Nebori: частина 1", author: "LoreKeeper", views: "2.7 тис.", date: "15 днів тому", duration: "19:08", tags: ["lore", "story"] },
  { id: "v114", title: "Секретні ачивки, які легко пропустити", author: "BadgeHunter", views: "27 тис.", date: "16 днів тому", duration: "10:33", tags: ["achievements", "tips"] },
  { id: "v115", title: "UI-оновлення платформи: що змінилось", author: "Nebori Team", views: "5.9 тис.", date: "18 днів тому", duration: "7:29", tags: ["devlog", "ui"] },
  { id: "v116", title: "Командна тактика 3-2-1 на практиці", author: "Frontline Hub", views: "11 тис.", date: "19 днів тому", duration: "22:40", tags: ["tactics", "teamplay"] },
  { id: "v118", title: "Порівняння налаштувань графіки для FPS", author: "PerfScope", views: "39 тис.", date: "3 тижні тому", duration: "15:17", tags: ["settings", "fps"] },
  { id: "v119", title: "Початок сезону: офіційний трейлер", author: "Nebori Team", views: "121 тис.", date: "3 тижні тому", duration: "2:11", tags: ["trailer", "season"] },
  { id: "v120", title: "Реакція спільноти на новий патч", author: "VoiceChat", views: "17 тис.", date: "24 дні тому", duration: "18:02", tags: ["community", "patch"] }
];

export const activities = [
  "Іван подивився «Огляд патчу Expedition 2.1»",
  "Марія підписалася на автора Raid Signals",
  "Олег отримав ачівку «Перші 1000 переглядів»",
  "Daria опублікувала нове відео",
  "Raptor підписався на автора Nebori Team"
];

export type ThreadReply = {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  dislikes: number;
};

export type ThreadComment = {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  dislikes: number;
  replies: ThreadReply[];
};

export const threadComments: ThreadComment[] = [
  {
    id: "c1",
    author: "TacticWolf",
    avatar: "https://i.pravatar.cc/80?img=12",
    time: "2 год тому",
    text: "Дуже сильний розбір, чекаю продовження.",
    likes: 34,
    dislikes: 1,
    replies: [
      { id: "c1-r1", author: "ScoutLine", avatar: "https://i.pravatar.cc/60?img=22", time: "1 год тому", text: "Підтримую, особливо блок про теги.", likes: 8, dislikes: 0 },
      { id: "c1-r2", author: "IronBand", avatar: "https://i.pravatar.cc/60?img=28", time: "54 хв тому", text: "Дякую, наступний випуск буде з таймкодами.", likes: 11, dislikes: 0 }
    ]
  },
  {
    id: "c2",
    author: "Mira",
    avatar: "https://i.pravatar.cc/80?img=5",
    time: "1 год тому",
    text: "Було б круто додати таймкоди в опис.",
    likes: 17,
    dislikes: 0,
    replies: [{ id: "c2-r1", author: "Nebori Team", avatar: "https://i.pravatar.cc/60?img=16", time: "42 хв тому", text: "Додали в закріпленому коментарі.", likes: 6, dislikes: 0 }]
  },
  {
    id: "c3",
    author: "RonySize",
    avatar: "https://i.pravatar.cc/80?img=31",
    time: "58 хв тому",
    text: "Зробіть ще випуск по економіці токенів, тема зараз гаряча.",
    likes: 26,
    dislikes: 2,
    replies: [{ id: "c3-r1", author: "TokenCrafter", avatar: "https://i.pravatar.cc/60?img=44", time: "47 хв тому", text: "Підтримую, є що розібрати.", likes: 4, dislikes: 0 }]
  },
  {
    id: "c4",
    author: "Ghosteee",
    avatar: "https://i.pravatar.cc/80?img=38",
    time: "40 хв тому",
    text: "Монтаж дуже чистий, а ще сподобались вставки зі статистикою.",
    likes: 19,
    dislikes: 1,
    replies: []
  }
];
