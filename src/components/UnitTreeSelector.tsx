import React, { useState, useEffect } from 'react';
import { Unit } from '../types';
import { adminApi } from '../api';

interface UnitTreeSelectorProps {
  multiple?: boolean;
  selectedIds?: string[];
  onChange?: (ids: string[]) => void;
  placeholder?: string;
}

const UnitTreeSelector: React.FC<UnitTreeSelectorProps> = ({
  multiple = false,
  selectedIds = [],
  onChange,
  placeholder = '请选择单位'
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);

  useEffect(() => {
    fetchUnits();
  }, []);

  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUnits();
      if (response.code === 0) {
        setUnits(response.data.tree);
        // 自动展开所有节点
        const keys: string[] = [];
        const collectKeys = (nodes: Unit[]) => {
          nodes.forEach(node => {
            keys.push(node.id);
            if (node.children && node.children.length > 0) {
              collectKeys(node.children);
            }
          });
        };
        collectKeys(response.data.tree);
        setExpandedKeys(keys);
      }
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (unitId: string, checked: boolean) => {
    let newSelectedIds: string[];
    if (multiple) {
      if (checked) {
        newSelectedIds = [...localSelectedIds, unitId];
      } else {
        newSelectedIds = localSelectedIds.filter(id => id !== unitId);
      }
    } else {
      newSelectedIds = checked ? [unitId] : [];
    }
    setLocalSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds);
  };

  const handleExpand = (unitId: string, expanded: boolean) => {
    if (expanded) {
      setExpandedKeys([...expandedKeys, unitId]);
    } else {
      setExpandedKeys(expandedKeys.filter(key => key !== unitId));
    }
  };

  const renderTree = (nodes: Unit[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="tree-node">
        <div 
          className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {node.children && node.children.length > 0 && (
            <button
              className="mr-2 text-gray-500"
              onClick={() => handleExpand(node.id, !expandedKeys.includes(node.id))}
            >
              {expandedKeys.includes(node.id) ? '▼' : '▶'}
            </button>
          )}
          {!node.children || node.children.length === 0 && (
            <span className="mr-2">•</span>
          )}
          <input
            type="checkbox"
            checked={localSelectedIds.includes(node.id)}
            onChange={(e) => handleCheck(node.id, e.target.checked)}
            className="mr-2"
          />
          <span>{node.name}</span>
        </div>
        {node.children && node.children.length > 0 && expandedKeys.includes(node.id) && (
          <div className="tree-children">
            {renderTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="unit-tree-selector">
      <div className="border rounded-md p-2 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">加载中...</div>
        ) : (
          <div>
            {renderTree(units)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTreeSelector;
