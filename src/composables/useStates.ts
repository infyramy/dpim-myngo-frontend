import { ref, computed } from "vue";
import { apiFetching } from "@/services/api-fetching";
import { toast } from "vue-sonner";

export interface State {
  id: string;
  name: string;
  code: string;
  flag?: string;
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  isActive: boolean;
}

export interface StateResponse {
  states: State[];
}

export function useStates() {
  // State
  const states = ref<State[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasStates = computed(() => states.value.length > 0);
  const statesCount = computed(() => states.value.length);
  const statesWithAdmins = computed(() => 
    states.value.filter(state => state.adminName && state.adminEmail)
  );
  const statesWithoutAdmins = computed(() => 
    states.value.filter(state => !state.adminName || !state.adminEmail)
  );

  /**
   * Get all states with admin information
   */
  const fetchStatesWithAdmins = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get("/states/admin", true);

      // Transform the response to match our interface
      const transformedStates = response.data.states.map((state: any) => ({
        id: state.id.toString(),
        name: state.name,
        code: state.code,
        flag: state.flag,
        adminId: state.adminId?.toString() || "",
        adminName: state.adminName || "",
        adminEmail: state.adminEmail || "",
        isActive: state.adminName && state.adminEmail ? true : false,
      }));

      states.value = transformedStates;
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch states";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get basic states list (public)
   */
  const fetchStates = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get("/states", false);

      const transformedStates = response.data.states.map((state: any) => ({
        id: state.id?.toString() || "",
        name: state.title,
        code: state.code,
        flag: state.flag,
        adminId: "",
        adminName: "",
        adminEmail: "",
        isActive: false,
      }));

      states.value = transformedStates;
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch states";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Assign admin to a state
   */
  const assignAdmin = async (
    stateId: string,
    adminName: string,
    adminEmail: string
  ): Promise<boolean> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (!stateId || !adminName || !adminEmail) {
        toast.error("Please provide all required information");
        return false;
      }

      const api = apiFetching();
      const response = await api.post(
        "/states/admin/assign",
        {
          stateId,
          adminName,
          adminEmail,
        },
        true
      );

      toast.success("Admin assigned successfully");
      return true;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to assign admin";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Update admin information
   */
  const updateAdmin = async (
    stateId: string,
    adminName: string,
    adminEmail: string
  ): Promise<boolean> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (!stateId || !adminName || !adminEmail) {
        toast.error("Please provide all required information");
        return false;
      }

      const api = apiFetching();
      const response = await api.put(
        `/states/admin/${stateId}`,
        {
          adminName,
          adminEmail,
        },
        true
      );

      toast.success("Admin updated successfully");
      return true;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to update admin";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Remove admin from a state
   */
  const removeAdmin = async (stateId: string): Promise<boolean> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (!stateId) {
        toast.error("State ID is required");
        return false;
      }

      const api = apiFetching();
      const response = await api.delete(`/states/admin/${stateId}`, true);

      toast.success("Admin removed successfully");
      return true;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to remove admin";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      return false;
    } finally {
      isSubmitting.value = false;
    }
  };

  /**
   * Refresh states data
   */
  const refreshStates = async () => {
    await fetchStatesWithAdmins();
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
    states.value = [];
    isLoading.value = false;
    isSubmitting.value = false;
    error.value = null;
  };

  return {
    // State
    states,
    isLoading,
    isSubmitting,
    error,

    // Computed
    hasStates,
    statesCount,
    statesWithAdmins,
    statesWithoutAdmins,

    // Methods
    fetchStatesWithAdmins,
    fetchStates,
    assignAdmin,
    updateAdmin,
    removeAdmin,
    refreshStates,
    clearError,
    resetState,
  };
} 