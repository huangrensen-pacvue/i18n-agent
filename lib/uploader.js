/**
 * Lokalise 上传模块
 * 将翻译结果上传到 Lokalise
 */

/**
 * 获取用户项目列表
 * @param {string} apiToken - Lokalise API Token
 * @returns {Promise<Array>} 项目列表
 */
export async function getProjects(apiToken) {
  if (!apiToken) {
    throw new Error('Lokalise API token is required');
  }

  const response = await fetch('https://api.lokalise.com/api2/projects', {
    method: 'GET',
    headers: {
      'X-Api-Token': apiToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch projects: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
    );
  }

  const responseData = await response.json();

  if (!responseData.projects || !Array.isArray(responseData.projects)) {
    throw new Error('Invalid response format: projects array not found');
  }

  return responseData.projects
    .filter((project) => project && project.project_id && project.name)
    .map((project) => ({
      project_id: project.project_id,
      name: project.name.trim(),
    }));
}

/**
 * 生成递增的key名称
 * @param {string} baseKey - 基础key
 * @param {number} index - 索引
 * @returns {string} 生成的key名称
 */
function generateKey(baseKey, index) {
  if (!baseKey) {
    return `key_${Date.now()}_${index}`;
  }

  // 提取基准key的字母部分和数字部分
  const match = baseKey.match(/^([a-zA-Z_]+)(\d+)$/);
  if (match) {
    const [, prefix, numberStr] = match;
    const baseNumber = parseInt(numberStr, 10);
    return `${prefix}${baseNumber + index}`;
  }

  return `${baseKey}_${index}`;
}

/**
 * 上传翻译到 Lokalise
 * @param {Array<Object>} translations - 翻译结果数组
 * @param {Object} config - 配置
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 上传结果
 */
export async function uploadTranslations(translations, config, options = {}) {
  const { apiToken, projectId } = config;
  const { tag = '', baseKey = '', useEnAsKey = true } = options;

  if (!apiToken) {
    throw new Error('Lokalise API token is required');
  }

  if (!projectId) {
    throw new Error('Lokalise project ID is required');
  }

  if (!translations || translations.length === 0) {
    return { success: true, uploaded: 0, message: 'No translations to upload' };
  }

  // 构建请求体
  const keys = translations.map((row, index) => {
    // 决定key名称的生成方式
    let keyName;
    if (baseKey && baseKey.trim()) {
      keyName = generateKey(baseKey.trim(), index);
    } else if (useEnAsKey && row.en) {
      // 直接使用英文作为 key（保持原样，区分大小写）
      keyName = String(row.en);
    } else {
      keyName = `key_${Date.now()}_${index}`;
    }

    const keyData = {
      key_name: keyName,
      platforms: ['web', 'other'],
      translations: [
        {
          language_iso: 'en',
          translation: row.en || '',
        },
        {
          language_iso: 'zh_CN',
          translation: row.cn || '',
        },
        {
          language_iso: 'ja',
          translation: row.jp || '',
        },
      ],
    };

    // 添加标签
    if (tag && tag.trim()) {
      keyData.tags = [tag.trim()];
    }

    return keyData;
  });

  // 调用 Lokalise API 上传
  const response = await fetch(
    `https://api.lokalise.com/api2/projects/${projectId}/keys`,
    {
      method: 'POST',
      headers: {
        'X-Api-Token': apiToken.trim(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    }
  );

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = {};
    }

    throw new Error(
      `Upload failed: ${errorData.error?.message || `HTTP ${response.status} ${response.statusText}`}`
    );
  }

  const responseData = await response.json();

  // 检查是否有错误
  if (responseData.errors && responseData.errors.length > 0) {
    const errorMessages = responseData.errors
      .map(
        (error) =>
          `${error.key_name?.web || error.key_name?.ios || 'Unknown key'}: ${error.message}`
      )
      .join('; ');

    console.warn('Some keys failed to upload:', responseData.errors);
    return {
      success: false,
      uploaded: keys.length - responseData.errors.length,
      errors: responseData.errors,
      message: `Upload completed with errors: ${errorMessages}`,
    };
  }

  return {
    success: true,
    uploaded: keys.length,
    message: `Successfully uploaded ${keys.length} keys`,
    keys: keys.map(k => k.key_name),
  };
}

/**
 * 批量上传（分批处理）
 * @param {Array<Object>} translations - 翻译结果数组
 * @param {Object} config - 配置
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 上传结果汇总
 */
export async function batchUpload(translations, config, options = {}) {
  const { batchSize = 100, delayMs = 500, onProgress = null, ...restOptions } = options;
  
  const results = {
    success: true,
    totalUploaded: 0,
    totalErrors: 0,
    allKeys: [],
    batches: [],
  };

  const total = translations.length;
  
  for (let i = 0; i < total; i += batchSize) {
    const batch = translations.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(total / batchSize);
    
    if (onProgress) {
      onProgress(`上传进度: ${batchNumber}/${totalBatches} 批`, i, total);
    }

    try {
      const result = await uploadTranslations(batch, config, {
        ...restOptions,
        baseKey: restOptions.baseKey ? 
          generateKey(restOptions.baseKey, i) : '',
      });
      
      results.batches.push(result);
      results.totalUploaded += result.uploaded || 0;
      
      if (result.keys) {
        results.allKeys.push(...result.keys);
      }
      
      if (!result.success) {
        results.success = false;
        results.totalErrors += result.errors?.length || 0;
      }

      // 批次之间添加延迟
      if (i + batchSize < total) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      results.success = false;
      results.batches.push({
        success: false,
        error: error.message,
      });
      console.error(`批次 ${batchNumber} 上传失败:`, error.message);
    }
  }

  results.message = results.success 
    ? `Successfully uploaded ${results.totalUploaded} keys`
    : `Upload completed with ${results.totalErrors} errors, ${results.totalUploaded} keys uploaded`;

  return results;
}

/**
 * 生成上传报告
 * @param {Object} uploadResult - 上传结果
 * @param {Array<Object>} translations - 翻译内容
 * @returns {string} 报告文本
 */
export function generateUploadReport(uploadResult, translations) {
  let report = '\n══════════════════════════════════════════════════════════\n';
  report += '                    上传报告\n';
  report += '══════════════════════════════════════════════════════════\n\n';

  report += `📊 上传统计:\n`;
  report += `   • 状态: ${uploadResult.success ? '✅ 成功' : '❌ 部分失败'}\n`;
  report += `   • 上传数量: ${uploadResult.totalUploaded || uploadResult.uploaded || 0} 条\n`;
  
  if (uploadResult.totalErrors) {
    report += `   • 失败数量: ${uploadResult.totalErrors} 条\n`;
  }
  
  report += '\n';

  if (translations && translations.length > 0) {
    report += `📝 翻译内容预览 (前10条):\n`;
    report += `──────────────────────────────────────────────────────────\n`;
    
    for (const item of translations.slice(0, 10)) {
      report += `   EN: ${item.en}\n`;
      report += `   CN: ${item.cn}\n`;
      report += `   JP: ${item.jp}\n`;
      report += `   ──────────────────────────────────────────\n`;
    }
    
    if (translations.length > 10) {
      report += `   ... 还有 ${translations.length - 10} 条\n`;
    }
  }

  report += '\n══════════════════════════════════════════════════════════\n';
  
  return report;
}

export default {
  getProjects,
  uploadTranslations,
  batchUpload,
  generateUploadReport,
};

