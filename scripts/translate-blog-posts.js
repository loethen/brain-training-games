/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const crypto = require('crypto');
const inquirer = require('inquirer');

// 配置环境变量
dotenv.config({ path: '.env.local' });

// 初始化Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// 请求控制参数
const RATE_LIMIT = {
  requestsPerMinute: 10,  // 每分钟最大请求数
  retryAttempts: 3,      // 重试次数
  retryDelay: 5000,      // 重试延迟(ms)
  cooldownPeriod: 60000  // 冷却时间(ms)
};

// 请求队列管理
let requestCount = 0;
let lastRequestTime = Date.now();

// 延时函数
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 重置请求计数器
async function resetRequestCount() {
  const now = Date.now();
  if (now - lastRequestTime >= RATE_LIMIT.cooldownPeriod) {
    requestCount = 0;
    lastRequestTime = now;
  }
}

// 处理API请求的包装函数
async function makeAPIRequest(prompt, retryCount = 0) {
  try {
    await resetRequestCount();
    
    // 检查是否达到速率限制
    if (requestCount >= RATE_LIMIT.requestsPerMinute) {
      console.log('Rate limit reached, cooling down...');
      await delay(RATE_LIMIT.cooldownPeriod);
      requestCount = 0;
    }
    
    // 获取Gemini模型
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 发起请求
    const result = await model.generateContent(prompt);
    requestCount++;
    lastRequestTime = Date.now();
    
    return result.response.text().trim();
  } catch (error) {
    // 处理429错误
    if (error.status === 429 && retryCount < RATE_LIMIT.retryAttempts) {
      console.log(`Rate limit exceeded, retrying in ${RATE_LIMIT.retryDelay/1000}s... (Attempt ${retryCount + 1}/${RATE_LIMIT.retryAttempts})`);
      await delay(RATE_LIMIT.retryDelay);
      return makeAPIRequest(prompt, retryCount + 1);
    }
    
    throw error;
  }
}

// 支持的语言列表
const SUPPORTED_LOCALES = ['zh'];

// 博客文章目录
const BLOG_DIR = path.join(process.cwd(), 'data', 'blog');
// 翻译后的文章目录
const TRANSLATIONS_DIR = path.join(process.cwd(), 'data', 'blog-translations');
// 翻译记录文件路径
const TRANSLATION_RECORD_FILE = path.join(process.cwd(), 'data', 'translation-record.json');

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
const LOCALE_NAMES = {
  'zh': '中文'
};

