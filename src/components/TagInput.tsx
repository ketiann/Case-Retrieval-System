import React, { useState, useEffect } from 'react';
import { Tag } from '../types';
import { adminApi } from '../api';

interface TagInputProps {
  selectedTags?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  selectedTags = [],
  onChange,
  placeholder = '请输入或选择标签'
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTags();
      if (response.code === 0) {
        setTags(response.data.list);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tagName: string) => {
    if (!localSelectedTags.includes(tagName)) {
      const newTags = [...localSelectedTags, tagName];
      setLocalSelectedTags(newTags);
      onChange?.(newTags);
    }
  };

  const handleTagRemove = (tagName: string) => {
    const newTags = localSelectedTags.filter(tag => tag !== tagName);
    setLocalSelectedTags(newTags);
    onChange?.(newTags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const trimmedValue = inputValue.trim();
      if (!localSelectedTags.includes(trimmedValue)) {
        const newTags = [...localSelectedTags, trimmedValue];
        setLocalSelectedTags(newTags);
        onChange?.(newTags);
      }
      setInputValue('');
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) && 
    !localSelectedTags.includes(tag.name)
  );

  return (
    <div className="tag-input">
      <div className="flex flex-wrap gap-2 mb-2">
        {localSelectedTags.map(tag => (
          <span key={tag} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {tag}
            <button 
              className="ml-2 text-blue-600 hover:text-blue-800"
              onClick={() => handleTagRemove(tag)}
            >
              ×
            </button>
          </span>
        ))}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder={placeholder}
            className="px-3 py-1 border rounded-md text-sm"
          />
          {showDropdown && inputValue && filteredTags.length > 0 && (
            <div className="absolute z-10 mt-1 w-64 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filteredTags.map(tag => (
                <div
                  key={tag.id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleTagClick(tag.name);
                    setInputValue('');
                    setShowDropdown(false);
                  }}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
          {showDropdown && inputValue && filteredTags.length === 0 && (
            <div className="absolute z-10 mt-1 w-64 bg-white border rounded-md shadow-lg p-2">
              <div className="text-sm text-gray-500">
                将创建新标签: {inputValue}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagInput;
