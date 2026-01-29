/**
 * i18n-agent Frontend Application
 */

// ============================
// i18n Translations
// ============================
const translations = {
  en: {
    // Header
    checking_config: 'Checking config...',
    config_ready: 'Config ready',
    config_error: 'Config error',
    
    // Step 1
    load_cdn_data: 'Load CDN Data',
    load_cdn_help: 'Load existing translation data from CDN',
    load_data: 'Load Data',
    loading_cdn: 'Loading CDN data...',
    cdn_loaded: 'Loaded {en} EN keys, {cn} CN keys',
    cdn_load_failed: 'Failed to load CDN data',
    
    // Step 2
    scan_project: 'Scan Project',
    scan_help: 'Scan $t() calls in your project',
    enter_directory: 'Enter project directory path...',
    start_scan: 'Start Scan',
    scanning: 'Scanning...',
    scan_complete: 'Scanned {files} files, found {texts} $t() calls',
    scan_failed: 'Scan failed',
    recent_directories: 'Recent Directories',
    clear: 'Clear',
    no_recent: 'No recent directories',
    paste: 'Paste',
    favorite: 'Favorite',
    favorites: 'Favorites',
    added_to_favorites: 'Added to favorites',
    removed_from_favorites: 'Removed from favorites',
    directory_required: 'Please enter a directory path',
    copied_to_input: 'Path pasted',
    select_directory: 'Select Directory',
    parent_folder: 'Parent',
    quick_access: 'Quick Access',
    selected: 'Selected:',
    select: 'Select',
    no_folders: 'No folders found',
    enter_folder: 'Enter',
    run_update: 'Run Update Flow',
    update_help: 'Full flow: load → scan → check → replace → translate → upload',
    dry_run: 'Dry run (no file changes)',
    skip_translate: 'Skip translate',
    skip_upload: 'Skip upload',
    upload_tag: 'Upload tag (optional)',
    project_optional: 'Project (optional)',
    load_projects: 'Load',
    confirm_title: 'Confirm',
    confirm: 'Confirm',
    confirm_replace: 'Replace {count} items with standard keys?',
    confirm_translate: 'Translate {count} missing items?',
    confirm_upload: 'Upload translation results to Lokalise?',
    update_running: 'Running update flow...',
    update_complete: 'Update flow completed',
    update_failed: 'Update flow failed',
    project_required: 'Please select a project',
    use_default_project: 'Use default project',
    check_failed: 'Check failed',
    deepseek_required: 'Please configure DeepSeek API Key',
    dry_run_notice: 'Dry run: no files will be modified',
    
    // Step 3
    check_status: 'Check Translation Status',
    check_help: 'Check which keys are translated',
    start_check: 'Start Check',
    checking: 'Checking...',
    check_complete: 'Check complete',
    
    // Stats
    translated: 'Translated',
    need_replace: 'Need Replace',
    untranslated: 'Untranslated',
    total: 'Total',
    
    // Actions
    execute_replace: 'Execute Replace',
    ai_translate: 'AI Translate',
    upload_lokalise: 'Upload to Lokalise',
    
    // Results
    empty_state: 'Please load CDN data and scan your project first',
    need_replace_title: 'Need to Replace with Standard Key',
    missing_title: 'Untranslated (Need Translation)',
    translation_results: 'Translation Results',
    select_all: 'Select All',
    upload_selected: 'Upload Selected',
    selected_count: 'Selected {count}',
    no_items_selected: 'Please select at least one item',
    export_untranslated: 'Export',
    export_missing_done: 'Untranslated exported',
    export_only_text: 'Only text',
    credentials_title: 'Credentials',
    deepseek_key: 'DeepSeek API Key',
    lokalise_token: 'Lokalise API Token',
    credentials_later: 'Later',
    save: 'Save',
    credentials_saved: 'Credentials saved',
    credentials_required: 'Please configure credentials',
    cdn_select_required: 'Please select at least one CDN source',
    
    // Modal
    upload_to_lokalise: 'Upload to Lokalise',
    select_project: 'Select Project:',
    loading: 'Loading...',
    cancel: 'Cancel',
    confirm_upload: 'Confirm Upload',
    
    // Toast messages
    replace_success: 'Replaced {count} items successfully',
    replace_failed: 'Replace failed',
    translate_success: 'Translated {count} items',
    translate_failed: 'Translation failed',
    upload_success: 'Uploaded successfully',
    upload_failed: 'Upload failed',
    no_items_to_replace: 'No items to replace',
    no_items_to_translate: 'No items to translate',
    please_load_cdn_first: 'Please load CDN data first',
    please_scan_first: 'Please scan project first',
    please_check_first: 'Please check translation status first',
    please_translate_first: 'Please translate first',
    step_waiting: 'Waiting',
    step_running: 'Running',
    step_done: 'Done',
    step_blocked: 'Blocked',
    step_failed: 'Failed',
  },
  zh: {
    // Header
    checking_config: '检查配置中...',
    config_ready: '配置就绪',
    config_error: '配置错误',
    
    // Step 1
    load_cdn_data: '加载 CDN 数据',
    load_cdn_help: '从 CDN 加载已有的翻译数据',
    load_data: '加载数据',
    loading_cdn: '正在加载 CDN 数据...',
    cdn_loaded: '已加载 {en} 个英文 key, {cn} 个中文 key',
    cdn_load_failed: '加载 CDN 数据失败',
    
    // Step 2
    scan_project: '扫描项目',
    scan_help: '扫描项目中的 $t() 调用',
    enter_directory: '输入项目目录路径...',
    start_scan: '开始扫描',
    scanning: '扫描中...',
    scan_complete: '扫描了 {files} 个文件，发现 {texts} 个 $t() 调用',
    scan_failed: '扫描失败',
    recent_directories: '最近目录',
    clear: '清空',
    no_recent: '没有最近的目录',
    paste: '粘贴',
    favorite: '收藏',
    favorites: '收藏夹',
    added_to_favorites: '已添加到收藏',
    removed_from_favorites: '已从收藏移除',
    directory_required: '请输入目录路径',
    copied_to_input: '路径已粘贴',
    select_directory: '选择目录',
    parent_folder: '上级',
    quick_access: '快速访问',
    selected: '已选择:',
    select: '选择',
    no_folders: '没有找到文件夹',
    enter_folder: '进入',
    run_update: '执行完整流程',
    update_help: '完整流程：加载 → 扫描 → 检查 → 替换 → 翻译 → 上传',
    dry_run: '预览模式（不修改文件）',
    skip_translate: '跳过翻译',
    skip_upload: '跳过上传',
    upload_tag: '上传标签（可选）',
    project_optional: '项目（可选）',
    load_projects: '加载',
    confirm_title: '确认',
    confirm: '确认',
    confirm_replace: '是否替换 {count} 条为标准 key？',
    confirm_translate: '是否翻译 {count} 条未翻译项？',
    confirm_upload: '是否上传翻译结果到 Lokalise？',
    update_running: '正在执行完整流程...',
    update_complete: '完整流程执行完成',
    update_failed: '完整流程执行失败',
    project_required: '请选择项目',
    use_default_project: '使用默认项目',
    check_failed: '检查失败',
    deepseek_required: '请先配置 DeepSeek API Key',
    dry_run_notice: '预览模式：不会修改文件',
    
    // Step 3
    check_status: '检查翻译状态',
    check_help: '检查哪些 key 已翻译',
    start_check: '开始检查',
    checking: '检查中...',
    check_complete: '检查完成',
    
    // Stats
    translated: '已翻译',
    need_replace: '需替换',
    untranslated: '未翻译',
    total: '总计',
    
    // Actions
    execute_replace: '执行替换',
    ai_translate: 'AI 翻译',
    upload_lokalise: '上传到 Lokalise',
    
    // Results
    empty_state: '请先加载 CDN 数据并扫描项目',
    need_replace_title: '需要替换为标准 Key',
    missing_title: '未翻译（需要翻译）',
    translation_results: '翻译结果',
    select_all: '全选',
    upload_selected: '上传选中项',
    selected_count: '已选 {count}',
    no_items_selected: '请至少选择一项',
    export_untranslated: '导出',
    export_missing_done: '未翻译已导出',
    export_only_text: '仅文本',
    credentials_title: '密钥配置',
    deepseek_key: 'DeepSeek API Key',
    lokalise_token: 'Lokalise API Token',
    credentials_later: '稍后配置',
    save: '保存',
    credentials_saved: '密钥已保存',
    credentials_required: '请先配置密钥',
    cdn_select_required: '请至少选择一个 CDN 源',
    
    // Modal
    upload_to_lokalise: '上传到 Lokalise',
    select_project: '选择项目:',
    loading: '加载中...',
    cancel: '取消',
    confirm_upload: '确认上传',
    
    // Toast messages
    replace_success: '成功替换 {count} 项',
    replace_failed: '替换失败',
    translate_success: '已翻译 {count} 项',
    translate_failed: '翻译失败',
    upload_success: '上传成功',
    upload_failed: '上传失败',
    no_items_to_replace: '没有需要替换的项',
    no_items_to_translate: '没有需要翻译的项',
    please_load_cdn_first: '请先加载 CDN 数据',
    please_scan_first: '请先扫描项目',
    please_check_first: '请先检查翻译状态',
    please_translate_first: '请先翻译',
    step_waiting: '等待中',
    step_running: '进行中',
    step_done: '已完成',
    step_blocked: '被阻塞',
    step_failed: '失败',
  }
};