// 加载翻译记录
function loadTranslationRecord() {
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
function saveTranslationRecord(record) {
  try {
    fs.writeFileSync(TRANSLATION_RECORD_FILE, JSON.stringify(record, null, 2));
  } catch (error) {
    console.error('Failed to save translation record:', error);
  }
}

// 计算文件内容哈希值
function computeFileHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// 检查文件是否需要翻译
function needsTranslation(filePath, fileName, fileHash, targetLocale, translationRecord, forceTranslate) {
  // 如果强制翻译，始终返回true
  if (forceTranslate) {
    return true;
  }

  // 检查翻译记录
  if (translationRecord && 
      translationRecord[fileName] && 
      translationRecord[fileName][targetLocale] && 
      translationRecord[fileName][targetLocale].hash === fileHash) {
    return false;
  }

  return true;
}

// 翻译frontmatter数据
async function translateFrontmatter(
  frontmatter,
  targetLocale
) {
  const translatedFrontmatter = { ...frontmatter };
  const fieldsToTranslate = ['title', 'description', 'excerpt'];
  
  for (const field of fieldsToTranslate) {
    if (frontmatter[field] && typeof frontmatter[field] === 'string') {
      const content = frontmatter[field];
      const prompt = `
You are a skilled translator specializing in localizing blog content for a tech-savvy audience interested in cognitive science, brain training, and memory improvement games. Your goal is to make the text sound like it was originally written in the target language.

Task: Translate the following ${field === 'title' ? 'blog title' : field === 'description' ? 'blog description' : 'blog excerpt'} from English to ${targetLocale === 'zh' ? 'Simplified Chinese (for Mainland China)' : LOCALE_NAMES[targetLocale]}.

Crucial Instructions:
1.  **Output ONLY the translated text.** Do NOT include prefixes like "Translation:", explanations, or alternative options.
2.  **Prioritize naturalness and fluency.** Convey the original meaning and intent using idiomatic expressions in ${LOCALE_NAMES[targetLocale]}. Avoid literal, word-for-word translation.
3.  **Adapt the tone** to be engaging, informative, and accessible for a general audience interested in the blog's topics. It must sound completely natural to a native speaker.
4.  **Restructure sentences** freely if the English structure sounds awkward or unnatural in ${LOCALE_NAMES[targetLocale]}.
5.  **Use appropriate terminology** for cognitive science and brain training topics in ${LOCALE_NAMES[targetLocale]}.
6.  **For Simplified Chinese (zh) ONLY:**
    *   Use standard Mainland P.R.C. Simplified Chinese characters and vocabulary.
    *   Employ modern, common expressions natural to Mainland Chinese readers.
    *   Strictly avoid Traditional Chinese characters, Taiwan/Hong Kong specific terms, or overly regional phrasing.

Original English text:
${content}

${LOCALE_NAMES[targetLocale]} Translation:
`;
      
      try {
        const translation = await makeAPIRequest(prompt);
        translatedFrontmatter[field] = translation;
        // 每个字段翻译后添加短暂延迟
        await delay(1000);
      } catch (error) {
        console.error(`Error translating ${field} to ${targetLocale}:`, error);
        translatedFrontmatter[field] = content;
      }
    }
  }

  return translatedFrontmatter;
}

// 翻译内容时保留代码块
async function translateContentPreservingCodeBlocks(
  content,
  targetLocale
) {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const codeBlocks = [];
  
  const contentWithPlaceholders = content.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `CODE_BLOCK_${codeBlocks.length - 1}`;
  });

  const prompt = `
You are a skilled translator specializing in localizing blog content for a tech-savvy audience interested in cognitive science, brain training, and memory improvement games. Your goal is to make the entire article sound like it was originally written in the target language.

Task: Translate the following blog article content from English to ${targetLocale === 'zh' ? 'Simplified Chinese (for Mainland China)' : LOCALE_NAMES[targetLocale]}.

Crucial Instructions:
1.  **Output ONLY the translated text.** Do NOT include any commentary, explanations, or notes before or after the translation.
2.  **Preserve placeholders exactly:** The text contains placeholders like 'CODE_BLOCK_0'. DO NOT translate these; keep them precisely as they are.
3.  **Prioritize naturalness and fluency:** Focus on conveying the original meaning and intent using idiomatic, fluent language in ${LOCALE_NAMES[targetLocale]}. Avoid stiff, literal translation.
4.  **Adapt the tone:** Make it engaging, informative, and accessible for a general audience interested in cognitive improvement. It must sound completely natural to a native speaker.
5.  **Restructure freely:** Rephrase sentences and restructure paragraphs where needed to improve flow and readability in ${LOCALE_NAMES[targetLocale]}. Don't rigidly follow English sentence structure.
6.  **Preserve formatting:** Maintain original markdown formatting (paragraphs, headers, lists, bold/italics, links).
7.  **Use consistent terminology:** Apply appropriate terms for cognitive science, brain training, and memory games consistently in ${LOCALE_NAMES[targetLocale]}.
8.  **For Simplified Chinese (zh) ONLY:**
    *   Use standard Mainland P.R.C. Simplified Chinese characters and vocabulary.
    *   Employ modern, common expressions natural to Mainland Chinese readers.
    *   Strictly avoid Traditional Chinese characters, Taiwan/Hong Kong specific terms, or overly regional phrasing.

Original English text with placeholders:
${contentWithPlaceholders}

${LOCALE_NAMES[targetLocale]} Translation:
`;

  try {
    const translatedContent = await makeAPIRequest(prompt);
    
    // 恢复代码块
    let finalContent = translatedContent;
    for (let i = 0; i < codeBlocks.length; i++) {
      finalContent = finalContent.replace(`CODE_BLOCK_${i}`, codeBlocks[i]);
    }
    
    return finalContent;
  } catch (error) {
    console.error(`Error translating content to ${targetLocale}:`, error);
    return content;
  }
}

