/**
 * i18n-agent Web Server
 * 提供 Web 界面来操作国际化工具
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

// 导入核心模块
import { loadAllTranslations } from './lib/cdnLoader.js';
import { scanProject } from './lib/fileScanner.js';
import { checkKeysInCDN, generateKeyCheckReport, batchReplaceTextWithKey } from './lib/replacer.js';
import { batchTranslate } from './lib/translator.js';
import { batchUpload, getProjects } from './lib/uploader.js';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 动态加载配置
async function loadConfig() {
  try {
    const { pathToFileURL } = await import('url');
    const configPath = path.join(__dirname, 'config.js');
    const configUrl = `${pathToFileURL(configPath).href}?t=${Date.now()}`;
    const config = await import(configUrl);
    return config.default;
  } catch (error) {
    console.error('加载配置失败:', error.message);
    return null;
  }
}

const app = express();
const PORT = process.env.PORT || 7777;

// 中间件
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 存储当前会话数据
let sessionData = {
  config: null,
  translationData: null,
  scanResult: null,
  checkResult: null,
};

function mergeRuntimeCredentials(baseConfig) {
  if (!baseConfig || !sessionData.config) return baseConfig;
  const runtimeDeepseek = (sessionData.config.deepseek?.apiKey || '').trim();
  const runtimeLokalise = (sessionData.config.lokalise?.apiToken || '').trim();
  if (runtimeDeepseek && runtimeDeepseek !== 'your_deepseek_api_key_here') {
    baseConfig.deepseek.apiKey = runtimeDeepseek;
  }
  if (runtimeLokalise && runtimeLokalise !== 'your_lokalise_api_token_here') {
    baseConfig.lokalise.apiToken = runtimeLokalise;
  }
  return baseConfig;
}


// API: 获取配置状态
app.get('/api/config', async (req, res) => {
  try {
    const config = await loadConfig();
    if (!config) {
      return res.json({ success: false, message: '配置文件不存在，请先创建 config.js' });
    }
    const mergedConfig = mergeRuntimeCredentials(config);
    sessionData.config = mergedConfig;
    const deepseekKey = (mergedConfig.deepseek?.apiKey || '').trim();
    const lokaliseToken = (mergedConfig.lokalise?.apiToken || '').trim();
    res.json({
      success: true,
      cdnSources: mergedConfig.cdn.sources.map(s => s.name),
      hasDeepseekKey: deepseekKey !== '' && deepseekKey !== 'your_deepseek_api_key_here',
      hasLokaliseToken: lokaliseToken !== '' && lokaliseToken !== 'your_lokalise_api_token_here',
      lokaliseProjectId: mergedConfig.lokalise?.projectId || '',
      lokaliseDefaultTag: mergedConfig.lokalise?.defaultTag || '',
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});


// API: 加载 CDN 数据
app.post('/api/load-cdn', async (req, res) => {
  try {
    if (!sessionData.config) {
      sessionData.config = await loadConfig();
    }
    const selectedSources = Array.isArray(req.body?.selectedSources) ? req.body.selectedSources : [];
    const allSources = sessionData.config.cdn.sources || [];
    const sourcesToLoad = selectedSources.length > 0
      ? allSources.filter(source => selectedSources.includes(source.name))
      : allSources;

    if (sourcesToLoad.length === 0) {
      return res.json({ success: false, message: '未选择任何 CDN 源' });
    }

    const translationData = await loadAllTranslations(sourcesToLoad);
    sessionData.translationData = translationData;
    
    res.json({
      success: true,
      enCount: Object.keys(translationData.en).length,
      cnCount: Object.keys(translationData.cn).length,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 扫描目录
app.post('/api/scan', async (req, res) => {
  try {
    const { directory } = req.body;
    
    if (!directory) {
      return res.json({ success: false, message: '请提供扫描目录' });
    }
    
    if (!sessionData.config) {
      sessionData.config = await loadConfig();
    }
    
    const targetDir = path.resolve(directory);
    const scanResult = await scanProject(targetDir, {
      ...sessionData.config.scan,
      scanI18nKeys: true,
    });
    
    sessionData.scanResult = scanResult;
    
    res.json({
      success: true,
      totalFiles: scanResult.summary.totalFiles,
      filesWithTexts: scanResult.summary.filesWithTexts,
      totalTexts: scanResult.summary.totalTexts,
      uniqueTexts: scanResult.summary.uniqueTexts,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 检查翻译状态
app.post('/api/check', async (req, res) => {
  try {
    if (!sessionData.translationData) {
      return res.json({ success: false, message: '请先加载 CDN 数据' });
    }
    
    if (!sessionData.scanResult) {
      return res.json({ success: false, message: '请先扫描目录' });
    }
    
    const checkResult = checkKeysInCDN(sessionData.scanResult.uniqueTexts, sessionData.translationData);
    sessionData.checkResult = checkResult;
    
    res.json({
      success: true,
      existing: checkResult.existing.map(item => ({
        text: item.text,
        key: item.key,
        matchType: item.matchType,
        locations: item.occurrences.slice(0, 3).map(o => ({
          file: path.basename(o.filePath),
          line: o.line,
        })),
        totalLocations: item.occurrences.length,
      })),
      needReplace: checkResult.needReplace?.map(item => ({
        text: item.text,
        key: item.key,
        locations: item.occurrences.slice(0, 3).map(o => ({
          file: path.basename(o.filePath),
          line: o.line,
        })),
        totalLocations: item.occurrences.length,
      })) || [],
      missing: checkResult.missing.map(item => ({
        text: item.text,
        locations: item.occurrences.slice(0, 3).map(o => ({
          file: path.basename(o.filePath),
          line: o.line,
        })),
        totalLocations: item.occurrences.length,
      })),
      summary: checkResult.summary,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 执行 key 替换
app.post('/api/replace', async (req, res) => {
  try {
    if (!sessionData.checkResult?.needReplace?.length) {
      return res.json({ success: false, message: '没有需要替换的项' });
    }
    
    const result = await batchReplaceTextWithKey(sessionData.checkResult.needReplace);
    
    res.json({
      success: true,
      totalChanges: result.totalChanges,
      successCount: result.success.length,
      failedCount: result.failed.length,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 翻译未翻译的文案
app.post('/api/translate', async (req, res) => {
  try {
    if (!sessionData.checkResult?.missing?.length) {
      return res.json({ success: false, message: '没有需要翻译的项' });
    }
    
    if (!sessionData.config?.deepseek?.apiKey || 
        sessionData.config.deepseek.apiKey === 'your_deepseek_api_key_here') {
      return res.json({ success: false, message: '请先配置 DeepSeek API Key' });
    }
    
    const textsToTranslate = sessionData.checkResult.missing.map(item => ({
      text: item.text,
      language: 'en',
      occurrences: item.occurrences,
    }));
    
    const translations = await batchTranslate(textsToTranslate, sessionData.config.deepseek, {});
    sessionData.translations = translations;
    
    res.json({
      success: true,
      translations: translations.map(t => ({
        en: t.en,
        cn: t.cn,
        jp: t.jp,
      })),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 获取 Lokalise 项目列表
app.get('/api/lokalise/projects', async (req, res) => {
  try {
    if (!sessionData.config?.lokalise?.apiToken ||
        sessionData.config.lokalise.apiToken === 'your_lokalise_api_token_here') {
      return res.json({ success: false, message: '请先配置 Lokalise API Token' });
    }
    
    const projects = await getProjects(sessionData.config.lokalise.apiToken);
    
    res.json({
      success: true,
      projects: projects.map(p => ({
        id: p.project_id,
        name: p.name,
      })),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 上传到 Lokalise
app.post('/api/upload', async (req, res) => {
  try {
    const { projectId, tag, translations } = req.body;
    
    const uploadItems = Array.isArray(translations) && translations.length
      ? translations
      : sessionData.translations;
    
    if (!uploadItems?.length) {
      return res.json({ success: false, message: '没有翻译结果可上传' });
    }
    
    const targetProjectId = projectId || sessionData.config?.lokalise?.projectId;
    
    if (!targetProjectId) {
      return res.json({ success: false, message: '请选择 Lokalise 项目' });
    }
    
    const result = await batchUpload(uploadItems, {
      apiToken: sessionData.config.lokalise.apiToken,
      projectId: targetProjectId,
    }, {
      tag: tag || sessionData.config?.lokalise?.defaultTag,
    });
    
    res.json({
      success: true,
      message: result.message,
      uploaded: result.uploaded,
      failed: result.failed,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 保存密钥（仅内存）
app.post('/api/credentials', async (req, res) => {
  try {
    const { deepseekKey, lokaliseToken } = req.body;
    if (!sessionData.config) {
      sessionData.config = await loadConfig();
    }
    if (!sessionData.config) {
      return res.json({ success: false, message: '配置加载失败' });
    }

    if (deepseekKey) {
      sessionData.config.deepseek.apiKey = deepseekKey;
    }
    if (lokaliseToken) {
      sessionData.config.lokalise.apiToken = lokaliseToken;
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 获取磁盘驱动器 (Windows) 或根目录
app.get('/api/browse/drives', async (req, res) => {
  try {
    const platform = os.platform();
    
    if (platform === 'win32') {
      // Windows: 获取可用驱动器
      const drives = [];
      // 检查 A-Z 驱动器
      for (let i = 65; i <= 90; i++) {
        const driveLetter = String.fromCharCode(i);
        const drivePath = `${driveLetter}:\\`;
        try {
          await fs.access(drivePath);
          drives.push({
            name: `${driveLetter}:`,
            path: drivePath,
            type: 'drive'
          });
        } catch {
          // 驱动器不存在，跳过
        }
      }
      res.json({ success: true, drives });
    } else {
      // Linux/Mac: 返回根目录和用户目录
      const homeDir = os.homedir();
      res.json({
        success: true,
        drives: [
          { name: '/', path: '/', type: 'root' },
          { name: 'Home', path: homeDir, type: 'home' }
        ]
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// API: 浏览目录内容
app.get('/api/browse', async (req, res) => {
  try {
    let { path: dirPath } = req.query;
    
    if (!dirPath) {
      // 默认返回用户目录
      dirPath = os.homedir();
    }
    
    // 规范化路径
    dirPath = path.normalize(dirPath);
    
    // 检查目录是否存在
    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) {
        return res.json({ success: false, message: 'Not a directory' });
      }
    } catch (e) {
      return res.json({ success: false, message: 'Directory not found' });
    }
    
    // 读取目录内容
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    // 只返回目录，排除隐藏目录和特殊目录
    const directories = entries
      .filter(entry => {
        if (!entry.isDirectory()) return false;
        // 排除隐藏目录
        if (entry.name.startsWith('.')) return false;
        // 排除特殊目录
        if (['node_modules', '$RECYCLE.BIN', 'System Volume Information'].includes(entry.name)) return false;
        return true;
      })
      .map(entry => ({
        name: entry.name,
        path: path.join(dirPath, entry.name),
        type: 'directory'
      }))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    
    // 计算父目录
    const parentPath = path.dirname(dirPath);
    const hasParent = parentPath !== dirPath;
    
    res.json({
      success: true,
      currentPath: dirPath,
      parent: hasParent ? parentPath : null,
      directories
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🌍 i18n-agent Web Server                                ║
║                                                           ║
║   服务已启动: http://localhost:${PORT}                       ║
║                                                           ║
║   在浏览器中打开上述地址即可使用                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
