<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useStates,
  type State,
  type StateAdmin,
} from "@/composables/useStates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// States composable
const {
  states,
  availableUsers,
  isLoading,
  isSubmitting,
  isLoadingUsers,
  fetchStatesWithAdmins,
  fetchAvailableUsers,
  assignAdmin,
  removeAdmin,
  refreshStates,
} = useStates();

// Form values for new admin
const selectedState = ref<string | null>(null);
const selectedUser = ref<string | null>(null);
const isDialogOpen = ref(false);

// View admins modal
const isViewAdminsDialogOpen = ref(false);
const viewAdminsState = ref<State | null>(null);

// Remove confirmation state
const isRemoveDialogOpen = ref(false);
const removeStateId = ref<string | null>(null);
const removeUserId = ref<string | null>(null);
const removeStateName = ref("");
const removeUserName = ref("");

// Function to assign new admin
async function handleAssignAdmin() {
  if (!selectedState.value || !selectedUser.value) {
    return;
  }

  const success = await assignAdmin(selectedState.value, selectedUser.value);

  if (success) {
    resetForm();
    isDialogOpen.value = false;
    // Refresh the states list
    await refreshStates();
  }
}

// Function to open view admins modal
function openViewAdminsDialog(state: State) {
  viewAdminsState.value = state;
  isViewAdminsDialogOpen.value = true;
}

// Function to open remove confirmation dialog
function openRemoveDialog(state: State, admin: StateAdmin) {
  removeStateId.value = state.id;
  removeUserId.value = admin.adminId;
  removeStateName.value = state.name;
  removeUserName.value = admin.adminName;
  isRemoveDialogOpen.value = true;
}

// Function to remove admin
async function handleRemoveAdmin() {
  if (!removeStateId.value || !removeUserId.value) return;

  const success = await removeAdmin(removeStateId.value, removeUserId.value);

  if (success) {
    // Reset remove dialog state
    removeStateId.value = null;
    removeUserId.value = null;
    removeStateName.value = "";
    removeUserName.value = "";
    isRemoveDialogOpen.value = false;

    isViewAdminsDialogOpen.value = false;
    // Refresh the states list and update the view modal
    await refreshStates();
    // Update the view modal state if it's open
    if (viewAdminsState.value && removeStateId.value) {
      const updatedState = states.value.find(
        (s) => s.id === viewAdminsState.value?.id
      );
      if (updatedState) {
        viewAdminsState.value = updatedState;
      }
    }
  }
}

// Reset form values
function resetForm() {
  selectedState.value = null;
  selectedUser.value = null;
}

// Open dialog for specific state
async function openAssignDialog(stateId?: string) {
  if (stateId) {
    selectedState.value = stateId;
    // Fetch available users for this state
    await fetchAvailableUsers(stateId);
  }
  isDialogOpen.value = true;
}

// Handle state selection change
async function handleStateChange(value: any) {
  const stateId = value as string;
  selectedState.value = stateId;
  selectedUser.value = null;
  if (stateId) {
    await fetchAvailableUsers(stateId);
  }
}

// Handle refresh
async function handleRefresh() {
  await refreshStates();
}

