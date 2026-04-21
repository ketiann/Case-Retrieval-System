// 用户相关类型
export interface User {
  id: string;
  name: string;
  role: 'uploader' | 'prefecture_auditor' | 'province_auditor' | 'leader';
  coreUnitId: string;
  relatedUnitIds: string[];
  permissions: string[];
}

// 单位相关类型
export interface Unit {
  id: string;
  name: string;
  parentId?: string;
  level: number;
  children?: Unit[];
}

// 标签相关类型
export interface Tag {
  id: number;
  name: string;
  category?: string;
}

// 文档相关类型
export interface Document {
  id: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  uploaderId: number;
  coreUnitId: string;
  businessTags: string[];
  relatedUnitIds: string[];
  remark?: string;
  status: string;
  createdAt: string;
}

// 实体相关类型
export interface Entity {
  id: string;
  name: string;
  type: 'person' | 'org' | 'event' | 'document';
  coreUnitId: string;
  properties: Record<string, any>;
  businessTags: string[];
  relatedUnitIds: string[];
  status: string;
  createdAt: string;
}

// 关系相关类型
export interface Relation {
  id: number;
  sourceId: string;
  targetId: string;
  relationType: string;
  createdAt: string;
}

// 事件相关类型
export interface Event {
  id: string;
  name: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  coreUnitId: string;
  status: string;
  createdAt: string;
}

// 时间轴节点相关类型
export interface TimelineNode {
  id: number;
  eventId: string;
  time: string;
  title: string;
  description?: string;
  docId?: string;
  evidenceUrl?: string;
  createdAt: string;
}

// 审核日志相关类型
export interface AuditLog {
  id: number;
  entityId: string;
  auditorId: number;
  action: 'pass' | 'reject' | 'merge';
  comment?: string;
  createdAt: string;
}

// 搜索结果相关类型
export interface SearchResult {
  entityId: string;
  name: string;
  highlightSummary: string;
  coreUnit: string;
  relatedUnits: string[];
  businessTags: string[];
  eventCount: number;
  documentCount: number;
}

// 知识图谱相关类型
export interface GraphNode {
  id: string;
  label: string;
  type: string;
  core?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// 时间轴相关类型
export interface Timeline {
  eventId: string;
  eventName: string;
  nodes: TimelineNode[];
}

// KPI相关类型
export interface KPI {
  newCases: number;
  activeCases: number;
  arrestedToday: number;
  totalAmount: number;
}

// 案件类型分布相关类型
export interface CaseType {
  type: string;
  value: number;
  subTypes?: {
    name: string;
    value: number;
  }[];
}

// 案件趋势相关类型
export interface Trend {
  dates: string[];
  [key: string]: string[] | number[];
}

// 热力图数据相关类型
export interface HeatmapData {
  lng: number;
  lat: number;
  count: number;
}

// 预警相关类型
export interface Alert {
  id: string;
  title: string;
  type: string;
  targetUrl: string;
}

// 驾驶舱统计数据相关类型
export interface DashboardStatistics {
  kpi: KPI;
  caseTypeDistribution: CaseType[];
  trend: Trend;
  heatmapData: HeatmapData[];
  alerts: Alert[];
  relationGraph: GraphData;
}

// API响应相关类型
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

// 分页相关类型
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// 分页响应相关类型
export interface PaginatedResponse<T> {
  total: number;
  list: T[];
}