/**
 * 文案替换模块
 * 将匹配到的文案替换为 $t('key') 格式
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * 替换文件中的文案为国际化key
 * @param {string} filePath - 文件路径
 * @param {Array<Object>} replacements - 替换列表 [{ text, key, line, original }]
 * @returns {Promise<Object>} 替换结果
 */
export async function replaceInFile(filePath, replacements) {
  if (!replacements || replacements.length === 0) {
    return { success: true, changes: 0 };
  }

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let changeCount = 0;

    // 按行号倒序排列，从后往前替换，避免位置偏移
    const sortedReplacements = [...replacements].sort((a, b) => b.line - a.line);

    for (const { text, key, original, type } of sortedReplacements) {
      const oldContent = content;
      
      // 根据不同类型生成替换内容
      let replacement;
      
      if (type === 'template') {
        // Vue template 中的文本：> text < -> > {{ $t('key') }} <
        replacement = `{{ $t('${key}') }}`;
        content = content.replace(
          new RegExp(`>\\s*${escapeRegExp(text)}\\s*<`, 'g'),
          `>${replacement}<`
        );
      } else if (type === 'attribute') {
        // 属性值：placeholder="text" -> :placeholder="$t('key')"
        const attrPatterns = [
          { pattern: /placeholder\s*=\s*["']/, prefix: ':placeholder="$t(\'', suffix: '\')"' },
          { pattern: /title\s*=\s*["']/, prefix: ':title="$t(\'', suffix: '\')"' },
          { pattern: /label\s*=\s*["']/, prefix: ':label="$t(\'', suffix: '\')"' },
          { pattern: /message\s*=\s*["']/, prefix: ':message="$t(\'', suffix: '\')"' },
          { pattern: /content\s*=\s*["']/, prefix: ':content="$t(\'', suffix: '\')"' },
          { pattern: /text\s*=\s*["']/, prefix: ':text="$t(\'', suffix: '\')"' },
        ];
        
        for (const { pattern, prefix, suffix } of attrPatterns) {
          const fullPattern = new RegExp(
            `(${pattern.source})${escapeRegExp(text)}["']`,
            'g'
          );
          content = content.replace(fullPattern, `${prefix}${key}${suffix}`);
        }
      } else {
        // 普通字符串：'text' -> $t('key') 或 "text" -> $t('key')
        replacement = `$t('${key}')`;
        
        // 替换单引号字符串
        content = content.replace(
          new RegExp(`'${escapeRegExp(text)}'`, 'g'),
          replacement
        );
        
        // 替换双引号字符串
        content = content.replace(
          new RegExp(`"${escapeRegExp(text)}"`, 'g'),
          replacement
        );
        
        // 替换模板字符串中的内容
        content = content.replace(
          new RegExp(`\`${escapeRegExp(text)}\``, 'g'),
          replacement
        );
      }

      if (content !== oldContent) {
        changeCount++;
      }
    }

    if (changeCount > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
    }

    return {
      success: true,
      changes: changeCount,
      filePath,
    };
  } catch (error) {
    console.error(`替换文件失败: ${filePath}`, error);
    return {
      success: false,
      error: error.message,
      filePath,
    };
  }
}

/**
 * 转义正则表达式特殊字符
 * @param {string} string - 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 将 $t('text') 替换为 $t('key')
 * @param {string} filePath - 文件路径
 * @param {Array<Object>} replacements - 替换列表 [{ text, key, occurrences }]
 * @returns {Promise<Object>} 替换结果
 */
export async function replaceTextWithKey(filePath, replacements) {
  if (!replacements || replacements.length === 0) {
    return { success: true, changes: 0 };
  }

  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let changeCount = 0;

    for (const { text, key } of replacements) {
      if (text === key) continue; // 无需替换
      
      const oldContent = content;
      
      // 替换 $t('text') 为 $t('key')
      // 匹配 $t('text') 或 $t("text") 或 $t('text', ...)
      const patterns = [
        // $t('text') 或 $t('text', ...)
        new RegExp(`\\$t\\(\\s*'${escapeRegExp(text)}'(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
        // $t("text") 或 $t("text", ...)
        new RegExp(`\\$t\\(\\s*"${escapeRegExp(text)}"(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
        // i18n.t('text') 或 i18n.t('text', ...)
        new RegExp(`i18n\\.t\\(\\s*'${escapeRegExp(text)}'(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
        new RegExp(`i18n\\.t\\(\\s*"${escapeRegExp(text)}"(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
        // t('text') 独立函数
        new RegExp(`(?<![\\$a-zA-Z])t\\(\\s*'${escapeRegExp(text)}'(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
        new RegExp(`(?<![\\$a-zA-Z])t\\(\\s*"${escapeRegExp(text)}"(\\s*,\\s*[^)]+)?\\s*\\)`, 'g'),
      ];
      
      for (const pattern of patterns) {
        content = content.replace(pattern, (match, params) => {
          const quote = match.includes("'") ? "'" : '"';
          return `$t(${quote}${key}${quote}${params || ''})`;
        });
      }

      if (content !== oldContent) {
        changeCount++;
      }
    }

    if (changeCount > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
    }

    return {
      success: true,
      changes: changeCount,
      filePath,
    };
  } catch (error) {
    console.error(`替换文件失败: ${filePath}`, error);
    return {
      success: false,
      error: error.message,
      filePath,
    };
  }
}

/**
 * 批量将 $t('text') 替换为 $t('key')
 * @param {Array} needReplaceItems - 需要替换的项目列表
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 替换结果汇总
 */
export async function batchReplaceTextWithKey(needReplaceItems, options = {}) {
  const { dryRun = false } = options;
  
  const results = {
    success: [],
    failed: [],
    totalChanges: 0,
  };

  // 按文件分组
  const fileReplacements = {};
  for (const item of needReplaceItems) {
    for (const occurrence of item.occurrences) {
      if (!fileReplacements[occurrence.filePath]) {
        fileReplacements[occurrence.filePath] = [];
      }
      fileReplacements[occurrence.filePath].push({
        text: item.text,
        key: item.key,
      });
    }
  }

  for (const [filePath, replacements] of Object.entries(fileReplacements)) {
    if (dryRun) {
      results.success.push({
        filePath,
        changes: replacements.length,
        dryRun: true,
      });
      results.totalChanges += replacements.length;
    } else {
      const result = await replaceTextWithKey(filePath, replacements);
      
      if (result.success) {
        results.success.push(result);
        results.totalChanges += result.changes;
      } else {
        results.failed.push(result);
      }
    }
  }

  return results;
}

/**
 * 批量替换多个文件
 * @param {Object} fileReplacements - 文件替换映射 { filePath: [replacements] }
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 替换结果汇总
 */
export async function batchReplace(fileReplacements, options = {}) {
  const { dryRun = false, backupDir = null } = options;
  
  const results = {
    success: [],
    failed: [],
    totalChanges: 0,
  };

  for (const [filePath, replacements] of Object.entries(fileReplacements)) {
    // 创建备份
    if (backupDir && !dryRun) {
      try {
        const relativePath = path.basename(filePath);
        const backupPath = path.join(backupDir, `${relativePath}.backup`);
        await fs.copyFile(filePath, backupPath);
      } catch (error) {
        console.error(`创建备份失败: ${filePath}`, error.message);
      }
    }

    if (dryRun) {
      // 干运行模式，只记录将要进行的更改
      results.success.push({
        filePath,
        changes: replacements.length,
        dryRun: true,
      });
      results.totalChanges += replacements.length;
    } else {
      const result = await replaceInFile(filePath, replacements);
      
      if (result.success) {
        results.success.push(result);
        results.totalChanges += result.changes;
      } else {
        results.failed.push(result);
      }
    }
  }

  return results;
}

/**
 * 分析并准备替换计划（用于原始文案 → $t() 替换）
 * @param {Array} uniqueTexts - 唯一文本列表
 * @param {Object} translationData - 翻译数据
 * @param {Function} findKeyFn - 查找key的函数
 * @returns {Object} 替换计划 { matched, unmatched, fileReplacements }
 */
export function prepareReplacementPlan(uniqueTexts, translationData, findKeyFn) {
  const matched = [];
  const unmatched = [];
  const fileReplacements = {};

  for (const item of uniqueTexts) {
    const key = findKeyFn(item.text, translationData);
    
    if (key) {
      matched.push({
        text: item.text,
        key,
        occurrences: item.occurrences,
        language: item.language,
      });

      // 按文件分组替换
      for (const occurrence of item.occurrences) {
        if (!fileReplacements[occurrence.filePath]) {
          fileReplacements[occurrence.filePath] = [];
        }
        fileReplacements[occurrence.filePath].push({
          text: item.text,
          key,
          line: occurrence.line,
          original: occurrence.original,
          type: occurrence.type,
        });
      }
    } else {
      unmatched.push({
        text: item.text,
        occurrences: item.occurrences,
        language: item.language,
      });
    }
  }

  return {
    matched,
    unmatched,
    fileReplacements,
    summary: {
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      filesAffected: Object.keys(fileReplacements).length,
    },
  };
}

/**
 * 检查 $t() 中的内容是否已在 CDN 中存在翻译
 * 
 * 支持两种匹配方式：
 * 1. $t('key123') - 直接作为 key 匹配（检查 CDN 中是否存在 key123）
 * 2. $t('some text') - 作为 value 匹配（检查 CDN 中是否有某个 key 对应这个文案）
 * 
 * 替换规则：
 * - 如果 $t('some text') 匹配到 value，且对应多个 keys ['key1', 'key2', 'some text']
 * - 如果 'some text' 本身是其中一个 key，则不需要替换
 * - 如果不是，则建议替换为第一个 key
 * 
 * @param {Array} uniqueKeys - 扫描到的唯一内容列表 [{ text: 'key587' 或 'some text', occurrences: [...] }]
 * @param {Object} translationData - CDN 翻译数据 { en: {}, cn: {}, ja: {}, valueToKeysMap: { en: Map, cn: Map } }
 * @returns {Object} 检查结果 { existing, missing, needReplace }
 */
export function checkKeysInCDN(uniqueKeys, translationData) {
  const existing = [];     // CDN 中已存在，且不需要替换
  const missing = [];      // CDN 中不存在（需要翻译）
  const needReplace = [];  // CDN 中存在，但需要将 value 替换为 key

  // 获取所有已加载的 key
  const allKeys = new Set([
    ...Object.keys(translationData.en || {}),
    ...Object.keys(translationData.cn || {}),
  ]);

  for (const item of uniqueKeys) {
    const text = item.text;
    let matchType = null;
    let matchedKey = null;
    let allMatchedKeys = [];
    let shouldReplace = false;
    
    // 方式1: 检查是否直接作为 key 存在（如 $t('key123')）
    if (allKeys.has(text)) {
      matchType = 'key';
      matchedKey = text;
      allMatchedKeys = [text];
    } 
    // 方式2: 检查是否作为 value 存在（如 $t('some text') 对应 key456: 'some text'）
    else {
      // 先尝试精确匹配英文 value（区分大小写）
      const enKeys = translationData.valueToKeysMap?.en?.get(text);
      if (enKeys && enKeys.length > 0) {
        matchType = 'value-en';
        allMatchedKeys = enKeys;
        
        // 检查 text 本身是否在匹配的 keys 中
        if (allKeys.has(text)) {
          // text 本身就是一个有效的 key，不需要替换
          matchedKey = text;
        } else {
          // text 不是 key，需要替换为第一个 key
          matchedKey = enKeys[0];
          shouldReplace = true;
        }
      } else {
        // 再尝试精确匹配中文 value
        const cnKeys = translationData.valueToKeysMap?.cn?.get(text);
        if (cnKeys && cnKeys.length > 0) {
          matchType = 'value-cn';
          allMatchedKeys = cnKeys;
          
          // 检查 text 本身是否在匹配的 keys 中
          if (allKeys.has(text)) {
            matchedKey = text;
          } else {
            matchedKey = cnKeys[0];
            shouldReplace = true;
          }
        }
      }
    }
    
    if (matchedKey) {
      const entry = {
        text,
        key: matchedKey,
        allKeys: allMatchedKeys,
        matchType,
        enValue: translationData.en?.[matchedKey] || '',
        cnValue: translationData.cn?.[matchedKey] || '',
        jaValue: translationData.ja?.[matchedKey] || '',
        occurrences: item.occurrences,
      };
      
      if (shouldReplace) {
        needReplace.push(entry);
      } else {
        existing.push(entry);
      }
    } else {
      missing.push({
        text,
        occurrences: item.occurrences,
      });
    }
  }

  return {
    existing,
    missing,
    needReplace,
    summary: {
      existingCount: existing.length,
      missingCount: missing.length,
      needReplaceCount: needReplace.length,
      totalKeys: uniqueKeys.length,
    },
  };
}

/**
 * 生成 Key 检查报告
 * @param {Object} checkResult - checkKeysInCDN 的返回结果
 * @returns {string} 报告文本
 */
export function generateKeyCheckReport(checkResult) {
  let report = '\n══════════════════════════════════════════════════════════\n';
  report += '                    i18n 检查报告\n';
  report += '══════════════════════════════════════════════════════════\n\n';

  report += `📊 统计摘要:\n`;
  report += `   • 总共扫描: ${checkResult.summary.totalKeys} 条 $t() 调用\n`;
  report += `   • 已翻译 (无需处理): ${checkResult.summary.existingCount} 条\n`;
  report += `   • 需要替换 key: ${checkResult.summary.needReplaceCount || 0} 条\n`;
  report += `   • 未翻译 (需要翻译): ${checkResult.summary.missingCount} 条\n\n`;

  // 显示需要替换的项
  if (checkResult.needReplace && checkResult.needReplace.length > 0) {
    report += `🔄 需要替换为标准 key (value 匹配但需规范化):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    for (const item of checkResult.needReplace.slice(0, 20)) {
      const locations = item.occurrences.slice(0, 2).map(o => `${o.filePath.split(/[/\\]/).pop()}:${o.line}`).join(', ');
      report += `   • $t('${item.text}') → $t('${item.key}')\n`;
      report += `     位置: ${locations}${item.occurrences.length > 2 ? ` (+${item.occurrences.length - 2} 处)` : ''}\n`;
    }
    if (checkResult.needReplace.length > 20) {
      report += `   ... 还有 ${checkResult.needReplace.length - 20} 条\n`;
    }
    report += '\n';
  }

  // 显示未翻译的项
  if (checkResult.missing.length > 0) {
    report += `❌ 未翻译 (需要翻译后上传到 Lokalise):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    for (const item of checkResult.missing.slice(0, 30)) {
      const locations = item.occurrences.slice(0, 2).map(o => `${o.filePath.split(/[/\\]/).pop()}:${o.line}`).join(', ');
      report += `   • ${item.text}\n`;
      report += `     位置: ${locations}${item.occurrences.length > 2 ? ` (+${item.occurrences.length - 2} 处)` : ''}\n`;
    }
    if (checkResult.missing.length > 30) {
      report += `   ... 还有 ${checkResult.missing.length - 30} 条\n`;
    }
    report += '\n';
  }

  // 显示已翻译的项（仅在数量较少时显示）
  if (checkResult.existing.length > 0 && checkResult.existing.length <= 20) {
    report += `✅ 已翻译 (无需处理):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    for (const item of checkResult.existing.slice(0, 10)) {
      const matchInfo = item.matchType === 'key' ? '[key]' : '[value]';
      const displayValue = item.text === item.key ? (item.enValue || item.cnValue || '').substring(0, 30) : `key=${item.key}`;
      report += `   • ${matchInfo} ${item.text.substring(0, 40)}${item.text.length > 40 ? '...' : ''}\n`;
    }
    if (checkResult.existing.length > 10) {
      report += `   ... 还有 ${checkResult.existing.length - 10} 条\n`;
    }
  }

  report += '\n══════════════════════════════════════════════════════════\n';
  
  return report;
}

/**
 * 生成替换报告
 * @param {Object} plan - 替换计划
 * @returns {string} 报告文本
 */
export function generateReport(plan) {
  let report = '\n══════════════════════════════════════════════════════════\n';
  report += '                    国际化替换报告\n';
  report += '══════════════════════════════════════════════════════════\n\n';

  report += `📊 统计摘要:\n`;
  report += `   • 已匹配文案: ${plan.summary.matchedCount} 条\n`;
  report += `   • 未匹配文案: ${plan.summary.unmatchedCount} 条\n`;
  report += `   • 涉及文件数: ${plan.summary.filesAffected} 个\n\n`;

  if (plan.matched.length > 0) {
    report += `✅ 已匹配的文案 (将被替换为 $t()):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    for (const item of plan.matched.slice(0, 20)) { // 只显示前20条
      report += `   "${item.text}" → $t('${item.key}')\n`;
    }
    if (plan.matched.length > 20) {
      report += `   ... 还有 ${plan.matched.length - 20} 条\n`;
    }
    report += '\n';
  }

  if (plan.unmatched.length > 0) {
    report += `❌ 未匹配的文案 (需要翻译后上传):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    for (const item of plan.unmatched.slice(0, 20)) { // 只显示前20条
      report += `   "${item.text}"\n`;
    }
    if (plan.unmatched.length > 20) {
      report += `   ... 还有 ${plan.unmatched.length - 20} 条\n`;
    }
  }

  report += '\n══════════════════════════════════════════════════════════\n';
  
  return report;
}

export default {
  replaceInFile,
  batchReplace,
  prepareReplacementPlan,
  generateReport,
};

