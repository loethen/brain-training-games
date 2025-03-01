export const GAME_CONFIG = {
  trials: {
    perRound: 20, // 每轮试验次数
    interval: 3000, // 试验间隔时间（毫秒）
    startDelay: 500, // 第一次试验前的延迟
  },
  difficulty: {
    initialLevel: 1, // 从1-back开始
    maxLevel: 4, // 最大n-back级别
    targetAccuracy: 80, // 晋级所需的准确率百分比
  },
  mahjong: {
    // 麻将牌类型
    tiles: [
      { id: 'bamboo1', name: '一条', audio: 'yitiao' },
      { id: 'bamboo2', name: '二条', audio: 'ertiao' },
      { id: 'bamboo3', name: '三条', audio: 'santiao' },
      { id: 'bamboo4', name: '四条', audio: 'sitiao' },
      { id: 'bamboo5', name: '五条', audio: 'wutiao' },
      { id: 'bamboo6', name: '六条', audio: 'liutiao' },
      { id: 'bamboo7', name: '七条', audio: 'qitiao' },
      { id: 'bamboo8', name: '八条', audio: 'batiao' },
      { id: 'bamboo9', name: '九条', audio: 'jiutiao' },
      
      { id: 'dot1', name: '一筒', audio: 'yitong' },
      { id: 'dot2', name: '二筒', audio: 'ertong' },
      { id: 'dot3', name: '三筒', audio: 'santong' },
      { id: 'dot4', name: '四筒', audio: 'sitong' },
      { id: 'dot5', name: '五筒', audio: 'wutong' },
      { id: 'dot6', name: '六筒', audio: 'liutong' },
      { id: 'dot7', name: '七筒', audio: 'qitong' },
      { id: 'dot8', name: '八筒', audio: 'batong' },
      { id: 'dot9', name: '九筒', audio: 'jiutong' },
      
      { id: 'character1', name: '一万', audio: 'yiwan' },
      { id: 'character2', name: '二万', audio: 'erwan' },
      { id: 'character3', name: '三万', audio: 'sanwan' },
      { id: 'character4', name: '四万', audio: 'siwan' },
      { id: 'character5', name: '五万', audio: 'wuwan' },
      { id: 'character6', name: '六万', audio: 'liuwan' },
      { id: 'character7', name: '七万', audio: 'qiwan' },
      { id: 'character8', name: '八万', audio: 'bawan' },
      { id: 'character9', name: '九万', audio: 'jiuwan' },
      
      { id: 'dragon_red', name: '中', audio: 'zhong' },
      { id: 'dragon_green', name: '发', audio: 'fa' },
      { id: 'dragon_white', name: '白', audio: 'bai' },
      
      { id: 'wind_east', name: '东', audio: 'dong' },
      { id: 'wind_south', name: '南', audio: 'nan' },
      { id: 'wind_west', name: '西', audio: 'xi' },
      { id: 'wind_north', name: '北', audio: 'bei' },
    ],
    // 麻将牌资源路径
    basePath: '/games/mahjong-dual-n-back/tiles/',
    audioPath: '/games/mahjong-dual-n-back/audio/',
  },
  messages: {
    start: "记住N步之前的麻将牌和声音",
    levelUp: "做得好！进入 {level}-back",
    levelDown: "让我们尝试更简单的级别: {level}-back",
    complete: "训练完成！位置准确率: {position}%, 音频准确率: {audio}%"
  }
} as const; 