// Current language
let currentLang = localStorage.getItem('i18n-agent-lang') || 'en';

// App state
let configState = {
  hasDeepseekKey: false,
  hasLokaliseToken: false,
  lokaliseProjectId: '',
  lokaliseDefaultTag: ''
};
let cdnLoaded = false;
let lastScanOk = false;
let lastCheckResult = null;
let lastTranslations = null;

let credentialsModalRequired = false;
const credentialsStorageKey = 'i18nAgentCredentials';
let availableCdnSources = [];

// Storage keys
const STORAGE_KEYS = {
  RECENT_DIRS: 'i18n-agent-recent-dirs',
  FAVORITES: 'i18n-agent-favorites',
  LANG: 'i18n-agent-lang'
};

// Max recent directories
const MAX_RECENT_DIRS = 10;

// ============================
// i18n Functions
// ============================
function t(key, params = {}) {
  let text = translations[currentLang][key] || translations['en'][key] || key;
  // Replace placeholders like {count}
  Object.keys(params).forEach(param => {
    text = text.replace(`{${param}}`, params[param]);
  });
  return text;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('i18n-agent-lang', lang);
  
  // Update button states
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all i18n elements
  updateAllTexts();
}

function updateAllTexts() {
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Refresh option labels that are not data-i18n
  updateConfigDefaults();
  updateButtonsState();
}

// ============================
// Toast Notifications
// ============================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateModalOpenState() {
  const hasOpenModal = document.querySelectorAll('.modal.show').length > 0;
  document.body.classList.toggle('modal-open', hasOpenModal);
}

function updateButtonsState() {
  const scanBtn = document.getElementById('scanBtn');
  const checkBtn = document.getElementById('checkBtn');
  const replaceBtn = document.getElementById('replaceBtn');
  const translateBtn = document.getElementById('translateBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  
  if (scanBtn) scanBtn.disabled = !cdnLoaded;
  if (checkBtn) checkBtn.disabled = !lastScanOk;
  
  const canReplace = !!(lastCheckResult?.needReplace?.length);
  const canTranslate = !!(lastCheckResult?.missing?.length) && configState.hasDeepseekKey;
  const selectedCount = getSelectedTranslationCount();
  const canUpload = !!(lastTranslations?.length) && configState.hasLokaliseToken && selectedCount > 0;
  
  if (replaceBtn) replaceBtn.disabled = !canReplace;
  if (translateBtn) translateBtn.disabled = !canTranslate;
  if (uploadBtn) uploadBtn.disabled = !canUpload;

  updateStepStatuses();
}

function renderCdnSources(sources) {
  availableCdnSources = Array.isArray(sources) ? sources : [];
  const cdnSourcesEl = document.getElementById('cdnSources');
  if (!cdnSourcesEl) return;
  cdnSourcesEl.innerHTML = '';
  availableCdnSources.forEach((name) => {
    const isDefault = /common/i.test(name) || /amazonsearch/i.test(name);
    const label = document.createElement('label');
    label.className = 'checkbox';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = isDefault;
    input.dataset.sourceName = name;
    const span = document.createElement('span');
    span.textContent = name;
    label.appendChild(input);
    label.appendChild(span);
    cdnSourcesEl.appendChild(label);
  });
}

function getSelectedCdnSources() {
  const cdnSourcesEl = document.getElementById('cdnSources');
  if (!cdnSourcesEl) return [];
  const inputs = cdnSourcesEl.querySelectorAll('input[type="checkbox"][data-source-name]');
  return Array.from(inputs)
    .filter(input => input.checked)
    .map(input => input.dataset.sourceName);
}

function openCredentialsModal(force = false) {
  credentialsModalRequired = force;
  const stored = loadStoredCredentials();
  if (stored) {
    document.getElementById('deepseekKeyInput').value = stored.deepseekKey || '';
    document.getElementById('lokaliseTokenInput').value = stored.lokaliseToken || '';
  }
  document.getElementById('credentialsModal').classList.add('show');
  updateModalOpenState();
}

function closeCredentialsModal() {
  if (credentialsModalRequired) {
    const stored = loadStoredCredentials();
    const hasStoredDeepseek = !!stored?.deepseekKey;
    const hasStoredLokalise = !!stored?.lokaliseToken;
    if (!hasStoredDeepseek || !hasStoredLokalise) {
      showToast(t('credentials_required'), 'warning');
    }
  }
  credentialsModalRequired = false;
  document.getElementById('credentialsModal').classList.remove('show');
  updateModalOpenState();
}

async function saveCredentials() {
  const deepseekKey = document.getElementById('deepseekKeyInput').value.trim();
  const lokaliseToken = document.getElementById('lokaliseTokenInput').value.trim();
  try {
    const response = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deepseekKey, lokaliseToken })
    });
    const data = await response.json();
    if (data.success) {
      saveStoredCredentials({ deepseekKey, lokaliseToken });
      configState.hasDeepseekKey = !!deepseekKey;
      configState.hasLokaliseToken = !!lokaliseToken;
      updateButtonsState();
      showToast(t('credentials_saved'), 'success');
      credentialsModalRequired = false;
      closeCredentialsModal();
    } else {
      showToast(data.message || t('credentials_required'), 'error');
    }
  } catch (error) {
    showToast(error.message || t('credentials_required'), 'error');
  }
}

