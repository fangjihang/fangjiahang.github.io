
    /* ============================================================
       通用数据可视化大屏 · 白色液体玻璃风格 (Liquid Glass)
       支持任意 CSV 结构（考研/招聘/销售/电商等）
       ============================================================ */

    // ====== THEMES (4 套浅色液体玻璃主题 - 彩色光晕背景) ======
    const THEMES = {
      skyblue: {
        name: '天空蓝', primary: '#2563eb', accent: '#7c3aed',
        palette: ['#2563eb', '#7c3aed', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#8b5cf6'],
        bg1: 'radial-gradient(circle at 15% 20%, rgba(96,165,250,.45) 0%, transparent 42%), radial-gradient(circle at 85% 30%, rgba(167,139,250,.40) 0%, transparent 42%), radial-gradient(circle at 50% 85%, rgba(244,114,182,.30) 0%, transparent 45%), radial-gradient(circle at 25% 75%, rgba(110,231,183,.30) 0%, transparent 40%)',
        baseBg: 'linear-gradient(135deg, #f0f4fa 0%, #e8eef8 50%, #f5f3ff 100%)',
        primarySoft: 'rgba(37, 99, 235, 0.12)',
        kpiIconGrad: 'linear-gradient(135deg, rgba(96,165,250,0.3), rgba(167,139,250,0.3))'
      },
      rosegold: {
        name: '玫瑰金', primary: '#ec4899', accent: '#f59e0b',
        palette: ['#ec4899', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981', '#3b82f6', '#f97316'],
        bg1: 'radial-gradient(circle at 20% 25%, rgba(251,113,133,.40) 0%, transparent 42%), radial-gradient(circle at 80% 70%, rgba(251,191,36,.35) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(244,114,182,.25) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(196,181,253,.25) 0%, transparent 45%)',
        baseBg: 'linear-gradient(135deg, #fff5f7 0%, #fff1f2 50%, #fff7ed 100%)',
        primarySoft: 'rgba(236, 72, 153, 0.12)',
        kpiIconGrad: 'linear-gradient(135deg, rgba(251,113,133,0.3), rgba(251,191,36,0.3))'
      },
      emerald: {
        name: '翡翠绿', primary: '#10b981', accent: '#06b6d4',
        palette: ['#10b981', '#06b6d4', '#84cc16', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'],
        bg1: 'radial-gradient(circle at 25% 20%, rgba(16,185,129,.40) 0%, transparent 42%), radial-gradient(circle at 75% 75%, rgba(6,182,212,.35) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(132,204,22,.25) 0%, transparent 50%), radial-gradient(circle at 15% 80%, rgba(110,231,183,.30) 0%, transparent 45%)',
        baseBg: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
        primarySoft: 'rgba(16, 185, 129, 0.12)',
        kpiIconGrad: 'linear-gradient(135deg, rgba(110,231,183,0.3), rgba(6,182,212,0.3))'
      },
      sunset: {
        name: '暖阳橙', primary: '#f97316', accent: '#f59e0b',
        palette: ['#f97316', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#3b82f6'],
        bg1: 'radial-gradient(circle at 20% 30%, rgba(251,146,60,.45) 0%, transparent 42%), radial-gradient(circle at 80% 70%, rgba(251,191,36,.40) 0%, transparent 42%), radial-gradient(circle at 50% 50%, rgba(239,68,68,.25) 0%, transparent 50%), radial-gradient(circle at 70% 15%, rgba(196,181,253,.25) 0%, transparent 45%)',
        baseBg: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 50%, #fef3c7 100%)',
        primarySoft: 'rgba(249, 115, 22, 0.12)',
        kpiIconGrad: 'linear-gradient(135deg, rgba(251,146,60,0.3), rgba(251,191,36,0.3))'
      }
    };

    // ====== STATE ======
    let rawRows = [];
    let columns = [];
    let charts = [];
    let activeTheme = 'emerald';
    let config = null;
    let barFilter = null;
    let lineFilter = null;
    let highlightTimers = [];   // 动态高亮定时器
    let layoutSeed = null;      // 当前布局种子

    // ====== DOM ======
    const $overlay = document.getElementById('uploadOverlay');
    const $uploadBox = document.getElementById('uploadBox');
    const $fileInput = document.getElementById('fileInput');
    const $demoBtn = document.getElementById('demoBtn');
    const $header = document.getElementById('header');
    const $main = document.getElementById('main');
    const $dataBadge = document.getElementById('dataBadge');
    const $drawer = document.getElementById('configDrawer');
    const $backdrop = document.getElementById('backdrop');
    const $drawerBody = document.getElementById('drawerBody');
    const $configBtn = document.getElementById('configBtn');
    const $closeDrawer = document.getElementById('closeDrawer');
    const $applyCfg = document.getElementById('applyCfgBtn');
    const $autoCfg = document.getElementById('autoCfgBtn');
    const $reloadBtn = document.getElementById('reloadBtn');
    const $shuffleBtn = document.getElementById('shuffleBtn');
    const $bgLayer1 = document.getElementById('bgLayer1');
    const $dashTitle = document.getElementById('dashTitle');

    // ====== UPLOAD HANDLERS ======
    $uploadBox.addEventListener('click', e => { if (e.target.id !== 'demoBtn') $fileInput.click(); });
    $fileInput.addEventListener('change', e => { if (e.target.files[0]) loadFile(e.target.files[0]); });
    $uploadBox.addEventListener('dragover', e => { e.preventDefault(); $uploadBox.style.transform = 'translateY(-4px)'; });
    $uploadBox.addEventListener('dragleave', () => { $uploadBox.style.transform = ''; });
    $uploadBox.addEventListener('drop', e => {
      e.preventDefault(); $uploadBox.style.transform = '';
      const f = e.dataTransfer.files[0]; if (f) loadFile(f);
    });
    $demoBtn.addEventListener('click', e => { e.stopPropagation(); loadDemo(); });
    $configBtn.addEventListener('click', openDrawer);
    $closeDrawer.addEventListener('click', closeDrawer);
    $backdrop.addEventListener('click', closeDrawer);
    $applyCfg.addEventListener('click', () => { collectConfig(); applyConfig(); closeDrawer(); });
    $autoCfg.addEventListener('click', () => { autoSuggestConfig(); renderDrawer(); });
    $shuffleBtn.addEventListener('click', () => {
      if (rawRows.length) buildAll();
    });
    $reloadBtn.addEventListener('click', () => {
      $overlay.classList.remove('done');
      $header.style.display = 'none';
      $main.style.display = 'none';
      $fileInput.value = '';
    });

    function loadFile(file) {
      if (!file.name.toLowerCase().endsWith('.csv')) { alert('请上传 .csv 文件'); return; }
      Papa.parse(file, {
        header: true, encoding: 'UTF-8', skipEmptyLines: true,
        complete(r) {
          rawRows = r.data.filter(row => Object.values(row).some(v => v !== '' && v != null));
          if (!rawRows.length) { alert('CSV 为空'); return; }
          onRowsLoaded(file.name.replace(/\.csv$/i, ''));
        },
        error(e) { alert('解析失败: ' + e.message); }
      });
    }

    function loadDemo() {
      const csvText = `学校名称,985,211,双一流,普通院校,院系名称,专业,招生人数,学习方式,分数线
清华大学,是,是,是,不是,人文学院,哲学,4,全日制,370
清华大学,是,是,是,不是,社会科学学院,理论经济学,1,全日制,350
清华大学,是,是,是,不是,经济管理学院,金融,1,全日制,365
清华大学,是,是,是,不是,五道口金融学院,金融,35,全日制,365
北京大学,是,是,是,不是,光华管理学院,金融,30,全日制,380
北京大学,是,是,是,不是,经济学院,金融,25,全日制,360
北京大学,是,是,是,不是,法学院,法律,40,全日制,355
复旦大学,是,是,是,不是,经济学院,金融,28,全日制,370
复旦大学,是,是,是,不是,新闻学院,新闻学,20,全日制,365
上海交通大学,是,是,是,不是,安泰经管,金融,22,全日制,375
上海交通大学,是,是,是,不是,机械学院,机械工程,45,全日制,340
浙江大学,是,是,是,不是,经济学院,金融,30,全日制,365
浙江大学,是,是,是,不是,计算机学院,计算机,50,全日制,355
南京大学,是,是,是,不是,商学院,金融,25,全日制,370
南京大学,是,是,是,不是,物理学院,物理学,15,全日制,345
武汉大学,是,是,是,不是,经济管理学院,金融,35,全日制,360
武汉大学,是,是,是,不是,法学院,法律,40,全日制,355
中山大学,是,是,是,不是,岭南学院,金融,28,全日制,365
中山大学,是,是,是,不是,医学院,临床医学,60,全日制,350
同济大学,是,是,是,不是,经管学院,金融,20,全日制,360
同济大学,是,是,是,不是,建筑学院,建筑学,30,全日制,355
厦门大学,是,是,是,不是,经济学院,金融,32,全日制,360
厦门大学,是,是,是,不是,会计学院,会计学,40,全日制,365
四川大学,是,是,是,不是,经济学院,金融,25,全日制,355
四川大学,是,是,是,不是,华西医学院,临床医学,55,全日制,350
华中科技大学,是,是,是,不是,经济学院,金融,22,全日制,355
华中科技大学,是,是,是,不是,光电学院,光电信息,45,全日制,350
北京师范大学,是,是,是,不是,教育学部,教育学,35,全日制,355
北京师范大学,是,是,是,不是,心理学院,心理学,30,全日制,365
中国人民大学,是,是,是,不是,财政金融学院,金融,40,全日制,375
中国人民大学,是,是,是,不是,法学院,法律,45,全日制,365
南开大学,是,是,是,不是,经济学院,金融,28,全日制,365
南开大学,是,是,是,不是,数学学院,数学,20,全日制,345
天津大学,是,是,是,不是,经管学部,金融,18,全日制,360
天津大学,是,是,是,不是,化工学院,化学工程,40,全日制,345
山东大学,是,是,是,不是,经济学院,金融,30,全日制,355
山东大学,是,是,是,不是,医学院,临床医学,50,全日制,345
吉林大学,是,是,是,不是,经济学院,金融,32,全日制,350
吉林大学,是,是,是,不是,法学院,法律,45,全日制,345
中南大学,是,是,是,不是,商学院,金融,25,全日制,355
中南大学,是,是,是,不是,湘雅医学院,临床医学,55,全日制,348
西北农林科技大学,是,不是,不是,不是,农学院,农学,40,全日制,330
中央民族大学,是,不是,不是,不是,民族学与社会学学院,民族学,30,全日制,340
中国海洋大学,是,不是,不是,不是,海洋学院,海洋科学,40,全日制,335
东北大学,是,不是,不是,不是,工商管理学院,金融,25,全日制,345
东北大学,是,不是,不是,不是,计算机学院,计算机,40,全日制,350
湖南大学,是,不是,不是,不是,经济与贸易学院,金融,30,全日制,355
华东师范大学,是,不是,不是,不是,经济学院,金融,25,全日制,365
郑州大学,不是,是,是,不是,商学院,金融,35,全日制,345
郑州大学,不是,是,是,不是,医学院,临床医学,60,全日制,335
苏州大学,不是,是,是,不是,商学院,金融,28,全日制,350
上海大学,不是,是,是,不是,经济学院,金融,30,全日制,345
南昌大学,不是,是,是,不是,经济管理学院,金融,32,全日制,340
云南大学,不是,是,是,不是,经济学院,金融,28,全日制,335
新疆大学,不是,是,是,不是,经济与管理学院,金融,30,全日制,325
深圳大学,不是,不是,不是,是,经济学院,金融,35,全日制,355
深圳大学,不是,不是,不是,是,计算机学院,计算机,50,全日制,345
南方科技大学,不是,不是,不是,是,计算机学院,计算机,40,全日制,360
南方科技大学,不是,不是,不是,是,生物学院,生物学,30,全日制,350
上海科技大学,不是,不是,不是,是,信息学院,计算机,35,全日制,358
宁波大学,不是,不是,不是,是,商学院,金融,32,全日制,340
扬州大学,不是,不是,不是,是,商学院,金融,30,全日制,335
浙江工业大学,不是,不是,不是,是,经济学院,金融,28,全日制,338
北京工业大学,不是,不是,不是,是,经管学院,金融,25,全日制,345`;
      Papa.parse(csvText, {
        header: true, skipEmptyLines: true,
        complete(r) {
          rawRows = r.data.filter(row => Object.values(row).some(v => v !== '' && v != null));
          onRowsLoaded('考研示例数据');
        }
      });
    }

    function onRowsLoaded(name) {
      columns = detectColumns(rawRows);
      autoSuggestConfig();
      $dashTitle.innerHTML = escapeHtml(name) + '<span> · 可视化大屏</span>';
      $overlay.classList.add('done');
      $header.style.display = 'flex';
      $main.style.display = 'grid';
      $dataBadge.textContent = rawRows.length.toLocaleString() + ' 条 · ' + columns.length + ' 字段';
      applyTheme(activeTheme);
      buildAll();
    }

    // ====== COLUMN TYPE DETECTION ======
    function detectColumns(rows) {
      if (!rows.length) return [];
      const names = Object.keys(rows[0]);
      return names.map(name => {
        const vals = rows.map(r => r[name]).filter(v => v !== '' && v != null && v !== '--');
        const type = detectType(vals);
        const uniq = [...new Set(vals.map(v => String(v)))];
        return { name, type, uniqueCount: uniq.length, sample: vals.slice(0, 3) };
      });
    }

    function detectType(values) {
      if (!values.length) return 'categorical';
      const numOk = values.filter(v => !isNaN(Number(v)) && /^-?\d+\.?\d*$/.test(String(v).trim())).length;
      if (numOk / values.length > 0.85) return 'numeric';
      const dateOk = values.filter(v => {
        const s = String(v);
        if (!/[-/:年月日\s]/.test(s)) return false;
        const t = Date.parse(s);
        return !isNaN(t);
      }).length;
      if (dateOk / values.length > 0.85) return 'date';
      const uniq = new Set(values.map(v => String(v).toLowerCase()));
      if (uniq.size <= 2 && [...uniq].every(v => ['是', '否', 'true', 'false', 'yes', 'no', '0', '1', 'y', 'n', 't', 'f'].includes(v))) return 'boolean';
      if (uniq.size <= 30) return 'categorical';
      return 'text';
    }

    // ====== AUTO CONFIG SUGGESTION ======
    function autoSuggestConfig() {
      const numerics = columns.filter(c => c.type === 'numeric');
      const categoricals = columns.filter(c => c.type === 'categorical' || c.type === 'boolean');
      const dates = columns.filter(c => c.type === 'date');

      const kpiMetrics = [];
      for (let i = 0; i < 4; i++) {
        const col = numerics[i % Math.max(1, numerics.length)];
        if (col) kpiMetrics.push({ col: col.name, agg: i === 0 ? 'sum' : (i === 1 ? 'count' : (i === 2 ? 'mean' : 'max')) });
        else kpiMetrics.push({ col: '', agg: 'count' });
      }

      const barDim = categoricals[0]?.name || columns[0]?.name || '';
      const barMet = numerics[0]?.name || '';
      const barFilterDim = categoricals[1]?.name || '';

      let pieDim = categoricals[0]?.name || '';
      for (const c of categoricals) {
        if (c.uniqueCount >= 2 && c.uniqueCount <= 10) { pieDim = c.name; break; }
      }

      const lineX = dates[0]?.name || categoricals[0]?.name || '';
      const lineMet = numerics[0]?.name || '';
      const lineFilterDim = categoricals[2]?.name || '';

      const scatterX = numerics[0]?.name || '';
      const scatterY = numerics[1]?.name || numerics[0]?.name || '';
      const scatterColor = categoricals[0]?.name || '';

      const groupCat = categoricals[0]?.name || '';
      const groupDim = categoricals[1]?.name || '';
      const groupMet = numerics[0]?.name || '';

      const rankDim = categoricals[0]?.name || '';
      const rankMet = numerics[0]?.name || '';
      const rankAgg = 'sum';

      config = {
        kpi: kpiMetrics,
        bar: { dim: barDim, met: barMet, agg: 'sum', top: 10, filterDim: barFilterDim },
        pie: { dim: pieDim, met: barMet, agg: 'sum' },
        line: { x: lineX, met: lineMet, agg: 'sum', filterDim: lineFilterDim },
        scatter: { x: scatterX, y: scatterY, color: scatterColor },
        group: { cat: groupCat, dim: groupDim, met: groupMet, agg: 'sum' },
        rank: { dim: rankDim, met: rankMet, agg: rankAgg, top: 10, asc: false }
      };
    }

    // ====== DRAWER RENDERING ======
    function renderDrawer() {
      const numOpts = columns.filter(c => c.type === 'numeric').map(c => `<option value="${escapeAttr(c.name)}">${escapeHtml(c.name)} [数值]</option>`).join('');
      const catOpts = columns.filter(c => c.type !== 'numeric').map(c => `<option value="${escapeAttr(c.name)}">${escapeHtml(c.name)} [${typeLabel(c.type)}]</option>`).join('');
      const allOpts = columns.map(c => `<option value="${escapeAttr(c.name)}">${escapeHtml(c.name)} [${typeLabel(c.type)}]</option>`).join('');
      const aggOpts = `<option value="sum">求和</option><option value="mean">平均</option><option value="max">最大</option><option value="min">最小</option><option value="count">计数</option>`;

      const opt = (sel, opts) => `<option value="">（不选）</option>${opts}`.replace(`<option value="${escapeAttr(sel)}">`, `<option value="${escapeAttr(sel)}" selected>`);

      const kpiRows = [0, 1, 2, 3].map(i => {
        const k = config.kpi[i] || { col: '', agg: 'sum' };
        return `<div class="cfg-row">
      <select data-kpi="${i}" data-field="col">${opt(k.col, numOpts)}</select>
      <select data-kpi="${i}" data-field="agg">${aggOpts.replace(`value="${k.agg}"`, `value="${k.agg}" selected`)}</select>
    </div>`;
      }).join('');

      $drawerBody.innerHTML = `
    <div class="cfg-section">
      <h3>🎨 主题配色</h3>
      <div class="theme-grid" id="themeGrid">
        ${Object.entries(THEMES).map(([k, t]) => `
          <div class="theme-card${k === activeTheme ? ' active' : ''}" data-theme="${k}">
            <div class="theme-swatch" style="background:linear-gradient(135deg, ${t.primary}, ${t.accent})"></div>
            <div class="name">${t.name}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="cfg-section">
      <h3>📊 KPI 指标卡 (4 个)</h3>
      ${kpiRows}
    </div>

    <div class="cfg-section">
      <h3>📈 柱状图 TOP 榜</h3>
      <div class="cfg-row"><label>分组维度</label><select id="cfg_bar_dim">${opt(config.bar.dim, catOpts)}</select></div>
      <div class="cfg-row"><label>指标</label><select id="cfg_bar_met">${opt(config.bar.met, numOpts)}</select></div>
      <div class="cfg-row"><label>聚合</label><select id="cfg_bar_agg">${aggOpts.replace(`value="${config.bar.agg}"`, `value="${config.bar.agg}" selected`)}</select></div>
      <div class="cfg-row"><label>TOP</label><input type="number" id="cfg_bar_top" value="${config.bar.top}" min="3" max="50"></div>
      <div class="cfg-row"><label>筛选维度</label><select id="cfg_bar_filterDim">${opt(config.bar.filterDim, catOpts)}</select></div>
    </div>

    <div class="cfg-section">
      <h3>🥧 饼图占比</h3>
      <div class="cfg-row"><label>分类维度</label><select id="cfg_pie_dim">${opt(config.pie.dim, catOpts)}</select></div>
      <div class="cfg-row"><label>指标</label><select id="cfg_pie_met">${opt(config.pie.met, numOpts)}</select></div>
      <div class="cfg-row"><label>聚合</label><select id="cfg_pie_agg">${aggOpts.replace(`value="${config.pie.agg}"`, `value="${config.pie.agg}" selected`)}</select></div>
    </div>

    <div class="cfg-section">
      <h3>📉 折线趋势</h3>
      <div class="cfg-row"><label>X 轴</label><select id="cfg_line_x">${opt(config.line.x, allOpts)}</select></div>
      <div class="cfg-row"><label>指标</label><select id="cfg_line_met">${opt(config.line.met, numOpts)}</select></div>
      <div class="cfg-row"><label>聚合</label><select id="cfg_line_agg">${aggOpts.replace(`value="${config.line.agg}"`, `value="${config.line.agg}" selected`)}</select></div>
      <div class="cfg-row"><label>筛选维度</label><select id="cfg_line_filterDim">${opt(config.line.filterDim, catOpts)}</select></div>
    </div>

    <div class="cfg-section">
      <h3>🎯 散点关联</h3>
      <div class="cfg-row"><label>X 轴</label><select id="cfg_scatter_x">${opt(config.scatter.x, numOpts)}</select></div>
      <div class="cfg-row"><label>Y 轴</label><select id="cfg_scatter_y">${opt(config.scatter.y, numOpts)}</select></div>
      <div class="cfg-row"><label>颜色维度</label><select id="cfg_scatter_color">${opt(config.scatter.color, catOpts)}</select></div>
    </div>

    <div class="cfg-section">
      <h3>📊 分组对比</h3>
      <div class="cfg-row"><label>主分类</label><select id="cfg_group_cat">${opt(config.group.cat, catOpts)}</select></div>
      <div class="cfg-row"><label>分组维度</label><select id="cfg_group_dim">${opt(config.group.dim, catOpts)}</select></div>
      <div class="cfg-row"><label>指标</label><select id="cfg_group_met">${opt(config.group.met, numOpts)}</select></div>
      <div class="cfg-row"><label>聚合</label><select id="cfg_group_agg">${aggOpts.replace(`value="${config.group.agg}"`, `value="${config.group.agg}" selected`)}</select></div>
    </div>

    <div class="cfg-section">
      <h3>🏆 排行榜</h3>
      <div class="cfg-row"><label>维度</label><select id="cfg_rank_dim">${opt(config.rank.dim, catOpts)}</select></div>
      <div class="cfg-row"><label>指标</label><select id="cfg_rank_met">${opt(config.rank.met, numOpts)}</select></div>
      <div class="cfg-row"><label>聚合</label><select id="cfg_rank_agg">${aggOpts.replace(`value="${config.rank.agg}"`, `value="${config.rank.agg}" selected`)}</select></div>
      <div class="cfg-row"><label>TOP</label><input type="number" id="cfg_rank_top" value="${config.rank.top}" min="3" max="50"></div>
      <div class="cfg-row"><label>排序</label><select id="cfg_rank_asc">
        <option value="false" ${!config.rank.asc ? 'selected' : ''}>降序 (大→小)</option>
        <option value="true" ${config.rank.asc ? 'selected' : ''}>升序 (小→大)</option>
      </select></div>
    </div>
  `;

      $drawerBody.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
          activeTheme = card.dataset.theme;
          $drawerBody.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          applyTheme(activeTheme);
        });
      });
    }

    function collectConfig() {
      $drawerBody.querySelectorAll('select[data-kpi]').forEach(sel => {
        const i = +sel.dataset.kpi;
        const f = sel.dataset.field;
        if (!config.kpi[i]) config.kpi[i] = { col: '', agg: 'sum' };
        config.kpi[i][f] = sel.value;
      });
      const get = id => document.getElementById(id)?.value || '';
      const getNum = (id, def) => { const v = document.getElementById(id)?.value; return v ? +v : def; };
      config.bar = { dim: get('cfg_bar_dim'), met: get('cfg_bar_met'), agg: get('cfg_bar_agg'), top: getNum('cfg_bar_top', 10), filterDim: get('cfg_bar_filterDim') };
      config.pie = { dim: get('cfg_pie_dim'), met: get('cfg_pie_met'), agg: get('cfg_pie_agg') };
      config.line = { x: get('cfg_line_x'), met: get('cfg_line_met'), agg: get('cfg_line_agg'), filterDim: get('cfg_line_filterDim') };
      config.scatter = { x: get('cfg_scatter_x'), y: get('cfg_scatter_y'), color: get('cfg_scatter_color') };
      config.group = { cat: get('cfg_group_cat'), dim: get('cfg_group_dim'), met: get('cfg_group_met'), agg: get('cfg_group_agg') };
      config.rank = { dim: get('cfg_rank_dim'), met: get('cfg_rank_met'), agg: get('cfg_rank_agg'), top: getNum('cfg_rank_top', 10), asc: get('cfg_rank_asc') === 'true' };
    }

    function applyConfig() {
      barFilter = null;
      lineFilter = null;
      buildAll();
    }

    function openDrawer() {
      renderDrawer();
      $drawer.classList.add('open');
      $backdrop.classList.add('show');
    }
    function closeDrawer() {
      $drawer.classList.remove('open');
      $backdrop.classList.remove('show');
    }

    // ====== THEME ======
    function applyTheme(name) {
      const t = THEMES[name];
      const root = document.documentElement.style;
      root.setProperty('--primary', t.primary);
      root.setProperty('--accent', t.accent);
      root.setProperty('--primary-soft', t.primarySoft);
      root.setProperty('--base-bg', t.baseBg);
      document.body.style.background = t.baseBg;
      $bgLayer1.style.background = t.bg1;
      registerEchartsTheme(t);
      if (rawRows.length) buildAll();
    }

    // ====== ECharts 浅色液体玻璃主题 ======
    function registerEchartsTheme(t) {
      const theme = {
        backgroundColor: 'transparent',
        textStyle: { color: '#1a2540', fontFamily: 'DS, sans-serif' },
        color: t.palette,
        title: { textStyle: { color: '#1a2540' } },
        legend: { textStyle: { color: '#5a6478' } },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 1,
          textStyle: { color: '#1a2540' },
          extraCssText: 'backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); box-shadow: 0 8px 32px rgba(31,38,135,0.15), inset 0 1px 1px rgba(255,255,255,0.95); border-radius: 12px;'
        },
        categoryAxis: {
          axisLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.15)' } },
          axisTick: { show: false },
          axisLabel: { color: '#5a6478' },
          splitLine: { show: false }
        },
        valueAxis: {
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#5a6478' },
          splitLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.06)' } }
        }
      };
      try { echarts.registerTheme('dyn', theme); } catch (e) { }
    }

    // ====== AGGREGATION HELPERS ======
    function toNum(v) { const n = Number(v); return isNaN(n) ? NaN : n; }
    function isVal(v) { return v != null && v !== '' && v !== '--'; }

    function groupAgg(rows, gCol, vCol, agg) {
      const m = {};
      for (const r of rows) {
        const k = r[gCol];
        if (!isVal(k)) continue;
        if (agg === 'count') { m[k] = (m[k] || 0) + 1; continue; }
        const v = toNum(r[vCol]);
        if (isNaN(v)) continue;
        if (agg === 'sum' || agg === 'mean') { m[k] = (m[k] || 0) + v; if (agg === 'mean') m[k + '_c'] = (m[k + '_c'] || 0) + 1; }
        else if (agg === 'max') { m[k] = m[k] == null ? v : Math.max(m[k], v); }
        else if (agg === 'min') { m[k] = m[k] == null ? v : Math.min(m[k], v); }
      }
      let entries = Object.entries(m).filter(([k]) => !k.endsWith('_c'));
      if (agg === 'mean') {
        entries = entries.map(([k, v]) => [k, +(v / (m[k + '_c'] || 1)).toFixed(2)]);
      }
      return entries.map(([k, v]) => [k, +v]);
    }

    function aggAll(rows, vCol, agg) {
      if (agg === 'count') return rows.length;
      const vals = rows.map(r => toNum(r[vCol])).filter(v => !isNaN(v));
      if (!vals.length) return 0;
      if (agg === 'sum') return vals.reduce((a, b) => a + b, 0);
      if (agg === 'mean') return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
      if (agg === 'max') return Math.max(...vals);
      if (agg === 'min') return Math.min(...vals);
      return 0;
    }

    // ====== BUILD ALL — 随机布局 + 动态效果 ======
    function buildAll() {
      destroyCharts();
      clearHighlightTimers();
      startGlobalAnimLoop();
      buildKPIs();
      buildRandomLayout();
      // 为新创建的元素初始化液体玻璃 CSS 变量（不覆盖 animation-delay）
      requestAnimationFrame(() => {
        document.querySelectorAll('.panel, .kpi-card').forEach(el => {
          el.style.setProperty('--mx', '50%');
          el.style.setProperty('--my', '50%');
          el.style.setProperty('--glow-intensity', '0.6');
        });
      });
      setTimeout(() => charts.forEach(c => { try { c.resize(); } catch (e) { } }), 300);
      setTimeout(() => charts.forEach(c => { try { c.resize(); } catch (e) { } }), 1500);
    }

    function clearHighlightTimers() {
      highlightTimers.forEach(t => clearInterval(t));
      highlightTimers = [];
    }

    // 随机布局生成器：从所有可用图表中随机选择 6 个，随机分配 span
    function buildRandomLayout() {
      const $container = document.getElementById('panelsContainer');
      $container.innerHTML = '';

      // 所有可用的图表构建器（按是否满足前置条件筛选）
      const availableBuilders = CHART_BUILDERS.filter(b => b.available());

      // 随机选择 6 个（如果不足 6 个，取全部）
      const picked = shuffle(availableBuilders).slice(0, 6);
      const n = picked.length;

      // 预定义布局模板：保证 3 列网格 + 3 行 + 整齐的行
      // 每个模板都是 3 行，每行 span 之和 = 3，行内面板数总和 = 6
      const TEMPLATES_6 = [
        [[2, 1], [2, 1], [2, 1]],         // 6 panels: 2+2+2
        [[1, 2], [1, 2], [1, 2]],         // 6 panels: 2+2+2
        [[2, 1], [1, 2], [2, 1]],         // 6 panels: 2+2+2
        [[1, 2], [2, 1], [1, 2]],         // 6 panels: 2+2+2
        [[3], [2, 1], [1, 1, 1]],         // 6 panels: 1+2+3
        [[3], [1, 2], [1, 1, 1]],         // 6 panels: 1+2+3
        [[2, 1], [3], [1, 1, 1]],         // 6 panels: 2+1+3
        [[1, 2], [3], [1, 1, 1]],         // 6 panels: 2+1+3
        [[1, 1, 1], [3], [2, 1]],         // 6 panels: 3+1+2
        [[1, 1, 1], [3], [1, 2]],         // 6 panels: 3+1+2
        [[1, 1, 1], [2, 1], [3]],         // 6 panels: 3+2+1
        [[1, 1, 1], [1, 2], [3]]          // 6 panels: 3+2+1
      ];

      // 把模板按需打平成 span 数组
      const template = TEMPLATES_6[Math.floor(Math.random() * TEMPLATES_6.length)];
      let spanList = [];
      template.forEach(row => spanList.push(...row));

      // 如果面板数 < spanList 长度，截断；如果 > spanList，补 1
      if (n < spanList.length) spanList = spanList.slice(0, n);
      while (n > spanList.length) spanList.push(1);

      picked.forEach((builder, idx) => {
        const span = spanList[idx];
        const spanClass = span === 3 ? 'span3' : span === 2 ? 'span2' : '';

        const panelId = 'panel_' + idx;
        const chartId = 'chart_' + idx;

        const panelHtml = `<div class="panel ${spanClass}" id="${panelId}" style="animation-delay:${idx * 0.12}s">
          <div class="panel-head">
            <span class="ph-dot"></span>
            <span class="ph-title" data-title-slot></span>
            <div class="ph-actions" data-actions-slot"></div>
          </div>
          <div class="panel-body ${builder.bodyClass || ''}" id="${chartId}"></div>
          <span class="corner-bl"></span><span class="corner-br"></span>
        </div>`;

        $container.insertAdjacentHTML('beforeend', panelHtml);
        const $panel = document.getElementById(panelId);
        builder.build(chartId, $panel);
      });
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // 通用的 ECharts 动画选项（快速加载 + 动态效果）
    const ANIM_OPTS = {
      animation: true,
      animationDuration: 600,
      animationDurationUpdate: 400,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicInOut',
      animationDelay: 0,
      animationDelayUpdate: 0
    };

    // ====== 图表动态效果（轻量版）======
    // 统一管理定时器，避免每 80ms setOption 导致的卡顿
    let globalAnimFrame = null;

    function startGlobalAnimLoop() {
      if (globalAnimFrame) return;
      const chartsData = []; // {inst, type, dataLen, idx}
      const loop = () => {
        chartsData.forEach((cd, i) => {
          try {
            cd.frame = (cd.frame || 0) + 1;
            if (cd.type === 'radarRotate') {
              // 节流：每 3 帧更新一次（~20fps），避免每帧 setOption 导致闪烁
              if (cd.frame % 3 === 0) {
                cd.angle = (cd.angle + 1.5) % 360;
                cd.inst.setOption({ radar: { startAngle: cd.angle } }, false);
              }
            } else if (cd.type === 'flow') {
              if (cd.frame % 8 === 0) {
                cd.idx = (cd.idx + 1) % Math.max(1, cd.dataLen);
                cd.inst.dispatchAction({ type: 'downplay', seriesIndex: 0 });
                cd.inst.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: cd.idx });
              }
            } else if (cd.type === 'pulse') {
              if (cd.frame % 3 === 0) {
                cd.phase = (cd.phase + 0.24) % (Math.PI * 2);
                const scale = 0.8 + Math.sin(cd.phase) * 0.25;
                const opt = cd.inst.getOption();
                if (opt.series && opt.series[0]) {
                  opt.series[0].symbolSize = 7 * scale;
                  cd.inst.setOption(opt, { lazyUpdate: true, notMerge: false });
                }
              }
            } else if (cd.type === 'gauge') {
              if (cd.frame % 3 === 0) {
                cd.phase += 0.18;
                const len = 58 + Math.abs(Math.sin(cd.phase)) * 6;
                cd.inst.setOption({ series: [{ pointer: { length: len + '%' } }] }, false);
              }
            } else if (cd.type === 'highlight') {
              if (cd.frame % 10 === 0) {
                cd.idx = (cd.idx + 1) % Math.max(1, cd.dataLen);
                cd.inst.dispatchAction({ type: 'downplay', seriesIndex: 0 });
                cd.inst.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: cd.idx });
              }
            } else if (cd.type === 'shimmer') {
              if (cd.frame % 3 === 0) {
                cd.progress = (cd.progress + 0.45) % (cd.dataLen + 1);
                const xIdx = Math.min(Math.floor(cd.progress), cd.dataLen - 1);
                cd.inst.setOption({
                  series: [{
                    markLine: {
                      silent: true,
                      symbol: ['none', 'none'],
                      lineStyle: { color: 'rgba(255,255,255,0.7)', width: 1.5, type: 'dashed' },
                      data: [{ xAxis: xIdx }],
                      animation: false
                    }
                  }]
                }, false);
              }
            }
          } catch (e) { }
        });
        globalAnimFrame = requestAnimationFrame(loop);
      };
      globalAnimFrame = requestAnimationFrame(loop);

      // 存储注册函数
      window.__registerChartAnim = (inst, type, dataLen, seriesIdx = 0) => {
        const cd = { inst, type, dataLen, idx: 0, angle: 0, phase: Math.random() * Math.PI * 2, progress: 0, seriesIdx };
        chartsData.push(cd);
        return cd;
      };
    }

    function stopGlobalAnimLoop() {
      if (globalAnimFrame) {
        cancelAnimationFrame(globalAnimFrame);
        globalAnimFrame = null;
      }
    }

    function clearHighlightTimers() {
      stopGlobalAnimLoop();
      highlightTimers.forEach(t => clearInterval(t));
      highlightTimers = [];
    }

    // 简化的注册入口（每个图表构建器调用一次）
    function regAnim(inst, type, dataLen, seriesIdx) {
      if (window.__registerChartAnim) {
        window.__registerChartAnim(inst, type, dataLen, seriesIdx);
      }
    }

    function destroyCharts() {
      charts.forEach(c => { try { c.dispose(); } catch (e) { } });
      charts = [];
    }

    function echInit(id) {
      const dom = document.getElementById(id);
      if (!dom) return null;
      // 先给容器一个明确的最小尺寸，避免 ECharts init 时得到 0x0
      const cs = getComputedStyle(dom);
      if (!dom.offsetHeight || !dom.offsetWidth) {
        dom.style.minHeight = '220px';
        dom.style.minWidth = '100%';
      }
      const inst = echarts.init(dom, 'dyn');
      charts.push(inst);

      // 多阶段 resize 兜底：入场动画 / 滚动 / flex 布局稳定后
      [50, 200, 500, 1200].forEach(t => {
        setTimeout(() => { try { inst.resize(); } catch (e) { } }, t);
      });

      // 可见性监听：滚动到视口内时强制 resize（防止懒渲染类问题）
      try {
        if ('IntersectionObserver' in window) {
          const io = new IntersectionObserver(entries => {
            entries.forEach(en => {
              if (en.isIntersecting) {
                try { inst.resize(); } catch (e) { }
                io.disconnect();
              }
            });
          }, { threshold: 0.05 });
          io.observe(dom);
          // 3 秒后兜底断开，防止内存泄漏
          setTimeout(() => io.disconnect(), 3500);
        }
      } catch (e) { }

      return inst;
    }

    const grid = { left: 50, right: 24, top: 28, bottom: 64 };
    const catAxis = { type: 'category', axisLabel: { rotate: 35, fontSize: 10, color: '#5a6478' }, axisLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.15)' } }, axisTick: { show: false } };
    const valAxis = { type: 'value', axisLabel: { color: '#5a6478' }, splitLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.06)' } }, axisTick: { show: false }, axisLine: { show: false } };

    const KPI_ICONS = ['📋', '📊', '🎯', '📈'];
    const KPI_LABELS = ['指标一', '指标二', '指标三', '指标四'];

    // ====== KPI ======
    function buildKPIs() {
      const t = THEMES[activeTheme];
      const html = config.kpi.map((k, i) => {
        let val = '--';
        let label = KPI_LABELS[i];
        if (k.col) {
          val = aggAll(rawRows, k.col, k.agg || 'sum');
          val = formatNum(val);
          const aggLabel = ({ sum: '总和', mean: '平均', max: '最大', min: '最小', count: '计数' })[k.agg] || '';
          label = `${k.col} · ${aggLabel}`;
        }
        return `<div class="kpi-card" style="animation-delay:${i * 0.1}s">
      <div class="kpi-icon" style="background:${t.kpiIconGrad}">${KPI_ICONS[i]}</div>
      <div class="kpi-info">
        <div class="kpi-val" data-val="${val}">${val}</div>
        <div class="kpi-label">${escapeHtml(label)}</div>
      </div>
    </div>`;
      }).join('');
      document.getElementById('kpiRow').innerHTML = html;
      document.querySelectorAll('.kpi-val').forEach(el => animateCounter(el));
    }

    function animateCounter(el) {
      const target = el.dataset.val;
      if (target === '--' || target == null) return;
      const numStr = String(target).replace(/[,%]/g, '').replace(/亿|万/g, '');
      const num = parseFloat(numStr);
      if (isNaN(num)) { el.textContent = target; return; }
      const hasUnit = /亿|万/.test(target);
      const isFloat = numStr.includes('.') && numStr.split('.')[1].length > 0;
      const dec = isFloat ? numStr.split('.')[1].length : 0;
      const dur = 800;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = num * eased;
        el.textContent = formatNum(cur, dec) + (hasUnit && p === 1 ? target.replace(numStr, '').trim() : '');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    }

    function formatNum(n, dec) {
      if (n == null || isNaN(n)) return '--';
      if (dec == null) dec = (Math.abs(n) < 100 && n % 1 !== 0) ? 2 : 0;
      if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + '亿';
      if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(2) + '万';
      return n.toLocaleString(undefined, { maximumFractionDigits: dec, minimumFractionDigits: dec });
    }

    // ====== CHART BUILDERS — 所有图表构建器 ======
    // 每个 builder: { name, bodyClass?, available(), build(chartId, $panel) }

    function setPanelTitle($panel, text) {
      const $t = $panel.querySelector('[data-title-slot]');
      if ($t) $t.textContent = text;
    }
    function setPanelActions($panel, html) {
      const $a = $panel.querySelector('[data-actions-slot]');
      if ($a) $a.innerHTML = html || '';
    }

    // ----- 1. 柱状图 TOP -----
    const buildBarChart = (chartId, $panel) => {
      const c = config.bar;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置柱状图维度'); return; }
      setPanelTitle($panel, `${c.dim} · ${aggLabel(c.agg)}${c.met ? ' / ' + c.met : ''} TOP ${c.top || 10}`);

      let rows = rawRows;
      const filteredData = groupAgg(rows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]).slice(0, c.top || 10);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid,
        xAxis: { ...catAxis, data: filteredData.map(d => d[0]) },
        yAxis: { ...valAxis, name: c.met },
        series: [{
          type: 'bar', name: c.met, barWidth: '55%',
          data: filteredData.map((d, i) => ({
            value: d[1],
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: t.palette[i % t.palette.length] },
                { offset: 1, color: hexToRgba(t.palette[i % t.palette.length], 0.3) }
              ])
            }
          })),
          label: { show: true, position: 'top', color: '#5a6478', fontSize: 10, fontWeight: 600, formatter: p => formatNum(p.value) }
        }]
      });
      regAnim(inst, 'shimmer', filteredData.length);
      regAnim(inst, 'highlight', filteredData.length);
    };

    // ----- 2. 横向柱图 -----
    const buildBarHorizChart = (chartId, $panel) => {
      const c = config.rank;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置排行榜维度'); return; }
      let entries = groupAgg(rawRows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]).slice(0, c.top || 10).reverse();
      setPanelTitle($panel, `${c.dim} · ${aggLabel(c.agg)} 排行 TOP ${c.top || 10}`);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { ...grid, left: 100 },
        xAxis: { ...valAxis, name: c.met },
        yAxis: { ...catAxis, data: entries.map(d => d[0]), axisLabel: { ...catAxis.axisLabel, rotate: 0 } },
        series: [{
          type: 'bar', name: c.met, barWidth: '60%',
          data: entries.map((d, i) => ({
            value: d[1],
            itemStyle: {
              borderRadius: [0, 8, 8, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: hexToRgba(t.palette[i % t.palette.length], 0.3) },
                { offset: 1, color: t.palette[i % t.palette.length] }
              ])
            }
          })),
          label: { show: true, position: 'right', color: '#5a6478', fontSize: 10, fontWeight: 600, formatter: p => formatNum(p.value) }
        }]
      });
      regAnim(inst, 'shimmer', entries.length);
      regAnim(inst, 'highlight', entries.length);
    };

    // ----- 3. 饼图（环形） -----
    const buildPieChart = (chartId, $panel) => {
      const c = config.pie;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置饼图维度'); return; }
      const entries = groupAgg(rawRows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]);
      let data = entries.slice(0, 8).map(([n, v]) => ({ name: n, value: v }));
      if (entries.length > 8) {
        const otherSum = entries.slice(8).reduce((s, [, v]) => s + v, 0);
        if (otherSum > 0) data.push({ name: '其他', value: otherSum });
      }
      setPanelTitle($panel, `${c.dim} 占比分布`);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { type: 'scroll', bottom: 0, textStyle: { color: '#5a6478', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
        color: t.palette,
        series: [{
          type: 'pie',
          radius: ['42%', '72%'],
          center: ['50%', '46%'],
          data,
          label: { color: '#1a2540', fontSize: 10, formatter: '{b}\n{d}%' },
          labelLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.3)' } },
          itemStyle: { borderRadius: 6, borderColor: 'rgba(255, 255, 255, 0.9)', borderWidth: 3 },
          emphasis: { itemStyle: { shadowBlur: 18, shadowColor: hexToRgba(t.primary, 0.4) }, scale: true, scaleSize: 8 }
        }]
      });
      regAnim(inst, 'highlight', data.length);
    };

    // ----- 4. 玫瑰图 -----
    const buildRoseChart = (chartId, $panel) => {
      const c = config.pie;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置饼图维度'); return; }
      const entries = groupAgg(rawRows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]);
      const data = entries.slice(0, 10).map(([n, v]) => ({ name: n, value: v }));
      setPanelTitle($panel, `${c.dim} · 玫瑰图分布`);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { type: 'scroll', bottom: 0, textStyle: { color: '#5a6478', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
        color: t.palette,
        series: [{
          type: 'pie',
          roseType: 'area',
          radius: ['20%', '75%'],
          center: ['50%', '46%'],
          data,
          label: { color: '#1a2540', fontSize: 10, formatter: '{b}\n{d}%' },
          itemStyle: { borderRadius: 4, borderColor: 'rgba(255, 255, 255, 0.8)', borderWidth: 2 },
          emphasis: { itemStyle: { shadowBlur: 15, shadowColor: hexToRgba(t.primary, 0.4) } }
        }]
      });
      regAnim(inst, 'highlight', data.length);
    };

    // ----- 5. 折线趋势 -----
    const buildLineChart = (chartId, $panel) => {
      const c = config.line;
      const inst = echInit(chartId);
      if (!inst || !c.x) { showEmpty(chartId, '请配置折线 X 轴'); return; }

      let entries = groupAgg(rawRows, c.x, c.met, c.agg);
      const colType = columns.find(col => col.name === c.x)?.type;
      if (colType === 'date') entries = entries.sort((a, b) => new Date(a[0]) - new Date(b[0]));
      else if (entries.length && !isNaN(Number(entries[0][0]))) entries = entries.sort((a, b) => Number(a[0]) - Number(b[0]));

      setPanelTitle($panel, `${c.met || ''} ${aggLabel(c.agg)} 趋势`);

      const t = THEMES[activeTheme];
      const data = entries.map(d => d[1]);
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { ...catAxis, data: entries.map(d => d[0]), axisLabel: { ...catAxis.axisLabel, rotate: 30 } },
        yAxis: { ...valAxis, name: c.met, min: v => Math.floor(v.min * 0.9) },
        series: [{
          type: 'line', name: c.met, smooth: true, symbol: 'circle', symbolSize: 8,
          data,
          lineStyle: { color: t.accent, width: 3, shadowColor: hexToRgba(t.accent, 0.4), shadowBlur: 10 },
          itemStyle: { color: t.accent, borderColor: '#fff', borderWidth: 2, shadowColor: hexToRgba(t.accent, 0.4), shadowBlur: 6 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: hexToRgba(t.accent, .4) },
              { offset: 1, color: hexToRgba(t.accent, 0) }
            ])
          },
          label: { show: entries.length <= 20, color: '#5a6478', fontSize: 10, fontWeight: 600, formatter: p => formatNum(p.value) }
        }]
      }, true);
      regAnim(inst, 'flow', data.length);
    };

    // ----- 6. 面积堆叠图 -----
    const buildAreaStackChart = (chartId, $panel) => {
      const c = config.line;
      const inst = echInit(chartId);
      if (!inst || !c.x) { showEmpty(chartId, '请配置折线 X 轴'); return; }

      let entries = groupAgg(rawRows, c.x, c.met, c.agg);
      const colType = columns.find(col => col.name === c.x)?.type;
      if (colType === 'date') entries = entries.sort((a, b) => new Date(a[0]) - new Date(b[0]));
      else if (entries.length && !isNaN(Number(entries[0][0]))) entries = entries.sort((a, b) => Number(a[0]) - Number(b[0]));

      setPanelTitle($panel, `${c.met || ''} ${aggLabel(c.agg)} 趋势`);

      const t = THEMES[activeTheme];
      const data = entries.map(d => d[1]);
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'axis' },
        grid,
        xAxis: { ...catAxis, data: entries.map(d => d[0]), axisLabel: { ...catAxis.axisLabel, rotate: 30 } },
        yAxis: { ...valAxis, name: c.met },
        series: [{
          type: 'line', name: c.met, smooth: true, symbol: 'none',
          data,
          lineStyle: { color: t.primary, width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: hexToRgba(t.primary, .55) },
              { offset: 0.5, color: hexToRgba(t.accent, .35) },
              { offset: 1, color: hexToRgba(t.primary, 0) }
            ])
          },
          emphasis: { focus: 'series' },
          animationDelay: 300
        }]
      }, true);
      regAnim(inst, 'flow', data.length);
    };

    // ----- 7. 散点相关性 -----
    const buildScatterChart = (chartId, $panel) => {
      const c = config.scatter;
      const inst = echInit(chartId);
      if (!inst || !c.x || !c.y) { showEmpty(chartId, '请配置散点 X/Y'); return; }
      setPanelTitle($panel, `${c.x} vs ${c.y} 相关性`);
      const t = THEMES[activeTheme];

      let series = [];
      if (c.color) {
        const groups = {};
        for (const r of rawRows) {
          const x = toNum(r[c.x]), y = toNum(r[c.y]), g = r[c.color];
          if (isNaN(x) || isNaN(y) || !isVal(g)) continue;
          if (!groups[g]) groups[g] = [];
          groups[g].push([x, y]);
        }
        const groupKeys = Object.keys(groups).slice(0, 8);
        series = groupKeys.map((g, i) => ({
          name: g, type: 'scatter', data: groups[g], symbolSize: 9,
          itemStyle: { color: hexToRgba(t.palette[i % t.palette.length], 0.7), borderColor: t.palette[i % t.palette.length], borderWidth: 1.5, shadowColor: hexToRgba(t.palette[i % t.palette.length], 0.4), shadowBlur: 6 },
          emphasis: { scale: 1.4, focus: 'series' }
        }));
      } else {
        const pts = rawRows.map(r => [toNum(r[c.x]), toNum(r[c.y])]).filter(p => !isNaN(p[0]) && !isNaN(p[1]));
        const sampled = pts.length > 2000 ? pts.filter(() => Math.random() < 2000 / pts.length) : pts;
        series = [{ type: 'scatter', name: '数据点', data: sampled, symbolSize: 9, itemStyle: { color: hexToRgba(t.primary, 0.7), borderColor: t.primary, borderWidth: 1.5, shadowColor: hexToRgba(t.primary, 0.4), shadowBlur: 6 }, emphasis: { scale: 1.4 } }];
      }

      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'item', formatter: p => `${p.seriesName}<br/>${c.x}: ${p.value[0]}<br/>${c.y}: ${p.value[1]}` },
        grid,
        legend: series.length > 1 ? { type: 'scroll', bottom: 0, textStyle: { color: '#5a6478', fontSize: 10 }, itemWidth: 10, itemHeight: 10 } : undefined,
        xAxis: { ...valAxis, name: c.x, nameTextStyle: { color: '#5a6478' } },
        yAxis: { ...valAxis, name: c.y, nameTextStyle: { color: '#5a6478' } },
        series
      });
      regAnim(inst, 'pulse', series.length);
    };

    // ----- 8. 分组对比 -----
    const buildGroupChart = (chartId, $panel) => {
      const c = config.group;
      const inst = echInit(chartId);
      if (!inst || !c.cat || !c.dim) { showEmpty(chartId, '请配置分组对比'); return; }
      const t = THEMES[activeTheme];
      setPanelTitle($panel, `${c.cat} × ${c.dim} · ${aggLabel(c.agg)}${c.met ? ' / ' + c.met : ''}`);

      const map = {}, cats = new Set(), dims = new Set();
      for (const r of rawRows) {
        const cat = r[c.cat], dim = r[c.dim];
        if (!isVal(cat) || !isVal(dim)) continue;
        const v = c.agg === 'count' ? 1 : toNum(r[c.met]);
        if (c.agg !== 'count' && isNaN(v)) continue;
        if (!map[cat]) map[cat] = {};
        map[cat][dim] = (map[cat][dim] || 0) + v;
        cats.add(cat); dims.add(dim);
      }
      const catArr = [...cats].map(c => [c, Object.values(map[c] || {}).reduce((a, b) => a + b, 0)]).sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0]);
      const dimArr = [...dims].slice(0, 5);

      const series = dimArr.map((d, i) => ({
        type: 'bar', name: d, barWidth: '50%',
        data: catArr.map(ct => map[ct]?.[d] || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: t.palette[i % t.palette.length] },
            { offset: 1, color: hexToRgba(t.palette[i % t.palette.length], 0.4) }
          ]),
          borderRadius: [6, 6, 0, 0]
        },
        emphasis: { focus: 'series' }
      }));

      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        legend: { data: dimArr, textStyle: { color: '#5a6478', fontSize: 10 }, top: 0, type: 'scroll' },
        grid: { ...grid, top: 36, bottom: 70 },
        xAxis: { ...catAxis, data: catArr },
        yAxis: { ...valAxis, name: c.met },
        series
      });
    };

    // ----- 9. 雷达图 -----
    const buildRadarChart = (chartId, $panel) => {
      const c = config.bar;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置维度'); return; }
      const entries = groupAgg(rawRows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]).slice(0, 8);
      setPanelTitle($panel, `${c.dim} · ${aggLabel(c.agg)} 雷达图`);

      const t = THEMES[activeTheme];
      const maxVal = Math.max(...entries.map(e => e[1])) * 1.1;
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: {},
        radar: {
          indicator: entries.map(e => ({ name: e[0], max: maxVal })),
          radius: '65%',
          axisName: { color: '#1a2540', fontSize: 11 },
          splitArea: { areaStyle: { color: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.15)'] } },
          splitLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.15)' } },
          axisLine: { lineStyle: { color: 'rgba(26, 37, 64, 0.2)' } }
        },
        series: [{
          type: 'radar',
          data: [{
            value: entries.map(e => e[1]),
            name: c.met || c.dim,
            areaStyle: { color: hexToRgba(t.primary, 0.35) },
            lineStyle: { color: t.primary, width: 2 },
            itemStyle: { color: t.accent },
            symbolSize: 6
          }]
        }]
      })
      regAnim(inst, 'radarRotate', entries.length);
    };

    // ----- 10. 漏斗图 -----
    const buildFunnelChart = (chartId, $panel) => {
      const c = config.bar;
      const inst = echInit(chartId);
      if (!inst || !c.dim) { showEmpty(chartId, '请配置维度'); return; }
      const entries = groupAgg(rawRows, c.dim, c.met, c.agg).sort((a, b) => b[1] - a[1]).slice(0, 8);
      const data = entries.map(([n, v]) => ({ name: n, value: v }));
      setPanelTitle($panel, `${c.dim} · 漏斗图`);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        tooltip: { trigger: 'item', formatter: '{b}: {c}' },
        legend: { type: 'scroll', bottom: 0, textStyle: { color: '#5a6478', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
        color: t.palette,
        series: [{
          type: 'funnel',
          left: '10%', right: '10%', top: 10, bottom: 30,
          minSize: '20%',
          data,
          label: { show: true, position: 'inside', color: '#fff', fontSize: 11, fontWeight: 600 },
          labelLine: { show: false },
          itemStyle: { borderColor: 'rgba(255, 255, 255, 0.6)', borderWidth: 2 },
          emphasis: { label: { fontSize: 14 } }
        }]
      });
      regAnim(inst, 'highlight', data.length);
    };

    // ----- 11. 仪表盘 -----
    const buildGaugeChart = (chartId, $panel) => {
      const c = config.kpi[0];
      const inst = echInit(chartId);
      if (!inst || !c.col) { showEmpty(chartId, '请配置 KPI'); return; }
      const numCols = columns.filter(c => c.type === 'numeric').map(c => c.name);
      if (numCols.length < 1) { showEmpty(chartId, '无数值列'); return; }
      const col = numCols[0];
      const vals = rawRows.map(r => toNum(r[col])).filter(v => !isNaN(v));
      const avg = vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
      const max = Math.max(...vals);
      const pct = max > 0 ? Math.min(100, (avg / max) * 100) : 0;
      setPanelTitle($panel, `${col} · 平均值仪表`);

      const t = THEMES[activeTheme];
      inst.setOption({
        ...ANIM_OPTS,
        series: [{
          type: 'gauge',
          center: ['50%', '60%'],
          radius: '90%',
          min: 0, max: 100,
          progress: { show: true, width: 14, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: t.primary }, { offset: 1, color: t.accent }]) } },
          axisLine: { lineStyle: { width: 14, color: [[1, 'rgba(26, 37, 64, 0.08)']] } },
          pointer: { length: '60%', width: 5, itemStyle: { color: t.primary } },
          axisTick: { show: false },
          splitLine: { length: 12, lineStyle: { color: 'rgba(26, 37, 64, 0.2)' } },
          axisLabel: { color: '#9ca3b8', fontSize: 9, distance: 18 },
          anchor: { show: true, size: 16, itemStyle: { color: t.accent, borderColor: '#fff', borderWidth: 2 } },
          title: { show: false },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
            color: '#1a2540',
            fontSize: 32,
            fontWeight: 700,
            offsetCenter: [0, '30%']
          },
          data: [{ value: pct.toFixed(1), name: col }]
        }]
      });
      regAnim(inst, 'gauge', 1);
    };

    // ----- 12. 排行榜（HTML 滚动） -----
    const buildRankListChart = (chartId, $panel) => {
      const c = config.rank;
      const $el = document.getElementById(chartId);
      if (!$el) return;
      $el.classList.add('rank-list');
      if (!c.dim) { $el.innerHTML = '<div class="empty">请配置排行榜维度</div>'; return; }
      let entries = groupAgg(rawRows, c.dim, c.met, c.agg);
      entries = entries.sort((a, b) => c.asc ? a[1] - b[1] : b[1] - a[1]).slice(0, c.top || 10);
      setPanelTitle($panel, `${c.dim} ${aggLabel(c.agg)}${c.met ? ' / ' + c.met : ''} ${c.asc ? '↑ 升序' : '↓ 降序'} TOP ${c.top || 10}`);

      const maxVal = entries[0]?.[1] || 1;
      $el.innerHTML = entries.map(([name, val], i) => {
        const cls = i < 3 ? 'top3' : 'normal';
        const pct = (val / maxVal * 100).toFixed(0);
        return `<div class="rank-item" style="animation-delay:${i * 0.08}s">
      <span class="rank-idx ${cls}">${i + 1}</span>
      <span class="rank-name" title="${escapeAttr(name)}">${escapeHtml(name)}</span>
      <span class="rank-bar-track"><span class="rank-bar-fill" style="width:0%" data-target="${pct}"></span></span>
      <span class="rank-val">${formatNum(val)}</span>
    </div>`;
      }).join('') || '<div class="empty">无数据</div>';

      // 动画填充进度条
      setTimeout(() => {
        $el.querySelectorAll('.rank-bar-fill').forEach(($bar, i) => {
          setTimeout(() => {
            $bar.style.transition = 'width 0.8s cubic-bezier(.16,.84,.44,1)';
            $bar.style.width = $bar.dataset.target + '%';
          }, i * 80);
        });
      }, 300);

      // 排行榜自动高亮轮播
      let highlightIdx = 0;
      const items = $el.querySelectorAll('.rank-item');
      const timer = setInterval(() => {
        items.forEach(it => it.style.transform = '');
        if (items[highlightIdx]) {
          items[highlightIdx].style.transform = 'translateX(6px)';
          items[highlightIdx].style.transition = 'transform .4s';
        }
        highlightIdx = (highlightIdx + 1) % items.length;
      }, 1800);
      highlightTimers.push(timer);
    };

    // ====== 所有图表构建器列表 ======
    const CHART_BUILDERS = [
      { name: '柱状图', available: () => config.bar && config.bar.dim, build: buildBarChart },
      { name: '横向柱图', available: () => config.rank && config.rank.dim, build: buildBarHorizChart },
      { name: '饼图', available: () => config.pie && config.pie.dim, build: buildPieChart },
      { name: '玫瑰图', available: () => config.pie && config.pie.dim, build: buildRoseChart },
      { name: '折线图', available: () => config.line && config.line.x, build: buildLineChart },
      { name: '面积图', available: () => config.line && config.line.x, build: buildAreaStackChart },
      { name: '散点图', available: () => config.scatter && config.scatter.x && config.scatter.y, build: buildScatterChart },
      { name: '分组对比', available: () => config.group && config.group.cat && config.group.dim, build: buildGroupChart },
      { name: '雷达图', available: () => config.bar && config.bar.dim, build: buildRadarChart },
      { name: '漏斗图', available: () => config.bar && config.bar.dim, build: buildFunnelChart },
      { name: '仪表盘', available: () => columns.some(c => c.type === 'numeric'), build: buildGaugeChart },
      { name: '排行榜', available: () => config.rank && config.rank.dim, build: buildRankListChart, bodyClass: 'rank-list' }
    ];

    // ====== HELPERS ======
    function aggLabel(agg) {
      return ({ sum: '总和', mean: '平均', max: '最大', min: '最小', count: '计数' })[agg] || agg;
    }
    function typeLabel(t) {
      return ({ numeric: '数值', categorical: '类别', boolean: '布尔', date: '日期', text: '文本' })[t] || t;
    }
    function showEmpty(id, msg) {
      const $el = document.getElementById(id);
      if ($el) $el.innerHTML = `<div class="empty">${escapeHtml(msg)}</div>`;
    }
    function escapeHtml(s) {
      return String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    }
    function escapeAttr(s) {
      return String(s == null ? '' : s).replace(/"/g, '&quot;');
    }
    function hexToRgba(hex, a) {
      const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      if (!m) return hex;
      return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
    }

    // ====== RESIZE ======
    window.addEventListener('resize', () => charts.forEach(c => { try { c.resize(); } catch (e) { } }));

    // ====== MOUSE FOLLOW — 动态液体玻璃高光 ======
    (function initGlassInteractions() {
      const glassEls = () => document.querySelectorAll('.panel, .kpi-card, .upload-box, #configDrawer, #header');
      let rafPending = false;
      let lastTime = 0;

      function updateGlass(x, y) {
        const els = glassEls();
        els.forEach(el => {
          if (!el.getBoundingClientRect) return;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;
          const relX = ((x - rect.left) / rect.width) * 100;
          const relY = ((y - rect.top) / rect.height) * 100;
          if (relX >= -50 && relX <= 150 && relY >= -50 && relY <= 150) {
            el.style.setProperty('--mx', Math.max(0, Math.min(100, relX)) + '%');
            el.style.setProperty('--my', Math.max(0, Math.min(100, relY)) + '%');
            el.style.setProperty('--glow-intensity', '1');
          }
        });
      }

      document.addEventListener('mousemove', (e) => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
          updateGlass(e.clientX, e.clientY);
          rafPending = false;
        });
      });

      // 触摸设备支持
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          updateGlass(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      // 鼠标离开时弱化高光（不低于 0.3）
      document.addEventListener('mouseleave', () => {
        glassEls().forEach(el => {
          el.style.setProperty('--glow-intensity', '0.4');
        });
      });

      // 周期性检查并初始化（防止某些情况下变量丢失）
      setInterval(() => {
        const els = glassEls();
        els.forEach(el => {
          const intensity = el.style.getPropertyValue('--glow-intensity');
          if (!intensity) {
            el.style.setProperty('--mx', '50%');
            el.style.setProperty('--my', '50%');
            el.style.setProperty('--glow-intensity', '0.6');
          }
        });
      }, 1000);

      // 初始化
      setTimeout(() => {
        glassEls().forEach(el => {
          el.style.setProperty('--mx', '50%');
          el.style.setProperty('--my', '50%');
          el.style.setProperty('--glow-intensity', '0.6');
        });
      }, 800);
    })();

    // ====== INIT ======
    registerEchartsTheme(THEMES.emerald);
  