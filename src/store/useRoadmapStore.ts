import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type NodeProgressStatus = 'completed' | 'available' | 'locked';

export const CHANGE_MANAGER_FOCUS_NODE_IDS = [
  'change-enablement',
  'release-management',
  'deployment-management',
  'service-configuration-management',
  'incident-management',
  'problem-management',
  'it-asset-management',
  'governance',
  'svc-plan',
  'svc-design-transition'
];

export type ThemeMode = 'dark' | 'light';

interface RoadmapState {
  completedNodeIds: string[];
  selectedNodeId: string | null;
  searchQuery: string;
  isChangeManagerFocusMode: boolean;
  theme: ThemeMode;
  hasHydrated: boolean;
  
  setHasHydrated: (state: boolean) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleChangeManagerFocusMode: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleNodeCompletion: (nodeId: string) => void;
  resetProgress: () => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      completedNodeIds: [],
      selectedNodeId: null,
      searchQuery: '',
      isChangeManagerFocusMode: false,
      theme: 'dark',
      hasHydrated: false,
      
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleChangeManagerFocusMode: () => set((state) => ({ isChangeManagerFocusMode: !state.isChangeManagerFocusMode })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      toggleNodeCompletion: (nodeId) =>
        set((state) => {
          const isCompleted = state.completedNodeIds.includes(nodeId);
          const newCompleted = isCompleted
            ? state.completedNodeIds.filter((id) => id !== nodeId)
            : [...state.completedNodeIds, nodeId];
          return { completedNodeIds: newCompleted };
        }),
      resetProgress: () => set({ completedNodeIds: [], selectedNodeId: null, searchQuery: '', isChangeManagerFocusMode: false }),
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
