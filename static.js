/**
 * 智能交通分析平台控制器
 * 版本：3.0 (智能分析版)
 */
$(function(){
    initSmartTrafficSystem();
    updateLastAnalysisTime();
});
// 修改图表初始化逻辑（完整代码）
function initCharts() {
  const chartContainers = [
    { id: 'char1', type: 'pie', height: '120px' },    // 左上角环形图
    { id: 'char2', type: 'bar', height: '150px' },    // 右侧表格区域
    { id: 'char3', type: 'line', height: '150px' },   // 下方四个区域
    { id: 'char4', type: 'line', height: '150px' },
    { id: 'char5', type: 'bar', height: '150px' }
  ];

  chartContainers.forEach(container => {
    const el = document.getElementById(container.id);
    if (!el) return;

    // 强制设置容器尺寸
    el.style.cssText = `
      width: 100% !important;
      height: ${container.height} !important;
      min-height: ${container.height} !important;
      position: relative;
      background: rgba(255,255,255,0.05);  // 调试用背景色
    `;

    // 初始化图表
    const chart = echarts.init(el);
    chart.setOption(getPlaceholderOption(container.type)); // 设置占位数据
  });
}

// 占位图表配置
function getPlaceholderOption(type) {
  const baseOption = {
    backgroundColor: 'transparent',
    title: {
      text: '数据加载中...',
      left: 'center',
      top: 'center',
      textStyle: { color: '#aaa', fontSize: 14 }
    }
  };

  switch(type) {
    case 'pie':
      return { ...baseOption, series: [{ type: 'pie', data: [] }] };
    case 'bar':
      return { 
        ...baseOption, 
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'bar', data: [] }] 
      };
    case 'line':
      return {
        ...baseOption,
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: [{ type: 'line', data: [] }]
      };
  }
}
// 系统初始化
function initSmartTrafficSystem() {
    initChartContainers();
    bindEventListeners();
    loadInitialData();
}

// 更新时间显示
function updateLastAnalysisTime() {
    document.getElementById('last-analysis-time').textContent = 
        `最后分析时间: ${new Date().toLocaleString()}`;
}

// 图表容器配置
const chartConfigs = {
    'traffic-flow': { type: 'pie', title: '交通方式智能分析' },
    'traffic-status': { type: 'bar', title: '交通状态实时监测' },
    'travel-pattern': { type: 'line', title: '出行模式AI预测' },
    'safety-analysis': { type: 'mixed', title: '安全风险智能评估' },
    'hebei-map': { type: 'map', title: '河北省交通热力图' }
};

// 智能分析维度配置
const analysisDimensions = {
    time: ['实时', '今日', '本周', '本月'],
    region: ['全省', '石家庄', '唐山', '保定', '邯郸'],
    vehicle: ['全部', '私家车', '公交', '货运', '特种车辆'],
    analysis: ['流量预测', '拥堵分析', '事故预警', '排放评估']
};

// 初始化图表容器
function initChartContainers() {
    Object.keys(chartConfigs).forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.style.width = '100%';
            container.style.height = id === 'hebei-map' ? '500px' : '300px';
            container.innerHTML = `<div class="chart-loading">加载智能分析数据...</div>`;
        }
    });
}

// 绑定事件监听
function bindEventListeners() {
    // 智能搜索功能
    $('#smart-search-btn').click(performSmartAnalysis);
    $('#analysis-reset').click(resetAnalysisCriteria);
    
    // 高级分析选项
    $('#advanced-analysis').change(function() {
        toggleAdvancedOptions(this.checked);
    });
    
    // 响应式调整
    window.addEventListener('resize', debounce(resizeCharts, 200));
}

// 执行智能分析
function performSmartAnalysis() {
    const criteria = getAnalysisCriteria();
    
    showLoadingState();
    
    // 模拟AI分析延迟
    setTimeout(() => {
        fetchSmartAnalysisData(criteria)
            .then(data => {
                renderAnalysisResults(data);
                updateAnalysisInsights(data.insights);
                saveAnalysisHistory(criteria);
            })
            .catch(error => {
                showErrorState(error);
            })
            .finally(() => {
                updateLastAnalysisTime();
            });
    }, 1000);
}

// 获取分析条件
function getAnalysisCriteria() {
    return {
        timeRange: $('#time-range').val(),
        region: $('#region-select').val(),
        vehicleType: $('#vehicle-type').val(),
        analysisType: $('#analysis-type').val(),
        useAI: $('#use-ai-check').prop('checked'),
        predictionDays: $('#prediction-days').val()
    };
}

// 获取智能分析数据
function fetchSmartAnalysisData(criteria) {
    return new Promise((resolve) => {
        // 模拟AI分析数据
        const mockData = generateAIData(criteria);
        setTimeout(() => resolve(mockData), 800);
    });
}

