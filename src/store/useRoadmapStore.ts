import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NodeProgressStatus = 'completed' | 'available' | 'locked';

export type ThemeMode = 'dark' | 'light';

export type ViewMode = 'canvas' | 'grid';

interface RoadmapState {
  completedNodeIds: string[];
  selectedNodeId: string | null;
  searchQuery: string;
  theme: ThemeMode;
  viewMode: ViewMode;
  hasHydrated: boolean;
  
  setHasHydrated: (state: boolean) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setViewMode: (mode: ViewMode) => void;
  toggleNodeCompletion: (nodeId: string) => void;
  resetProgress: () => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      completedNodeIds: [],
      selectedNodeId: null,
      searchQuery: '',
      theme: 'dark',
      viewMode: 'canvas',
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleNodeCompletion: (nodeId) =>
        set((state) => {
          const isCompleted = state.completedNodeIds.includes(nodeId);
          const newCompleted = isCompleted
            ? state.completedNodeIds.filter((id) => id !== nodeId)
            : [...state.completedNodeIds, nodeId];
          return { completedNodeIds: newCompleted };
        }),
      resetProgress: () => set({ completedNodeIds: [], selectedNodeId: null, searchQuery: '' }),
    }),
    {
      name: 'itil-roadmap-progression',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

/**
 * Helper selector to compute node status given its prerequisites.
 */
export const getNodeStatus = (
  nodeId: string,
  prerequisites: string[],
  completedNodeIds: string[]
): NodeProgressStatus => {
  if (completedNodeIds.includes(nodeId)) {
    return 'completed';
  }
  const hasUnmetPrereq = prerequisites.some((prereqId) => !completedNodeIds.includes(prereqId));
  return hasUnmetPrereq ? 'locked' : 'available';
};
