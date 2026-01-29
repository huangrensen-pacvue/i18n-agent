# i18n-agent 国际化自动化工具

一个自动化的国际化文案处理工具，支持文案扫描、匹配、替换、翻译和上传到Lokalise。

## 功能特性

- 🔍 **自动扫描**: 扫描项目中的中文/英文文案
- 🔗 **智能匹配**: 从CDN加载现有翻译数据，自动匹配已有的key
- 🔄 **自动替换**: 将已匹配的文案自动替换为 `$t('key')` 格式
- 🌐 **智能翻译**: 使用DeepSeek AI进行中英日三语翻译
- 📤 **一键上传**: 将翻译结果上传到Lokalise

## 安装

```bash
cd i18n-agent
npm install
```

## 使用方法

### Web 方式（推荐）

启动 Web 服务并在浏览器中操作全流程：

```bash
# 启动 Web 服务（默认端口 7777）
pnpm run web
# 或
node server.js
```

访问：`http://localhost:7777`

Web 端流程与 CLI 完全一致：**加载 CDN → 扫描 → 检查 → 替换 → 翻译 → 上传**。  
并额外支持：
- 目录选择器 / 历史目录
- 步骤状态提示与自动折叠
- 翻译可编辑、可勾选上传
- 未翻译一键导出（每行一条）

### 1. 完整更新流程（推荐）

在开发完成后，执行一次完整的国际化更新:

```bash
# 处理当前目录
node index.js update

# 处理指定项目目录
node index.js update "C:\Users\RensenHuang\pacvue\amazon-v3-web\src"

# 预览模式（不实际修改）
node index.js update --dry-run

# 跳过上传步骤
node index.js update --skip-upload

# 指定上传标签
node index.js update --tag "feature-xxx"
```

### 2. 单独扫描文案

```bash
# 扫描当前目录
node index.js scan

# 扫描指定目录
node index.js scan "C:\path\to\project"

# 输出结果到文件
node index.js scan -o scan-result.json
```

### 3. 匹配分析

仅分析文案匹配情况，不执行替换:

```bash
node index.js match "C:\path\to\project"
```

### 4. 单独翻译

```bash
# 翻译指定文本
node index.js translate "Hello World" "Welcome"

# 从文件读取并翻译
node index.js translate -f texts.txt -o translations.csv
```

### 5. 单独上传

```bash
# 上传CSV翻译文件
node index.js upload translations.csv

# 指定项目和标签
node index.js upload translations.csv -p project_id -t tag_name
```

## 工作流程

```
┌─────────────────────────────────────────────────────────────┐
│                    i18n-agent 工作流程                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 加载CDN翻译数据                                          │
│     ↓                                                       │
│  2. 扫描项目文件中的中文/英文文案                              │
│     ↓                                                       │
│  3. 匹配分析                                                 │
│     ├── 已匹配 → 替换为 $t('key')                            │
│     └── 未匹配 → 进入翻译流程                                 │
│           ↓                                                 │
│  4. DeepSeek AI 翻译（中英日三语）                            │
│     ↓                                                       │
│  5. 上传到 Lokalise                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 支持的文件类型

- `.vue` - Vue单文件组件
- `.js` - JavaScript文件
- `.ts` - TypeScript文件
- `.tsx` - TypeScript React组件
- `.jsx` - JavaScript React组件

## 文案识别规则

工具会自动识别以下位置的文案:

1. **Vue template中的文本**: `>文案内容<`
2. **字符串中的中文**: `'中文内容'` 或 `"中文内容"`
3. **属性值**: `placeholder="请输入"`, `title="标题"` 等
4. **模板字符串**: `` `包含中文的内容` ``

## 替换示例

**替换前:**
```vue
<template>
  <div>欢迎使用</div>
  <input placeholder="请输入" />
</template>

<script>
const msg = '操作成功';
</script>
```

**替换后:**
```vue
<template>
  <div>{{ $t('welcome_to_use') }}</div>
  <input :placeholder="$t('please_input')" />
</template>

<script>
const msg = $t('operation_successful');
</script>
```

## 配置说明

### CDN源配置

可以配置多个CDN源来加载现有翻译:

```javascript
cdn: {
  sources: [
    {
      name: 'Common',
      en: 'https://cdn.../Common/en.js',
      cn: 'https://cdn.../Common/zh_CN.js',
      ja: 'https://cdn.../Common/ja.js',
    },
    // 添加更多源...
  ],
}
```

### 扫描配置

```javascript
scan: {
  extensions: ['.vue', '.js', '.ts'],  // 扫描的文件类型
  excludeDirs: ['node_modules', 'dist'], // 排除的目录
}
```

## 注意事项

1. **备份重要**: 建议在执行替换前使用 `--dry-run` 预览
2. **Git版本控制**: 确保项目在Git控制下，方便回退
3. **API限制**: DeepSeek和Lokalise有API调用限制，大批量处理时会自动分批
4. **人工复核**: 自动替换后建议人工检查关键文案

## 常见问题

### Q: 如何添加新的CDN源?
A: 在 `config.js` 的 `cdn.sources` 数组中添加新的源配置。

### Q: 翻译结果不准确怎么办?
A: 可以在 `config.js` 中自定义 `translationPrompt` 来优化翻译质量。

### Q: 如何只处理特定文件?
A: 可以指定更精确的目录路径，或修改 `scan.extensions` 配置。

## License

MIT

