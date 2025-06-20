<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useStates, type State } from "@/composables/useStates";
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
  isLoading,
  isSubmitting,
  fetchStatesWithAdmins,
  assignAdmin,
  updateAdmin,
  removeAdmin,
  refreshStates,
} = useStates();

// Form values for new admin
const selectedState = ref<string | null>(null);
const newAdminName = ref("");
const newAdminEmail = ref("");
const isDialogOpen = ref(false);
const isEditMode = ref(false);

// Edit state
const editStateId = ref<string | null>(null);
const editAdminName = ref("");
const editAdminEmail = ref("");
const isEditDialogOpen = ref(false);

// Remove confirmation state
const isRemoveDialogOpen = ref(false);
const removeStateId = ref<string | null>(null);
const removeStateName = ref("");

// Function to assign new admin
async function handleAssignAdmin() {
  console.log(selectedState.value);
  console.log(newAdminName.value);
  console.log(newAdminEmail.value);

  if (!selectedState.value || !newAdminName.value || !newAdminEmail.value) {
    return;
  }

  const success = await assignAdmin(
    selectedState.value,
    newAdminName.value,
    newAdminEmail.value
  );

  if (success) {
    resetForm();
    isDialogOpen.value = false;
    // Refresh the states list
    await refreshStates();
  }
}

// Function to update admin
async function handleUpdateAdmin() {
  if (!editStateId.value || !editAdminName.value || !editAdminEmail.value) {
    return;
  }

  const success = await updateAdmin(
    editStateId.value,
    editAdminName.value,
    editAdminEmail.value
  );

  if (success) {
    resetEditForm();
    isEditDialogOpen.value = false;
    // Refresh the states list
    await refreshStates();
  }
}

// Function to open remove confirmation dialog
function openRemoveDialog(state: State) {
  removeStateId.value = state.id;
  removeStateName.value = state.name;
  isRemoveDialogOpen.value = true;
}

// Function to remove admin
async function handleRemoveAdmin() {
  if (!removeStateId.value) return;

  const success = await removeAdmin(removeStateId.value);

  if (success) {
    // Reset remove dialog state
    removeStateId.value = null;
    removeStateName.value = "";
    isRemoveDialogOpen.value = false;
    // Refresh the states list
    await refreshStates();
  }
}

// Reset form values
function resetForm() {
  selectedState.value = null;
  newAdminName.value = "";
  newAdminEmail.value = "";
  isEditMode.value = false;
}

// Reset edit form values
function resetEditForm() {
  editStateId.value = null;
  editAdminName.value = "";
  editAdminEmail.value = "";
}

// Open dialog for specific state
function openAssignDialog(stateId?: string) {
  if (stateId) {
    selectedState.value = stateId;
  }
  isDialogOpen.value = true;
}

// Open edit dialog
function openEditDialog(state: State) {
  editStateId.value = state.id;
  editAdminName.value = state.adminName || "";
  editAdminEmail.value = state.adminEmail || "";
  isEditDialogOpen.value = true;
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
                Create a new Negeri Admin account for a state branch.
              </DialogDescription>
            </DialogHeader>

            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <Label for="state">State</Label>
                <Select v-model="selectedState" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="state in states.filter((s) => !s.isActive)"
                      :key="state.id"
                      :value="state.id"
                    >
                      {{ state.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid gap-2">
                <Label for="name" class="text-sm font-medium">Admin Name</Label>
                <Input
                  id="name"
                  v-model="newAdminName"
                  placeholder="Full name of administrator"
                />
              </div>

              <div class="grid gap-2">
                <Label for="email" class="text-sm font-medium"
                  >Admin Email</Label
                >
                <Input
                  id="email"
                  v-model="newAdminEmail"
                  placeholder="Email address"
                  type="email"
                />
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
              <Button @click="handleAssignAdmin" :disabled="isSubmitting">
                {{ isSubmitting ? "Assigning..." : "Assign Admin" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- Edit Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit State Administrator</DialogTitle>
          <DialogDescription>
            Update the administrator information for this state.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="edit-name" class="text-sm font-medium"
              >Admin Name</label
            >
            <Input
              id="edit-name"
              v-model="editAdminName"
              placeholder="Full name of administrator"
            />
          </div>

          <div class="grid gap-2">
            <label for="edit-email" class="text-sm font-medium"
              >Admin Email</label
            >
            <Input
              id="edit-email"
              v-model="editAdminEmail"
              placeholder="Email address"
              type="email"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            @click="isEditDialogOpen = false"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button @click="handleUpdateAdmin" :disabled="isSubmitting">
            {{ isSubmitting ? "Updating..." : "Update Admin" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Remove Confirmation Dialog -->
    <Dialog v-model:open="isRemoveDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove State Administrator</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the administrator for {{ removeStateName }}? This action cannot be undone.
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
                <th class="h-10 px-4 text-left font-medium">Admin Name</th>
                <th class="h-10 px-4 text-left font-medium">Admin Email</th>
                <th class="h-10 px-4 text-center font-medium">Status</th>
                <th class="h-10 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="state in states" :key="state.id" class="border-b">
                <td class="p-4 align-middle font-medium">{{ state.name }}</td>
                <td class="p-4 align-middle">
                  {{ state.adminName || "Not assigned" }}
                </td>
                <td class="p-4 align-middle">
                  {{ state.adminEmail || "Not assigned" }}
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
                      v-if="!state.isActive"
                      variant="outline"
                      size="sm"
                      @click="openAssignDialog(state.id)"
                    >
                      Assign Admin
                    </Button>
                    <Button
                      v-if="state.isActive"
                      variant="outline"
                      size="sm"
                      @click="openEditDialog(state)"
                    >
                      Edit
                    </Button>
                    <Button
                      v-if="state.isActive"
                      variant="destructive"
                      size="sm"
                      @click="openRemoveDialog(state)"
                      :disabled="isSubmitting"
                    >
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!isLoading && states.length === 0">
                <td colspan="5" class="p-8 text-center text-muted-foreground">
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
