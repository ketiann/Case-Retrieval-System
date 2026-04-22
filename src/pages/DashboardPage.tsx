import React, { useState, useEffect, useRef } from 'react';
import { dashboardApi } from '../api';
import { DashboardStatistics, Alert } from '../types';
import * as echarts from 'echarts';

// 模拟数据
const mockStatistics: DashboardStatistics = {
  kpi: {
    newCases: 12,
    activeCases: 89,
    arrestedToday: 5,
    totalAmount: 2300000
  },
  caseTypeDistribution: [
    { type: '刑事', value: 45, subTypes: [{ name: '抢劫', value: 10 }, { name: '盗窃', value: 20 }, { name: '故意伤害', value: 15 }] },
    { type: '禁毒', value: 15 },
    { type: '交通', value: 25 },
    { type: '其他', value: 15 }
  ],
  trend: {
    dates: ['04-15', '04-16', '04-17', '04-18', '04-19', '04-20', '04-21'],
    binzhou: [5, 7, 6, 12, 9, 8, 11],
    huimin: [2, 1, 3, 2, 4, 1, 2]
  },
  heatmapData: [
    { lng: 118.02, lat: 37.38, count: 3 },
    { lng: 118.03, lat: 37.39, count: 1 },
    { lng: 118.01, lat: 37.37, count: 2 },
    { lng: 118.04, lat: 37.40, count: 4 },
    { lng: 118.00, lat: 37.36, count: 1 }
  ],
  alerts: [
    { id: 'a1', title: '刘强抓捕任务已下达', type: '抓捕', targetUrl: '/entity/person/9527' },
    { id: 'a2', title: '4·18滨城区抢劫案需要补充证据', type: '证据补充', targetUrl: '/entity/event/88' },
    { id: 'a3', title: '系统需要更新到最新版本', type: '系统更新', targetUrl: '/admin' }
  ],
  relationGraph: {
    nodes: [
      { id: 'person_9527', label: '刘强', type: 'person', core: true },
      { id: 'org_201', label: '无棣县棣丰街道', type: 'org' },
      { id: 'event_88', label: '4·18抢劫案', type: 'event' },
      { id: 'org_202', label: '滨城分局', type: 'org' },
      { id: 'person_9528', label: '王小明', type: 'person' }
    ],
    edges: [
      { source: 'person_9527', target: 'org_201', relation: '核心归属' },
      { source: 'person_9527', target: 'event_88', relation: '嫌疑人' },
      { source: 'event_88', target: 'org_202', relation: '主办单位' },
      { source: 'person_9528', target: 'event_88', relation: '受害人' }
    ]
  }
};

