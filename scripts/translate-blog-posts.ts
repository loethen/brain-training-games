import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import crypto from 'crypto';

// 配置环境变量
dotenv.config({ path: '.env.local' });

// 初始化Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 支持的语言列表
const SUPPORTED_LOCALES = ['zh', 'de', 'ja', 'es', 'ko', 'fr'];
// 源语言（英语）
const SOURCE_LOCALE = 'en';

// 博客文章目录
const BLOG_DIR = path.join(process.cwd(), 'data', 'blog');
// 翻译后的文章目录
const TRANSLATIONS_DIR = path.join(process.cwd(), 'data', 'blog-translations');
// 翻译记录文件路径
const TRANSLATION_RECORD_FILE = path.join(process.cwd(), 'data', 'translation-record.json');

// 处理命令行参数
const args = process.argv.slice(2);
const FORCE_TRANSLATE = args.includes('--force');

// 创建翻译目录（如果不存在）
if (!fs.existsSync(TRANSLATIONS_DIR)) {
  fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
}

// 创建语言子目录
SUPPORTED_LOCALES.forEach(locale => {
  const localeDir = path.join(TRANSLATIONS_DIR, locale);
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }
});

// 语言代码到全名的映射，用于提示
const LOCALE_NAMES: Record<string, string> = {
  'zh': '中文',
  'de': '德语',
  'ja': '日语',
  'es': '西班牙语',
  'ko': '韩语',
  'fr': '法语'
};

// 加载翻译记录
function loadTranslationRecord(): Record<string, Record<string, { hash: string, timestamp: number }>> {
  try {
    if (fs.existsSync(TRANSLATION_RECORD_FILE)) {
      const recordContent = fs.readFileSync(TRANSLATION_RECORD_FILE, 'utf8');
      return JSON.parse(recordContent);
    }
  } catch (error) {
    console.warn('Failed to load translation record, will create a new one:', error);
  }
  return {};
}

// 保存翻译记录
function saveTranslationRecord(record: Record<string, Record<string, { hash: string, timestamp: number }>>) {
  try {
    fs.writeFileSync(TRANSLATION_RECORD_FILE, JSON.stringify(record, null, 2));
  } catch (error) {
    console.error('Failed to save translation record:', error);
  }
}

// 计算文件内容哈希值
function computeFileHash(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

// 检查文件是否需要翻译
function needsTranslation(
  filePath: string, 
  fileName: string,
  fileHash: string,
  targetLocale: string,
  translationRecord: Record<string, Record<string, { hash: string, timestamp: number }>>
): boolean {
  // 如果强制翻译，则始终返回true
  if (FORCE_TRANSLATE) {
    return true;
  }
  
  // 检查目标翻译文件是否存在
  const targetFilePath = path.join(TRANSLATIONS_DIR, targetLocale, fileName);
  if (!fs.existsSync(targetFilePath)) {
    return true;
  }
  
  // 检查翻译记录
  if (!translationRecord[fileName] || !translationRecord[fileName][targetLocale]) {
    return true;
  }
  
  // 比较哈希值
  return translationRecord[fileName][targetLocale].hash !== fileHash;
}

// 翻译frontmatter数据
async function translateFrontmatter(
  frontmatter: Record<string, unknown>,
  targetLocale: string
): Promise<Record<string, unknown>> {
  // 复制frontmatter
  const translatedFrontmatter = { ...frontmatter };

  // 需要翻译的字段
  const fieldsToTranslate = ['title', 'description', 'excerpt'];
  
  // 获取Gemini模型
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 翻译每个字段
  for (const field of fieldsToTranslate) {
    if (frontmatter[field] && typeof frontmatter[field] === 'string') {
      const content = frontmatter[field] as string;
      
      // 构建翻译提示
      const prompt = `
你是一位专业的翻译，精通多种语言和文化习惯。请将以下英文(${SOURCE_LOCALE})内容翻译成${LOCALE_NAMES[targetLocale]}，
保持原意的同时，使翻译结果符合${LOCALE_NAMES[targetLocale]}的表达习惯和文化背景。
这是博客文章的${field === 'title' ? '标题' : field === 'description' ? '描述' : '摘要'}。

原文: ${content}

翻译:
`;
      
      try {
        const result = await model.generateContent(prompt);
        const translation = result.response.text().trim();
        translatedFrontmatter[field] = translation;
      } catch (error) {
        console.error(`Error translating ${field} to ${targetLocale}:`, error);
        // 保留原文
        translatedFrontmatter[field] = content;
      }
    }
  }

  return translatedFrontmatter;
}

// 翻译内容时保留代码块
async function translateContentPreservingCodeBlocks(
  content: string,
  targetLocale: string
): Promise<string> {
  // 正则表达式匹配代码块
  const codeBlockRegex = /```[\s\S]*?```/g;
  
  // 保存找到的代码块
  const codeBlocks: string[] = [];
  
  // 将代码块替换为占位符
  const contentWithPlaceholders = content.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `CODE_BLOCK_${codeBlocks.length - 1}`;
  });

  // 获取Gemini模型
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  // 构建翻译提示
  const prompt = `
你是一位专业的翻译，精通多种语言和文化习惯。请将以下英文(${SOURCE_LOCALE})内容翻译成${LOCALE_NAMES[targetLocale]}，
保持原意的同时，使翻译结果符合${LOCALE_NAMES[targetLocale]}的表达习惯和文化背景。
这是一篇博客文章的正文内容。文本中包含CODE_BLOCK_N格式的标记，这些是代码块占位符，请保持原样不要翻译。

原文:
${contentWithPlaceholders}

翻译:
`;

  try {
    // 翻译没有代码块的内容
    const result = await model.generateContent(prompt);
    let translatedContent = result.response.text().trim();
    
    // 恢复代码块
    for (let i = 0; i < codeBlocks.length; i++) {
      translatedContent = translatedContent.replace(`CODE_BLOCK_${i}`, codeBlocks[i]);
    }
    
    return translatedContent;
  } catch (error) {
    console.error(`Error translating content to ${targetLocale}:`, error);
    // 出错时返回原文
    return content;
  }
}

