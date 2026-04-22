import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import { User, Unit, Tag } from '../types';

// 模拟数据
const mockUsers: User[] = [
  { id: 'user001', name: '李海峰', role: 'prefecture_auditor', coreUnitId: 'unit_1001', relatedUnitIds: ['unit_1002'], permissions: ['search', 'upload', 'audit_prefecture'] },
  { id: 'user002', name: '王小明', role: 'uploader', coreUnitId: 'unit_1001', relatedUnitIds: [], permissions: ['upload'] },
  { id: 'user003', name: '张三', role: 'province_auditor', coreUnitId: 'unit_001', relatedUnitIds: [], permissions: ['search', 'audit_province'] },
  { id: 'user004', name: '李四', role: 'leader', coreUnitId: 'unit_001', relatedUnitIds: ['unit_1001', 'unit_1002'], permissions: ['search', 'dashboard'] }
];

const mockTags: Tag[] = [
  { id: 1, name: '跨市协作', category: '业务类型' },
  { id: 2, name: '2026雷霆行动', category: '行动代号' },
  { id: 3, name: '在逃人员', category: '人员状态' },
  { id: 4, name: '跨区域作案', category: '案件类型' },
  { id: 5, name: '前科人员', category: '人员状态' }
];

const mockUnits: Unit[] = [
  {
    id: 'unit_001',
    name: '山东省公安厅',
    level: 1,
    children: [
      {
        id: 'unit_1001',
        name: '滨州市公安局',
        level: 2,
        children: [
          {
            id: 'unit_1001_001',
            name: '滨城区分局',
            level: 3
          },
          {
            id: 'unit_1001_002',
            name: '无棣县局',
            level: 3
          }
        ]
      },
      {
        id: 'unit_1002',
        name: '东营市公安局',
        level: 2
      }
    ]
  }
];

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'tags' | 'units'>('users');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 使用模拟数据
    switch (activeTab) {
      case 'users':
        setUsers(mockUsers);
        break;
      case 'tags':
        setTags(mockTags);
        break;
      case 'units':
        setUnits(mockUnits);
        break;
    }
  }, [activeTab]);

  const renderUsers = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">用户权限管理</h2>
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    核心归属单位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    关联单位
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    权限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.coreUnitId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{user.relatedUnitIds.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{user.permissions.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                      <button className="text-red-600 hover:text-red-900">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTags = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">标签库管理</h2>
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map(tag => (
              <div key={tag.id} className="border rounded-md p-4 hover:bg-gray-50">
                <div className="font-medium">{tag.name}</div>
                {tag.category && (
                  <div className="text-sm text-gray-500 mt-1">分类：{tag.category}</div>
                )}
                <div className="mt-2 flex space-x-2">
                  <button className="text-sm text-blue-600 hover:text-blue-900">编辑</button>
                  <button className="text-sm text-red-600 hover:text-red-900">删除</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderUnits = () => {
    const renderTree = (nodes: Unit[], level = 0) => {
      return nodes.map(node => (
        <div key={node.id} className="mb-2">
          <div 
            className="flex items-center py-1 px-2 hover:bg-gray-100 rounded"
            style={{ paddingLeft: `${level * 20}px` }}
          >
            <span className="font-medium">{node.name}</span>
            <div className="ml-auto flex space-x-2">
              <button className="text-xs text-blue-600 hover:text-blue-900">编辑</button>
              <button className="text-xs text-red-600 hover:text-red-900">删除</button>
            </div>
          </div>
          {node.children && node.children.length > 0 && (
            <div className="mt-1">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      ));
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">归属单位维护</h2>
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {renderTree(units)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">系统管理</h1>

      {/* 标签切换 */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            用户权限管理
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'tags' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tags')}
          >
            标签库管理
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${activeTab === 'units' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('units')}
          >
            归属单位维护
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div>
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'tags' && renderTags()}
        {activeTab === 'units' && renderUnits()}
      </div>
    </div>
  );
};

export default AdminPage;
