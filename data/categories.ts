export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  {
    id: "focus",
    name: "Focus",
    slug: "focus",
    description: "Games that train your ability to concentrate and maintain attention on specific tasks.",
    icon: "Focus"
  },
  {
    id: "memory",
    name: "Memory",
    slug: "memory",
    description: "Exercises to improve your short-term and working memory capacity.",
    icon: "Brain"
  },
  {
    id: "working-memory",
    name: "Working Memory",
    description: "Games that train your ability to hold and manipulate information in your mind temporarily.",
    slug: "working-memory",
    icon: "Brain"
  },
  {
    id: "visual-tracking",
    name: "Visual Tracking",
    description: "Games that improve your ability to follow moving objects and maintain visual focus.",
    slug: "visual-tracking",
    icon: "Eye"
  },
  {
    id: "sustained-attention",
    name: "Sustained Attention",
    description: "Games that develop your ability to maintain focus on a task for extended periods of time.",
    slug: "sustained-attention",
    icon: "Focus"
  },
  {
    id: "selective-attention",
    name: "Selective Attention",
    description: "Games that enhance your ability to focus on relevant stimuli while ignoring distractions.",
    slug: "selective-attention",
    icon: "Target"
  },
  {
    id: "divided-attention",
    name: "Divided Attention",
    description: "Games that improve your ability to split attention between multiple tasks or stimuli simultaneously.",
    slug: "divided-attention",
    icon: "Split"
  },
  {
    id: "reaction-time",
    name: "Reaction Time",
    description: "Games that sharpen your speed of response to visual or auditory stimuli.",
    slug: "reaction-time",
    icon: "Zap"
  },
  {
    id: "cognitive-flexibility",
    name: "Cognitive Flexibility",
    description: "Games that develop your ability to switch between different concepts or adapt to changing rules.",
    slug: "cognitive-flexibility",
    icon: "Shuffle"
  }
];

// 辅助函数
export function getCategory(id: string): Category | undefined {
  return categories.find(category => category.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(category => category.slug === slug);
} 