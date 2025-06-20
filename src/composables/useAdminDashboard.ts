import { ref, computed } from "vue";
import { apiFetching } from "@/services/api-fetching";
import { toast } from "vue-sonner";

export interface AdminDashboardStats {
  totalMembers: number;
  totalProducts: number;
  totalPendingApplications: number;
}

export interface StateOverviewData {
  id: number;
  name: string;
  code: string;
  members: number;
  pendingApplications: number;
  products: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  stateData: StateOverviewData[];
}

export function useAdminDashboard() {
  // State
  const dashboardData = ref<AdminDashboardData | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasData = computed(() => dashboardData.value !== null);
  const totalMembers = computed(() => dashboardData.value?.stats.totalMembers || 0);
  const totalProducts = computed(() => dashboardData.value?.stats.totalProducts || 0);
  const totalPendingApplications = computed(() => dashboardData.value?.stats.totalPendingApplications || 0);
  const stateData = computed(() => dashboardData.value?.stateData || []);

  /**
   * Fetch complete admin dashboard overview
   */
  const fetchDashboardOverview = async (): Promise<AdminDashboardData> => {
    try {
      isLoading.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get("/admin-dashboard/overview", true);

      dashboardData.value = response.data;
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch admin dashboard data";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch admin dashboard statistics only
   */
  const fetchDashboardStats = async (): Promise<AdminDashboardStats> => {
    try {
      isLoading.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get("/admin-dashboard/stats", true);

      if (dashboardData.value) {
        dashboardData.value.stats = response.data.stats;
      }

      return response.data.stats;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch admin dashboard statistics";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch state overview data only
   */
  const fetchStateOverview = async (): Promise<StateOverviewData[]> => {
    try {
      isLoading.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get("/admin-dashboard/state-overview", true);

      if (dashboardData.value) {
        dashboardData.value.stateData = response.data.stateData;
      }

      return response.data.stateData;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch state overview data";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Refresh dashboard data
   */
  const refreshDashboard = async (): Promise<void> => {
    await fetchDashboardOverview();
    toast.success("Dashboard refreshed successfully");
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null;
  };

  /**
   * Reset all state
   */
  const resetState = () => {
    dashboardData.value = null;
    error.value = null;
    isLoading.value = false;
  };

  return {
    // State
    dashboardData,
    isLoading,
    error,

    // Computed
    hasData,
    totalMembers,
    totalProducts,
    totalPendingApplications,
    stateData,

    // Methods
    fetchDashboardOverview,
    fetchDashboardStats,
    fetchStateOverview,
    refreshDashboard,
    clearError,
    resetState,
  };
} 