# GA4 Analytics Implementation Guide

## 📊 Overview

This document outlines the complete GA4 event tracking system implemented for FreeFocusGames. The system is designed to analyze user behavior patterns and identify conversion bottlenecks based on the finding that 91% of users are new visitors with low return rates.

## 🎯 Core Conversion Funnels

### Funnel 1: New User Conversion
```
Page View → Start Assessment → Complete Assessment → Click Recommendation → Start Game → Complete Game
```

**Key Metrics:**
- Assessment start rate from homepage
- Assessment completion rate
- Recommendation click-through rate
- First game conversion rate
- Game completion rate

### Funnel 2: User Engagement & Retention
```
Game Start → Game Complete → Share Results → Settings Change → Repeat Play
```

**Key Metrics:**
- Game completion rate by difficulty
- Share/social engagement rate
- Settings optimization behavior
- Return visit patterns

## 📈 Event Implementation

### 1. Assessment Events

#### `start_assessment`
**Trigger:** User begins cognitive assessment in /get-started
```javascript
analytics.assessment.start({
  test_type: 'assessment_focus|memory|speed|general'
});
```

#### `complete_assessment` 
**Trigger:** User completes all assessment tests
```javascript
analytics.assessment.complete({
  test_type: 'assessment_focus|memory|speed|general',
  recommendations: ['dual-n-back', 'schulte-table']
});
```

### 2. Game Events

#### `start_game` (Key Event)
**Trigger:** User starts any brain training game
```javascript
analytics.game.start({
  game_id: 'dual-n-back|schulte-table|stroop-test|...',
  mode: 'dual|position|audio',
  level: 1-5,
  difficulty: 'easy|medium|hard'
});
```

#### `complete_game` (Key Event)
**Trigger:** User completes a game session
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

#### `game_pause_resume`
**Trigger:** User pauses or resumes game
```javascript
analytics.game.pause({
  game_id: 'dual-n-back',
  action: 'pause|resume',
  level: 2
});
```

#### `game_settings_change`
**Trigger:** User adjusts game settings
```javascript
analytics.game.settings({
  game_id: 'dual-n-back',
  setting_changed: 'difficulty_level',
  level: 3
});
```

### 3. Navigation Events

#### `game_recommendation_click` (Key Event)
**Trigger:** User clicks recommended game from assessment results
```javascript
analytics.navigation.recommendation({
  from_page: 'get-started',
  to_page: 'games/dual-n-back',
  source: 'assessment_recommendation',
  game_to: 'dual-n-back'
});
```

#### `navigate_to_assessment`
**Trigger:** User navigates to assessment from any page
```javascript
analytics.navigation.toAssessment('homepage_hero', 'homepage');
```

#### `navigate_to_game`
**Trigger:** User navigates to any game page
```javascript
analytics.navigation.toGame({
  game_id: 'dual-n-back',
  from_page: 'homepage',
  source: 'game_carousel'
});
```

### 4. Social Events

#### `share_results`
**Trigger:** User shares game results
```javascript
analytics.social.share({
  game_id: 'dual-n-back',
  score: 15,
  accuracy: 85
});
```

### 5. Engagement Events

#### `page_engagement`
**Trigger:** User spends >5 seconds on page
```javascript
analytics.engagement.pageTime('homepage', 15000);
```

## 🔧 Implementation Details

### File Structure
```
lib/analytics.ts          # Main analytics utility
├── Event type definitions
├── Tracking functions
├── Development logging
└── Batch export object

Components with tracking:
├── games/dual-n-back/components/GameComponent.tsx
├── get-started/components/OnboardingFlow.tsx
└── [Other game components as needed]
```

### Development Features
- Console logging in development environment
- TypeScript type safety for all events
- Graceful fallback if gtag is unavailable
- Centralized configuration

## 📊 GA4 Dashboard Setup

### Recommended Key Events
Mark these events as "Key Events" in GA4:
1. `start_assessment`
2. `complete_assessment`
3. `start_game`
4. `complete_game`
5. `game_recommendation_click`

### Custom Dimensions
Set up these custom dimensions for deeper analysis:
- `game_id` - Which game was played
- `difficulty` - Game difficulty level
- `test_type` - Type of assessment taken
- `source` - Traffic source for conversions

### Conversion Paths
Create these conversion paths in GA4:
1. **Assessment to Game:** `start_assessment` → `complete_assessment` → `game_recommendation_click` → `start_game`
2. **Game Engagement:** `start_game` → `complete_game` → `share_results`
3. **User Retention:** `complete_game` → `start_game` (return visits)

## 🎯 Expected Insights

### User Flow Analysis
- **Drop-off Points:** Identify where users leave the funnel
- **Conversion Rates:** Measure assessment → game conversion
- **Engagement Quality:** Track game completion rates by difficulty

### Content Performance
- **Game Popularity:** Which games convert best from recommendations
- **Difficulty Optimization:** Optimal difficulty progression
- **Assessment Effectiveness:** Which assessment types lead to better engagement

### User Segmentation
- **New vs Return:** Behavior differences between user types
- **Goal-Based:** Performance by user-selected goals (focus, memory, speed)
- **Engagement Level:** Casual vs power users

## 🚀 Next Steps

### Phase 1: Data Collection (Weeks 1-2)
- [ ] Deploy to production
- [ ] Verify events are firing correctly
- [ ] Set up GA4 key events and funnels

### Phase 2: Analysis (Weeks 3-4)  
- [ ] Identify biggest conversion bottlenecks
- [ ] Analyze user behavior patterns
- [ ] Segment high-value vs low-value traffic

### Phase 3: Optimization (Week 5+)
- [ ] Implement ChatGPT's N-Back page optimizations
- [ ] A/B test recommendation algorithms
- [ ] Optimize based on funnel analysis

## 🔍 Monitoring & Alerts

### Key Metrics to Watch
- Assessment completion rate (target: >60%)
- Game start rate from recommendations (target: >40%) 
- Game completion rate (target: >70%)
- Return visitor rate (target: increase from current 9%)

### Alert Thresholds
Set up alerts if metrics drop below:
- Assessment completion rate < 50%
- Game recommendation clicks < 30%
- Overall conversion rate drops >20%

---

**Implementation Date:** January 2025  
**GA4 Property:** G-93FVQFJCHE  
**Tracking Library:** @next/third-parties/google + custom analytics.ts