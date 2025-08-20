# GA4 数据分析实施指南

## 📊 概述

本文档详细说明了 FreeFocusGames 实施的完整 GA4 事件追踪系统。该系统设计用于分析用户行为模式并识别转化瓶颈，基于以下发现：91% 的用户是新访客，回访率较低。

## 🎯 核心转化漏斗

### 漏斗1：新用户转化
```
页面浏览 → 开始评估 → 完成评估 → 点击推荐 → 开始游戏 → 完成游戏
```

**关键指标：**
- 从首页开始评估的比率
- 评估完成率
- 推荐点击率
- 首次游戏转化率
- 游戏完成率

### 漏斗2：用户参与与留存
```
游戏开始 → 游戏完成 → 分享结果 → 设置调整 → 重复游戏
```

**关键指标：**
- 按难度分组的游戏完成率
- 分享/社交参与率
- 设置优化行为
- 回访模式

### 漏斗3：教程学习转化 ⭐ 新增
```
教程按钮点击 → 开始教程 → 完成步骤 → 完成教程 → 开始实际游戏
```

**关键指标：**
- 教程开始率
- 步骤完成率
- 教程完成率
- 教程后游戏开始率

## 📈 事件实施详情

### 1. 评估测试事件

#### `start_assessment` (关键事件)
**触发条件：** 用户在 /get-started 页面开始认知评估
```javascript
analytics.assessment.start({
  test_type: 'assessment_focus|memory|speed|general'
});
```

#### `complete_assessment` (关键事件)
**触发条件：** 用户完成所有评估测试
```javascript
analytics.assessment.complete({
  test_type: 'assessment_focus|memory|speed|general',
  result: 2.5,
  duration_ms: 180000,
  recommendations: ['dual-n-back', 'schulte-table']
});
```

### 2. 游戏事件

#### `start_game` (关键事件)
**触发条件：** 用户开始任何脑力训练游戏
```javascript
analytics.game.start({
  game_id: 'dual-n-back|schulte-table|stroop-test|...',
  mode: 'dual|position|audio',
  level: 1,
  difficulty: 'easy|medium|hard'
});
```

#### `complete_game` (关键事件)
**触发条件：** 用户完成一次游戏会话
```javascript
analytics.game.complete({
  game_id: 'dual-n-back',
  mode: 'dual',
  level: 2,
  score: 15,
  duration_ms: 120000,
  accuracy: 85,
  difficulty: 'medium'
});
```

#### `game_settings_change`
**触发条件：** 用户调整游戏设置
```javascript
analytics.game.settings({
  game_id: 'dual-n-back',
  setting_changed: 'difficulty_level',
  level: 3
});
```

### 3. 教程交互事件 ⭐ 新增

#### `tutorial_start` (关键事件)
**触发条件：** 用户开始互动教程
```javascript
analytics.tutorial.start({
  game_id: 'dual-n-back',
  total_steps: 5,
  source: 'game_page|how_to_play_section'
});
```

#### `tutorial_step_complete`
**触发条件：** 用户完成教程中的某个步骤
```javascript
analytics.tutorial.step({
  game_id: 'dual-n-back',
  tutorial_step: 2,
  total_steps: 5,
  correct_responses: 3,
  total_responses: 4
});
```

#### `tutorial_complete` (关键事件)
**触发条件：** 用户完成整个教程
```javascript
analytics.tutorial.complete({
  game_id: 'dual-n-back',
  completion_rate: 100,
  duration_ms: 45000,
  correct_responses: 8,
  total_responses: 10,
  source: 'game_page'
});
```

#### `tutorial_exit` (重要事件)
**触发条件：** 用户中途退出教程
```javascript
analytics.tutorial.exit({
  game_id: 'dual-n-back',
  exit_step: 3,
  total_steps: 5,
  completion_rate: 60,
  duration_ms: 20000
});
```

#### `tutorial_button_click`
**触发条件：** 用户点击教程入口按钮
```javascript
analytics.tutorial.buttonClick({
  game_id: 'dual-n-back',
  source: 'how_to_play_section|game_page'
});
```

### 4. 导航事件

#### `game_recommendation_click` (关键事件)
**触发条件：** 用户从评估结果点击推荐游戏
```javascript
analytics.navigation.recommendation({
  from_page: 'get-started',
  to_page: 'games/dual-n-back',
  source: 'assessment_recommendation',
  game_to: 'dual-n-back'
});
```

#### `navigate_to_assessment`
**触发条件：** 用户从任何页面导航到评估页面
```javascript
analytics.navigation.toAssessment('homepage_hero', 'homepage');
```

#### `navigate_to_game`
**触发条件：** 用户导航到任何游戏页面
```javascript
analytics.navigation.toGame({
  game_id: 'dual-n-back',
  from_page: 'homepage',
  source: 'game_carousel'
});
```

### 5. 社交事件

#### `share_results`
**触发条件：** 用户分享游戏结果
```javascript
analytics.social.share({
  game_id: 'dual-n-back',
  score: 15,
  accuracy: 85
});
```

### 6. 参与度事件

#### `page_engagement`
**触发条件：** 用户在页面停留超过5秒
```javascript
analytics.engagement.pageTime('games/dual-n-back', 15000);
```

## 🔧 技术实施详情