// 翻译和保存文件
async function translateAndSaveFile(filePath, targetLocale, fileHash, translationRecord, forceTranslate = false) {
  try {
    const fileName = path.basename(filePath);
    
    // 检查是否需要翻译
    if (!needsTranslation(filePath, fileName, fileHash, targetLocale, translationRecord, forceTranslate)) {
      console.log(`跳过 ${fileName} 到 ${LOCALE_NAMES[targetLocale]} (已是最新)`);
      return;
    }
    
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
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
    
    // 更新翻译记录
    if (!translationRecord) {
      translationRecord = loadTranslationRecord();
    }
    
    if (!translationRecord[fileName]) {
      translationRecord[fileName] = {};
    }
    
    translationRecord[fileName][targetLocale] = {
      hash: fileHash,
      timestamp: new Date().toISOString()
    };
    
    // 保存翻译记录
    saveTranslationRecord(translationRecord);
    
    console.log(`✅ ${fileName} 已翻译到 ${LOCALE_NAMES[targetLocale]}`);
  } catch (error) {
    console.error(`翻译 ${fileName} 到 ${targetLocale} 时出错:`, error);
    throw error;
  }
}

// 交互式选择文章和语言
async function selectBlogAndLanguage() {
  try {
    const blogDir = path.join(process.cwd(), 'data/blog');
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

    // 准备文章选项
    const blogChoices = await Promise.all(files.map(async file => {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(content);
      return {
        name: `${data.title || file} (${file})`,
        value: file
      };
    }));

    // 添加"翻译所有文章"选项
    blogChoices.unshift({
      name: '📚 翻译所有文章',
      value: 'ALL'
    });

    // 选择文章
    const { selectedBlog } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedBlog',
        message: '请选择要翻译的文章:',
        choices: blogChoices,
        pageSize: 20
      }
    ]);

    // 准备语言选项
    const languageChoices = SUPPORTED_LOCALES.map(locale => ({
      name: LOCALE_NAMES[locale],
      value: locale
    }));

    // 添加"翻译所有语言"选项
    languageChoices.unshift({
      name: '🌐 翻译所有语言',
      value: 'ALL'
    });

    // 选择语言
    const { selectedLanguage } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedLanguage',
        message: '请选择目标语言:',
        choices: languageChoices
      }
    ]);

    // 询问是否强制重新翻译
    const { forceTranslate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'forceTranslate',
        message: '是否强制重新翻译（忽略已有翻译）？',
        default: false
      }
    ]);

    // 确认选择
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: `确认开始翻译${selectedBlog === 'ALL' ? '所有文章' : `"${selectedBlog}"`}到${selectedLanguage === 'ALL' ? '所有语言' : LOCALE_NAMES[selectedLanguage]}${forceTranslate ? '（强制重新翻译）' : ''}？`,
        default: true
      }
    ]);

    if (!confirmed) {
      console.log('已取消翻译操作');
      process.exit(0);
    }

    return {
      targetFiles: selectedBlog === 'ALL' ? files : [selectedBlog],
      targetLocales: selectedLanguage === 'ALL' ? SUPPORTED_LOCALES : [selectedLanguage],
      forceTranslate
    };
  } catch (error) {
    console.error('选择过程出错:', error);
    process.exit(1);
  }
}

// 主函数
async function translateBlogPosts() {
  try {
    // 交互式选择文章和语言
    const { targetFiles, targetLocales, forceTranslate } = await selectBlogAndLanguage();
    
    console.log(`\n开始翻译 ${targetFiles.length} 篇文章到 ${targetLocales.length} 种语言${forceTranslate ? '（强制重新翻译）' : ''}...\n`);
    
    // 为每个文件执行翻译
    for (const file of targetFiles) {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const fileHash = computeFileHash(fileContent);
      
      for (const locale of targetLocales) {
        console.log(`\n📝 正在翻译 ${file} 到 ${LOCALE_NAMES[locale]}...`);
        await translateAndSaveFile(filePath, locale, fileHash, null, forceTranslate);
      }
    }
    
    console.log('\n✨ 翻译完成！');
  } catch (error) {
    console.error('翻译过程出错:', error);
    process.exit(1);
  }
}

// 开始执行翻译
translateBlogPosts(); 