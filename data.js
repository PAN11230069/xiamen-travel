// ============================================
// 2026 廈金五天四夜慢旅行 — 行程資料
// 之後要改行程/公告/待辦，只要改這個檔案就好
// ============================================

const tripInfo = {
  title: "2026 廈金五天四夜慢旅行",
  subtitle: "把行程、地圖、住宿和注意事項都放在這裡，出門只要打開這個網站就好。",
  startDate: "2026-07-19",
  endDate: "2026-07-23",
  emergencyContact: "尚未填寫",
  meetingTime: "7/19 10:30　龍潭住家上車",
  meetingPlace: "桃園市龍潭區住家",
  outboundFlight: "B7-8821　松山→金門　14:30-15:35",
  returnFlightNo: "B7-8836　金門→松山　20:15-21:15",
  returnFlight: "2026-07-23T20:15:00",
  ferryToXiamen: "2026-07-20T09:00:00",
  ferryToKinmen: "2026-07-23T17:00:00"
};

// 機場接送（大車包車）
const transfers = [
  {
    type: "送機",
    date: "2026-07-19",
    time: "10:30",
    pickup: "桃園市龍潭區住家",
    dropoff: "松山機場",
    passengers: "7 人",
    luggage: "7 件",
    flight: "B7-8821",
    note: "航班 14:30-15:35，請提前 3 小時抵達機場"
  },
  {
    type: "接機",
    date: "2026-07-23",
    time: "21:15 抵達",
    pickup: "松山機場",
    dropoff: "桃園市龍潭區住家",
    passengers: "7 人",
    luggage: "7 件",
    flight: "B7-8836",
    note: "航班 20:15-21:15"
  }
];

// 市內交通（計程車等短程移動）
const localTraffic = [
  {
    route: "酒店 → 東渡碼頭",
    transport: "計程車",
    duration: "約 16 分鐘",
    note: "鼓浪嶼船票需提前確認"
  }
];

// 兩岸航班與船班
const flights = [
  { date: "7/19", route: "松山 → 金門", no: "B7-8821", time: "14:30-15:35" },
  { date: "7/23", route: "金門 → 松山", no: "B7-8836", time: "20:15-21:15" }
];
const ferries = [
  { date: "7/20", route: "金門 → 五通", ship: "金瑞龍", time: "09:00-09:30" },
  { date: "7/23", route: "五通 → 金門", ship: "新金祥龍", time: "17:00-17:30" }
];

const announcement = {
  text: "目前行程仍在規劃中，請大家確認待訂購與待預約項目。",
  updatedAt: "2026-07-04"
};

const members = [
  { name: "游家俊", role: "" },
  { name: "邵一蓓", role: "" },
  { name: "潘朝福", role: "" },
  { name: "王美鳳", role: "" },
  { name: "李萌漟", role: "" },
  { name: "蔡珮晴", role: "" },
  { name: "潘柏霖", role: "" }
];

const todoList = {
  order: [
    { name: "旅平險", done: false },
    { name: "機場接送", done: true, note: "7/2 已訂" },
    { name: "鼓浪嶼船票", done: false },
    { name: "網卡", done: false }
  ],
  reserve: [
    { name: "華僑博物院", done: false },
    { name: "廈門大學", done: false },
    { name: "南普陀寺", done: false }
  ]
};

const hotels = [
  {
    name: "歡樂滿屋民宿",
    nights: "7/19",
    address: "金門縣金城鎮榜林村伯玉路一段236巷8號",
    checkin: "尚未填寫",
    checkout: "尚未填寫",
    phone: "0963 591 810",
    rooms: "尚未填寫",
    map: ""
  },
  {
    name: "廈門中山路步行街檀邑飯店",
    nights: "7/20 - 7/23",
    address: "廈門市思明區局口西二街109號",
    checkin: "尚未填寫",
    checkout: "尚未填寫",
    phone: "+86-592-6015999",
    rooms: "尚未填寫",
    map: ""
  }
];

const packingList = [
  "台胞證", "身分證", "健保卡", "手機", "充電器", "行動電源",
  "網卡 / 電話卡", "現金", "銀行卡", "雨傘", "換洗衣物",
  "個人藥品", "船票資訊", "機票資訊", "旅平險資料"
];

const budgetItems = [
  { item: "住宿", amount: 0 },
  { item: "交通", amount: 0 },
  { item: "門票", amount: 0 },
  { item: "餐費", amount: 0 }
];

const foodList = {
  mustEat: [
    { name: "八市晚餐", type: "小吃 / 海鮮", address: "廈門八市", note: "建議傍晚前往", hours: "" },
    { name: "曾厝垵小吃", type: "小吃街", address: "廈門曾厝垵", note: "人潮較多", hours: "" }
  ],
  backup: [
    { name: "鼓浪嶼附近美食", type: "咖啡廳 / 小吃", address: "鼓浪嶼", note: "備選", hours: "" }
  ]
};

const rainyDayPlans = [
  { original: "鼓浪嶼", backup: "室內咖啡廳 / 商場 / 博物館" },
  { original: "沙波尾、曾厝垵", backup: "華僑博物院 / 百貨商場 / 室內美食行程" }
];

