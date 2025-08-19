# FreeFocusGames - Claude Context File

## 项目概述
FreeFocusGames 是一个基于科学的认知训练游戏平台，使用 Next.js 15 + TypeScript + Tailwind CSS 构建。

## 当前状态 (2025-01)

### ✅ 已完成
- **GA4事件追踪系统** - 完整实现用户行为分析 (详见 `GA4_ANALYTICS_GUIDE.md`)
- **核心游戏** - Dual N-Back, Schulte Table, Stroop Test 等
- **评估系统** - `/get-started` 认知能力测试和个性化推荐
- **多语言支持** - 中文/英文 (next-intl)
- **响应式设计** - 移动端和桌面端适配

### 🎯 关键数据洞察 (ChatGPT分析)
- **用户构成**: 91%新用户，回访率低
- **转化问题**: N-Back页面跳出率31.3%，但"开始测试"页面仅5%
- **高价值页面**: get-started测试页面是最强转化发动机

## 🚨 待优化：N-Back页面跳出率问题

### 问题诊断
基于代码分析，N-Back页面跳出率高的根本原因：

**1. 首屏信息过载**
```
❌ 当前: 标题 → 副标题 → 游戏设置 → 技术说明 → 开始按钮
✅ 应该: 价值主张 → 单一CTA → 折叠其他选项
```

**2. 认知门槛过高**
- Dual N-Back概念对新用户太复杂
- 技术术语过多 ("Track position & sound from 2 steps back")
- 直接从2-back开始，没有渐进引导

**3. CTA竞争**
- 开始游戏 + 设置调整 + 其他按钮并存
- 缺少明确的主要行动指引

**4. 缺少信任建立**
- 没有快速演示或预览
- 没有"先试试"的低风险入口

### 🎯 优化方案 (基于ChatGPT建议)

#### 优先级1: 简化首屏CTA
```typescript
// 当前首屏结构 (GameComponent.tsx:533-550)
{gameState === "idle" ? (
  <div>
    <设置说明 />
    <开始挑战按钮 />
  </div>
) : ...}

// 优化后结构
{gameState === "idle" ? (
  <div>
    <主要CTA: "立即开始" />
    <次要CTA: "找到我的水平" → /get-started />
    <折叠设置: "高级设置" />
  </div>
) : ...}
```

#### 优先级2: 降低认知门槛
- 默认从1-back开始
- 用通俗语言重写说明
- 添加快速演示动画

#### 优先级3: 增加游戏间导流
- 完成后推荐更简单游戏 (Schulte Table)
- 失败时引导到测试页面
- 实现"下一个训练"推荐系统

### 实施计划
1. **立即可做**: 简化首屏，隐藏设置到折叠菜单
2. **本周内**: 添加到测试页面的导流按钮
3. **下周**: 实现游戏间推荐系统

## 技术栈

### 核心框架
- **Next.js 15** - App Router
- **TypeScript** - 严格类型检查
- **Tailwind CSS** - 样式系统
- **next-intl** - 国际化

### 关键组件路径
```
app/[locale]/(main)/
├── games/dual-n-back/components/GameComponent.tsx  # 主要优化目标
├── get-started/components/OnboardingFlow.tsx       # 转化最好的页面
└── games/page.tsx                                  # 游戏列表

components/
├── GamePageTemplate.tsx  # 游戏页面模板
└── [其他共用组件]

lib/
├── analytics.ts          # GA4事件追踪
└── utils.ts
```

### 开发命令
```bash
npm run dev          # 开发环境
npm run build        # 生产构建
npm run start        # 生产运行
```

## GA4事件追踪已实现

### 核心漏斗
1. **新用户转化**: 页面浏览 → 开始评估 → 完成评估 → 点击推荐 → 开始游戏 → 完成游戏
2. **用户参与**: 游戏开始 → 游戏完成 → 分享结果 → 重复游戏

### 关键事件
- `start_assessment` / `complete_assessment`
- `start_game` / `complete_game` 
- `game_recommendation_click`
- `share_results`

详见: `GA4_ANALYTICS_GUIDE.md`

## 下次继续时的重点

1. **优化N-Back页面首屏**
   - 文件: `app/[locale]/(main)/games/dual-n-back/components/GameComponent.tsx`
   - 重点: 简化idle状态的渲染逻辑

2. **添加导流功能**
   - 在游戏完成后添加推荐
   - 在首屏添加"测试水平"按钮

3. **A/B测试准备**
   - 验证事件追踪正常工作
   - 设置转化率监控

---
**更新时间**: 2025-01-19  
**下次重点**: N-Back页面首屏优化  
**关键指标**: 将跳出率从31.3%降至25%以下