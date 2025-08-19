// GA4 Event Tracking for FreeFocusGames
// Based on user behavior analysis and conversion funnel optimization

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// 游戏相关事件数据类型
export interface GameEventData {
  game_id: string;
  mode?: string;
  level?: number;
  score?: number;
  duration_ms?: number;
  accuracy?: number;
  difficulty?: string;
}

// 测试评估事件数据类型
export interface AssessmentEventData {
  test_type: string;
  result?: number;
  duration_ms?: number;
  recommendations?: string[];
}

// 导航流转事件数据类型
export interface NavigationEventData {
  from_page?: string;
  to_page?: string;
  source?: string;
  game_from?: string;
  game_to?: string;
}

// 检查 gtag 是否可用
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

// 基础事件追踪函数
const trackEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (!isGtagAvailable()) {
    console.warn('gtag not available, skipping event:', eventName, parameters);
    return;
  }

  window.gtag('event', eventName, {
    custom_map: {},
    ...parameters
  });

  // 开发环境下打印事件日志
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 GA4 Event:', eventName, parameters);
  }
};

// ==================== 核心转化漏斗事件 ====================

// 1. 开始评估测试 (关键事件)
export const trackStartAssessment = (data: AssessmentEventData) => {
  trackEvent('start_assessment', {
    test_type: data.test_type
  });
};

// 2. 完成评估测试 (关键事件) 
export const trackCompleteAssessment = (data: AssessmentEventData) => {
  trackEvent('complete_assessment', {
    test_type: data.test_type,
    result: data.result || 0,
    duration_ms: data.duration_ms || 0,
    recommendations: data.recommendations?.join(',') || ''
  });
};

// 3. 开始游戏 (关键事件)
export const trackStartGame = (data: GameEventData) => {
  trackEvent('start_game', {
    game_id: data.game_id,
    mode: data.mode || 'standard',
    level: data.level || 1,
    difficulty: data.difficulty || 'normal'
  });
};

// 4. 完成游戏 (关键事件)
export const trackCompleteGame = (data: GameEventData) => {
  trackEvent('complete_game', {
    game_id: data.game_id,
    mode: data.mode || 'standard',
    level: data.level || 1,
    score: data.score || 0,
    duration_ms: data.duration_ms || 0,
    accuracy: data.accuracy || 0,
    difficulty: data.difficulty || 'normal'
  });
};

// 5. 点击游戏推荐 (关键事件)
export const trackGameRecommendationClick = (data: NavigationEventData) => {
  trackEvent('game_recommendation_click', {
    from_page: data.from_page || '',
    to_page: data.to_page || '',
    game_from: data.game_from || '',
    game_to: data.game_to || '',
    source: data.source || 'recommendation'
  });
};

// ==================== 辅助转化事件 ====================

// 6. 导航到测试页面
export const trackNavigateToAssessment = (source: string, from_page?: string) => {
  trackEvent('navigate_to_assessment', {
    source: source,
    from_page: from_page || ''
  });
};

// 7. 导航到游戏页面
export const trackNavigateToGame = (data: NavigationEventData) => {
  trackEvent('navigate_to_game', {
    game_id: data.game_to || '',
    from_page: data.from_page || '',
    source: data.source || 'direct'
  });
};

// 8. 下一个游戏点击
export const trackNextGameClick = (data: NavigationEventData) => {
  trackEvent('next_game_click', {
    from_game: data.game_from || '',
    to_game: data.game_to || '',
    source: data.source || 'post_game_recommendation'
  });
};

// 9. 分享游戏结果
export const trackShareResults = (data: GameEventData) => {
  trackEvent('share_results', {
    game_id: data.game_id,
    score: data.score || 0,
    accuracy: data.accuracy || 0
  });
};

// 10. 页面停留时间（用于分析参与度）
export const trackPageEngagement = (pagePath: string, engagementTime: number) => {
  if (engagementTime > 5000) { // 只追踪停留超过5秒的页面
    trackEvent('page_engagement', {
      page_path: pagePath,
      engagement_time_ms: engagementTime
    });
  }
};

// ==================== 用户行为分析事件 ====================

// 11. 游戏设置调整
export const trackGameSettings = (data: GameEventData & { setting_changed?: string }) => {
  trackEvent('game_settings_change', {
    game_id: data.game_id,
    setting_changed: data.setting_changed || 'unknown',
    level: data.level || 1
  });
};

// 12. 游戏暂停/恢复
export const trackGamePause = (data: GameEventData & { action: 'pause' | 'resume' }) => {
  trackEvent('game_pause_resume', {
    game_id: data.game_id,
    action: data.action,
    level: data.level || 1
  });
};

// ==================== 批量导出 ====================

export const analytics = {
  // 核心转化漏斗
  assessment: {
    start: trackStartAssessment,
    complete: trackCompleteAssessment
  },
  game: {
    start: trackStartGame,
    complete: trackCompleteGame,
    settings: trackGameSettings,
    pause: trackGamePause
  },
  navigation: {
    toAssessment: trackNavigateToAssessment,
    toGame: trackNavigateToGame,
    nextGame: trackNextGameClick,
    recommendation: trackGameRecommendationClick
  },
  social: {
    share: trackShareResults
  },
  engagement: {
    pageTime: trackPageEngagement
  }
};

export default analytics;