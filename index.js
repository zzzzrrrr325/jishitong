/**
 * 日常交通智能分析图表控制器
 * 版本：2.1 (生活化交通版)
 */
$(function(){
    initDailyTrafficCharts();
});
// 更新时间显示
document.getElementById('map-update-time').textContent = new Date().toLocaleTimeString();

// 图表尺寸配置
const chartSizes = {
  'char1': { width: '100%', height: '90px' },
  'char2': { width: '100%', height: '90px' },
  'char3': { width: '100%', height: '90px' },
  'char4': { width: '100%', height: '90px' },
  'hebei-map': { width: '100%', height: '600px' }
};

// 初始化图表尺寸
function initChartSizes() {
  Object.keys(chartSizes).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.width = chartSizes[id].width;
      element.style.height = chartSizes[id].height;
    }
  });
}

// 响应式调整
function resizeCharts() {
  // 调整常规图表
  ['char1', 'char2', 'char3', 'char4'].forEach(id => {
    const chart = echarts.getInstanceByDom(document.getElementById(id));
    if (chart) {
      chart.resize({
        width: chartSizes[id].width,
        height: chartSizes[id].height
      });
    }
  });
  
  // 特殊调整地图
  const map = echarts.getInstanceByDom(document.getElementById('hebei-map'));
  if (map) {
    const mapContainer = document.getElementById('hebei-map');
    // 根据窗口宽度动态调整地图高度
    const newHeight = window.innerWidth < 768 ? '400px' : chartSizes['hebei-map'].height;
    mapContainer.style.height = newHeight;
    map.resize();
  }
}

// 动态修改图表尺寸
function setChartSize(id, width, height) {
  if (chartSizes[id]) {
    // 更新尺寸配置
    chartSizes[id] = { width, height };
    
    // 立即应用新尺寸
    const element = document.getElementById(id);
    const chart = echarts.getInstanceByDom(element);
    
    if (element) {
      element.style.width = width;
      element.style.height = height;
    }
    
    if (chart) {
      chart.resize();
    }
    
    return true;
  }
  return false;
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', () => {
  initChartSizes();
  
  // 监听窗口变化
  window.addEventListener('resize', debounce(resizeCharts, 200));
});

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

window.addEventListener('resize', resizeCharts);
// 初始化日常生活交通图表
function initDailyTrafficCharts() {
    fetchDailyTrafficData().then(data => {
        renderTrafficFlowChart(data.flow, 'char1');
        renderTrafficStatusChart(data.status, 'char2');
        renderTravelPatternChart(data.patterns, 'char3');
        renderSafetyChart(data.safety, 'char4');
        addDailyTrafficInsights(data);
    }).catch(error => {
        console.error('数据加载失败:', error);
        renderFallbackCharts();
    });
}

// 获取日常生活交通数据
function fetchDailyTrafficData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                flow: {
                    updateTime: new Date().toLocaleString(),
                    data: [
                        {value: 6850, name: '私家车', trend: '↑8%', color: '#FF9800'},
                        {value: 4320, name: '公交', trend: '↓2%', color: '#2196F3'},
                        {value: 3250, name: '货运', trend: '↑5%', color: '#4CAF50'},
                        {value: 2780, name: '火车', trend: '→稳定', color: '#9C27B0'}
                    ],
                    insight: "私家车使用率持续增长，公交出行比例略有下降"
                },
                status: {
                    categories: ['早高峰', '午间', '晚高峰', '夜间'],
                    series: [
                        {name: '私家车', data: [4500, 2200, 5200, 1800], color: '#FF9800'},
                        {name: '公交', data: [3200, 1800, 3500, 800], color: '#2196F3'},
                        {name: '货运', data: [1500, 2800, 1800, 2500], color: '#4CAF50'},
                        {name: '火车', data: [1200, 800, 1500, 600], color: '#9C27B0'}
                    ],
                    insight: "早晚高峰私家车流量最大，货运车辆午间活跃度高"
                },
                patterns: {
                    periods: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                    data: [
                        {name: '私家车', values: [800, 500, 4200, 3800, 4500, 3500]},
                        {name: '公交', values: [200, 100, 3800, 2500, 3200, 1800]},
                        {name: '货运', values: [1800, 2200, 1500, 2800, 2500, 2000]},
                        {name: '火车', values: [600, 400, 1200, 800, 1500, 1000]}
                    ],
                    insight: "公交早晚高峰特征明显，货运全天分布较均匀"
                },
                safety: {
                    categories: ['私家车', '公交', '货运', '火车'],
                    incidents: [1250, 320, 580, 80],
                    severity: [6.8, 3.2, 8.2, 1.5],
                    insight: "货运事故严重程度最高，火车安全性最佳"
                }
            });
        }, 800);
    });
}

// 交通方式分布饼图
function renderTrafficFlowChart(chartData, elementId) {
    const chart = echarts.init(document.getElementById(elementId));
    
    const option = {
        backgroundColor: 'transparent',
       
        tooltip: {
            trigger: 'item',
            formatter: params => {
                return `${params.name}: ${params.value}辆<br/>趋势: ${params.data.trend}`;
            }
        },
        
        series: [{
            name: '交通方式',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            data: chartData.data.map(item => ({
                ...item,
                itemStyle: { color: item.color }
            })),
            label: {
                color: '#fff',
                formatter: '{b}: {d}%'
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 交通状态堆叠柱状图
function renderTrafficStatusChart(chartData, elementId) {
    const chart = echarts.init(document.getElementById(elementId));
    
    const option = {
        backgroundColor: 'transparent',
       
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: chartData.series.map(item => item.name),
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chartData.categories,
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff' }
        },
        series: chartData.series.map(item => ({
            name: item.name,
            type: 'bar',
            stack: '总量',
            data: item.data,
            itemStyle: { color: item.color },
            label: {
                show: true,
                position: 'inside',
                color: '#fff'
            }
        }))
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 出行模式折线图
function renderTravelPatternChart(chartData, elementId) {
    const chart = echarts.init(document.getElementById(elementId));
    
    const option = {
        backgroundColor: 'transparent',
        
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: chartData.data.map(item => item.name),
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartData.periods,
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff' }
        },
        series: chartData.data.map(item => ({
            name: item.name,
            type: 'line',
            smooth: true,
            data: item.values,
            lineStyle: { width: 3 }
        }))
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 交通安全柱状图
function renderSafetyChart(chartData, elementId) {
    const chart = echarts.init(document.getElementById(elementId));
    
    const option = {
        backgroundColor: 'transparent',
        
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['事故数量', '严重程度(1-10)'],
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '1%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: chartData.categories,
            axisLabel: { 
                color: '#fff',
                interval: 0
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '事故数量',
                axisLabel: { color: '#fff' }
            },
            {
                type: 'value',
                name: '严重程度',
                axisLabel: { color: '#fff' }
            }
        ],
        series: [
            {
                name: '事故数量',
                type: 'bar',
                data: chartData.incidents,
                itemStyle: {
                    color: params => {
                        const colors = ['#FF5252', '#2196F3', '#FF9800', '#4CAF50'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            },
            {
                name: '严重程度',
                type: 'line',
                yAxisIndex: 1,
                data: chartData.severity,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: { width: 3 },
                itemStyle: { color: '#FFEB3B' }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 添加交通洞察
function addDailyTrafficInsights(data) {
 
    
    insights.forEach((text, index) => {
        const div = document.createElement('div');
        div.className = 'traffic-insight';
        div.innerHTML = text;
        document.getElementById(`char${index+1}`).appendChild(div);
    });
}




// 初始化样式
addTrafficChartStyles();