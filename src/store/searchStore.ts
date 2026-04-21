import { create } from 'zustand';
import { SearchResult } from '../types';

interface SearchState {
  keyword: string;
  type: 'person' | 'org' | 'event' | 'document';
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  setKeyword: (keyword: string) => void;
  setType: (type: 'person' | 'org' | 'event' | 'document') => void;
  setResults: (results: SearchResult[], total: number) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  type: 'person',
  results: [],
  total: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  setKeyword: (keyword) => set({ keyword }),
  setType: (type) => set({ type }),
  setResults: (results, total) => set({ results, total }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({
    keyword: '',
    type: 'person',
    results: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false
  })
}));
