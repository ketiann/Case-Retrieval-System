import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { searchApi } from '../api';

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
      const response = await searchApi.search(keyword, type, page, pageSize);
      if (response.code === 0) {
        setResults(response.data.list, response.data.total);
      }
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