// 生成AI模拟数据
function generateAIData(criteria) {
    const baseValue = criteria.useAI ? 1000 : 500;
    const trendFactor = criteria.predictionDays || 1;
    
    return {
        flow: {
            data: [
                {value: baseValue*1.5*trendFactor, name: '私家车', trend: '↑8%', color: '#FF9800'},
                {value: baseValue*0.9*trendFactor, name: '公交', trend: '↓2%', color: '#2196F3'},
                {value: baseValue*1.2*trendFactor, name: '货运', trend: '↑5%', color: '#4CAF50'}
            ],
            prediction: criteria.useAI ? "AI预测未来3天私家车流量将持续增长" : ""
        },
        status: {
            categories: ['早高峰', '午间', '晚高峰', '夜间'],
            series: [
                {name: '私家车', data: [4500, 2200, 5200, 1800].map(v => v*trendFactor), color: '#FF9800'},
                {name: '公交', data: [3200, 1800, 3500, 800].map(v => v*trendFactor), color: '#2196F3'}
            ],
            congestion: criteria.useAI ? "AI检测到晚高峰拥堵概率增加15%" : ""
        },
        patterns: {
            periods: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            data: [
                {name: '私家车', values: [800, 500, 4200, 3800, 4500, 3500].map(v => v*trendFactor)},
                {name: '公交', values: [200, 100, 3800, 2500, 3200, 1800].map(v => v*trendFactor)}
            ],
            anomaly: criteria.useAI ? "检测到异常出行模式：凌晨货运量增加" : ""
        },
        safety: {
            categories: ['私家车', '公交', '货运'],
            incidents: [1250, 320, 580].map(v => v*trendFactor),
            risk: criteria.useAI ? "高风险区域：唐山工业区交叉口" : ""
        },
        insights: [
            `智能分析维度：${criteria.analysisType}`,
            `区域聚焦：${criteria.region}`,
            `时间范围：${criteria.timeRange}`,
            criteria.useAI ? "AI深度分析已启用" : "常规分析模式"
        ]
    };
}

// 渲染分析结果
function renderAnalysisResults(data) {
    // 交通方式分析
    renderSmartChart('traffic-flow', {
        type: 'pie',
        data: data.flow.data,
        extra: data.flow.prediction
    });
    
    // 交通状态分析
    renderSmartChart('traffic-status', {
        type: 'bar',
        categories: data.status.categories,
        series: data.status.series,
        extra: data.status.congestion
    });
    
    // 出行模式分析
    renderSmartChart('travel-pattern', {
        type: 'line',
        categories: data.patterns.periods,
        series: data.patterns.data,
        extra: data.patterns.anomaly
    });
    
    // 安全分析
    renderSmartChart('safety-analysis', {
        type: 'mixed',
        categories: data.safety.categories,
        series: [
            {name: '事故数量', data: data.safety.incidents, type: 'bar'},
            {name: '风险指数', data: data.safety.incidents.map(v => v/100), type: 'line'}
        ],
        extra: data.safety.risk
    });
}

// 智能图表渲染器
function renderSmartChart(containerId, config) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 清除旧图表
    container.innerHTML = '';
    const chart = echarts.init(container);
    
    // 生成配置选项
    let option;
    switch(config.type) {
        case 'pie':
            option = generatePieOption(config);
            break;
        case 'bar':
            option = generateBarOption(config);
            break;
        case 'line':
            option = generateLineOption(config);
            break;
        case 'mixed':
            option = generateMixedOption(config);
            break;
    }
    
    // 添加AI分析标注
    if (config.extra) {
        option.title = option.title || {};
        option.title.subtext = `AI分析: ${config.extra}`;
        option.title.subtextStyle = {
            color: '#FFEB3B',
            fontSize: 12
        };
    }
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 生成饼图选项
function generatePieOption(config) {
    return {
        title: {
            text: chartConfigs[config.containerId].title,
            left: 'center',
            textStyle: { color: '#fff' }
        },
        tooltip: {
            trigger: 'item',
            formatter: params => {
                return `${params.name}: ${params.value}<br/>趋势: ${params.data.trend || ''}`;
            }
        },
        series: [{
            name: '交通方式',
            type: 'pie',
            radius: ['40%', '70%'],
            data: config.data,
            label: { color: '#fff' }
        }]
    };
}

// 其他图表选项生成函数...
// (保留原有的generateBarOption、generateLineOption等函数)

// 更新分析洞察
function updateAnalysisInsights(insights) {
    const insightsContainer = $('#analysis-insights');
    insightsContainer.empty();
    
    insights.forEach(insight => {
        insightsContainer.append(
            `<div class="insight-item">
                <i class="ai-icon">🔍</i>
                <span>${insight}</span>
            </div>`
        );
    });
}

// 重置分析条件
function resetAnalysisCriteria() {
    $('#time-range').val('今日');
    $('#region-select').val('全省');
    $('#vehicle-type').val('全部');
    $('#analysis-type').val('流量预测');
    $('#use-ai-check').prop('checked', true);
}

// 保存分析历史
function saveAnalysisHistory(criteria) {
    const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    history.unshift({
        criteria,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('analysisHistory', JSON.stringify(history.slice(0, 10)));
}

// 加载初始数据
function loadInitialData() {
    performSmartAnalysis();
}

// 其他辅助函数...
// (保留原有的debounce、resizeCharts等函数)

// 初始化样式
addSmartAnalysisStyles();