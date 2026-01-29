/**
 * 配置示例文件
 * 复制此文件为 config.js 并填入你的配置
 */
export default {
  // DeepSeek API 配置
  deepseek: {
    apiKey: 'your_deepseek_api_key_here',
    model: 'deepseek-chat',
    temperature: 0.1,
  },

  // Lokalise API 配置
  lokalise: {
    apiToken: 'your_lokalise_api_token_here',
    projectId: 'your_project_id_here',
    defaultTag: '', // 可选：默认上传标签
  },

  // CDN 配置 - 从这些地址加载现有翻译数据
  // 生产环境 + 预生产环境的翻译源
  cdn: {
    sources: [
      // 生产环境 - Common
      {
        name: 'Common (Production)',
        en: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/en.js',
        cn: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/zh_CN.js',
        ja: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/ja.js',
      },
      // 生产环境 - AmazonSearch
      {
        name: 'AmazonSearch (Production)',
        en: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/en.js',
        cn: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/zh_CN.js',
        ja: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/ja.js',
      },
      // 预生产环境 - Commerce
      {
        name: 'Commerce (Pre-Production)',
        en: 'https://pacvue-public-doc.s3.us-west-2.amazonaws.com/lokalise/Commerce/en.js',
        cn: 'https://pacvue-public-doc.s3.us-west-2.amazonaws.com/lokalise/Commerce/zh_CN.js',
        ja: 'https://pacvue-public-doc.s3.us-west-2.amazonaws.com/lokalise/Commerce/ja.js',
      },
    ],
  },

  // 扫描配置
  scan: {
    // 默认扫描的文件类型
    extensions: ['.vue', '.js', '.ts', '.tsx', '.jsx'],
    // 排除的目录
    excludeDirs: ['node_modules', 'dist', '.git', 'public'],
    // 需要匹配的国际化函数模式
    i18nPatterns: [
      /\$t\(['"`]([^'"`]+)['"`]\)/g,      // $t('key')
      /t\(['"`]([^'"`]+)['"`]\)/g,         // t('key')
      /i18n\.t\(['"`]([^'"`]+)['"`]\)/g,   // i18n.t('key')
    ],
  },

  // 翻译提示词
  translationPrompt: `1.角色定位：你是Pacvue的一名专业广告文案翻译师，擅长广告领域基础知识以及Pacvue广告系统，目标是帮助Pacvue生成专业的广告国际化文案。
2.任务描述：翻译英文文案，并生成对应的中文以及日文文案。
3.请以 CSV 格式输出，每列内容用 \`,\` 分隔，如果存在多行数据请进行换行处理,示例：
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
***输出结果中请不要携带示例文案***
***请检查英文文案中的拼写错误，如果存在拼写错误，请在输出结果中修正***
***请严格遵循 CSV 格式，**用逗号 \`,\` 分隔，并确保内容用 \`""\` 包裹**，避免格式错乱，不要使用代码块 \`\`\` 进行包裹，仅输出 CSV 纯文本格式***
***如果文案中存在特殊字符请保留原有格式，例如",",".","?","\\n","\\t","{0}","{1}"等等***
***中文以及日文翻译中去除{n}占位符前后的空格***`,
};