// 翻译和保存文件
async function translateAndSaveFile(
  filePath: string,
  targetLocale: string,
  fileHash: string,
  translationRecord: Record<string, Record<string, { hash: string, timestamp: number }>>
): Promise<void> {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // 检查是否需要翻译
    if (!needsTranslation(filePath, fileName, fileHash, targetLocale, translationRecord)) {
      console.log(`Skipping ${fileName} to ${targetLocale} (already up to date)`);
      return;
    }
    
    // 解析frontmatter和markdown内容
    const { data: frontmatter, content } = matter(fileContent);
    
    // 翻译frontmatter
    const translatedFrontmatter = await translateFrontmatter(frontmatter, targetLocale);
    
    // 翻译内容
    const translatedContent = await translateContentPreservingCodeBlocks(content, targetLocale);
    
    // 生成新的markdown文件内容
    const translatedFileContent = matter.stringify(translatedContent, translatedFrontmatter);
    
    // 保存到目标目录
    const targetFilePath = path.join(TRANSLATIONS_DIR, targetLocale, fileName);
    
    fs.writeFileSync(targetFilePath, translatedFileContent);
    console.log(`Translated ${fileName} to ${targetLocale}`);
    
    // 更新翻译记录
    if (!translationRecord[fileName]) {
      translationRecord[fileName] = {};
    }
    
    translationRecord[fileName][targetLocale] = {
      hash: fileHash,
      timestamp: Date.now()
    };
    
  } catch (error) {
    console.error(`Error translating ${filePath} to ${targetLocale}:`, error);
  }
}

// 主函数
async function translateBlogPosts(): Promise<void> {
  try {
    // 加载翻译记录
    const translationRecord = loadTranslationRecord();
    
    // 获取所有博客文章
    const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.md'));
    
    console.log(`Found ${files.length} blog posts to process${FORCE_TRANSLATE ? ' (force mode)' : ''}`);
    
    // 为每个文件执行翻译
    for (const file of files) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileHash = computeFileHash(fileContent);
      
      // 翻译成所有支持的语言
      for (const locale of SUPPORTED_LOCALES) {
        await translateAndSaveFile(filePath, locale, fileHash, translationRecord);
      }
    }
    
    // 保存翻译记录
    saveTranslationRecord(translationRecord);
    
    console.log('Blog translation completed successfully!');
  } catch (error) {
    console.error('Error translating blog posts:', error);
  }
}

// 开始执行翻译
translateBlogPosts(); 