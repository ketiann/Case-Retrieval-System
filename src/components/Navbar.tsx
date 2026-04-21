import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();

  const navItems = [
    { path: '/search', label: '综合检索' },
    { path: '/upload', label: '文档上传' },
    { path: '/audit/prefecture', label: '地市审核' },
    { path: '/audit/province', label: '省厅汇总' },
    { path: '/dashboard', label: '领导驾驶舱' },
    { path: '/admin', label: '系统管理' }
  ];

  return (
    <nav className="bg-[#1a365d] text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">案件检索系统</div>
        </div>
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path ? 'bg-[#3182ce]' : 'hover:bg-[#2c5282]'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{user.name}</span>
              <span className="text-xs bg-[#3182ce] px-2 py-1 rounded">{user.role}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
