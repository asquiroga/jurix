import { create } from 'zustand';

interface DashboardState {
    loadingScba: boolean;
    loadingPjn: boolean;
    loadingMev: boolean;
    setLoadingScba: (value: boolean) => void;
    setLoadingPjn: (value: boolean) => void;
    setLoadingMev: (value: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    loadingPjn: false,
    loadingScba: false,
    loadingMev: false,
    setLoadingScba: (value) => set({ loadingScba: value }),
    setLoadingPjn: (value) => set({ loadingPjn: value }),
    setLoadingMev: (value) => set({ loadingMev: value }),
}));