function loadStoredCredentials() {
  try {
    const raw = localStorage.getItem(credentialsStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      deepseekKey: (parsed.deepseekKey || '').trim(),
      lokaliseToken: (parsed.lokaliseToken || '').trim()
    };
  } catch {
    return null;
  }
}

function saveStoredCredentials({ deepseekKey, lokaliseToken }) {
  const safeDeepseekKey = (deepseekKey || '').trim();
  const safeLokaliseToken = (lokaliseToken || '').trim();
  if (!safeDeepseekKey && !safeLokaliseToken) {
    localStorage.removeItem(credentialsStorageKey);
    return;
  }
  localStorage.setItem(credentialsStorageKey, JSON.stringify({
    deepseekKey: safeDeepseekKey,
    lokaliseToken: safeLokaliseToken
  }));
}

function setStepStatus(id, statusKey, className) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = t(statusKey);
  el.classList.remove('success', 'warning', 'error');
  if (className) el.classList.add(className);
}

function updateStepStatuses() {
  // Step 1: Load CDN
  if (cdnLoaded) {
    setStepStatus('stepStatusLoad', 'step_done', 'success');
  } else {
    setStepStatus('stepStatusLoad', 'step_waiting');
  }
  
  // Step 2: Scan
  if (!cdnLoaded) {
    setStepStatus('stepStatusScan', 'step_blocked', 'warning');
  } else if (lastScanOk) {
    setStepStatus('stepStatusScan', 'step_done', 'success');
  } else {
    setStepStatus('stepStatusScan', 'step_waiting');
  }
  
  // Step 3: Check
  if (!lastScanOk) {
    setStepStatus('stepStatusCheck', 'step_blocked', 'warning');
  } else if (lastCheckResult) {
    setStepStatus('stepStatusCheck', 'step_done', 'success');
  } else {
    setStepStatus('stepStatusCheck', 'step_waiting');
  }
  
  // Step 4: Update
  if (!lastCheckResult) {
    setStepStatus('stepStatusUpdate', 'step_blocked', 'warning');
  } else {
    setStepStatus('stepStatusUpdate', 'step_waiting');
  }
}

function toggleCollapse(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.classList.toggle('collapsed');
}

function collapseIfComplete(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.classList.add('collapsed');
}

// ============================
// API Functions
// ============================
async function checkConfig() {
  try {
    const response = await fetch('/api/config');
    const data = await response.json();
    
    const statusDot = document.getElementById('configStatus');
    const statusText = document.getElementById('configStatusText');
    
    if (data.success) {
      configState = {
        hasDeepseekKey: !!data.hasDeepseekKey,
        hasLokaliseToken: !!data.hasLokaliseToken,
        lokaliseProjectId: data.lokaliseProjectId || '',
        lokaliseDefaultTag: data.lokaliseDefaultTag || ''
      };
      updateConfigDefaults();
      updateButtonsState();
      const stored = loadStoredCredentials();
      const hasStoredDeepseek = !!stored?.deepseekKey;
      const hasStoredLokalise = !!stored?.lokaliseToken;
      if ((!configState.hasDeepseekKey || !configState.hasLokaliseToken) &&
          !(hasStoredDeepseek && hasStoredLokalise)) {
        openCredentialsModal(true);
      }

      statusDot.className = 'status-dot success';
      statusText.textContent = t('config_ready');
      
      // Show CDN sources with selection
      renderCdnSources(data.cdnSources);
    } else {
      statusDot.className = 'status-dot error';
      statusText.textContent = t('config_error');
      showToast(data.message, 'error');
    }
  } catch (error) {
    document.getElementById('configStatus').className = 'status-dot error';
    document.getElementById('configStatusText').textContent = t('config_error');
    showToast(error.message, 'error');
  }
}

async function loadCDN() {
  const btn = document.getElementById('loadCdnBtn');
  const resultEl = document.getElementById('cdnResult');
  
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('loading_cdn')}</span>`;
  setStepStatus('stepStatusLoad', 'step_running');
  
  try {
    const selectedSources = getSelectedCdnSources();
    if (selectedSources.length === 0) {
      showToast(t('cdn_select_required'), 'warning');
      setStepStatus('stepStatusLoad', 'step_failed', 'error');
      resultEl.textContent = t('cdn_select_required');
      resultEl.className = 'result-info show error';
      return false;
    }
    const response = await fetch('/api/load-cdn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedSources })
    });
    const data = await response.json();
    
    if (data.success) {
      cdnLoaded = true;
      updateButtonsState();
      resultEl.textContent = t('cdn_loaded', { en: data.enCount, cn: data.cnCount });
      resultEl.className = 'result-info show success';
      document.getElementById('scanBtn').disabled = false;
      showToast(t('cdn_loaded', { en: data.enCount, cn: data.cnCount }), 'success');
      collapseIfComplete('stepCardLoad');
      return true;
    } else {
      cdnLoaded = false;
      updateButtonsState();
      setStepStatus('stepStatusLoad', 'step_failed', 'error');
      resultEl.textContent = data.message;
      resultEl.className = 'result-info show error';
      showToast(t('cdn_load_failed'), 'error');
      lastScanOk = false;
      lastCheckResult = null;
      lastTranslations = null;
      updateButtonsState();
      return false;
    }
  } catch (error) {
    cdnLoaded = false;
    updateButtonsState();
    setStepStatus('stepStatusLoad', 'step_failed', 'error');
    resultEl.textContent = error.message;
    resultEl.className = 'result-info show error';
    showToast(t('cdn_load_failed'), 'error');
    lastScanOk = false;
    lastCheckResult = null;
    lastTranslations = null;
    updateButtonsState();
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">📥</span><span data-i18n="load_data">${t('load_data')}</span>`;
  }
}

