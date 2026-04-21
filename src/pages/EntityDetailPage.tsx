import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { entityApi } from '../api';
import { Entity, GraphData, Timeline, TimelineNode } from '../types';
import EventTimeline from '../components/EventTimeline';
import * as G6 from '@antv/g6';

const EntityDetailPage: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'graph' | 'timeline'>('graph');
  const graphRef = useRef<HTMLDivElement>(null);
  const graphInstance = useRef<G6.Graph | null>(null);

  useEffect(() => {
    if (type && id) {
      fetchEntityData();
    }
  }, [type, id]);

  useEffect(() => {
    if (activeTab === 'graph' && graphData.nodes.length > 0 && graphRef.current) {
      renderGraph();
    }
  }, [activeTab, graphData]);

  const fetchEntityData = async () => {
    if (!type || !id) return;

    setLoading(true);
    try {
      const response = await entityApi.getEntity(type, id);
      if (response.code === 0) {
        setEntity(response.data.basicInfo);
        setGraphData(response.data.graph);
        setTimelines(response.data.timelines);
      }
    } catch (error) {
      console.error('Failed to fetch entity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderGraph = () => {
    if (!graphRef.current) return;

    // 销毁之前的图实例
    if (graphInstance.current) {
      graphInstance.current.destroy();
    }

    // 创建新的图实例
    const graph = new G6.Graph({
      container: graphRef.current,
      width: graphRef.current.clientWidth,
      height: 600
    } as any);

    // 设置默认节点样式
    (graph as any).setDefaultNode({
      size: 40,
      style: {
        fill: '#3182ce',
        stroke: '#1a365d',
        lineWidth: 2
      },
      labelCfg: {
        style: {
          fill: '#fff',
          fontSize: 12
        }
      }
    });

    // 设置默认边样式
    (graph as any).setDefaultEdge({
      style: {
        stroke: '#999',
        lineWidth: 2
      },
      labelCfg: {
        style: {
          fill: '#666',
          fontSize: 10
        }
      }
    });

    // 处理节点样式
    const nodes = graphData.nodes.map(node => ({
      ...node,
      style: {
        fill: node.core ? '#e53e3e' : '#3182ce',
        stroke: '#1a365d',
        lineWidth: 2
      }
    }));

    // 处理边样式
    const edges = graphData.edges.map(edge => ({
      ...edge,
      label: edge.relation
    }));

    // 加载数据
    (graph as any).data({ nodes, edges });
    (graph as any).render();

    // 保存图实例
    graphInstance.current = graph;
  };

  const handleNodeClick = (node: TimelineNode) => {
    // 处理时间轴节点点击事件
    console.log('Node clicked:', node);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">加载中...</div>;
  }

  if (!entity) {
    return <div className="container mx-auto px-4 py-8 text-center">未找到实体信息</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{entity.name} - 详情</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧：实体基础信息 */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gray-500">{entity.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-semibold">{entity.name}</h2>
              {entity.type === 'person' && entity.properties.idNumber && (
                <p className="text-sm text-gray-500 mt-1">{entity.properties.idNumber}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">核心归属单位</h3>
                <p className="text-sm">🏢 {entity.coreUnitId}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">关联单位</h3>
                <div className="flex flex-wrap gap-2">
                  {entity.relatedUnitIds.map((unitId, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      🔗 {unitId}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">业务标签</h3>
                <div className="flex flex-wrap gap-2">
                  {entity.businessTags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      🏷️ {tag}
                    </span>
                  ))}
                </div>
              </div>

              {entity.properties && Object.entries(entity.properties).map(([key, value]) => (
                <div key={key}>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{key}</h3>
                  <p className="text-sm">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：知识图谱和时间轴 */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* 标签切换 */}
            <div className="border-b border-gray-200 mb-6">
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'graph' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('graph')}
                >
                  知识图谱
                </button>
                <button
                  className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'timeline' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveTab('timeline')}
                >
                  事件时间轴
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div>
              {activeTab === 'graph' ? (
                <div ref={graphRef} className="w-full h-96 border rounded-md"></div>
              ) : (
                <EventTimeline 
                  timelineData={timelines} 
                  onNodeClick={handleNodeClick}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDetailPage;
