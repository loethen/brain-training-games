# 博客自动翻译功能

本项目实现了博客文章的自动翻译功能，使用Gemini 2.0 Flash模型将英文博客文章翻译成其他支持的语言，并保持各目标语言的语言习惯和文化表达。

## 支持的语言

当前支持以下语言：
- 英语 (en) - 源语言
- 中文 (zh)
- 德语 (de)
- 日语 (ja)
- 西班牙语 (es)
- 韩语 (ko)
- 法语 (fr)

## 使用方法

### 1. 安装依赖

确保已安装必要的依赖：

```bash
npm install --save @google/generative-ai dotenv ts-node
```

### 2. 配置环境变量

1. 复制 `.env.local.example` 文件为 `.env.local`
2. 获取 Gemini API 密钥并填入 `.env.local` 文件中

```
GEMINI_API_KEY=your_gemini_api_key_here
```

获取 Gemini API 密钥的方法：
1. 前往 [Google AI Studio](https://ai.google.dev/)
2. 注册或登录Google账户
3. 创建API密钥
4. 复制API密钥

### 3. 运行翻译脚本

```bash
# 只翻译新文章或已更新的文章（增量翻译）
npm run translate-blogs

# 强制重新翻译所有文章
npm run translate-blogs -- --force
```

此命令将：
1. 读取 `data/blog` 目录中的所有 Markdown 文件
2. 检查哪些文件是新的或已更新的（通过MD5哈希值比对）
3. 只翻译需要更新的文件，节省API请求和时间
4. 将翻译后的文件保存在 `data/blog-translations/{语言代码}/` 目录中
5. 更新翻译记录文件以便下次运行时进行比较

### 4. 翻译结果

翻译后的博客文章将自动按语言分类存储：
- 英文原文：`data/blog/`
- 中文翻译：`data/blog-translations/zh/`
- 德文翻译：`data/blog-translations/de/`
- 等等...

系统会自动根据用户当前浏览的语言显示相应语言版本的博客文章。

## 注意事项

1. **翻译质量**：使用Gemini 2.0 Flash生成式AI模型进行翻译，翻译质量比通用翻译API更高，但仍建议在发布前检查翻译质量。

2. **文化适应性**：翻译过程会考虑目标语言的文化背景和表达习惯，使翻译结果更自然地符合目标受众的阅读习惯。

3. **代码块保留**：翻译脚本会自动保留代码块不被翻译，但建议检查特别复杂的代码块是否正确保留。

4. **API使用限制**：Gemini API 有使用限额，请注意控制使用量。免费用户有每分钟请求数量限制。

5. **增量翻译**：脚本使用MD5哈希记录每个文件的翻译状态，只翻译新文件或已更新的文件，大幅减少API调用次数。

6. **错误处理**：脚本包含错误处理机制，当翻译某部分失败时会保留原文。

## 工作原理

1. 脚本将博客文章分为元数据（frontmatter）和内容两部分
2. 使用针对不同语言优化的提示词引导Gemini模型进行翻译
3. 针对标题、摘要等元数据使用专门的翻译提示
4. 保护代码块不被翻译
5. 将翻译后的内容重新组合成 Markdown 文件
6. 保存到对应语言的目录中
7. 维护翻译记录文件（`data/translation-record.json`）跟踪翻译状态

## 自定义与扩展

- 修改 `SUPPORTED_LOCALES` 数组可添加或移除支持的语言
- 修改 `LOCALE_NAMES` 对象可更新语言名称映射
- 修改翻译提示词可以调整翻译风格和质量
- 通过更改 Gemini 模型版本可以使用不同性能的模型
- 使用 `--force` 参数可强制重新翻译所有文件 