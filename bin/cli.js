#!/usr/bin/env node
/**
 * i18n-agent CLI 入口
 * 国际化自动化工具命令行界面
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';

// 获取当前目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入核心模块
import { loadAllTranslations, findKeyByValue } from '../lib/cdnLoader.js';
import { scanProject } from '../lib/fileScanner.js';
import { prepareReplacementPlan, batchReplace, generateReport, checkKeysInCDN, generateKeyCheckReport, batchReplaceTextWithKey } from '../lib/replacer.js';
import { batchTranslate } from '../lib/translator.js';
import { getProjects, batchUpload, generateUploadReport } from '../lib/uploader.js';

// 加载配置
async function loadConfig() {
  const configPath = path.join(__dirname, '../config.js');
  try {
    // Windows 需要使用 file:// URL 进行动态导入
    const configUrl = pathToFileURL(configPath).href;
    const config = await import(configUrl);
    console.log('config', config)
    return config.default;
  } catch (error) {
    console.log('error', error)
    console.log(chalk.yellow('\n⚠️  未找到配置文件，请复制 config.example.js 为 config.js 并填入配置\n'));
    return null;
  }
}

// 创建 CLI 程序
const program = new Command();

program
  .name('i18n-agent')
  .description('国际化自动化工具 - 自动匹配/替换/翻译/上传文案')
  .version('1.0.0');

// ======================= scan 命令 =======================
program
  .command('scan')
  .description('扫描项目中的 $t() 国际化调用')
  .argument('[directory]', '要扫描的目录', '.')
  .option('-e, --extensions <ext...>', '文件扩展名', ['.vue', '.js', '.ts', '.tsx', '.jsx'])
  .option('-x, --exclude <dirs...>', '排除的目录', ['node_modules', 'dist', '.git'])
  .option('-o, --output <file>', '输出结果到文件')
  .option('-r, --raw', '扫描未国际化的原始文案（而非 $t() 调用）')
  .action(async (directory, options) => {
    const config = await loadConfig();
    const targetDir = path.resolve(directory);
    
    const modeText = options.raw ? '扫描未国际化文案' : '扫描 $t() 国际化调用';
    console.log(chalk.cyan(`\n🔍 i18n-agent - ${modeText}\n`));
    
    const spinner = ora('正在扫描文件...').start();
    
    try {
      const result = await scanProject(targetDir, {
        extensions: options.extensions,
        excludeDirs: options.exclude,
        scanI18nKeys: !options.raw,  // 默认扫描 $t() 调用
      });
      
      spinner.succeed('扫描完成！');
      
      // 如果指定了输出文件
      if (options.output) {
        const outputPath = path.resolve(options.output);
        await fs.writeFile(outputPath, JSON.stringify(result, null, 2), 'utf-8');
        console.log(chalk.green(`\n✅ 结果已保存到: ${outputPath}`));
      }
      
      // 显示摘要
      console.log(chalk.cyan('\n📊 扫描摘要:'));
      console.log(`   扫描文件数: ${result.summary.totalFiles}`);
      console.log(`   包含文案的文件: ${result.summary.filesWithTexts}`);
      console.log(`   发现文案总数: ${result.summary.totalTexts}`);
      console.log(`   唯一文案数: ${result.summary.uniqueTexts}`);
      
    } catch (error) {
      spinner.fail('扫描失败');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// ======================= match 命令 =======================
program
  .command('match')
  .description('检查 $t() 调用中的 key 是否已在 CDN 中存在翻译')
  .argument('[directory]', '要扫描的目录', '.')
  .option('-o, --output <file>', '输出报告到文件')
  .action(async (directory, options) => {
    const config = await loadConfig();
    if (!config) return;
    
    const targetDir = path.resolve(directory);
    
    console.log(chalk.cyan('\n🔗 i18n-agent - Key 翻译检查\n'));
    
    // 1. 加载CDN翻译数据
    const spinner1 = ora('正在加载CDN翻译数据...').start();
    let translationData;
    try {
      translationData = await loadAllTranslations(config.cdn.sources);
      spinner1.succeed(`CDN数据加载完成 (${Object.keys(translationData.en).length} 条)`);
    } catch (error) {
      spinner1.fail('加载CDN数据失败');
      console.error(chalk.red(error.message));
      return;
    }
    
    // 2. 扫描项目中的 $t() 调用
    const spinner2 = ora('正在扫描 $t() 调用...').start();
    let scanResult;
    try {
      scanResult = await scanProject(targetDir, {
        ...config.scan,
        scanI18nKeys: true,  // 扫描 $t() 调用
      });
      spinner2.succeed(`扫描完成 (${scanResult.summary.uniqueTexts} 条 $t() 调用)`);
    } catch (error) {
      spinner2.fail('扫描失败');
      console.error(chalk.red(error.message));
      return;
    }
    
    // 3. 检查 key 是否在 CDN 中存在
    const spinner3 = ora('正在检查 key 翻译状态...').start();
    const checkResult = checkKeysInCDN(scanResult.uniqueTexts, translationData);
    const replaceCount = checkResult.summary.needReplaceCount || 0;
    spinner3.succeed(`检查完成: ${checkResult.summary.existingCount} 个已翻译, ${replaceCount} 个需替换, ${checkResult.summary.missingCount} 个未翻译`);
    
    // 4. 生成并显示报告
    const report = generateKeyCheckReport(checkResult);
    console.log(report);
    
    // 5. 如果有需要替换的项，询问是否执行替换
    if (checkResult.needReplace && checkResult.needReplace.length > 0) {
      const { confirmReplace } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmReplace',
        message: `是否将 ${checkResult.needReplace.length} 条 $t('text') 替换为 $t('key')?`,
        default: true,
      }]);
      
      if (confirmReplace) {
        const spinner4 = ora('正在执行替换...').start();
        try {
          const replaceResult = await batchReplaceTextWithKey(checkResult.needReplace);
          spinner4.succeed(`替换完成: ${replaceResult.totalChanges} 处`);
        } catch (error) {
          spinner4.fail('替换失败');
          console.error(chalk.red(error.message));
        }
      }
    }
    
    // 保存报告
    if (options.output) {
      const outputPath = path.resolve(options.output);
      await fs.writeFile(outputPath, report, 'utf-8');
      console.log(chalk.green(`\n✅ 报告已保存到: ${outputPath}`));
    }
  });

// ======================= update 命令 =======================
program
  .command('update')
  .description('执行完整的国际化更新流程：扫描 → 匹配 → 替换 → 翻译 → 上传')
  .argument('[directory]', '要处理的目录', '.')
  .option('--dry-run', '仅预览，不实际执行替换')
  .option('--skip-upload', '跳过上传步骤')
  .option('--skip-translate', '跳过翻译步骤')
  .option('-t, --tag <tag>', '上传到Lokalise时的标签')
  .option('-p, --project <projectId>', 'Lokalise项目ID')
  .action(async (directory, options) => {
    const config = await loadConfig();
    if (!config) return;
    
    const targetDir = path.resolve(directory);
    
    console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════════════'));
    console.log(chalk.cyan.bold('       🌍 i18n-agent - 国际化自动更新'));
    console.log(chalk.cyan.bold('═══════════════════════════════════════════════════════\n'));
    
    if (options.dryRun) {
      console.log(chalk.yellow('⚠️  预览模式: 不会实际修改文件\n'));
    }
    
    // 步骤1: 加载CDN翻译数据
    console.log(chalk.blue('【步骤 1/5】加载现有翻译数据'));
    const spinner1 = ora('正在从CDN加载翻译数据...').start();
    let translationData;
    try {
      translationData = await loadAllTranslations(config.cdn.sources);
      spinner1.succeed(`加载完成: ${Object.keys(translationData.en).length} 条英文, ${Object.keys(translationData.cn).length} 条中文`);
    } catch (error) {
      spinner1.fail('加载失败');
      console.error(chalk.red(error.message));
      return;
    }
    
    // 步骤2: 扫描项目中的 $t() 调用
    console.log(chalk.blue('\n【步骤 2/3】扫描项目中的 $t() 调用'));
    const spinner2 = ora('正在扫描...').start();
    let scanResult;
    try {
      scanResult = await scanProject(targetDir, {
        ...config.scan,
        scanI18nKeys: true,  // 扫描 $t() 调用
      });
      spinner2.succeed(`发现 ${scanResult.summary.uniqueTexts} 条 $t() 调用`);
    } catch (error) {
      spinner2.fail('扫描失败');
      console.error(chalk.red(error.message));
      return;
    }
    
    // 步骤3: 检查 key 是否在 CDN 中存在
    console.log(chalk.blue('\n【步骤 3/5】检查 key 翻译状态'));
    const spinner3 = ora('正在检查...').start();
    const checkResult = checkKeysInCDN(scanResult.uniqueTexts, translationData);
    const replaceCount = checkResult.summary.needReplaceCount || 0;
    spinner3.succeed(`已翻译: ${checkResult.summary.existingCount} 条, 需替换: ${replaceCount} 条, 未翻译: ${checkResult.summary.missingCount} 条`);
    
    // 显示报告
    console.log(generateKeyCheckReport(checkResult));
    
    // 步骤4: 处理需要替换的 $t('text') → $t('key')
    if (checkResult.needReplace && checkResult.needReplace.length > 0) {
      const { confirmReplace } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmReplace',
        message: `是否将 ${checkResult.needReplace.length} 条 $t('text') 替换为 $t('key')?`,
        default: true,
      }]);
      
      if (confirmReplace && !options.dryRun) {
        console.log(chalk.blue('\n【步骤 4/5】执行 key 替换'));
        const spinner4 = ora('正在替换...').start();
        try {
          const replaceResult = await batchReplaceTextWithKey(checkResult.needReplace);
          spinner4.succeed(`替换完成: ${replaceResult.totalChanges} 处`);
        } catch (error) {
          spinner4.fail('替换失败');
          console.error(chalk.red(error.message));
        }
      }
    }
    
    // 步骤5: 处理未翻译的 key
    if (checkResult.missing.length > 0 && !options.skipTranslate) {
      const { confirmTranslate } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmTranslate',
        message: `是否翻译 ${checkResult.missing.length} 条未翻译的 key?`,
        default: true,
      }]);
      
      if (confirmTranslate) {
        console.log(chalk.blue('\n【步骤 5/5】翻译并上传'));
        
        // 将 missing keys 转换为翻译器需要的格式
        // 这里 text 就是需要翻译的英文文案
        const textsToTranslate = checkResult.missing.map(item => ({
          text: item.text,  // text 就是英文文案
          language: 'en',
          occurrences: item.occurrences,
        }));
        
        // 翻译
        const spinner4 = ora('正在翻译...').start();
        let translations;
        try {
          translations = await batchTranslate(textsToTranslate, config.deepseek, {
            onProgress: (msg) => spinner4.text = msg,
          });
          spinner4.succeed(`翻译完成: ${translations.length} 条`);
        } catch (error) {
          spinner4.fail('翻译失败');
          console.error(chalk.red(error.message));
          return;
        }
        
        // 上传
        if (!options.skipUpload && translations.length > 0) {
          const { confirmUpload } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirmUpload',
            message: '是否上传翻译结果到Lokalise?',
            default: true,
          }]);
          
          if (confirmUpload) {
            let projectId = options.project || config.lokalise.projectId;
            
            // 如果没有配置项目ID，让用户选择
            if (!projectId) {
              try {
                const projects = await getProjects(config.lokalise.apiToken);
                const { selectedProject } = await inquirer.prompt([{
                  type: 'list',
                  name: 'selectedProject',
                  message: '选择要上传到的项目:',
                  choices: projects.map(p => ({ name: p.name, value: p.project_id })),
                }]);
                projectId = selectedProject;
              } catch (error) {
                console.error(chalk.red('获取项目列表失败:', error.message));
                return;
              }
            }
            
            const spinner6 = ora('正在上传到Lokalise...').start();
            try {
              const uploadResult = await batchUpload(translations, {
                apiToken: config.lokalise.apiToken,
                projectId,
              }, {
                tag: options.tag || config.lokalise.defaultTag,
                onProgress: (msg) => spinner6.text = msg,
              });
              spinner6.succeed(uploadResult.message);
              console.log(generateUploadReport(uploadResult, translations));
            } catch (error) {
              spinner6.fail('上传失败');
              console.error(chalk.red(error.message));
            }
          }
        }
      }
    }
    
    console.log(chalk.green.bold('\n✅ 国际化更新完成！\n'));
  });

// ======================= translate 命令 =======================
program
  .command('translate')
  .description('翻译指定的文本（支持管道输入）')
  .argument('[texts...]', '要翻译的文本列表')
  .option('-f, --file <file>', '从文件读取文本（每行一条）')
  .option('-o, --output <file>', '输出翻译结果到文件')
  .action(async (texts, options) => {
    const config = await loadConfig();
    if (!config) return;
    
    let inputTexts = texts || [];
    
    // 从文件读取
    if (options.file) {
      const fileContent = await fs.readFile(options.file, 'utf-8');
      inputTexts = fileContent.split('\n').filter(t => t.trim());
    }
    
    if (inputTexts.length === 0) {
      console.log(chalk.yellow('请提供要翻译的文本'));
      return;
    }
    
    console.log(chalk.cyan(`\n🌐 翻译 ${inputTexts.length} 条文本...\n`));
    
    const spinner = ora('正在翻译...').start();
    
    try {
      const items = inputTexts.map(text => ({
        text,
        language: /[\u4e00-\u9fa5]/.test(text) ? 'zh' : 'en',
        occurrences: [],
      }));
      
      const results = await batchTranslate(items, config.deepseek, {
        onProgress: (msg) => spinner.text = msg,
      });
      
      spinner.succeed('翻译完成');
      
      // 显示结果
      console.log('\n翻译结果:\n');
      for (const result of results) {
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.blue('EN:'), result.en);
        console.log(chalk.green('CN:'), result.cn);
        console.log(chalk.yellow('JP:'), result.jp);
      }
      
      // 保存到文件
      if (options.output) {
        const csv = results.map(r => `"${r.en}","${r.cn}","${r.jp}"`).join('\n');
        await fs.writeFile(options.output, csv, 'utf-8');
        console.log(chalk.green(`\n✅ 结果已保存到: ${options.output}`));
      }
    } catch (error) {
      spinner.fail('翻译失败');
      console.error(chalk.red(error.message));
    }
  });

// ======================= upload 命令 =======================
program
  .command('upload')
  .description('上传翻译文件到Lokalise')
  .argument('<file>', '要上传的CSV文件（格式: en,cn,jp）')
  .option('-p, --project <projectId>', 'Lokalise项目ID')
  .option('-t, --tag <tag>', '添加的标签')
  .action(async (file, options) => {
    const config = await loadConfig();
    if (!config) return;
    
    const filePath = path.resolve(file);
    
    console.log(chalk.cyan('\n📤 上传翻译到Lokalise\n'));
    
    // 读取CSV文件
    let content;
    try {
      content = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error(chalk.red(`无法读取文件: ${filePath}`));
      return;
    }
    
    // 解析CSV
    const lines = content.split('\n').filter(l => l.trim());
    const translations = lines.map(line => {
      const matches = line.match(/"([^"]*)","([^"]*)","([^"]*)"/);
      if (matches) {
        return { en: matches[1], cn: matches[2], jp: matches[3] };
      }
      const parts = line.split(',').map(p => p.replace(/"/g, '').trim());
      return { en: parts[0] || '', cn: parts[1] || '', jp: parts[2] || '' };
    });
    
    console.log(`找到 ${translations.length} 条翻译\n`);
    
    // 获取项目ID
    let projectId = options.project || config.lokalise.projectId;
    
    if (!projectId) {
      try {
        const projects = await getProjects(config.lokalise.apiToken);
        const { selectedProject } = await inquirer.prompt([{
          type: 'list',
          name: 'selectedProject',
          message: '选择要上传到的项目:',
          choices: projects.map(p => ({ name: p.name, value: p.project_id })),
        }]);
        projectId = selectedProject;
      } catch (error) {
        console.error(chalk.red('获取项目列表失败:', error.message));
        return;
      }
    }
    
    // 上传
    const spinner = ora('正在上传...').start();
    try {
      const result = await batchUpload(translations, {
        apiToken: config.lokalise.apiToken,
        projectId,
      }, {
        tag: options.tag || config.lokalise.defaultTag,
        onProgress: (msg) => spinner.text = msg,
      });
      
      spinner.succeed(result.message);
      console.log(generateUploadReport(result, translations));
    } catch (error) {
      spinner.fail('上传失败');
      console.error(chalk.red(error.message));
    }
  });

// ======================= init 命令 =======================
program
  .command('init')
  .description('初始化配置文件')
  .action(async () => {
    console.log(chalk.cyan('\n🔧 初始化 i18n-agent 配置\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'deepseekApiKey',
        message: 'DeepSeek API Key:',
        validate: (input) => input.length > 0 || '请输入API Key',
      },
      {
        type: 'input',
        name: 'lokaliseApiToken',
        message: 'Lokalise API Token:',
        validate: (input) => input.length > 0 || '请输入API Token',
      },
      {
        type: 'input',
        name: 'lokaliseProjectId',
        message: 'Lokalise 项目ID (可选):',
      },
    ]);
    
    const configContent = `/**
 * i18n-agent 配置文件
 */
export default {
  deepseek: {
    apiKey: '${answers.deepseekApiKey}',
    model: 'deepseek-chat',
    temperature: 0.1,
  },
  lokalise: {
    apiToken: '${answers.lokaliseApiToken}',
    projectId: '${answers.lokaliseProjectId || ''}',
    defaultTag: '',
  },
  cdn: {
    sources: [
      {
        name: 'Common',
        en: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/en.js',
        cn: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/zh_CN.js',
        ja: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/Common/ja.js',
      },
      {
        name: 'AmazonSearch',
        en: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/en.js',
        cn: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/zh_CN.js',
        ja: 'https://cdn-pacvue-public-doc.pacvue.com/lokalise/AmazonSearch/ja.js',
      },
    ],
  },
  scan: {
    extensions: ['.vue', '.js', '.ts', '.tsx', '.jsx'],
    excludeDirs: ['node_modules', 'dist', '.git', 'public'],
  },
};
`;
    
    const configPath = path.join(__dirname, '../config.js');
    await fs.writeFile(configPath, configContent, 'utf-8');
    
    console.log(chalk.green(`\n✅ 配置文件已创建: ${configPath}\n`));
  });

// 解析命令行参数
program.parse();

