import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { searchApi } from '../api';

// 模拟搜索结果数据
const mockSearchResults = {
  person: [
    {
      entityId: 'person_9527',
      name: '刘强',
      highlightSummary: '身份证号372324199407081052，<em>刘强</em>于2026年4月18日涉嫌抢劫',
      coreUnit: '滨州市无棣县棣丰街道',
      relatedUnits: ['滨城分局刑侦大队'],
      businessTags: ['跨区域作案', '前科人员'],
      eventCount: 2,
      documentCount: 5
    },
    {
      entityId: 'person_9528',
      name: '王小明',
      highlightSummary: '身份证号372324199501011234，<em>王小明</em>是4·18抢劫案的受害人',
      coreUnit: '滨州市滨城区',
      relatedUnits: ['滨城分局刑侦大队'],
      businessTags: ['受害人'],
      eventCount: 1,
      documentCount: 2
    }
  ],
  org: [
    {
      entityId: 'org_1001',
      name: '滨州市无棣县棣丰街道',
      highlightSummary: '<em>滨州市无棣县棣丰街道</em>是刘强的核心归属单位',
      coreUnit: '滨州市无棣县棣丰街道',
      relatedUnits: [],
      businessTags: [],
      eventCount: 5,
      documentCount: 10
    }
  ],
  event: [
    {
      entityId: 'event_88',
      name: '4·18滨城区抢劫案',
      highlightSummary: '<em>4·18滨城区抢劫案</em>发生于2026年4月18日，嫌疑人刘强',
      coreUnit: '滨城分局刑侦大队',
      relatedUnits: ['无棣县棣丰街道'],
      businessTags: ['跨区域作案'],
      eventCount: 0,
      documentCount: 8
    }
  ],
  document: [
    {
      entityId: 'doc_123',
      name: '4·18抢劫案现场勘查报告',
      highlightSummary: '这是<em>4·18抢劫案</em>的现场勘查报告，包含详细的现场情况',
      coreUnit: '滨城分局刑侦大队',
      relatedUnits: [],
      businessTags: ['现场勘查'],
      eventCount: 1,
      documentCount: 0
    }
  ]
};

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    keyword,
    type,
    results,
    total,
    page,
    pageSize,
    loading,
    setKeyword,
    setType,
    setResults,
    setPage,
    setLoading
  } = useSearchStore();

  // 从URL参数初始化搜索条件
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlType = (searchParams.get('type') as 'person' | 'org' | 'event' | 'document') || 'person';
    const urlPage = parseInt(searchParams.get('page') || '1');
    
    if (urlKeyword !== keyword) {
      setKeyword(urlKeyword);
    }
    if (urlType !== type) {
      setType(urlType);
    }
    if (urlPage !== page) {
      setPage(urlPage);
    }
  }, [searchParams, keyword, type, page, setKeyword, setType, setPage]);

  // 执行搜索
  useEffect(() => {
    if (keyword) {
      performSearch();
    }
  }, [keyword, type, page, pageSize]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // 使用模拟数据
      const results = mockSearchResults[type as keyof typeof mockSearchResults] || [];
      setResults(results, results.length);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateUrl();
  };

  const handleTypeChange = (newType: 'person' | 'org' | 'event' | 'document') => {
    setType(newType);
    setPage(1);
    updateUrl();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrl();
  };

  const updateUrl = () => {
    const newParams = new URLSearchParams();
    if (keyword) {
      newParams.set('keyword', keyword);
    }
    newParams.set('type', type);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const renderSearchResult = (result: any) => {
    return (
      <div key={result.entityId} className="bg-white p-4 rounded-md shadow-sm mb-4">
        <Link to={`/entity/${type}/${result.entityId}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {result.name}
        </Link>
        <div 
          className="mt-2 text-gray-600"
          dangerouslySetInnerHTML={{ __html: result.highlightSummary }}
        />
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex flex-wrap gap-2">
            <span>🏢 {result.coreUnit}</span>
            {result.relatedUnits.map((unit: string, index: number) => (
              <span key={index}>🔗 {unit}</span>
            ))}
            {result.businessTags.map((tag: string, index: number) => (
              <span key={index}>🏷️ {tag}</span>
            ))}
          </div>
          <div className="mt-1">
            关联事件数：{result.eventCount} | 涉及单位：{result.relatedUnits.join('、')} | 业务标签：{result.businessTags.join('、')}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索框区域 */}
      <div className="max-w-3xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="flex flex-col items-center">
          <div className="w-full flex">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="请输入关键词进行搜索"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              搜索
            </button>
          </div>
        </form>
      </div>

      {/* 结果分页签 */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 border-b-2 font-medium ${type === 'person' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTypeChange('person')}
          >
            人物
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${type === 'org' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTypeChange('org')}
          >
            单位
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${type === 'event' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTypeChange('event')}
          >
            事件
          </button>
          <button
            className={`px-4 py-2 border-b-2 font-medium ${type === 'document' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => handleTypeChange('document')}
          >
            文档
          </button>
        </div>
      </div>

      {/* 搜索结果 */}
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8">搜索中...</div>
        ) : keyword ? (
          results.length > 0 ? (
            <>
              {results.map(renderSearchResult)}
              
              {/* 分页 */}
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1 border rounded-md text-sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    上一页
                  </button>
                  <span className="px-3 py-1 text-sm">
                    第 {page} 页，共 {Math.ceil(total / pageSize)} 页
                  </span>
                  <button
                    className="px-3 py-1 border rounded-md text-sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil(total / pageSize)}
                  >
                    下一页
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">未找到相关结果</div>
          )
        ) : (
          <div className="text-center py-16 text-gray-500">
            请输入关键词进行搜索
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