async function scanDirectory() {
  const btn = document.getElementById('scanBtn');
  const resultEl = document.getElementById('scanResult');
  const directory = document.getElementById('scanDirectory').value.trim();
  
  if (!directory) {
    showToast(t('directory_required'), 'warning');
    return;
  }
  
  if (!cdnLoaded) {
    showToast(t('please_load_cdn_first'), 'warning');
    return false;
  }
  
  // Reset right-side results on re-scan
  document.getElementById('statsGrid').style.display = 'none';
  document.getElementById('actionBar').style.display = 'none';
  document.getElementById('replaceSection').style.display = 'none';
  document.getElementById('missingSection').style.display = 'none';
  document.getElementById('translationSection').style.display = 'none';
  document.getElementById('replaceSection').classList.add('collapsed');
  document.getElementById('missingSection').classList.add('collapsed');
  document.getElementById('translationSection').classList.add('collapsed');
  document.getElementById('resultsContainer').style.display = 'block';
  document.getElementById('translationList').innerHTML = '';
  document.getElementById('missingList').innerHTML = '';
  document.getElementById('replaceList').innerHTML = '';
  document.getElementById('translationCount').textContent = '0';
  document.getElementById('missingCount').textContent = '0';
  document.getElementById('replaceCount').textContent = '0';
  lastCheckResult = null;
  lastTranslations = null;
  updateButtonsState();
  
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('scanning')}</span>`;
  setStepStatus('stepStatusScan', 'step_running');
  
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ directory })
    });
    const data = await response.json();
    
    if (data.success) {
      // Save to recent directories
      saveRecentDir(directory);
      lastScanOk = true;
      lastCheckResult = null;
      lastTranslations = null;
      updateButtonsState();
      
      resultEl.textContent = t('scan_complete', { files: data.totalFiles, texts: data.uniqueTexts });
      resultEl.className = 'result-info show success';
      document.getElementById('checkBtn').disabled = false;
      showToast(t('scan_complete', { files: data.totalFiles, texts: data.uniqueTexts }), 'success');
      collapseIfComplete('stepCardScan');
      return true;
    } else {
      lastScanOk = false;
      updateButtonsState();
      setStepStatus('stepStatusScan', 'step_failed', 'error');
      resultEl.textContent = data.message;
      resultEl.className = 'result-info show error';
      showToast(t('scan_failed'), 'error');
      return false;
    }
  } catch (error) {
    lastScanOk = false;
    updateButtonsState();
    setStepStatus('stepStatusScan', 'step_failed', 'error');
    resultEl.textContent = error.message;
    resultEl.className = 'result-info show error';
    showToast(t('scan_failed'), 'error');
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">🔍</span><span data-i18n="start_scan">${t('start_scan')}</span>`;
  }
}

async function checkTranslation() {
  const btn = document.getElementById('checkBtn');
  const resultEl = document.getElementById('checkSummary');
  
  if (!cdnLoaded) {
    showToast(t('please_load_cdn_first'), 'warning');
    return false;
  }
  
  if (!lastScanOk) {
    showToast(t('please_scan_first'), 'warning');
    return false;
  }
  
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('checking')}</span>`;
  setStepStatus('stepStatusCheck', 'step_running');
  
  try {
    const response = await fetch('/api/check', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      lastCheckResult = data;
      updateButtonsState();
      resultEl.textContent = t('check_complete');
      resultEl.className = 'result-info show success';
      
      // Update stats
      document.getElementById('statsGrid').style.display = 'grid';
      document.getElementById('actionBar').style.display = 'flex';
      document.getElementById('statExisting').textContent = data.summary.existingCount;
      document.getElementById('statReplace').textContent = data.summary.needReplaceCount || 0;
      document.getElementById('statMissing').textContent = data.summary.missingCount;
      document.getElementById('statTotal').textContent = data.summary.totalKeys;
      
      // Hide empty state
      document.getElementById('resultsContainer').style.display = 'none';
      
      // Show replace section
      if (data.needReplace && data.needReplace.length > 0) {
        document.getElementById('replaceSection').style.display = 'block';
        document.getElementById('replaceCount').textContent = data.needReplace.length;
        document.getElementById('replaceBtn').disabled = false;
        document.getElementById('replaceSection').classList.remove('collapsed');
        
        const replaceList = document.getElementById('replaceList');
        replaceList.innerHTML = data.needReplace.map(item => `
          <div class="result-item">
            <div>
              <div class="result-text">
                <span>$t('${item.text}')</span>
                <span class="result-arrow">→</span>
                <span class="result-key">$t('${item.key}')</span>
              </div>
              <div class="result-location">📄 ${item.locations.map(l => `${l.file}:${l.line}`).join(', ')}${item.totalLocations > 3 ? ` (+${item.totalLocations - 3})` : ''}</div>
            </div>
          </div>
        `).join('');
      }
      
      // Show missing section
      if (data.missing && data.missing.length > 0) {
        document.getElementById('missingSection').style.display = 'block';
        document.getElementById('missingCount').textContent = data.missing.length;
        document.getElementById('translateBtn').disabled = false;
        document.getElementById('missingSection').classList.remove('collapsed');
        
        const missingList = document.getElementById('missingList');
        missingList.innerHTML = data.missing.map(item => `
          <div class="result-item">
            <div>
              <div class="result-text">${item.text}</div>
              <div class="result-location">📄 ${item.locations.map(l => `${l.file}:${l.line}`).join(', ')}${item.totalLocations > 3 ? ` (+${item.totalLocations - 3})` : ''}</div>
            </div>
          </div>
        `).join('');
      }
      
      showToast(t('check_complete'), 'success');
      collapseIfComplete('stepCardCheck');
      return true;
    } else {
      lastCheckResult = null;
      updateButtonsState();
      setStepStatus('stepStatusCheck', 'step_failed', 'error');
      resultEl.textContent = data.message;
      resultEl.className = 'result-info show error';
      showToast(data.message, 'error');
      return false;
    }
  } catch (error) {
    lastCheckResult = null;
    updateButtonsState();
    setStepStatus('stepStatusCheck', 'step_failed', 'error');
    resultEl.textContent = error.message;
    resultEl.className = 'result-info show error';
    showToast(error.message, 'error');
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">✅</span><span data-i18n="start_check">${t('start_check')}</span>`;
  }
}

