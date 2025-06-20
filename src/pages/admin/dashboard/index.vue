<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useAdminDashboard } from "@/composables/useAdminDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-vue-next";

const authStore = useAuthStore();
const username = ref(authStore.user?.fullname || "Admin");

// Use the admin dashboard composable
const {
  isLoading,
  totalMembers,
  totalProducts,
  totalPendingApplications,
  stateData,
  fetchDashboardOverview,
  refreshDashboard,
} = useAdminDashboard();

// Initialize dashboard data
onMounted(async () => {
  await fetchDashboardOverview();
});

// Handle refresh
const handleRefresh = async () => {
  await refreshDashboard();
};
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold md:text-2xl">HQ Admin Dashboard</h1>
      <Button 
        variant="outline" 
        @click="handleRefresh" 
        :disabled="isLoading"
        class="flex items-center gap-2"
      >
        <RefreshCw :class="{ 'animate-spin': isLoading }" class="h-4 w-4" />
        Refresh Data
      </Button>
    </div>

    <!-- Statistics Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Total Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            <Skeleton v-if="isLoading" class="h-8 w-16" />
            <span v-else>{{ totalMembers.toLocaleString() }}</span>
          </div>
          <p class="text-xs text-muted-foreground">Across all state branches</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Products Registered</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            <Skeleton v-if="isLoading" class="h-8 w-16" />
            <span v-else>{{ totalProducts.toLocaleString() }}</span>
          </div>
          <p class="text-xs text-muted-foreground">Across all state branches</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">Pending Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">
            <Skeleton v-if="isLoading" class="h-8 w-16" />
            <span v-else>{{ totalPendingApplications.toLocaleString() }}</span>
          </div>
          <p class="text-xs text-muted-foreground">
            Awaiting state admin approval
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- State Branch Overview -->
    <Card>
      <CardHeader>
        <CardTitle>State Branch Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead>
              <tr class="border-b">
                <th class="h-10 px-4 text-left font-medium">State</th>
                <th class="h-10 px-4 text-right font-medium">Members</th>
                <th class="h-10 px-4 text-right font-medium">
                  Pending Applications
                </th>
                <th class="h-10 px-4 text-right font-medium">Products</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading skeleton rows -->
              <template v-if="isLoading">
                <tr v-for="n in 5" :key="`skeleton-${n}`" class="border-b">
                  <td class="p-4 align-middle">
                    <Skeleton class="h-4 w-24" />
                  </td>
                  <td class="p-4 align-middle text-right">
                    <Skeleton class="h-4 w-12 ml-auto" />
                  </td>
                  <td class="p-4 align-middle text-right">
                    <Skeleton class="h-4 w-8 ml-auto" />
                  </td>
                  <td class="p-4 align-middle text-right">
                    <Skeleton class="h-4 w-12 ml-auto" />
                  </td>
                </tr>
              </template>

              <!-- Actual data rows -->
              <template v-else>
                <tr v-for="state in stateData" :key="state.id" class="border-b">
                  <td class="p-4 align-middle font-medium">{{ state.name }}</td>
                  <td class="p-4 align-middle text-right">{{ state.members.toLocaleString() }}</td>
                  <td class="p-4 align-middle text-right">
                    <span
                      :class="
                        state.pendingApplications > 0
                          ? 'text-amber-600 font-medium'
                          : ''
                      "
                    >
                      {{ state.pendingApplications.toLocaleString() }}
                    </span>
                  </td>
                  <td class="p-4 align-middle text-right">
                    {{ state.products.toLocaleString() }}
                  </td>
                </tr>
              </template>

              <!-- Empty state -->
              <tr v-if="!isLoading && stateData.length === 0">
                <td colspan="4" class="p-8 text-center text-muted-foreground">
                  No state data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