### 文件结构
```
lib/analytics.ts                # 主要分析工具
├── 事件类型定义
├── 追踪函数
├── 开发环境日志
├── TutorialEventData 接口     # 新增
└── 批量导出对象

带有追踪的组件:
├── games/dual-n-back/components/GameComponent.tsx
├── games/dual-n-back/components/GameDemo.tsx        # 新增
├── games/dual-n-back/components/TutorialButton.tsx  # 新增
├── get-started/components/OnboardingFlow.tsx
└── [其他游戏组件根据需要添加]
```

### 开发特性
- 开发环境控制台日志记录
- 所有事件的 TypeScript 类型安全
- gtag 不可用时的优雅降级
- 集中化配置
- 新增教程事件的完整类型定义

## 📊 GA4 仪表板设置

### 推荐的关键事件
在 GA4 中将这些事件标记为"关键事件"：
1. `start_assessment`
2. `complete_assessment`
3. `start_game`
4. `complete_game`
5. `game_recommendation_click`
6. `tutorial_start` ⭐ 新增
7. `tutorial_complete` ⭐ 新增

### 自定义维度
设置这些自定义维度进行深度分析：
- `game_id` - 玩的是哪个游戏
- `difficulty` - 游戏难度等级
- `test_type` - 评估测试类型
- `source` - 转化的流量来源
- `tutorial_step` - 教程步骤编号 ⭐ 新增
- `completion_rate` - 教程完成率 ⭐ 新增

### 转化路径
在 GA4 中创建这些转化路径：
1. **评估到游戏：** `start_assessment` → `complete_assessment` → `game_recommendation_click` → `start_game`
2. **游戏参与：** `start_game` → `complete_game` → `share_results`
3. **教程学习：** `tutorial_button_click` → `tutorial_start` → `tutorial_complete` → `start_game` ⭐ 新增
4. **用户留存：** `complete_game` → `start_game` (回访)

## 🎯 预期洞察

### 用户流程分析
- **流失点：** 识别用户离开漏斗的位置
- **转化率：** 测量评估 → 游戏转化
- **参与质量：** 按难度追踪游戏完成率
- **教程效果：** 教程完成对游戏参与的影响 ⭐ 新增

### 内容效果
- **游戏受欢迎程度：** 哪些游戏从推荐中转化最好
- **难度优化：** 最佳难度进阶
- **评估有效性：** 哪些评估类型导致更好的参与
- **教程优化：** 哪些教程步骤需要改进 ⭐ 新增

### 用户细分
- **新用户 vs 回访用户：** 用户类型之间的行为差异
- **基于目标：** 按用户选择的目标（专注、记忆、速度）分组
- **参与水平：** 休闲用户 vs 深度用户
- **学习偏好：** 喜欢教程 vs 直接上手的用户 ⭐ 新增

### 教程学习分析 ⭐ 新增
- **步骤效果：** 每个教程步骤的完成率
- **学习质量：** 正确响应率和交互质量
- **退出分析：** 用户在哪个步骤最容易退出
- **转化影响：** 完成教程的用户游戏参与率如何

## 🚀 实施阶段

### 第一阶段：数据收集（第1-2周）
- [x] 部署到生产环境
- [x] 验证事件正确触发
- [x] 设置 GA4 关键事件和漏斗
- [x] 添加教程事件追踪 ⭐ 新增

### 第二阶段：分析（第3-4周）
- [ ] 识别最大的转化瓶颈
- [ ] 分析用户行为模式
- [ ] 细分高价值 vs 低价值流量
- [ ] 分析教程使用情况和效果 ⭐ 新增

### 第三阶段：优化（第5周+）
- [ ] 实施基于 N-Back 页面分析的优化
- [ ] A/B 测试推荐算法
- [ ] 基于漏斗分析进行优化
- [ ] 优化教程内容和流程 ⭐ 新增

## 🔍 监控与警报

### 需要监控的关键指标
- 评估完成率（目标：>60%）
- 从推荐开始游戏的比率（目标：>40%）
- 游戏完成率（目标：>70%）
- 回访用户率（目标：从当前9%提升）
- 教程完成率（目标：>80%）⭐ 新增
- 教程后游戏开始率（目标：>60%）⭐ 新增

### 警报阈值
当指标低于以下阈值时设置警报：
- 评估完成率 < 50%
- 游戏推荐点击 < 30%
- 整体转化率下降 > 20%
- 教程完成率 < 70% ⭐ 新增

## 📊 特殊关注：教程优化分析 ⭐ 新增

### 教程漏斗分析
```
按钮展示 → 按钮点击 → 教程开始 → 步骤1 → 步骤2 → 步骤3 → 步骤4 → 步骤5 → 完成 → 开始游戏
```

### 教程质量指标
- **参与深度：** 平均完成步骤数
- **学习效果：** 正确响应率 vs 错误响应率
- **时间效率：** 完成教程的平均时间（目标：30-60秒）
- **转化价值：** 完成教程用户的后续游戏参与质量

### 优化机会识别
1. **高退出步骤：** 哪些步骤用户最容易放弃
2. **错误模式：** 用户在哪些交互上犯错最多
3. **时间分析：** 步骤停留时间是否合理
4. **设备差异：** 手机 vs 桌面的教程体验差异

---

**实施日期：** 2025年1月  
**GA4 属性：** G-93FVQFJCHE  
**追踪库：** @next/third-parties/google + 自定义 analytics.ts  
**最新更新：** 2025年1月 - 添加教程交互事件追踪