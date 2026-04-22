import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">案件检索系统</h1>
        <p className="text-xl text-gray-600 mb-12">高效、精准的案件信息检索与管理平台</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/search" className="bg-blue-600 text-white p-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2">综合检索</h2>
            <p className="text-sm">快速搜索案件相关的人物、单位、事件和文档</p>
          </Link>
          
          <Link to="/upload" className="bg-green-600 text-white p-8 rounded-lg shadow-lg hover:bg-green-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2">文档上传</h2>
            <p className="text-sm">上传案件相关文档，支持多种格式</p>
          </Link>
          
          <Link to="/dashboard" className="bg-purple-600 text-white p-8 rounded-lg shadow-lg hover:bg-purple-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2">数据看板</h2>
            <p className="text-sm">查看案件统计数据和趋势分析</p>
          </Link>
          
          <Link to="/admin" className="bg-gray-600 text-white p-8 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2">系统管理</h2>
            <p className="text-sm">管理用户权限、标签库和归属单位</p>
          </Link>
        </div>
        
        <div className="mt-16 bg-gray-100 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">系统功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-left">
              <h3 className="font-medium text-gray-800 mb-2">🔍 智能检索</h3>
              <p className="text-gray-600">支持多维度关键词搜索，快速定位相关信息</p>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800 mb-2">📊 数据可视化</h3>
              <p className="text-gray-600">直观展示案件统计数据和趋势分析</p>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800 mb-2">🔗 实体关联</h3>
              <p className="text-gray-600">自动构建人物、单位、事件之间的关联关系</p>
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-800 mb-2">🛡️ 权限管理</h3>
              <p className="text-gray-600">精细的角色权限控制，确保数据安全</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}