import { create } from 'zustand';

interface DashboardState {
    loadingScba: boolean;
    loadingPjn: boolean;
    setLoadingScba: (value: boolean) => void;
    setLoadingPjn: (value: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    loadingPjn: false,
    loadingScba: false,
    setLoadingScba: (value) => set({ loadingPjn: value }),
    setLoadingPjn: (value) => set({ loadingScba: value }),
}));
