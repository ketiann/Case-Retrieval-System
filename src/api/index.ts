import axios, { AxiosInstance } from 'axios';
import { ApiResponse, SearchResult, PaginatedResponse, Entity, GraphData, Timeline, DashboardStatistics } from '../types';
import { useUserStore } from '../store/userStore';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const user = useUserStore.getState().user;
    if (user) {
      // 添加认证信息到请求头
      config.headers['Authorization'] = `Bearer ${user.id}`;
      // 添加用户信息到请求参数
      config.params = {
        ...config.params,
        unitId: user.coreUnitId,
        role: user.role
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 类型声明，确保API函数返回正确的类型
declare module 'axios' {
  interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  }
}

// 文档上传
export const documentApi = {
  upload: (formData: FormData) => {
    return api.post<any>('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  preUpload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<any>('/document/pre-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// 审核管理
export const auditApi = {
  getPrefectureList: (page: number, pageSize: number) => {
    return api.get<any>('/audit/prefecture', {
      params: { page, pageSize }
    });
  },
  getProvinceList: (page: number, pageSize: number) => {
    return api.get<any>('/audit/province', {
      params: { page, pageSize }
    });
  },
  merge: (sourceId: string, targetId: string) => {
    return api.post<any>('/audit/merge', { sourceId, targetId });
  },
  pass: (entityId: string) => {
    return api.post<any>('/audit/pass', { entityId });
  },
  reject: (entityId: string, reason: string) => {
    return api.post<any>('/audit/reject', { entityId, reason });
  }
};

// 综合检索
export const searchApi = {
  search: (keyword: string, type: string, page: number, pageSize: number) => {
    return api.get<any>('/search', {
      params: { keyword, type, page, pageSize }
    });
  }
};

// 实体详情
export const entityApi = {
  getEntity: (type: string, id: string) => {
    return api.get<any>(`/entity/${type}/${id}`);
  }
};

// 领导驾驶舱
export const dashboardApi = {
  getStatistics: (timeRange: string, units?: string[]) => {
    return api.get<any>('/dashboard/statistics', {
      params: { timeRange, units: units?.join(',') }
    });
  }
};

// 系统管理
export const adminApi = {
  getUsers: () => {
    return api.get<any>('/admin/users');
  },
  getTags: () => {
    return api.get<any>('/admin/tags');
  },
  getUnits: () => {
    return api.get<any>('/admin/units');
  }
};

export default api;
