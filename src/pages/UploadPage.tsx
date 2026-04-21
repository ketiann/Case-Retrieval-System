import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { documentApi } from '../api';
import UnitTreeSelector from '../components/UnitTreeSelector';
import TagInput from '../components/TagInput';

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [coreUnitId, setCoreUnitId] = useState<string[]>([]);
  const [businessTags, setBusinessTags] = useState<string[]>([]);
  const [relatedUnitIds, setRelatedUnitIds] = useState<string[]>([]);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      message.error('请选择文件');
      return;
    }
    if (coreUnitId.length === 0) {
      message.error('请选择核心归属单位');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });
      formData.append('metadata', JSON.stringify({
        coreUnitId: coreUnitId[0],
        businessTags,
        relatedUnitIds,
        remark
      }));

      const response = await documentApi.upload(formData);
      if (response.code === 0) {
        message.success('上传成功');
        // 重置表单
        setFiles([]);
        setCoreUnitId([]);
        setBusinessTags([]);
        setRelatedUnitIds([]);
        setRemark('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        message.error(response.message || '上传失败');
      }
    } catch (error) {
      message.error('上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">文档上传</h1>
      
      {/* 文件上传区域 */}
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".docx,.pdf,.jpg,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="text-gray-500 mb-4">
          <p>点击或拖拽文件到此处上传</p>
          <p className="text-sm mt-1">支持 .docx, .pdf, .jpg, .txt 格式</p>
        </div>
        
        {/* 已选择文件列表 */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">已选择文件：</h3>
            <div className="max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1">
                  <span className="text-sm">{file.name}</span>
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFile(index)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 元数据表单 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">元数据信息</h2>
        
        <div className="space-y-4">
          {/* 核心归属单位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              核心归属单位 *
            </label>
            <UnitTreeSelector
              selectedIds={coreUnitId}
              onChange={setCoreUnitId}
            />
          </div>

          {/* 业务标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              业务标签 *
            </label>
            <TagInput
              selectedTags={businessTags}
              onChange={setBusinessTags}
            />
          </div>

          {/* 关联单位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              关联单位
            </label>
            <UnitTreeSelector
              multiple
              selectedIds={relatedUnitIds}
              onChange={setRelatedUnitIds}
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="用于说明'挂职'、'跨市协作'等特殊情况"
              className="w-full border rounded-md p-2 text-sm"
              rows={3}
            />
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? '上传中...' : '提交上传'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
