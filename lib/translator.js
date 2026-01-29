/**
 * 翻译模块
 * 使用 DeepSeek API 进行中英日三语翻译
 */

const DEFAULT_PROMPT = `1.角色定位：你是Pacvue的一名专业广告文案翻译师，擅长广告领域基础知识以及Pacvue广告系统，目标是帮助Pacvue生成专业的广告国际化文案。
2.任务描述：翻译英文文案，并生成对应的中文以及日文文案。
3.请以 CSV 格式输出，每列内容用 \`,\` 分隔，如果存在多行数据请进行换行处理,示例：
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
"原英文文案","翻译完成的中文文案","翻译完成的日文文案"(请不要携带示例文案)
***输出结果中请不要携带示例文案***
***请检查英文文案中的拼写错误，如果存在拼写错误，请在输出结果中修正***
***请严格遵循 CSV 格式，**用逗号 \`,\` 分隔，并确保内容用 \`""\` 包裹**，避免格式错乱，不要使用代码块 \`\`\` 进行包裹，仅输出 CSV 纯文本格式***
***如果文案中存在特殊字符请保留原有格式，例如",",".","?","\\n","\\t","{0}","{1}"等等***
***中文以及日文翻译中去除{n}占位符前后的空格***`;

const CN_TO_EN_PROMPT = `1.角色定位：你是Pacvue的一名专业广告文案翻译师，擅长广告领域基础知识以及Pacvue广告系统。
2.任务描述：将输入的中文文案翻译成英文、并保持中文原文以及翻译对应的日文文案。
3.请以 CSV 格式输出，每列内容用 \`,\` 分隔，如果存在多行数据请进行换行处理,示例：
"翻译完成的英文文案","原中文文案","翻译完成的日文文案"(请不要携带示例文案)
"翻译完成的英文文案","原中文文案","翻译完成的日文文案"(请不要携带示例文案)
***输出结果中请不要携带示例文案***
***请严格遵循 CSV 格式，**用逗号 \`,\` 分隔，并确保内容用 \`""\` 包裹**，避免格式错乱，不要使用代码块 \`\`\` 进行包裹，仅输出 CSV 纯文本格式***
***如果文案中存在特殊字符请保留原有格式，例如",",".","?","\\n","\\t","{0}","{1}"等等***
***英文和日文翻译中去除{n}占位符前后的空格***`;

/**
 * 调用 DeepSeek API 进行翻译
 * @param {string} content - 需要翻译的内容
 * @param {Object} config - 配置
 * @returns {Promise<string>} 翻译结果
 */
export async function callDeepSeekAPI(content, config) {
  const { apiKey, model = 'deepseek-chat', temperature = 0.1, prompt = DEFAULT_PROMPT } = config;

  if (!apiKey) {
    throw new Error('DeepSeek API key is required');
  }

  const messages = [
    { role: 'system', content: prompt },
    { role: 'user', content: content },
  ];

  const requestBody = {
    model,
    messages,
    temperature,
    response_format: { type: 'text' },
  };

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid response format from API');
  }

  return data.choices[0].message.content;
}

/**
 * 解析翻译结果文本为结构化数据
 * @param {string} data - API返回的CSV格式文本
 * @returns {Array<Object>} 解析后的翻译结果数组
 */
export function parseTranslationResult(data) {
  const lines = data
    .trim()
    .split('\n')
    .filter((line) => line.trim());

  return lines.map((line) => {
    // 使用正则表达式来正确解析 CSV 格式，处理包含逗号的字段
    const matches = line.match(/"([^"]*)","([^"]*)","([^"]*)"/);
    if (matches) {
      const [, en, cn, jp] = matches;
      return { en, cn, jp };
    } else {
      // 如果正则匹配失败，尝试简单的 split 方法
      const parts = line
        .split(',')
        .map((part) => part.replace(/"/g, '').trim());
      return {
        en: parts[0] || '',
        cn: parts[1] || '',
        jp: parts[2] || '',
      };
    }
  });
}

/**
 * 翻译未匹配的文案
 * @param {Array<Object>} unmatchedTexts - 未匹配的文案列表
 * @param {Object} config - 配置
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Array<Object>>} 翻译结果
 */
export async function translateTexts(unmatchedTexts, config, onProgress = null) {
  if (!unmatchedTexts || unmatchedTexts.length === 0) {
    return [];
  }

  // 分离中文和英文文案
  const chineseTexts = unmatchedTexts.filter(t => t.language === 'zh');
  const englishTexts = unmatchedTexts.filter(t => t.language === 'en');

  const results = [];

  // 翻译英文文案（英文 -> 中文、日文）
  if (englishTexts.length > 0) {
    if (onProgress) onProgress('translating_english', englishTexts.length);
    
    const enContent = englishTexts.map(t => t.text).join('\n');
    const enResult = await callDeepSeekAPI(enContent, {
      ...config,
      prompt: config.translationPrompt || DEFAULT_PROMPT,
    });
    
    const parsed = parseTranslationResult(enResult);
    for (let i = 0; i < parsed.length && i < englishTexts.length; i++) {
      results.push({
        original: englishTexts[i].text,
        language: 'en',
        ...parsed[i],
        occurrences: englishTexts[i].occurrences,
      });
    }
  }

  // 翻译中文文案（中文 -> 英文、日文）
  if (chineseTexts.length > 0) {
    if (onProgress) onProgress('translating_chinese', chineseTexts.length);
    
    const cnContent = chineseTexts.map(t => t.text).join('\n');
    const cnResult = await callDeepSeekAPI(cnContent, {
      ...config,
      prompt: CN_TO_EN_PROMPT,
    });
    
    const parsed = parseTranslationResult(cnResult);
    for (let i = 0; i < parsed.length && i < chineseTexts.length; i++) {
      results.push({
        original: chineseTexts[i].text,
        language: 'zh',
        ...parsed[i],
        occurrences: chineseTexts[i].occurrences,
      });
    }
  }

  return results;
}

/**
 * 批量翻译（分批处理，避免API限制）
 * @param {Array<Object>} unmatchedTexts - 未匹配的文案列表
 * @param {Object} config - 配置
 * @param {Object} options - 选项
 * @returns {Promise<Array<Object>>} 翻译结果
 */
export async function batchTranslate(unmatchedTexts, config, options = {}) {
  const { batchSize = 20, delayMs = 1000, onProgress = null } = options;
  
  const results = [];
  const total = unmatchedTexts.length;
  
  for (let i = 0; i < total; i += batchSize) {
    const batch = unmatchedTexts.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(total / batchSize);
    
    if (onProgress) {
      onProgress(`翻译进度: ${batchNumber}/${totalBatches} 批`, i, total);
    }
    
    try {
      const batchResults = await translateTexts(batch, config);
      results.push(...batchResults);
      
      // 批次之间添加延迟，避免API限制
      if (i + batchSize < total) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`批次 ${batchNumber} 翻译失败:`, error.message);
      // 记录失败的文案
      for (const item of batch) {
        results.push({
          original: item.text,
          language: item.language,
          en: item.language === 'en' ? item.text : '',
          cn: item.language === 'zh' ? item.text : '',
          jp: '',
          error: error.message,
          occurrences: item.occurrences,
        });
      }
    }
  }

  return results;
}

export default {
  callDeepSeekAPI,
  parseTranslationResult,
  translateTexts,
  batchTranslate,
};

