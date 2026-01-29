/**
 * 文件扫描模块
 * 扫描项目文件中的中文/英文文案
 */

import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';

/**
 * 扫描目录下的所有符合条件的文件
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 扫描选项
 * @returns {Promise<Array<string>>} 文件路径数组
 */
export async function scanFiles(targetDir, options = {}) {
  const {
    extensions = ['.vue', '.js', '.ts', '.tsx', '.jsx'],
    excludeDirs = ['node_modules', 'dist', '.git', 'public'],
  } = options;

  // 检查目录是否存在
  try {
    await fs.access(targetDir);
  } catch (error) {
    console.error(`❌ 目录不存在: ${targetDir}`);
    return [];
  }

  // 使用递归方式扫描文件（兼容 Windows）
  const files = await scanFilesRecursive(targetDir, extensions, excludeDirs);
  return files;
}

/**
 * 递归扫描目录中的文件
 * @param {string} dir - 目录路径
 * @param {string[]} extensions - 文件扩展名
 * @param {string[]} excludeDirs - 排除的目录
 * @returns {Promise<string[]>} 文件路径数组
 */
async function scanFilesRecursive(dir, extensions, excludeDirs) {
  const files = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 跳过排除的目录
        if (excludeDirs.includes(entry.name)) {
          continue;
        }
        // 递归扫描子目录
        const subFiles = await scanFilesRecursive(fullPath, extensions, excludeDirs);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // 检查文件扩展名
        const ext = path.extname(entry.name).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`读取目录失败: ${dir}`, error.message);
  }
  
  return files;
}

/**
 * 从文件内容中提取所有文本字符串
 * @param {string} content - 文件内容
 * @param {string} filePath - 文件路径
 * @param {Object} options - 扫描选项
 * @param {boolean} options.scanI18nKeys - 是否扫描已有的 $t() 调用中的 key/文案
 * @returns {Array<Object>} 提取的文本信息数组
 */
export function extractTexts(content, filePath, options = {}) {
  const { scanI18nKeys = false } = options;
  const texts = [];
  const isVue = filePath.endsWith('.vue');
  
  const lines = content.split('\n');
  
  // 如果是扫描已有的 $t() 调用
  if (scanI18nKeys) {
    // 匹配 $t("text"), $t('text'), $t("text", [...]), t("text"), i18n.t("text") 等模式
    const i18nPatterns = [
      // $t("key") 或 $t('key')，可能带参数
      /\$t\(\s*["']([^"']+)["'](?:\s*,\s*[^)]+)?\)/g,
      // t("key") 或 t('key')，可能带参数（排除 $t 和方法名如 get, set 等）
      /(?<![.$a-zA-Z])t\(\s*["']([^"']+)["'](?:\s*,\s*[^)]+)?\)/g,
      // i18n.t("key") 或 i18n.t('key')
      /i18n\.t\(\s*["']([^"']+)["'](?:\s*,\s*[^)]+)?\)/g,
    ];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;

      // 跳过注释
      if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
        continue;
      }

      for (const pattern of i18nPatterns) {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        
        while ((match = regex.exec(line)) !== null) {
          const key = match[1];
          if (key && key.trim()) {
            texts.push({
              text: key.trim(),
              type: 'i18n-key',
              line: lineNumber,
              column: match.index,
              original: match[0],
              filePath,
              language: 'key',
            });
          }
        }
      }
    }
    return texts;
  }
  
  // 提取中文文本的正则表达式
  const patterns = [
    // Vue template 中的文本
    {
      pattern: />([^<>]*[\u4e00-\u9fa5]+[^<>]*)</g,
      type: 'template',
      extract: (match) => match[1].trim(),
    },
    // 字符串中的中文（单引号）
    {
      pattern: /'([^']*[\u4e00-\u9fa5]+[^']*)'/g,
      type: 'string',
      extract: (match) => match[1],
    },
    // 字符串中的中文（双引号）
    {
      pattern: /"([^"]*[\u4e00-\u9fa5]+[^"]*)"/g,
      type: 'string',
      extract: (match) => match[1],
    },
    // 字符串中的中文（模板字符串）
    {
      pattern: /`([^`]*[\u4e00-\u9fa5]+[^`]*)`/g,
      type: 'template-string',
      extract: (match) => match[1],
    },
    // placeholder, title, label 等属性中的中文
    {
      pattern: /(?:placeholder|title|label|message|content|text)\s*[=:]\s*["']([^"']*[\u4e00-\u9fa5]+[^"']*)["']/gi,
      type: 'attribute',
      extract: (match) => match[1],
    },
  ];

  // 提取英文文本（用于匹配已有翻译）
  const englishPatterns = [
    // 全英文字符串（至少包含一个空格，排除纯变量和路径）
    {
      pattern: /["']([A-Z][a-zA-Z\s,.:!?]+[a-zA-Z.!?])["']/g,
      type: 'english',
      extract: (match) => match[1],
      minLength: 3,
    },
  ];
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineNumber = lineIndex + 1;

    // 跳过已经使用 $t() 的行
    if (line.includes('$t(') || line.includes('i18n.t(')) {
      continue;
    }

    // 跳过注释
    if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
      continue;
    }

    // 提取中文文本
    for (const { pattern, type, extract } of patterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const text = extract(match);
        if (text && text.trim() && !isExcluded(text)) {
          texts.push({
            text: text.trim(),
            type,
            line: lineNumber,
            column: match.index,
            original: match[0],
            filePath,
            language: 'zh',
          });
        }
      }
    }

    // 提取英文文本
    for (const { pattern, type, extract, minLength = 0 } of englishPatterns) {
      const regex = new RegExp(pattern.source, pattern.flags);
      let match;
      
      while ((match = regex.exec(line)) !== null) {
        const text = extract(match);
        if (text && text.trim().length >= minLength && !isExcluded(text)) {
          texts.push({
            text: text.trim(),
            type,
            line: lineNumber,
            column: match.index,
            original: match[0],
            filePath,
            language: 'en',
          });
        }
      }
    }
  }

  return texts;
}