async function executeReplace() {
  if (!lastCheckResult) {
    showToast(t('please_check_first'), 'warning');
    return false;
  }
  const replaceCount = lastCheckResult?.needReplace?.length || 0;
  if (replaceCount === 0) {
    showToast(t('no_items_to_replace'), 'info');
    return false;
  }
  
  const confirmReplace = await showConfirm(t('confirm_replace', { count: replaceCount }));
  if (!confirmReplace) {
    return false;
  }

  const btn = document.getElementById('replaceBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('execute_replace')}</span>`;
  
  try {
    const response = await fetch('/api/replace', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      showToast(t('replace_success', { count: data.totalChanges }), 'success');
      // Refresh check results
      await checkTranslation();
      return true;
    } else {
      showToast(data.message || t('replace_failed'), 'error');
      return false;
    }
  } catch (error) {
    showToast(t('replace_failed'), 'error');
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">🔄</span><span data-i18n="execute_replace">${t('execute_replace')}</span>`;
  }
}

async function translateMissing() {
  if (!lastCheckResult) {
    showToast(t('please_check_first'), 'warning');
    return false;
  }
  const missingCount = lastCheckResult?.missing?.length || 0;
  if (missingCount === 0) {
    showToast(t('no_items_to_translate'), 'info');
    return false;
  }
  
  if (!configState.hasDeepseekKey) {
    openCredentialsModal(true);
    showToast(t('credentials_required'), 'warning');
    return false;
  }

  const confirmTranslate = await showConfirm(t('confirm_translate', { count: missingCount }));
  if (!confirmTranslate) {
    return false;
  }

  const btn = document.getElementById('translateBtn');
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('ai_translate')}</span>`;
  
  try {
    const response = await fetch('/api/translate', { method: 'POST' });
    const data = await response.json();
    
    if (data.success) {
      lastTranslations = data.translations;
      updateButtonsState();
      showToast(t('translate_success', { count: data.translations.length }), 'success');
      
      // Show translation results
      document.getElementById('translationSection').style.display = 'block';
      document.getElementById('translationCount').textContent = `${data.translations.length}/${data.translations.length}`;
      document.getElementById('uploadBtn').disabled = false;
      document.getElementById('translationSection').classList.remove('collapsed');
      
      const translationList = document.getElementById('translationList');
      translationList.innerHTML = data.translations.map((item, idx) => `
        <div class="result-item">
          <div class="translation-item">
            <input type="checkbox" class="translation-checkbox" data-index="${idx}" checked onchange="syncSelectAllCheckbox()">
            <div class="translation-fields">
              <div class="translation-field">
                <span class="translation-label">EN</span>
                <input class="translation-input en" data-index="${idx}" data-lang="en" value="${escapeAttr(item.en)}">
              </div>
              <div class="translation-field">
                <span class="translation-label">CN</span>
                <input class="translation-input cn" data-index="${idx}" data-lang="cn" value="${escapeAttr(item.cn)}">
              </div>
              <div class="translation-field">
                <span class="translation-label">JP</span>
                <input class="translation-input jp" data-index="${idx}" data-lang="jp" value="${escapeAttr(item.jp)}">
              </div>
            </div>
          </div>
        </div>
      `).join('');
      document.getElementById('translationSelectAll').checked = true;
      updateTranslationCount();
      return true;
    } else {
      lastTranslations = null;
      updateButtonsState();
      showToast(data.message || t('translate_failed'), 'error');
      return false;
    }
  } catch (error) {
    lastTranslations = null;
    updateButtonsState();
    showToast(t('translate_failed'), 'error');
    return false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">🤖</span><span data-i18n="ai_translate">${t('ai_translate')}</span>`;
  }
}

async function showUploadModal() {
  document.getElementById('uploadModal').classList.add('show');
  updateModalOpenState();
  
  // Load projects
  const select = document.getElementById('projectSelect');
  select.innerHTML = `<option value="">${t('loading')}</option>`;
  const uploadTagInput = document.getElementById('uploadTag');
  if (uploadTagInput && !uploadTagInput.value) {
    uploadTagInput.value = 'common1';
  }
  
  try {
    const response = await fetch('/api/lokalise/projects');
    const data = await response.json();
    
    if (data.success) {
      select.innerHTML = data.projects.map(p => 
        `<option value="${p.id}">${p.name}</option>`
      ).join('');
    } else {
      select.innerHTML = `<option value="">${data.message}</option>`;
    }
  } catch (error) {
    select.innerHTML = `<option value="">Error loading projects</option>`;
  }
}

function hideUploadModal() {
  document.getElementById('uploadModal').classList.remove('show');
  updateModalOpenState();
}

async function executeUpload() {
  if (!lastTranslations?.length) {
    showToast(t('please_translate_first'), 'warning');
    return;
  }
  
  if (!configState.hasLokaliseToken) {
    showToast(t('upload_failed'), 'error');
    return;
  }
  
  const projectId = document.getElementById('projectSelect').value;
  const tag = document.getElementById('uploadTag')?.value?.trim() || 'common1';
  
  if (!projectId) {
    showToast(t('select_project'), 'warning');
    return;
  }
  
  const confirmUpload = await showConfirm(t('confirm_upload'));
  if (!confirmUpload) {
    return;
  }

  const selectedTranslations = getSelectedTranslations();
  if (selectedTranslations.length === 0) {
    showToast(t('no_items_selected'), 'warning');
    return;
  }
  
  await executeUploadWithOptions(projectId, tag, selectedTranslations);
  hideUploadModal();
}

async function executeUploadWithOptions(projectId, tag, translations = null) {
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, tag, translations })
    });
    const data = await response.json();
    
    if (data.success) {
      showToast(t('upload_success'), 'success');
      return true;
    } else {
      showToast(data.message || t('upload_failed'), 'error');
      return false;
    }
  } catch (error) {
    showToast(t('upload_failed'), 'error');
    return false;
  }
}

// ============================
// Recent Directories & Favorites
// ============================
function getRecentDirs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_DIRS)) || [];
  } catch {
    return [];
  }
}

function saveRecentDir(dir) {
  let recent = getRecentDirs();
  // Remove if exists
  recent = recent.filter(d => d !== dir);
  // Add to front
  recent.unshift(dir);
  // Keep max
  recent = recent.slice(0, MAX_RECENT_DIRS);
  localStorage.setItem(STORAGE_KEYS.RECENT_DIRS, JSON.stringify(recent));
  renderRecentDirs();
}

function removeRecentDir(dir, event) {
  event.stopPropagation();
  let recent = getRecentDirs();
  recent = recent.filter(d => d !== dir);
  localStorage.setItem(STORAGE_KEYS.RECENT_DIRS, JSON.stringify(recent));
  renderRecentDirs();
}

function clearRecentDirs() {
  localStorage.removeItem(STORAGE_KEYS.RECENT_DIRS);
  renderRecentDirs();
  hideRecentDirs();
}

