import { defineStore } from "pinia";
import { ref, computed, markRaw } from "vue";
import { type User, type UserRole } from "@/types/auth";

/**
 * Authentication store that manages user authentication state
 * Uses HTTP-only cookies for refresh tokens and localStorage for access tokens
 * Implements CSRF protection and a role-based access system
 */
export const useAuthStore = defineStore("auth", () => {
  try {
  } catch (error) {
    console.warn("Router not available when initializing auth store");
  }

  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const csrfToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const roles = ref<string[]>([]);
  const isInitialized = ref(false);

  // Impersonation state
  const impersonating = ref(false);
  const originalUser = ref<User | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return user.value?.user_type === role;
  };

  /**
   * Check if user has operator privileges
   */
  const isOperator = computed(() => {
    return user.value?.is_operator === true;
  });

  /**
   * Check if user has permission to access a resource
   */
  const hasPermission = (permission: string): boolean => {
    // This is a simple implementation. In a real app, you would have
    // a more robust permission system with role-based permissions
    const rolePermissions: Record<UserRole, string[]> = {
      superadmin: [
        "all",
        "user:read",
        "user:write",
        "user:delete",
        "settings:read",
        "settings:write",
        "system:read",
        "system:write",
        "operator:read",
        "operator:write",
      ],
      admin: ["user:read", "user:write", "settings:read", "settings:write"],
      user: ["user:read"],
    };

    // Additional permissions for operators
    const operatorPermissions = [
      "user:read",
      "user:write",
      "team:read",
      "team:write",
      "project:read",
      "project:write",
      "operator:read",
      "operator:write",
    ];

    // Superadmin has all permissions
    if (user.value?.user_type === "superadmin") {
      return true;
    }

    // Check base role permissions
    let hasRolePermission = user.value
      ? rolePermissions[user.value.user_type].includes(permission)
      : false;

    // Check operator permissions if user is an operator
    if (user.value?.is_operator && operatorPermissions.includes(permission)) {
      hasRolePermission = true;
    }

    return hasRolePermission;
  };

  /**
   * Initialize the auth store
   */
  const init = async (): Promise<void> => {
    // Try to load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    }

    // Try to load tokens
    const storedAccessToken = localStorage.getItem("access_token");
    const storedCSRFToken = localStorage.getItem("csrf_token");

    if (storedAccessToken) {
      accessToken.value = storedAccessToken;
    }

    if (storedCSRFToken) {
      csrfToken.value = storedCSRFToken;
    }

    // If we have tokens but no user, try to fetch user data
    if (accessToken.value && !user.value) {
      try {
        // await fetchUserData();
      } catch (error) {
        // If we can't get user data, clear the tokens
        clearAuthData();
      }
    }

    // Initialize impersonation state
    const isImpersonating = localStorage.getItem("impersonating") === "true";
    const storedOriginalUser = localStorage.getItem("original_user");

    if (isImpersonating && storedOriginalUser) {
      impersonating.value = true;
      originalUser.value = JSON.parse(storedOriginalUser);
    }

    // Mark store as initialized
    isInitialized.value = true;
  };

  /**
   * Clear all authentication data
   */
  const clearAuthData = (): void => {
    user.value = null;
    accessToken.value = null;
    csrfToken.value = null;
    roles.value = [];
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("csrf_token");
    localStorage.removeItem("operator_states");
  };

  const setUser = (userData: any) => {
    // Update the reactive user ref with proper User interface
    user.value = {
      id: userData.user.user_id || userData.user.id || "",
      fullname: userData.user.user_fullname,
      email: userData.user.user_email,
      user_type: userData.user.user_role,
      avatar: userData.user.avatar || "",
      is_operator: userData.is_operator || false,
      operator_states: userData.operator_states || null,
    };

    // Also update localStorage (keeping the existing structure for compatibility)
    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: userData.user.user_fullname,
        email: userData.user.user_email,
        user_type: userData.user.user_role,
        access_token: userData.access_token,
        isAuthenticated: true,
        is_operator: userData.is_operator || false,
        operator_states: userData.operator_states || null,
      })
    );

    // Update access token
    accessToken.value = userData.access_token;

    // Store operator states if available
    if (userData.operator_states) {
      localStorage.setItem("operator_states", JSON.stringify(userData.operator_states));
    }
  };

  const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const logoutUser = () => {
    // Clear reactive user ref
    user.value = null;
    accessToken.value = null;
    csrfToken.value = null;

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("csrf_token");
    localStorage.removeItem("operator_states");
  };

  const setOperatorStates = (states: any) => {
    localStorage.setItem("operator_states", JSON.stringify(states));
  };

  const getOperatorStates = () => {
    const operatorStates = localStorage.getItem("operator_states");
    return operatorStates ? JSON.parse(operatorStates) : null;
  };

  return {
    user,
    accessToken,
    csrfToken,
    isLoading,
    error,
    roles,
    isAuthenticated,
    isInitialized,
    hasRole,
    hasPermission,
    isOperator,
    init,
    setUser,
    getUser,
    logoutUser,
    setOperatorStates,
    getOperatorStates,
  };
});