/**
 * 判断文本是否应该被排除
 * @param {string} text - 文本
 * @returns {boolean} 是否排除
 */
function isExcluded(text) {
  const excludePatterns = [
    /^[\s\n\r]+$/,              // 纯空白
    /^[0-9.%$,+-]+$/,           // 纯数字
    /^\s*$/,                     // 空字符串
    /^https?:\/\//,             // URL
    /^[a-zA-Z]+:\/\//,          // 协议链接
    /^\//,                       // 路径
    /^@/,                        // @符号开头
    /^#/,                        // 颜色值或ID
    /^[a-z_]+$/i,               // 纯字母变量名
    /console\./,                // console语句
    /import\s/,                 // import语句
    /require\(/,                // require语句
  ];

  return excludePatterns.some(pattern => pattern.test(text));
}

/**
 * 扫描项目并提取所有需要国际化的文本
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 扫描选项
 * @returns {Promise<Object>} 扫描结果
 */
export async function scanProject(targetDir, options = {}) {
  console.log(`\n📂 开始扫描目录: ${targetDir}\n`);
  
  const files = await scanFiles(targetDir, options);
  console.log(`找到 ${files.length} 个文件需要扫描\n`);

  const allTexts = [];
  const fileResults = {};

  for (const filePath of files) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const texts = extractTexts(content, filePath, { scanI18nKeys: options.scanI18nKeys });
      
      if (texts.length > 0) {
        fileResults[filePath] = texts;
        allTexts.push(...texts);
        
        const relativePath = path.relative(targetDir, filePath);
        console.log(`  📄 ${relativePath}: 发现 ${texts.length} 处文案`);
      }
    } catch (error) {
      console.error(`  ❌ 读取文件失败: ${filePath}`, error.message);
    }
  }

  // 去重
  const uniqueTexts = deduplicateTexts(allTexts);

  console.log(`\n✅ 扫描完成！`);
  console.log(`   总计发现 ${allTexts.length} 处文案`);
  console.log(`   去重后 ${uniqueTexts.length} 条唯一文案\n`);

  return {
    files: fileResults,
    allTexts,
    uniqueTexts,
    summary: {
      totalFiles: files.length,
      filesWithTexts: Object.keys(fileResults).length,
      totalTexts: allTexts.length,
      uniqueTexts: uniqueTexts.length,
    },
  };
}

/**
 * 文本去重
 * @param {Array} texts - 文本数组
 * @returns {Array} 去重后的文本数组
 */
function deduplicateTexts(texts) {
  const seen = new Map();
  
  for (const item of texts) {
    const key = item.text;
    if (!seen.has(key)) {
      seen.set(key, {
        text: item.text,
        language: item.language,
        occurrences: [],
      });
    }
    seen.get(key).occurrences.push({
      filePath: item.filePath,
      line: item.line,
      type: item.type,
      original: item.original,
    });
  }

  return Array.from(seen.values());
}

export default {
  scanFiles,
  extractTexts,
  scanProject,
};

