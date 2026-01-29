/**
 * CDN翻译数据加载模块
 * 从CDN获取现有的翻译数据
 */

/**
 * 从CDN获取翻译数据
 * @param {string} url - CDN URL
 * @returns {Promise<Object>} 解析后的翻译数据
 */
export async function fetchTranslations(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/javascript, text/javascript, */*',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsContent = await response.text();
    return parseTranslationData(jsContent);
  } catch (error) {
    console.error(`Failed to fetch CDN data from ${url}:`, error);
    throw new Error(`Failed to fetch translations from CDN: ${error.message}`);
  }
}

/**
 * 解析JavaScript格式的翻译数据
 * @param {string} jsContent - JavaScript内容
 * @returns {Object} 解析后的翻译数据
 */
function parseTranslationData(jsContent) {
  try {
    // 方法1: 尝试使用 Function 构造器安全地执行 JS 并获取 translations 对象
    try {
      // 提取 translations 对象部分
      // 匹配 var translations = {...}; 或 window.translations = {...};
      const match = jsContent.match(/(?:var\s+|window\.)?translations\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
      
      if (match) {
        const objectString = match[1];
        // 使用 Function 构造器来安全解析 JS 对象
        const parseFunc = new Function(`return ${objectString}`);
        const translations = parseFunc();
        
        if (translations && typeof translations === 'object' && Object.keys(translations).length > 0) {
          return translations;
        }
      }
    } catch (evalError) {
      // 如果 Function 方式失败，使用备用正则方法
      console.log('Function 解析失败，使用正则备用方法');
    }

    // 方法2: 备用正则解析（更健壮）
    const translations = {};
    
    // 匹配所有 "key": "value" 或 'key': 'value' 模式
    // 支持值中包含转义引号的情况
    const keyValueRegex = /["']([^"']+)["']\s*:\s*["']((?:[^"'\\]|\\.)*)["']/g;
    
    let kvMatch;
    while ((kvMatch = keyValueRegex.exec(jsContent)) !== null) {
      const key = kvMatch[1];
      let value = kvMatch[2];
      
      // 处理转义字符
      value = value
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t');
      
      translations[key] = value;
    }

    if (Object.keys(translations).length === 0) {
      throw new Error('No valid translations found in CDN data');
    }

    return translations;
  } catch (error) {
    console.error('Failed to parse translation data:', error);
    throw new Error(`Failed to parse translation data: ${error.message}`);
  }
}

/**
 * 从多个CDN源加载所有翻译数据
 * @param {Array} sources - CDN源配置数组
 * @returns {Promise<Object>} 合并后的翻译数据 { en: {}, cn: {}, ja: {} }
 */
export async function loadAllTranslations(sources) {
  const result = {
    en: {},
    cn: {},
    ja: {},
    // 建立反向索引：value -> keys 的映射（一个 value 可能对应多个 key）
    valueToKeysMap: {
      en: new Map(),  // Map<value, string[]>
      cn: new Map(),  // Map<value, string[]>
    },
    // 保留旧的单一映射以兼容
    valueToKeyMap: {
      en: new Map(),
      cn: new Map(),
    },
  };

  for (const source of sources) {
    try {
      let enCount = 0, cnCount = 0, jaCount = 0;
      
      // 加载英文翻译
      if (source.en) {
        const enData = await fetchTranslations(source.en);
        enCount = Object.keys(enData).length;
        Object.assign(result.en, enData);
        // 建立英文反向索引（value -> keys[]）
        for (const [key, value] of Object.entries(enData)) {
          if (value && value.trim()) {
            const normalizedValue = value.trim().toLowerCase();
            // 单一映射（保留兼容）
            result.valueToKeyMap.en.set(normalizedValue, key);
            // 多 key 映射
            if (!result.valueToKeysMap.en.has(normalizedValue)) {
              result.valueToKeysMap.en.set(normalizedValue, []);
            }
            result.valueToKeysMap.en.get(normalizedValue).push(key);
          }
        }
      }

      // 加载中文翻译
      if (source.cn) {
        const cnData = await fetchTranslations(source.cn);
        cnCount = Object.keys(cnData).length;
        Object.assign(result.cn, cnData);
        // 建立中文反向索引（value -> keys[]）
        for (const [key, value] of Object.entries(cnData)) {
          if (value && value.trim()) {
            const normalizedValue = value.trim();
            // 单一映射（保留兼容）
            result.valueToKeyMap.cn.set(normalizedValue, key);
            // 多 key 映射
            if (!result.valueToKeysMap.cn.has(normalizedValue)) {
              result.valueToKeysMap.cn.set(normalizedValue, []);
            }
            result.valueToKeysMap.cn.get(normalizedValue).push(key);
          }
        }
      }

      // 加载日文翻译
      if (source.ja) {
        const jaData = await fetchTranslations(source.ja);
        jaCount = Object.keys(jaData).length;
        Object.assign(result.ja, jaData);
      }

      console.log(`✓ 已加载 ${source.name}: ${enCount} 个英文key, ${cnCount} 个中文key`);
    } catch (error) {
      console.error(`✗ 加载 ${source.name} 失败:`, error.message);
    }
  }

  console.log(`\n总计加载: ${Object.keys(result.en).length} 个英文key, ${Object.keys(result.cn).length} 个中文key`);
  
  return result;
}

/**
 * 根据文案内容查找对应的key
 * @param {string} text - 要查找的文案
 * @param {Object} translationData - 翻译数据
 * @returns {string|null} 找到的key或null
 */
export function findKeyByValue(text, translationData) {
  if (!text || !text.trim()) {
    return null;
  }

  const trimmedText = text.trim();
  
  // 先尝试精确匹配中文
  let key = translationData.valueToKeyMap.cn.get(trimmedText);
  if (key) {
    return key;
  }

  // 尝试精确匹配英文（忽略大小写）
  key = translationData.valueToKeyMap.en.get(trimmedText.toLowerCase());
  if (key) {
    return key;
  }

  // 遍历查找（支持部分匹配或标准化匹配）
  for (const [value, k] of translationData.valueToKeyMap.cn.entries()) {
    if (normalizeText(value) === normalizeText(trimmedText)) {
      return k;
    }
  }

  for (const [value, k] of translationData.valueToKeyMap.en.entries()) {
    if (normalizeText(value) === normalizeText(trimmedText.toLowerCase())) {
      return k;
    }
  }

  return null;
}

/**
 * 标准化文本（用于匹配）
 * @param {string} text - 原始文本
 * @returns {string} 标准化后的文本
 */
function normalizeText(text) {
  return text
    .replace(/\s+/g, ' ')      // 将多个空格替换为单个空格
    .replace(/[，,]/g, ',')    // 统一逗号
    .replace(/[。.]/g, '.')    // 统一句号
    .replace(/[！!]/g, '!')    // 统一感叹号
    .replace(/[？?]/g, '?')    // 统一问号
    .replace(/["""]/g, '"')    // 统一引号
    .replace(/[''']/g, "'")    // 统一单引号
    .trim();
}

export default {
  fetchTranslations,
  loadAllTranslations,
  findKeyByValue,
};

