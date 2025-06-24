<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-0">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">My Businesses</h1>
        <p class="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage your business registrations and information
        </p>
      </div>
      <Button
        @click="navigateToAddBusiness"
        :disabled="isSubmitting"
        class="flex items-center gap-2 w-full sm:w-auto"
      >
        <PlusIcon class="h-4 w-4" />
        New Business
      </Button>
    </div>

    <!-- Search and Filters -->
    <div class="px-4 sm:px-0">
      <Card>
        <CardContent class="p-4 sm:p-6">
          <div class="space-y-4">
            <!-- Search Input -->
            <div class="relative">
              <SearchIcon
                class="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                placeholder="Search your businesses..."
                class="pl-9 w-full"
                @input="performSearch"
              />
            </div>

            <!-- Mobile Filter Toggle -->
            <div class="sm:hidden">
              <Collapsible v-model:open="showMobileFilters">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    class="w-full justify-between text-sm"
                  >
                    <div class="flex items-center gap-2">
                      <SlidersHorizontalIcon class="h-4 w-4" />
                      Filters
                      <Badge v-if="activeFiltersCount > 0" variant="secondary" class="text-xs">
                        {{ activeFiltersCount }}
                      </Badge>
                    </div>
                    <ChevronDownIcon
                      class="h-4 w-4 transition-transform duration-200"
                      :class="{ 'rotate-180': showMobileFilters }"
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-3">
                  <!-- Mobile Filter Controls -->
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <Label for="businessSectorMobile" class="text-sm">Sector</Label>
                      <Select
                        v-model="filters.sector"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger id="businessSectorMobile" class="w-full mt-1 h-10">
                          <SelectValue placeholder="All sectors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All sectors</SelectItem>
                          <SelectItem
                            v-for="sector in businessSectorOptions"
                            :key="sector.value"
                            :value="sector.value"
                          >
                            {{ sector.title }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label for="mofRegistrationMobile" class="text-sm">MOF Registration</Label>
                      <Select
                        v-model="filters.mofRegistration"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger id="mofRegistrationMobile" class="w-full mt-1 h-10">
                          <SelectValue placeholder="All businesses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All businesses</SelectItem>
                          <SelectItem value="true">MOF Registered</SelectItem>
                          <SelectItem value="false">Not MOF Registered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="outline"
                      class="w-full flex items-center gap-2 h-10"
                      @click="resetFilters"
                    >
                      <RefreshCcwIcon class="h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <!-- Desktop Filter Controls -->
            <div class="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label for="businessSector" class="text-sm">Sector</Label>
                <Select
                  v-model="filters.sector"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="businessSector" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sectors</SelectItem>
                    <SelectItem
                      v-for="sector in businessSectorOptions"
                      :key="sector.value"
                      :value="sector.value"
                    >
                      {{ sector.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="mofRegistration" class="text-sm">MOF Registration</Label>
                <Select
                  v-model="filters.mofRegistration"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="mofRegistration" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All businesses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All businesses</SelectItem>
                    <SelectItem value="true">MOF Registered</SelectItem>
                    <SelectItem value="false">Not MOF Registered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex items-end sm:col-span-2 lg:col-span-1">
                <Button
                  variant="outline"
                  class="w-full flex items-center gap-2 h-10"
                  @click="resetFilters"
                >
                  <RefreshCcwIcon class="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Businesses Section -->
    <div class="px-4 sm:px-0">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h2 class="text-lg sm:text-xl font-semibold">
          Your Businesses
          <span class="text-sm sm:text-base font-normal text-muted-foreground ml-2">
            ({{ totalResults }} businesses)
          </span>
        </h2>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground whitespace-nowrap">Sort by:</p>
          <Select v-model="sortBy" @update:modelValue="performSearch">
            <SelectTrigger class="w-[140px] sm:w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="sector">Sector</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
      >
        <Card v-for="i in 6" :key="i" class="animate-pulse overflow-hidden">
          <CardContent class="p-0">
            <!-- Business Header Skeleton -->
            <div class="p-3 sm:p-4 border-b bg-muted/30">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                  <div class="h-5 sm:h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div class="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div class="h-5 sm:h-6 bg-muted rounded w-10 sm:w-12 ml-2"></div>
              </div>
              <div class="flex gap-2 mt-3">
                <div class="h-4 sm:h-5 bg-muted rounded w-14 sm:w-16"></div>
                <div class="h-4 sm:h-5 bg-muted rounded w-16 sm:w-20"></div>
              </div>
            </div>

            <!-- Business Info Skeleton -->
            <div class="p-3 sm:p-4 space-y-3">
              <div class="space-y-2">
                <div class="flex items-start gap-2">
                  <div
                    class="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded mt-0.5 flex-shrink-0"
                  ></div>
                  <div class="h-3 sm:h-4 bg-muted rounded w-full"></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded flex-shrink-0"></div>
                  <div class="h-3 sm:h-4 bg-muted rounded w-2/3"></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded flex-shrink-0"></div>
                  <div class="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="h-3 sm:h-4 w-3 sm:w-4 bg-muted rounded flex-shrink-0"></div>
                  <div class="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>

              <div class="flex justify-between pt-2 gap-2">
                <div class="flex gap-1 flex-1">
                  <div class="h-7 sm:h-8 bg-muted rounded flex-1"></div>
                  <div class="h-7 sm:h-8 bg-muted rounded flex-1"></div>
                </div>
                <div class="h-7 sm:h-8 w-7 sm:w-8 bg-muted rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Businesses Grid -->
      <div
        v-else-if="paginatedResults.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
      >
        <Card
          v-for="business in paginatedResults"
          :key="business.id"
          class="hover:shadow-md transition-shadow overflow-hidden"
        >
          <CardContent class="p-0">
            <!-- Business Header -->
            <div class="p-3 sm:p-4 border-b bg-muted/30">
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-base sm:text-lg line-clamp-1 mb-1">
                    {{ business.name }}
                  </h3>
                  <p class="text-xs sm:text-sm text-muted-foreground">
                    SSM: {{ business.ssm }}
                  </p>
                </div>
                <Badge
                  :variant="business.mofRegistration ? 'default' : 'secondary'"
                  class="text-xs ml-2 flex-shrink-0"
                >
                  {{ business.mofRegistration ? "MOF" : "No MOF" }}
                </Badge>
              </div>
              <div class="flex gap-1 sm:gap-2 flex-wrap">
                <Badge variant="outline" class="text-xs">
                  {{ getBusinessTypeLabel(business.type) }}
                </Badge>
                <Badge variant="outline" class="text-xs">
                  {{ getBusinessSectorLabel(business.sector) }}
                </Badge>
              </div>
            </div>

            <!-- Business Info -->
            <div class="p-3 sm:p-4 space-y-3">
              <div class="space-y-2 text-xs sm:text-sm">
                <div class="flex items-start gap-2">
                  <MapPinIcon
                    class="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0"
                  />
                  <span class="text-muted-foreground line-clamp-2">{{
                    business.address
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <PhoneIcon
                    class="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0"
                  />
                  <span class="text-muted-foreground">{{
                    business.phone
                  }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <TagIcon
                    class="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0"
                  />
                  <span class="text-muted-foreground">
                    {{ getBusinessCategoryLabel(business.category) }}
                  </span>
                </div>
                <div v-if="business.mofRegistration && business.mofRegistrationNumber" class="flex items-center gap-2">
                  <ShieldCheckIcon
                    class="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0"
                  />
                  <span class="text-muted-foreground">
                    MOF: {{ business.mofRegistrationNumber }}
                  </span>
                </div>
                <div v-if="business.images && business.images.length > 0" class="flex items-center gap-2">
                  <ImageIcon
                    class="h-3 sm:h-4 w-3 sm:w-4 text-muted-foreground flex-shrink-0"
                  />
                  <span class="text-muted-foreground text-xs sm:text-sm">
                    {{ business.images.length }} image{{ business.images.length > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between pt-2 gap-2">
                <div class="flex gap-1 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1 flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    @click="viewBusinessDetail(business)"
                  >
                    <EyeIcon class="h-3 w-3" />
                    <span class="hidden sm:inline">View</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1 flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    @click="navigateToEditBusiness(business.id)"
                    :disabled="isSubmitting"
                  >
                    <PencilIcon class="h-3 w-3" />
                    <span class="hidden sm:inline">Edit</span>
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  class="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3"
                  @click="confirmDeleteBusiness(business)"
                  :disabled="isSubmitting"
                >
                  <TrashIcon class="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8 sm:py-12 px-4">
        <div
          class="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mb-4"
        >
          <BuildingIcon class="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
        </div>
        <h3 class="text-base sm:text-lg font-semibold mb-2">
          {{ hasActiveFilters ? "No businesses found" : "No businesses yet" }}
        </h3>
        <p class="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
          {{
            hasActiveFilters
              ? "Try adjusting your search criteria or reset filters"
              : 'You haven\'t registered any businesses yet. Click "Add Business" to get started.'
          }}
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-2">
          <Button
            v-if="hasActiveFilters"
            variant="outline"
            @click="resetFilters"
            class="flex items-center gap-2 w-full sm:w-auto"
          >
            <RefreshCcwIcon class="h-4 w-4" />
            Reset Filters
          </Button>
          <Button
            @click="navigateToAddBusiness"
            :disabled="isSubmitting"
            class="flex items-center gap-2 w-full sm:w-auto"
          >
            <PlusIcon class="h-4 w-4" />
            New Business
          </Button>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="paginatedResults.length > 0 && totalPages > 1"
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <p class="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, totalResults) }} of
          {{ totalResults }} businesses
        </p>
        <div class="flex items-center justify-center gap-1">
          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8 sm:h-9 sm:w-9"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <ChevronLeftIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="page === currentPage ? 'default' : 'outline'"
            size="sm"
            class="h-8 w-8 sm:h-9 sm:w-9 text-xs sm:text-sm"
            @click="goToPage(page)"
          >
            {{ page }}
          </Button>

          <Button
            variant="outline"
            size="icon"
            class="h-8 w-8 sm:h-9 sm:w-9"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <ChevronRightIcon class="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Business Detail Dialog -->
    <Dialog v-model:open="showBusinessDetailDialog">
      <DialogContent class="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <!-- Fixed Header -->
        <DialogHeader class="px-6 py-4 border-b">
          <DialogTitle>Business Details</DialogTitle>
          <DialogDescription>
            Detailed information about your business
          </DialogDescription>
        </DialogHeader>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="selectedBusiness" class="grid gap-6">
            <!-- Business Header -->
            <div>
              <div class="flex items-start justify-between mb-3">
                <h2 class="text-2xl font-bold">{{ selectedBusiness.name }}</h2>
                <div class="flex gap-2">
                  <Badge
                    :variant="
                      selectedBusiness.mofRegistration ? 'default' : 'secondary'
                    "
                  >
                    {{
                      selectedBusiness.mofRegistration
                        ? "MOF Registered"
                        : "Not MOF Registered"
                    }}
                  </Badge>
                </div>
              </div>
              <div class="flex items-center gap-3 mb-4">
                <Badge variant="outline">{{
                  getBusinessTypeLabel(selectedBusiness.type)
                }}</Badge>
                <Badge variant="outline">{{
                  getBusinessSectorLabel(selectedBusiness.sector)
                }}</Badge>
                <Badge variant="outline">{{
                  getBusinessCategoryLabel(selectedBusiness.category)
                }}</Badge>
              </div>
              <p class="text-sm text-muted-foreground">
                SSM Registration: {{ selectedBusiness.ssm }}
              </p>
            </div>

            <Separator />

            <!-- Contact Information -->
            <div>
              <h3 class="font-semibold mb-3">Contact Information</h3>
              <div class="space-y-3">
                <div class="flex items-start gap-3">
                  <MapPinIcon class="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p class="font-medium">Address</p>
                    <p class="text-sm text-muted-foreground">
                      {{ selectedBusiness.address }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <PhoneIcon class="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p class="font-medium">Phone</p>
                    <p class="text-sm text-muted-foreground">
                      {{ selectedBusiness.phone }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="selectedBusiness.images && selectedBusiness.images.length > 0"
                  class="flex items-start gap-3"
                >
                  <ImageIcon class="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div class="flex-1">
                    <p class="font-medium mb-2">Business Images</p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div
                        v-for="(image, index) in selectedBusiness.images"
                        :key="index"
                        class="aspect-video bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          :src="getBusinessImageUrl(image)"
                          :alt="`Business image ${index + 1}`"
                          class="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"

                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <!-- Business Classification -->
            <div>
              <h3 class="font-semibold mb-3">Business Classification</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground"
                      >Business Type:</span
                    >
                    <span class="text-sm">{{
                      getBusinessTypeLabel(selectedBusiness.type)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Sector:</span>
                    <span class="text-sm">{{
                      getBusinessSectorLabel(selectedBusiness.sector)
                    }}</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Category:</span>
                    <span class="text-sm">{{
                      getBusinessCategoryLabel(selectedBusiness.category)
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground"
                      >MOF Registration:</span
                    >
                    <Badge
                      :variant="
                        selectedBusiness.mofRegistration
                          ? 'default'
                          : 'secondary'
                      "
                      class="text-xs"
                    >
                      {{ selectedBusiness.mofRegistration ? "Yes" : "No" }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Footer -->
        <DialogFooter class="px-6 py-4 border-t gap-2">
          <Button variant="outline" @click="showBusinessDetailDialog = false">
            Close
          </Button>
          <Button
            class="flex items-center gap-2"
            @click="navigateToEditBusiness(selectedBusiness!.id)"
            :disabled="isSubmitting"
          >
            <PencilIcon class="h-4 w-4" />
            Edit Business
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Business</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the business
            <strong>"{{ businessToDelete?.name }}"</strong>? <br /><br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2">
          <Button
            variant="outline"
            @click="showDeleteDialog = false"
            :disabled="isSubmitting"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleDeleteBusiness"
            :disabled="isSubmitting"
            class="flex items-center gap-2"
          >
            <div
              v-if="isSubmitting"
              class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            ></div>
            {{ isSubmitting ? "Deleting..." : "Delete Business" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
  ImageIcon,
  SearchIcon,
  RefreshCcwIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  ChevronDownIcon,
} from "lucide-vue-next";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// Types and composables
import type { Business } from "@/types/business";

import { apiFetching } from "@/services/api-fetching";
import { toast } from "vue-sonner";
import { getBusinessImageUrl } from "@/utils/imageUrl";

// Router
const router = useRouter();

// Business composable
// const { businesses, isLoading, isSubmitting, fetchBusinesses, deleteBusiness } =
//   useBusiness();

const isLoading = ref(false);
const isSubmitting = ref(false);

const BUSINESS_TYPE_OPTIONS = ref<any[]>([]);
const BUSINESS_SECTOR_OPTIONS = ref<any[]>([]);
const BUSINESS_CATEGORY_OPTIONS = ref<any[]>([]);

const businesses = ref<Business[]>([]);

// Dialog states
const showDeleteDialog = ref(false);
const showBusinessDetailDialog = ref(false);
const businessToDelete = ref<Business | null>(null);
const selectedBusiness = ref<Business | null>(null);

// Search and filter states
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(9);
const sortBy = ref("newest");
const showMobileFilters = ref(false);

// Filters
const filters = ref({
  sector: "all",
  mofRegistration: "all",
});

// Filter options (using the imported constants)
const businessSectorOptions = BUSINESS_SECTOR_OPTIONS;

// Computed properties
const filteredResults = computed(() => {
  let results = [...businesses.value];

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (business) =>
        business.name.toLowerCase().includes(query) ||
        business.ssm.toLowerCase().includes(query) ||
        business.address.toLowerCase().includes(query) ||
        business.phone.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.sector !== "all") {
    results = results.filter(
      (business) => business.sector === filters.value.sector
    );
  }

  if (filters.value.mofRegistration !== "all") {
    const isMofRegistered = filters.value.mofRegistration === "true";
    results = results.filter(
      (business) => business.mofRegistration === isMofRegistered
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "newest":
      results.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
      break;
    case "oldest":
      results.sort(
        (a: any, b: any) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "sector":
      results.sort((a, b) => a.sector.localeCompare(b.sector));
      break;
  }

  return results;
});

const totalResults = computed(() => filteredResults.value.length);
const totalPages = computed(() =>
  Math.ceil(totalResults.value / itemsPerPage.value)
);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

const paginatedResults = computed(() => {
  return filteredResults.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== "" ||
    filters.value.sector !== "all" ||
    filters.value.mofRegistration !== "all"
  );
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.sector !== "all") count++;
  if (filters.value.mofRegistration !== "all") count++;
  return count;
});

// Utility functions for labels
const getBusinessTypeLabel = (type: string) => {
  return (
    BUSINESS_TYPE_OPTIONS.value.find((option: any) => option.value === type)
      ?.title || type
  );
};

const getBusinessSectorLabel = (sector: string) => {
  return (
    BUSINESS_SECTOR_OPTIONS.value.find((option) => option.value === sector)
      ?.title || sector
  );
};

const getBusinessCategoryLabel = (category: string) => {
  return (
    BUSINESS_CATEGORY_OPTIONS.value.find((option) => option.value === category)
      ?.title || category
  );
};

// Methods
const performSearch = () => {
  currentPage.value = 1;
};

const resetFilters = () => {
  searchQuery.value = "";
  filters.value = {
    sector: "all",
    mofRegistration: "all",
  };
  sortBy.value = "newest";
  currentPage.value = 1;
};

const viewBusinessDetail = (business: Business) => {
  selectedBusiness.value = business;
  showBusinessDetailDialog.value = true;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Navigation functions
const navigateToAddBusiness = () => {
  router.push("/user/businesses/add");
};

const navigateToEditBusiness = (businessId: string) => {
  router.push(`/user/businesses/${businessId}`);
};

// Delete confirmation
const confirmDeleteBusiness = (business: Business) => {
  businessToDelete.value = business;
  showDeleteDialog.value = true;
};

const handleDeleteBusiness = async () => {
  try {
    const response = await apiFetching().delete(
      `/businesses/${businessToDelete.value?.id}`,
      true
    );
    console.log("response.data: ", response.data);

    showDeleteDialog.value = false;
    businessToDelete.value = null;

    toast.success("Business deleted successfully");
    fetchBusinesses();
  } catch (error) {
    toast.error("Failed to delete business");
    console.error("Failed to delete business:", error);
  }
};

async function fetchLookup() {
  try {
    const bt = await apiFetching().get(`/lookup?lookup_group=business_type`);
    console.log("response.data: ", bt.data.lookup_data);

    BUSINESS_TYPE_OPTIONS.value = bt.data.lookup_data;

    const bs = await apiFetching().get(`/lookup?lookup_group=business_sector`);
    console.log("response.data: ", bs.data.lookup_data);

    BUSINESS_SECTOR_OPTIONS.value = bs.data.lookup_data;

    const bc = await apiFetching().get(
      `/lookup?lookup_group=business_category`
    );
    console.log("response.data: ", bc.data.lookup_data);

    BUSINESS_CATEGORY_OPTIONS.value = bc.data.lookup_data;
  } catch (error) {
    console.error("Fetch lookup error:", error);
  }
}

async function fetchBusinesses() {
  try {
    isLoading.value = true;
    const response = await apiFetching().get("/businesses", true);

    console.log("response.data: ", response.data);

    businesses.value = response.data.businesses;
  } catch (error) {
    console.error("Fetch businesses error:", error);
  } finally {
    isLoading.value = false;
  }
}

// Load businesses on mount
onMounted(async () => {
  try {
    await fetchLookup();
    await fetchBusinesses();
  } catch (error) {
    console.error("Error loading page data:", error);
  }
});
</script>
