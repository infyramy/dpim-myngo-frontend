import { ref, computed } from "vue";
import { apiFetching } from "@/services/api-fetching";
import { toast } from "vue-sonner";

export interface StateAdmin {
  adminId: string;
  adminName: string;
  adminEmail: string;
}

export interface State {
  id: string;
  name: string;
  code: string;
  flag?: string;
  admins: StateAdmin[];
  isActive: boolean;
}

export interface AvailableUser {
  id: string;
  name: string;
  email: string;
}

export interface StateResponse {
  states: State[];
}

export interface UsersResponse {
  users: AvailableUser[];
}

export function useStates() {
  // State
  const states = ref<State[]>([]);
  const availableUsers = ref<AvailableUser[]>([]);
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const isLoadingUsers = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasStates = computed(() => states.value.length > 0);
  const statesCount = computed(() => states.value.length);
  const statesWithAdmins = computed(() => 
    states.value.filter(state => state.admins.length > 0)
  );
  const statesWithoutAdmins = computed(() => 
    states.value.filter(state => state.admins.length === 0)
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
        admins: state.admins || [],
        isActive: state.isActive || false,
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
   * Get available users for a specific state
   */
  const fetchAvailableUsers = async (stateId: string) => {
    try {
      isLoadingUsers.value = true;
      error.value = null;

      const api = apiFetching();
      const response = await api.get(`/states/admin/${stateId}/users`, true);

      availableUsers.value = response.data.users || [];
      return response.data.users;
    } catch (err: any) {
      const errorMessage =
        err.data?.message || err.message || "Failed to fetch available users";
      error.value = errorMessage;
      toast.error("Error", errorMessage);
      throw err;
    } finally {
      isLoadingUsers.value = false;
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
        admins: [],
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
   * Assign existing user as admin to a state
   */
  const assignAdmin = async (
    stateId: string,
    userId: string
  ): Promise<boolean> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (!stateId || !userId) {
        toast.error("Please provide all required information");
        return false;
      }

      const api = apiFetching();
      const response = await api.post(
        "/states/admin/assign",
        {
          stateId,
          userId,
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
   * Update admin information (keeping for backward compatibility)
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
   * Remove specific admin from a state
   */
  const removeAdmin = async (stateId: string, userId: string): Promise<boolean> => {
    try {
      isSubmitting.value = true;
      error.value = null;

      if (!stateId || !userId) {
        toast.error("State ID and User ID are required");
        return false;
      }

      const api = apiFetching();
      const response = await api.delete(`/states/admin/${stateId}/${userId}`, true);

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
    availableUsers.value = [];
    isLoading.value = false;
    isSubmitting.value = false;
    isLoadingUsers.value = false;
    error.value = null;
  };

  return {
    // State
    states,
    availableUsers,
    isLoading,
    isSubmitting,
    isLoadingUsers,
    error,

    // Computed
    hasStates,
    statesCount,
    statesWithAdmins,
    statesWithoutAdmins,

    // Methods
    fetchStatesWithAdmins,
    fetchAvailableUsers,
    fetchStates,
    assignAdmin,
    updateAdmin,
    removeAdmin,
    refreshStates,
    clearError,
    resetState,
  };
} 