function renderRecentDirs() {
  const list = document.getElementById('recentDirsList');
  const recent = getRecentDirs();
  
  if (recent.length === 0) {
    list.innerHTML = `<div class="dropdown-empty" data-i18n="no_recent">${t('no_recent')}</div>`;
    return;
  }

  list.innerHTML = '';
  recent.forEach(dir => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.addEventListener('click', () => selectRecentDir(dir));

    const icon = document.createElement('span');
    icon.className = 'dropdown-item-icon';
    icon.textContent = '📁';

    const text = document.createElement('span');
    text.className = 'dropdown-item-text';
    text.textContent = shortenPath(dir);
    text.title = dir;

    const del = document.createElement('button');
    del.className = 'dropdown-item-delete';
    del.title = 'Remove';
    del.textContent = '×';
    del.addEventListener('click', (event) => removeRecentDir(dir, event));

    item.appendChild(icon);
    item.appendChild(text);
    item.appendChild(del);
    list.appendChild(item);
  });
}

function selectRecentDir(dir) {
  document.getElementById('scanDirectory').value = dir;
  hideRecentDirs();
}

function toggleRecentDirs() {
  const dropdown = document.getElementById('recentDirsDropdown');
  dropdown.classList.toggle('show');
  if (dropdown.classList.contains('show')) {
    renderRecentDirs();
  }
}

function hideRecentDirs() {
  document.getElementById('recentDirsDropdown').classList.remove('show');
}

// Favorites
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
  } catch {
    return [];
  }
}

function addToFavorites() {
  const dir = document.getElementById('scanDirectory').value.trim();
  if (!dir) {
    showToast(t('directory_required'), 'warning');
    return;
  }
  
  let favorites = getFavorites();
  if (favorites.includes(dir)) {
    showToast(t('added_to_favorites'), 'info');
    return;
  }
  
  favorites.push(dir);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  renderFavorites();
  showToast(t('added_to_favorites'), 'success');
}

function removeFavorite(dir, event) {
  event.stopPropagation();
  let favorites = getFavorites();
  favorites = favorites.filter(d => d !== dir);
  localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  renderFavorites();
  showToast(t('removed_from_favorites'), 'info');
}

function selectFavorite(dir) {
  document.getElementById('scanDirectory').value = dir;
}

function renderFavorites() {
  const section = document.getElementById('favoritesSection');
  const list = document.getElementById('favoritesList');
  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  list.innerHTML = '';
  favorites.forEach(dir => {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    item.addEventListener('click', () => selectFavorite(dir));

    const text = document.createElement('span');
    text.className = 'favorite-item-text';
    text.textContent = shortenPath(dir, 25);
    text.title = dir;

    const del = document.createElement('button');
    del.className = 'favorite-item-delete';
    del.title = 'Remove';
    del.textContent = '×';
    del.addEventListener('click', (event) => removeFavorite(dir, event));

    item.appendChild(text);
    item.appendChild(del);
    list.appendChild(item);
  });
}

// Utility functions
function shortenPath(path, maxLen = 40) {
  if (path.length <= maxLen) return path;
  
  const parts = path.split(/[/\\]/);
  if (parts.length <= 3) return path;
  
  const first = parts[0];
  const last = parts.slice(-2).join('/');
  return `${first}/.../${last}`;
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (text) {
      document.getElementById('scanDirectory').value = text.trim();
      showToast(t('copied_to_input'), 'success');
    }
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    showToast('Clipboard access denied', 'error');
  }
}

// ============================
// Directory Browser
// ============================
let currentBrowsePath = '';
let selectedDirPath = '';
let parentDirPath = null;
let dirHistory = [];
let dirHistoryIndex = -1;
let isNavigatingHistory = false;

async function openDirBrowser() {
  document.getElementById('dirBrowserModal').classList.add('show');
  updateModalOpenState();
  selectedDirPath = '';
  document.getElementById('selectedPathDisplay').textContent = '-';
  
  // Reset history
  dirHistory = [];
  dirHistoryIndex = -1;
  updateHistoryButtons();
  
  // Load drives/quick access
  await loadDrives();
  
  // Start from user's home directory or existing value
  const existingPath = document.getElementById('scanDirectory').value.trim();
  if (existingPath) {
    await browseDirectory(existingPath);
  } else {
    await loadDrives();
    // Show empty state initially
    document.getElementById('dirList').innerHTML = `<div class="dir-empty" data-i18n="no_folders">${t('no_folders')}</div>`;
    document.getElementById('currentPathText').textContent = '-';
    document.getElementById('breadcrumbList').innerHTML = '';
  }
}

function closeDirBrowser() {
  document.getElementById('dirBrowserModal').classList.remove('show');
  updateModalOpenState();
}