// Initialize data
onMounted(async () => {
  await fetchStatesWithAdmins();
});
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-8">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold md:text-2xl">State Branch Management</h1>

      <div class="flex gap-2">
        <Button variant="outline" @click="handleRefresh" :disabled="isLoading">
          Refresh
        </Button>

        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="resetForm">Assign New Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign State Administrator</DialogTitle>
              <DialogDescription>
                Assign an existing user as administrator for a state branch.
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="state">State</Label>
                <Select
                  :model-value="selectedState"
                  @update:model-value="handleStateChange"
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="state in states"
                      :key="state.id"
                      :value="state.id"
                    >
                      {{ state.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid gap-2" v-if="selectedState">
                <Label for="user">Available Users</Label>
                <div v-if="isLoadingUsers" class="flex items-center space-x-2">
                  <Skeleton class="h-10 w-full" />
                </div>
                <Select v-else v-model="selectedUser" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in availableUsers"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.name }} ({{ user.email }})
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p
                  v-if="availableUsers.length === 0 && !isLoadingUsers"
                  class="text-sm text-muted-foreground"
                >
                  No available users found for this state. Only users registered
                  under this state can be assigned as administrators.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                @click="isDialogOpen = false"
                :disabled="isSubmitting"
              >
                Cancel
              </Button>
              <Button
                @click="handleAssignAdmin"
                :disabled="isSubmitting || !selectedState || !selectedUser"
              >
                {{ isSubmitting ? "Assigning..." : "Assign Admin" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- View Admins Modal -->
    <Dialog v-model:open="isViewAdminsDialogOpen">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle
            >State Administrators - {{ viewAdminsState?.name }}</DialogTitle
          >
          <DialogDescription>
            Manage administrators for {{ viewAdminsState?.name }} state.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div
            v-if="viewAdminsState?.admins.length === 0"
            class="text-center py-8 text-muted-foreground"
          >
            <p>No administrators assigned to this state.</p>
            <Button
              class="mt-4"
              @click="
                () => {
                  isViewAdminsDialogOpen = false;
                  openAssignDialog(viewAdminsState?.id);
                }
              "
            >
              Assign First Admin
            </Button>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="admin in viewAdminsState?.admins"
              :key="admin.adminId"
              class="flex items-center justify-between p-4 border rounded-lg"
            >
              <div class="flex-1">
                <div class="font-medium">{{ admin.adminName }}</div>
                <div class="text-sm text-muted-foreground">
                  {{ admin.adminEmail }}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                @click="openRemoveDialog(viewAdminsState!, admin)"
                :disabled="isSubmitting"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            @click="
              () => {
                isViewAdminsDialogOpen = false;
                openAssignDialog(viewAdminsState?.id);
              }
            "
          >
            Add Another Admin
          </Button>
          <Button @click="isViewAdminsDialogOpen = false"> Close </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Remove Confirmation Dialog -->
    <Dialog v-model:open="isRemoveDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove State Administrator</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {{ removeUserName }} as
            administrator for {{ removeStateName }}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            @click="isRemoveDialogOpen = false"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleRemoveAdmin"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Removing..." : "Remove Admin" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Card>
      <CardHeader>
        <CardTitle>State Branches</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="relative w-full overflow-auto">
          <!-- Loading State -->
          <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
              <Skeleton class="h-12 w-12 rounded-full" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-[200px]" />
                <Skeleton class="h-4 w-[150px]" />
              </div>
            </div>
          </div>

          <!-- States Table -->
          <table v-else class="w-full caption-bottom text-sm">
            <thead>
              <tr class="border-b">
                <th class="h-10 px-4 text-left font-medium">State</th>
                <th class="h-10 px-4 text-left font-medium">Administrators</th>
                <th class="h-10 px-4 text-center font-medium">Status</th>
                <th class="h-10 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="state in states" :key="state.id" class="border-b">
                <td class="p-4 align-middle font-medium">{{ state.name }}</td>
                <td class="p-4 align-middle">
                  <button
                    @click="openViewAdminsDialog(state)"
                    class="w-full text-left hover:bg-accent hover:text-accent-foreground rounded-lg p-3 transition-all duration-200 border border-transparent hover:border-border"
                  >
                    <div class="flex items-center justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <svg
                            class="w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                            />
                          </svg>
                          <span class="text-sm font-medium">
                            {{ state.admins.length }} Administrator{{
                              state.admins.length !== 1 ? "s" : ""
                            }}
                          </span>
                        </div>
                        <div class="text-xs text-muted-foreground">
                          {{
                            state.admins.length === 0
                              ? "No admins assigned"
                              : state.admins.length === 1
                              ? state.admins[0].adminName
                              : `${state.admins[0].adminName} + ${
                                  state.admins.length - 1
                                } more`
                          }}
                        </div>
                      </div>
                      <div class="flex items-center text-muted-foreground">
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                </td>
                <td class="p-4 align-middle text-center">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      state.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                    ]"
                  >
                    {{ state.isActive ? "Active" : "Inactive" }}
                  </span>
                </td>
                <td class="p-4 align-middle text-right">
                  <div class="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      @click="openAssignDialog(state.id)"
                    >
                      Add Admin
                    </Button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!isLoading && states.length === 0">
                <td colspan="4" class="p-8 text-center text-muted-foreground">
                  No states found. Please try refreshing the page.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