const DashboardPage: React.FC = () => {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(mockStatistics);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('today');
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  
  const caseTypeChartRef = useRef<HTMLDivElement>(null);
  const trendChartRef = useRef<HTMLDivElement>(null);
  const heatmapChartRef = useRef<HTMLDivElement>(null);
  const relationChartRef = useRef<HTMLDivElement>(null);
  
  const caseTypeChart = useRef<echarts.ECharts | null>(null);
  const trendChart = useRef<echarts.ECharts | null>(null);
  const heatmapChart = useRef<echarts.ECharts | null>(null);
  const relationChart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, [timeRange, selectedUnits]);

  useEffect(() => {
    if (statistics) {
      renderCharts();
    }
  }, [statistics]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const response = await dashboardApi.getStatistics(timeRange, selectedUnits);
      if (response.code === 0) {
        setStatistics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCharts = () => {
    if (!displayStatistics) return;

    // 渲染案件类型分布图表
    if (caseTypeChartRef.current) {
      if (!caseTypeChart.current) {
        caseTypeChart.current = echarts.init(caseTypeChartRef.current);
      }
      const option = {
        title: {
          text: '案件类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '案件类型',
            type: 'pie',
            radius: '50%',
            data: displayStatistics.caseTypeDistribution.map(item => ({
              value: item.value,
              name: item.type
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      caseTypeChart.current.setOption(option);
    }

    // 渲染案件趋势图表
    if (trendChartRef.current) {
      if (!trendChart.current) {
        trendChart.current = echarts.init(trendChartRef.current);
      }
      const series = Object.keys(displayStatistics.trend)
        .filter(key => key !== 'dates')
        .map(key => ({
          name: key,
          type: 'line',
          data: displayStatistics.trend[key] as number[]
        }));
      const option = {
        title: {
          text: '近7天案件趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: Object.keys(displayStatistics.trend).filter(key => key !== 'dates'),
          bottom: 0
        },
        xAxis: {
          type: 'category',
          data: displayStatistics.trend.dates
        },
        yAxis: {
          type: 'value'
        },
        series
      };
      trendChart.current.setOption(option);
    }

    // 渲染地图热力图
    if (heatmapChartRef.current) {
      if (!heatmapChart.current) {
        heatmapChart.current = echarts.init(heatmapChartRef.current);
      }
      const option = {
        title: {
          text: '滨州市地图热力图',
          left: 'center'
        },
        tooltip: {
          position: 'top'
        },
        visualMap: {
          min: 0,
          max: Math.max(...displayStatistics.heatmapData.map(item => item.count)),
          calculable: true,
          inRange: {
            color: ['#e0f2fe', '#38bdf8', '#0284c7']
          },
          left: 'left',
          bottom: '10%'
        },
        geo: {
          map: 'china',
          roam: true,
          zoom: 12,
          center: [118.02, 37.38], // 滨州市中心坐标
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#f0f9ff',
              borderColor: '#94a3b8'
            },
            emphasis: {
              areaColor: '#dbeafe'
            }
          }
        },
        series: [
          {
            name: '案件数量',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: displayStatistics.heatmapData.map(item => ({
              value: [item.lng, item.lat, item.count]
            })),
            symbolSize: function (val: any) {
              return val[2] * 5;
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            }
          }
        ]
      };
      heatmapChart.current.setOption(option);
    }

    // 渲染动态实体关联网络
    if (relationChartRef.current) {
      if (!relationChart.current) {
        relationChart.current = echarts.init(relationChartRef.current);
      }
      const option = {
        title: {
          text: '动态实体关联网络',
          left: 'center'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut' as const,
        series: [
          {
            type: 'graph',
            layout: 'force',
            force: {
              repulsion: 100,
              edgeLength: [40, 100]
            },
            roam: true,
            label: {
              show: true
            },
            data: displayStatistics.relationGraph.nodes.map(node => ({
              name: node.label,
              symbolSize: node.core ? 30 : 20
            })),
            links: displayStatistics.relationGraph.edges.map(edge => ({
              source: edge.source,
              target: edge.target
            })),
            lineStyle: {
              opacity: 0.9,
              width: 2,
              curveness: 0
            }
          }
        ]
      };
      relationChart.current.setOption(option);
    }
  };

  // 使用模拟数据
  const displayStatistics = statistics || mockStatistics;

  if (loading && !statistics) {
    return <div className="container mx-auto px-4 py-8 text-center">加载中...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">数据看板</h1>

      {/* 时间筛选器 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md ${timeRange === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('today')}
          >
            今日
          </button>
          <button
            className={`px-4 py-2 rounded-md ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('week')}
          >
            本周
          </button>
          <button
            className={`px-4 py-2 rounded-md ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('month')}
          >
            本月
          </button>
          <button
            className={`px-4 py-2 rounded-md ${timeRange === 'custom' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setTimeRange('custom')}
          >
            自定义
          </button>
        </div>
      </div>

      {/* KPI卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">今日新增案件</div>
          <div className="text-2xl font-bold text-blue-600">{displayStatistics.kpi.newCases}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">在侦案件</div>
          <div className="text-2xl font-bold text-green-600">{displayStatistics.kpi.activeCases}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">今日抓获</div>
          <div className="text-2xl font-bold text-red-600">{displayStatistics.kpi.arrestedToday}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-500 mb-1">涉案总金额</div>
          <div className="text-2xl font-bold text-purple-600">¥{displayStatistics.kpi.totalAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* 第二行：案件类型分布和趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div ref={caseTypeChartRef} className="w-full h-80"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div ref={trendChartRef} className="w-full h-80"></div>
        </div>
      </div>

      {/* 第三行：地图热力图和最新预警 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div ref={heatmapChartRef} className="w-full h-80"></div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">最新待办与预警</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {displayStatistics.alerts.map(alert => (
              <div key={alert.id} className="p-3 border rounded-md hover:bg-gray-50">
                <div className="font-medium">{alert.title}</div>
                <div className="text-sm text-gray-500 mt-1">类型：{alert.type}</div>
                <a href={alert.targetUrl} className="text-sm text-blue-600 mt-1 inline-block">
                  查看详情
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部：动态实体关联网络 */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div ref={relationChartRef} className="w-full h-96"></div>
      </div>
    </div>
  );
};

export default DashboardPage;