async function loadDrives() {
  try {
    const response = await fetch('/api/browse/drives');
    const data = await response.json();
    
    if (data.success) {
      const drivesList = document.getElementById('drivesList');
      drivesList.innerHTML = data.drives.map(drive => `
        <div class="dir-drive-item" onclick="browseDirectory('${escapeHtml(drive.path)}')">
          <span class="drive-icon">${drive.type === 'drive' ? '💾' : drive.type === 'home' ? '🏠' : '📁'}</span>
          <span>${drive.name}</span>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Failed to load drives:', error);
  }
}

async function browseDirectory(dirPath, addToHistory = true) {
  const dirList = document.getElementById('dirList');
  dirList.innerHTML = `<div class="dir-loading" data-i18n="loading">${t('loading')}</div>`;
  
  try {
    const response = await fetch(`/api/browse?path=${encodeURIComponent(dirPath)}`);
    const data = await response.json();
    
    if (data.success) {
      currentBrowsePath = data.currentPath;
      parentDirPath = data.parent;
      
      // Update history
      if (addToHistory && !isNavigatingHistory) {
        // Remove forward history when navigating to new path
        if (dirHistoryIndex < dirHistory.length - 1) {
          dirHistory = dirHistory.slice(0, dirHistoryIndex + 1);
        }
        dirHistory.push(data.currentPath);
        dirHistoryIndex = dirHistory.length - 1;
        updateHistoryButtons();
      }
      isNavigatingHistory = false;
      
      // Update UI
      document.getElementById('currentPathText').textContent = data.currentPath;
      document.getElementById('parentDirBtn').disabled = !data.parent;
      
      // Update breadcrumb
      updateBreadcrumb(data.currentPath);
      
      // Select current path by default
      selectedDirPath = data.currentPath;
      document.getElementById('selectedPathDisplay').textContent = data.currentPath;
      
      if (data.directories.length === 0) {
        dirList.innerHTML = `<div class="dir-empty" data-i18n="no_folders">${t('no_folders')}</div>`;
      } else {
        dirList.innerHTML = data.directories.map(dir => `
          <div class="dir-item" onclick="selectDirectory(this, '${escapeHtml(dir.path)}')" ondblclick="enterDirectory('${escapeHtml(dir.path)}')">
            <span class="dir-item-icon">📁</span>
            <span class="dir-item-name" title="${escapeHtml(dir.path)}">${escapeHtml(dir.name)}</span>
            <button class="dir-item-enter" onclick="event.stopPropagation(); enterDirectory('${escapeHtml(dir.path)}')" data-i18n="enter_folder">${t('enter_folder')}</button>
          </div>
        `).join('');
      }
    } else {
      dirList.innerHTML = `<div class="dir-empty">${data.message}</div>`;
    }
  } catch (error) {
    dirList.innerHTML = `<div class="dir-empty">Error: ${error.message}</div>`;
  }
}

function selectDirectory(element, dirPath) {
  // Remove previous selection
  document.querySelectorAll('.dir-item.selected').forEach(el => el.classList.remove('selected'));
  
  // Add selection to clicked item
  element.classList.add('selected');
  selectedDirPath = dirPath;
  document.getElementById('selectedPathDisplay').textContent = dirPath;
}

function goToParentDir() {
  if (parentDirPath) {
    browseDirectory(parentDirPath);
  }
}

function goBackDir() {
  if (dirHistoryIndex > 0) {
    isNavigatingHistory = true;
    dirHistoryIndex--;
    updateHistoryButtons();
    browseDirectory(dirHistory[dirHistoryIndex], false);
  }
}

function goForwardDir() {
  if (dirHistoryIndex < dirHistory.length - 1) {
    isNavigatingHistory = true;
    dirHistoryIndex++;
    updateHistoryButtons();
    browseDirectory(dirHistory[dirHistoryIndex], false);
  }
}

function updateHistoryButtons() {
  document.getElementById('backDirBtn').disabled = dirHistoryIndex <= 0;
  document.getElementById('forwardDirBtn').disabled = dirHistoryIndex >= dirHistory.length - 1;
}

function updateBreadcrumb(dirPath) {
  const breadcrumbList = document.getElementById('breadcrumbList');
  
  // Parse path into segments
  const isWindows = dirPath.includes('\\') || /^[A-Z]:/.test(dirPath);
  const separator = isWindows ? '\\' : '/';
  const parts = dirPath.split(/[/\\]/).filter(Boolean);
  
  let breadcrumbHtml = '';
  let currentPath = '';
  
  if (isWindows) {
    // Windows: Start with drive letter
    if (parts.length > 0 && /^[A-Z]:$/i.test(parts[0])) {
      currentPath = parts[0] + '\\';
      breadcrumbHtml += `
        <div class="breadcrumb-item">
          <button class="breadcrumb-link${parts.length === 1 ? ' active' : ''}" onclick="browseDirectory('${escapeHtml(currentPath)}')">${parts[0]}</button>
        </div>
      `;
      parts.shift();
    }
  } else {
    // Unix: Start with root
    currentPath = '/';
    breadcrumbHtml += `
      <div class="breadcrumb-item">
        <button class="breadcrumb-link${parts.length === 0 ? ' active' : ''}" onclick="browseDirectory('/')">/</button>
      </div>
    `;
  }
  
  // Add each path segment
  parts.forEach((part, index) => {
    currentPath = isWindows 
      ? (currentPath + (currentPath.endsWith('\\') ? '' : '\\') + part)
      : (currentPath + (currentPath.endsWith('/') ? '' : '/') + part);
    
    const isLast = index === parts.length - 1;
    breadcrumbHtml += `
      <div class="breadcrumb-item">
        <span class="breadcrumb-sep">›</span>
        <button class="breadcrumb-link${isLast ? ' active' : ''}" onclick="browseDirectory('${escapeHtml(currentPath)}')">${part}</button>
      </div>
    `;
  });
  
  breadcrumbList.innerHTML = breadcrumbHtml;
  
  // Scroll to end
  const breadcrumb = document.getElementById('dirBreadcrumb');
  breadcrumb.scrollLeft = breadcrumb.scrollWidth;
}

function enterDirectory(dirPath) {
  browseDirectory(dirPath);
}

function confirmDirSelection() {
  if (selectedDirPath) {
    document.getElementById('scanDirectory').value = selectedDirPath;
    closeDirBrowser();
    showToast(t('copied_to_input'), 'success');
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  // Escape backslashes first (for Windows paths), then quotes
  return div.innerHTML
    .replace(/\\/g, '\\\\')  // Escape backslashes for JS strings
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getSelectedTranslations() {
  const selected = [];
  const checkboxes = document.querySelectorAll('.translation-checkbox');
  checkboxes.forEach(cb => {
    if (!cb.checked) return;
    const idx = cb.dataset.index;
    const en = document.querySelector(`.translation-input[data-index="${idx}"][data-lang="en"]`)?.value?.trim();
    const cn = document.querySelector(`.translation-input[data-index="${idx}"][data-lang="cn"]`)?.value?.trim();
    const jp = document.querySelector(`.translation-input[data-index="${idx}"][data-lang="jp"]`)?.value?.trim();
    if (en || cn || jp) {
      selected.push({ en: en || '', cn: cn || '', jp: jp || '' });
    }
  });
  return selected;
}

function getSelectedTranslationCount() {
  return document.querySelectorAll('.translation-checkbox:checked').length;
}

function exportMissing() {
  const missing = lastCheckResult?.missing || [];
  if (!missing.length) {
    showToast(t('no_items_to_translate'), 'info');
    return;
  }
  const lines = missing.map(item => item.text).filter(Boolean);
  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'untranslated.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(t('export_missing_done'), 'success');
}

function updateTranslationCount() {
  const total = document.querySelectorAll('.translation-checkbox').length;
  const selected = document.querySelectorAll('.translation-checkbox:checked').length;
  const badge = document.getElementById('translationCount');
  if (badge) {
    badge.textContent = `${selected}/${total}`;
  }
  updateButtonsState();
}

function toggleSelectAllTranslations(checkbox) {
  const checkboxes = document.querySelectorAll('.translation-checkbox');
  checkboxes.forEach(cb => { cb.checked = checkbox.checked; });
  updateTranslationCount();
}

function syncSelectAllCheckbox() {
  const selectAll = document.getElementById('translationSelectAll');
  if (!selectAll) return;
  const total = document.querySelectorAll('.translation-checkbox').length;
  const selected = document.querySelectorAll('.translation-checkbox:checked').length;
  selectAll.checked = total > 0 && total === selected;
  updateTranslationCount();
}

// ============================
// Update Flow (CLI-compatible)
// ============================
function updateConfigDefaults() {
  const tagInput = document.getElementById('updateTag');
  if (tagInput && configState.lokaliseDefaultTag && !tagInput.value) {
    tagInput.value = configState.lokaliseDefaultTag;
  }
  
  const projectSelect = document.getElementById('updateProjectSelect');
  if (!projectSelect) return;
  if (projectSelect.dataset.hasProjects === 'true') return;
  
  const defaultId = configState.lokaliseProjectId || '';
  projectSelect.innerHTML = '';
  if (defaultId) {
    projectSelect.innerHTML = `
      <option value="${defaultId}">${defaultId} (${t('use_default_project')})</option>
      <option value="">${t('project_optional')}</option>
    `;
  } else {
    projectSelect.innerHTML = `<option value="">${t('project_optional')}</option>`;
  }
  projectSelect.dataset.hasProjects = 'false';
}

async function loadProjectsForUpdate() {
  const select = document.getElementById('updateProjectSelect');
  if (!select) return;
  
  select.innerHTML = `<option value="">${t('loading')}</option>`;
  
  try {
    const response = await fetch('/api/lokalise/projects');
    const data = await response.json();
    
    if (data.success) {
      select.innerHTML = data.projects.map(p => 
        `<option value="${p.id}">${p.name} (${p.id})</option>`
      ).join('');
      select.dataset.hasProjects = 'true';
    } else {
      select.innerHTML = `<option value="">${data.message}</option>`;
      select.dataset.hasProjects = 'false';
    }
  } catch (error) {
    select.innerHTML = `<option value="">Error loading projects</option>`;
    select.dataset.hasProjects = 'false';
  }
}

let confirmResolver = null;

function showConfirm(message) {
  return new Promise(resolve => {
    confirmResolver = resolve;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmModal').classList.add('show');
    updateModalOpenState();
  });
}

function resolveConfirm(result) {
  if (confirmResolver) {
    confirmResolver(result);
  }
  closeConfirmModal();
}

function closeConfirmModal() {
  document.getElementById('confirmModal').classList.remove('show');
  updateModalOpenState();
  confirmResolver = null;
}

let projectPickerResolver = null;

async function showProjectPicker() {
  return new Promise(async resolve => {
    projectPickerResolver = resolve;
    const select = document.getElementById('projectPickerSelect');
    select.innerHTML = `<option value="">${t('loading')}</option>`;
    
    try {
      const response = await fetch('/api/lokalise/projects');
      const data = await response.json();
      
      if (data.success) {
        select.innerHTML = data.projects.map(p => 
          `<option value="${p.id}">${p.name} (${p.id})</option>`
        ).join('');
      } else {
        select.innerHTML = `<option value="">${data.message}</option>`;
      }
    } catch (error) {
      select.innerHTML = `<option value="">Error loading projects</option>`;
    }
    
    document.getElementById('projectPickerModal').classList.add('show');
    updateModalOpenState();
  });
}

function confirmProjectPicker() {
  const selected = document.getElementById('projectPickerSelect').value;
  if (projectPickerResolver) {
    projectPickerResolver(selected || null);
  }
  closeProjectPicker();
}

function closeProjectPicker() {
  document.getElementById('projectPickerModal').classList.remove('show');
  updateModalOpenState();
  if (projectPickerResolver) {
    projectPickerResolver(null);
  }
  projectPickerResolver = null;
}

async function runUpdateFlow() {
  const btn = document.getElementById('runUpdateBtn');
  const resultEl = document.getElementById('updateResult');
  const directory = document.getElementById('scanDirectory').value.trim();
  
  if (!directory) {
    showToast(t('directory_required'), 'warning');
    return;
  }
  
  const dryRun = document.getElementById('updateDryRun').checked;
  const skipTranslate = document.getElementById('updateSkipTranslate').checked;
  const skipUpload = document.getElementById('updateSkipUpload').checked;
  const tag = document.getElementById('updateTag').value.trim();
  let projectId = document.getElementById('updateProjectSelect').value || configState.lokaliseProjectId || '';
  
  btn.disabled = true;
  btn.innerHTML = `<span class="loading">${t('update_running')}</span>`;
  setStepStatus('stepStatusUpdate', 'step_running');
  
  try {
    const cdnOk = cdnLoaded ? true : await loadCDN();
    if (!cdnOk) throw new Error(t('cdn_load_failed'));
    
    const scanOk = await scanDirectory();
    if (!scanOk) throw new Error(t('scan_failed'));
    
    const checkOk = await checkTranslation();
    if (!checkOk) throw new Error(t('check_failed'));
    
    const checkResult = lastCheckResult;
    
    if (checkResult?.needReplace?.length) {
      const confirmReplace = await showConfirm(t('confirm_replace', { count: checkResult.needReplace.length }));
      if (confirmReplace) {
        if (dryRun) {
          showToast(t('dry_run_notice'), 'info');
        } else {
          await executeReplace();
        }
      }
    }
    
    if (checkResult?.missing?.length && !skipTranslate) {
      if (!configState.hasDeepseekKey) {
        showToast(t('deepseek_required'), 'error');
      } else {
        const confirmTranslate = await showConfirm(t('confirm_translate', { count: checkResult.missing.length }));
        if (confirmTranslate) {
          await translateMissing();
        }
      }
    }
    
    if (lastTranslations?.length && !skipUpload) {
      const confirmUpload = await showConfirm(t('confirm_upload'));
      if (confirmUpload) {
        if (!projectId) {
          projectId = await showProjectPicker();
        }
        
        if (!projectId) {
          showToast(t('project_required'), 'warning');
        } else {
          const selectedTranslations = getSelectedTranslations();
          if (selectedTranslations.length === 0) {
            showToast(t('no_items_selected'), 'warning');
          } else {
            await executeUploadWithOptions(projectId, tag, selectedTranslations);
          }
        }
      }
    }
    
    setStepStatus('stepStatusUpdate', 'step_done', 'success');
    resultEl.textContent = t('update_complete');
    resultEl.className = 'result-info show success';
    showToast(t('update_complete'), 'success');
    collapseIfComplete('stepCardUpdate');
  } catch (error) {
    setStepStatus('stepStatusUpdate', 'step_failed', 'error');
    resultEl.textContent = error.message || t('update_failed');
    resultEl.className = 'result-info show error';
    showToast(t('update_failed'), 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<span class="btn-icon">🚀</span><span data-i18n="run_update">${t('run_update')}</span>`;
  }
}

// ============================
// Initialize
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Set initial language
  setLanguage(currentLang);
  
  // Render favorites
  renderFavorites();
  
  // Enter key support for directory input
  document.getElementById('scanDirectory').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !document.getElementById('scanBtn').disabled) {
      scanDirectory();
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-with-dropdown')) {
      hideRecentDirs();
    }
  });
  
  // Auto load config + CDN on initial page load
  (async () => {
    const stored = loadStoredCredentials();
    if (stored && (stored.deepseekKey || stored.lokaliseToken)) {
      try {
        await fetch('/api/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stored)
        });
      } catch {
        // Ignore; user can re-save via modal
      }
    }
    await checkConfig();
    await loadCDN();
  })();
});