const tripData = [
  {
    day: "Day 1",
    date: "2026-07-19",
    displayDate: "7/19",
    week: "星期日",
    title: "抵達金門",
    location: "金門",
    plans: [
      {
        time: "15:35",
        place: "金門",
        activity: "抵達金門",
        transport: "飛機 B7-8821",
        duration: "",
        ticket: false,
        reserve: false,
        note: "松山 14:30 起飛，抵達後前往金門住宿（歡樂滿屋民宿）",
        map: ""
      },
      {
        time: "晚上",
        place: "金門住宿",
        activity: "入住休息",
        transport: "自行安排",
        duration: "",
        ticket: false,
        reserve: false,
        note: "隔天 09:00 搭船至廈門，建議提早休息",
        map: ""
      }
    ]
  },
  {
    day: "Day 2",
    date: "2026-07-20",
    displayDate: "7/20",
    week: "星期一",
    title: "前往廈門與集美學村",
    location: "廈門",
    plans: [
      {
        time: "09:00",
        place: "金門碼頭",
        activity: "搭船至廈門（五通）",
        transport: "船（金瑞龍）",
        duration: "約 30 分鐘，09:00-09:30",
        ticket: true,
        reserve: false,
        note: "請提前到碼頭辦理相關手續",
        map: ""
      },
      {
        time: "抵達後",
        place: "五通碼頭",
        activity: "辦電話卡、開戶",
        transport: "步行",
        duration: "",
        ticket: false,
        reserve: false,
        note: "需準備台胞證與相關證件",
        map: ""
      },
      {
        time: "下午",
        place: "廈門酒店",
        activity: "辦理住宿",
        transport: "計程車",
        duration: "約 26 分鐘",
        ticket: false,
        reserve: false,
        note: "可先寄放行李",
        map: ""
      },
      {
        time: "傍晚",
        place: "集美學村",
        activity: "參觀、散步",
        transport: "鎮海路地鐵站搭地鐵",
        duration: "",
        ticket: false,
        reserve: false,
        note: "注意回程時間",
        map: ""
      }
    ]
  },
  {
    day: "Day 3",
    date: "2026-07-21",
    displayDate: "7/21",
    week: "星期二",
    title: "鼓浪嶼與八市晚餐",
    location: "廈門 / 鼓浪嶼",
    plans: [
      {
        time: "上午",
        place: "東渡碼頭",
        activity: "前往碼頭",
        transport: "計程車",
        duration: "約 16 分鐘",
        ticket: false,
        reserve: false,
        note: "請確認鼓浪嶼船票與證件",
        map: ""
      },
      {
        time: "上午",
        place: "三丘田碼頭",
        activity: "搭船至鼓浪嶼",
        transport: "船",
        duration: "約 20 分鐘",
        ticket: true,
        reserve: false,
        note: "鼓浪嶼船票需提前購買",
        map: ""
      },
      {
        time: "晚上",
        place: "八市",
        activity: "晚餐",
        transport: "計程車",
        duration: "約 16 分鐘",
        ticket: false,
        reserve: false,
        note: "可安排小吃或海鮮",
        map: ""
      }
    ]
  },
  {
    day: "Day 4",
    date: "2026-07-22",
    displayDate: "7/22",
    week: "星期三",
    title: "沙波尾、南普陀寺與廈門大學",
    location: "廈門市區",
    plans: [
      {
        time: "上午",
        place: "沙波尾",
        activity: "散步、拍照",
        transport: "計程車",
        duration: "",
        ticket: false,
        reserve: false,
        note: "文青街區，適合拍照",
        map: ""
      },
      {
        time: "中午前後",
        place: "華僑博物院",
        activity: "參觀",
        transport: "步行",
        duration: "約 12 分鐘",
        ticket: false,
        reserve: true,
        note: "需確認是否預約",
        map: ""
      },
      {
        time: "下午",
        place: "南普陀寺",
        activity: "參觀",
        transport: "步行",
        duration: "約 14 分鐘",
        ticket: false,
        reserve: true,
        note: "待預約",
        map: ""
      },
      {
        time: "下午",
        place: "廈門大學",
        activity: "參觀校園",
        transport: "步行",
        duration: "約 5 分鐘",
        ticket: false,
        reserve: true,
        note: "待預約，需確認入校規定",
        map: ""
      },
      {
        time: "傍晚",
        place: "曾厝垵",
        activity: "逛街、晚餐",
        transport: "計程車",
        duration: "約 12 分鐘",
        ticket: false,
        reserve: false,
        note: "人潮較多，注意集合時間",
        map: ""
      },
      {
        time: "晚上",
        place: "酒店",
        activity: "返回酒店",
        transport: "計程車",
        duration: "約 16 分鐘",
        ticket: false,
        reserve: false,
        note: "整理隔天返台物品",
        map: ""
      }
    ]
  },
  {
    day: "Day 5",
    date: "2026-07-23",
    displayDate: "7/23",
    week: "星期四",
    title: "廈門植物園與返台",
    location: "廈門 / 金門 / 台灣",
    plans: [
      {
        time: "上午",
        place: "廈門植物園",
        activity: "參觀",
        transport: "計程車",
        duration: "約 6 分鐘",
        ticket: true,
        reserve: false,
        note: "回程日行程不要排太滿",
        map: ""
      },
      {
        time: "17:00",
        place: "五通碼頭",
        activity: "搭船返回金門",
        transport: "船（新金祥龍）",
        duration: "約 30 分鐘，17:00-17:30",
        ticket: true,
        reserve: false,
        note: "務必提早到碼頭",
        map: ""
      },
      {
        time: "20:15",
        place: "金門機場",
        activity: "搭機返台（B7-8836）",
        transport: "飛機",
        duration: "20:15-21:15",
        ticket: true,
        reserve: false,
        note: "抵達松山後有接機車輛，直接返回龍潭住家",
        map: ""
      }
    ]
  }
];
