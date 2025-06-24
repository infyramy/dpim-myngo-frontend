<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-0"
    >
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold">My Products</h1>
        <p class="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage your products and services
        </p>
      </div>
      <Button
        @click="showAddProductDialog = true"
        :disabled="isSubmitting"
        class="flex items-center gap-2 w-full sm:w-auto"
      >
        <PlusIcon class="h-4 w-4" />
        New Product
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
                placeholder="Search products, services, tags, or links..."
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
                      <Badge
                        v-if="activeFiltersCount > 0"
                        variant="secondary"
                        class="text-xs"
                      >
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
                      <Label for="productCategoryMobile" class="text-sm"
                        >Category</Label
                      >
                      <Select
                        v-model="filters.category"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger
                          id="productCategoryMobile"
                          class="w-full mt-1 h-10"
                        >
                          <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All categories</SelectItem>
                          <SelectItem
                            v-for="category in categories"
                            :key="category.value"
                            :value="category.value"
                          >
                            {{ category.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label for="statusFilterMobile" class="text-sm"
                        >Status</Label
                      >
                      <Select
                        v-model="filters.status"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger
                          id="statusFilterMobile"
                          class="w-full mt-1 h-10"
                        >
                          <SelectValue placeholder="All status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label for="featuredFilterMobile" class="text-sm"
                        >Featured</Label
                      >
                      <Select
                        v-model="filters.featured"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger
                          id="featuredFilterMobile"
                          class="w-full mt-1 h-10"
                        >
                          <SelectValue placeholder="All products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All products</SelectItem>
                          <SelectItem value="true">Featured only</SelectItem>
                          <SelectItem value="false">Non-featured</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label for="tagFilterMobile" class="text-sm">Tag</Label>
                      <Select
                        v-model="filters.tag"
                        @update:modelValue="performSearch"
                      >
                        <SelectTrigger
                          id="tagFilterMobile"
                          class="w-full mt-1 h-10"
                        >
                          <SelectValue placeholder="All tags" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All tags</SelectItem>
                          <SelectItem
                            v-for="tag in allTags"
                            :key="tag.id"
                            :value="tag.name"
                          >
                            {{ tag.name }}
                          </SelectItem>
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
            <div class="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label for="productCategory" class="text-sm">Category</Label>
                <Select
                  v-model="filters.category"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="productCategory" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem
                      v-for="category in categories"
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="statusFilter" class="text-sm">Status</Label>
                <Select
                  v-model="filters.status"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="statusFilter" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="featuredFilter" class="text-sm">Featured</Label>
                <Select
                  v-model="filters.featured"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="featuredFilter" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All products</SelectItem>
                    <SelectItem value="true">Featured only</SelectItem>
                    <SelectItem value="false">Non-featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="tagFilter" class="text-sm">Tag</Label>
                <Select
                  v-model="filters.tag"
                  @update:modelValue="performSearch"
                >
                  <SelectTrigger id="tagFilter" class="w-full mt-1 h-10">
                    <SelectValue placeholder="All tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    <SelectItem
                      v-for="tag in allTags"
                      :key="tag.id"
                      :value="tag.name"
                    >
                      {{ tag.name }}
                    </SelectItem>
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

    <!-- Products Section -->
    <div class="px-4 sm:px-0">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3"
      >
        <h2 class="text-lg sm:text-xl font-semibold">
          Your Products
          <span
            class="text-sm sm:text-base font-normal text-muted-foreground ml-2"
          >
            ({{ totalResults }} products)
          </span>
        </h2>
        <div class="flex items-center gap-2">
          <p class="text-sm text-muted-foreground whitespace-nowrap">
            Sort by:
          </p>
          <Select v-model="sortBy" @update:modelValue="performSearch">
            <SelectTrigger class="w-[140px] sm:w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
      >
        <Card v-for="i in 6" :key="i" class="animate-pulse">
          <CardContent class="p-3 sm:p-4">
            <div class="space-y-3">
              <div class="h-28 sm:h-32 bg-muted rounded"></div>
              <div class="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
              <div class="h-3 bg-muted rounded w-1/2"></div>
              <div class="h-3 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 sm:py-12 px-4">
        <div
          class="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-full flex items-center justify-center mb-4"
        >
          <AlertCircleIcon class="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
        </div>
        <h3 class="text-base sm:text-lg font-semibold mb-2">
          Error Loading Products
        </h3>
        <p
          class="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto"
        >
          {{ error }}
        </p>
        <Button
          @click="fetchProducts"
          class="flex items-center gap-2 w-full sm:w-auto"
        >
          <RefreshCcwIcon class="h-4 w-4" />
          Try Again
        </Button>
      </div>

      <!-- Products Grid -->
      <div
        v-else-if="paginatedResults.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6"
      >
        <Card
          v-for="product in paginatedResults"
          :key="product.id"
          class="hover:shadow-md transition-shadow overflow-hidden"
        >
          <CardContent class="p-0">
            <!-- Product Image -->
            <div class="aspect-video w-full overflow-hidden bg-muted relative">
              <!-- <img
                :src="product.images?.[0] || '/placeholder-image.jpg'"
                :alt="product.name"
                class="h-full w-full object-cover"
                loading="lazy"
              /> -->


              <img
                v-if="product.images && product.images.length > 0"
                :src="`${backendUrl}${product.images?.[0]}`"
                :alt="product.name"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <img
                v-else
                src="@/assets/logo/dpim-logo-1.png"
                :alt="product.name"
                class="h-auto w-auto object-fill"
                loading="lazy"
              />
              <div class="absolute top-2 right-2 flex gap-1">
                <Badge
                  :variant="
                    product.status === 'active' ? 'default' : 'secondary'
                  "
                  class="text-xs capitalize"
                >
                  {{ product.status }}
                </Badge>
                <Badge
                  v-if="product.featured"
                  variant="default"
                  class="text-xs bg-yellow-500"
                >
                  Featured
                </Badge>
              </div>
              <!-- Multiple Images Indicator -->
              <div
                v-if="product.images && product.images.length > 1"
                class="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
              >
                {{ product.images.length }} images
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-3 sm:p-4 space-y-3">
              <div>
                <h3
                  class="font-semibold text-base sm:text-lg line-clamp-1 mb-1"
                >
                  {{ product.name }}
                </h3>
                <div class="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" class="text-xs">{{
                    getCategoryLabel(product.category)
                  }}</Badge>
                  <Badge
                    v-if="product.business"
                    variant="secondary"
                    class="text-xs"
                  >
                    {{ product.business.label }}
                  </Badge>
                </div>
              </div>

              <p class="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {{ product.description }}
              </p>

              <!-- Tags -->
              <div
                v-if="product.tags && product.tags.length > 0"
                class="flex flex-wrap gap-1"
              >
                <div
                  v-for="tag in product.tags.slice(0, 3)"
                  :key="tag.id"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-sm"
                >
                  <TagIcon class="h-3 w-3" />
                  {{ tag.name }}
                </div>
                <div
                  v-if="product.tags.length > 3"
                  class="inline-flex items-center px-2 py-1 bg-muted text-muted-foreground text-xs rounded-sm"
                >
                  +{{ product.tags.length - 3 }} more
                </div>
              </div>

              <div class="space-y-2">
                <div
                  class="flex items-center justify-between text-xs text-muted-foreground"
                >
                  <span class="hidden sm:inline"
                    >Created: {{ formatDate(product.createdAt) }}</span
                  >
                  <div class="flex items-center gap-1">
                    <CalendarIcon class="h-3 w-3" />
                    <span class="sm:hidden">{{
                      formatDate(product.createdAt)
                    }}</span>
                    <span class="hidden sm:inline">{{
                      formatDate(product.createdAt)
                    }}</span>
                  </div>
                </div>

                <!-- Product Link Display -->
                <div v-if="product.link" class="text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <span class="flex-shrink-0">🔗</span>
                    <a
                      :href="product.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 underline truncate"
                    >
                      {{
                        product.link.length > 30
                          ? product.link.substring(0, 30) + "..."
                          : product.link
                      }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex justify-between pt-2 gap-2">
                <div class="flex gap-1 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1 flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    @click="viewProductDetail(product)"
                  >
                    <EyeIcon class="h-3 w-3" />
                    <span class="hidden sm:inline">View</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    class="flex items-center gap-1 flex-1 text-xs sm:text-sm h-8 sm:h-9"
                    @click="editProduct(product)"
                  >
                    <PencilIcon class="h-3 w-3" />
                    <span class="hidden sm:inline">Edit</span>
                  </Button>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  class="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-3"
                  @click="deleteProduct(product.id)"
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
          <PackageIcon class="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
        </div>
        <h3 class="text-base sm:text-lg font-semibold mb-2">
          {{ hasActiveFilters ? "No products found" : "No products yet" }}
        </h3>
        <p
          class="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto"
        >
          {{
            hasActiveFilters
              ? "Try adjusting your search criteria or reset filters"
              : 'You haven\'t added any products yet. Click "Add Product" to get started.'
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
            @click="showAddProductDialog = true"
            class="flex items-center gap-2 w-full sm:w-auto"
          >
            <PlusIcon class="h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="paginatedResults.length > 0 && totalPages > 1"
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <p
          class="text-xs sm:text-sm text-muted-foreground text-center sm:text-left"
        >
          Showing {{ startIndex + 1 }}-{{ Math.min(endIndex, totalResults) }} of
          {{ totalResults }} products
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

    <!-- Product Detail Dialog -->
    <Dialog v-model:open="showProductDetailDialog">
      <DialogContent class="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
        <!-- Fixed Header -->
        <DialogHeader class="px-6 py-4 border-b">
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            Detailed information about your product
          </DialogDescription>
        </DialogHeader>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="selectedProduct" class="grid gap-6">
            <!-- Product Images -->
            <div class="w-full">
              <!-- Single Image -->
              <div
                v-if="
                  !selectedProduct.images || selectedProduct.images.length <= 1
                "
                class="aspect-video w-full overflow-hidden bg-muted rounded-lg shadow-lg"
              >
                <!-- <img
                  :src="
                    `${backendUrl}${selectedProduct.images?.[0]}` ||
                    '/placeholder-image.jpg'
                  "
                  :alt="selectedProduct.name"
                  class="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                /> -->

                <img
                  v-if="
                    selectedProduct.images && selectedProduct.images.length > 0
                  "
                  :src="`${backendUrl}${selectedProduct.images?.[0]}`"
                  :alt="selectedProduct.name"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <img
                  v-else
                  src="@/assets/logo/dpim-logo-1.png"
                  :alt="selectedProduct.name"
                  class="h-auto w-auto object-fill"
                  loading="lazy"
                />
              </div>

              <!-- Multiple Images Carousel -->
              <div v-else class="w-full space-y-4">
                <!-- Main Carousel -->
                <div class="relative">
                  <Carousel class="w-full" v-model="currentImageIndex">
                    <CarouselContent>
                      <CarouselItem
                        v-for="(image, index) in selectedProduct.images"
                        :key="index"
                      >
                        <div
                          class="aspect-video w-full overflow-hidden bg-muted rounded-lg shadow-lg relative group"
                        >
                          <img
                            :src="`${backendUrl}${image}`"
                            :alt="`${selectedProduct.name} - Image ${
                              index + 1
                            }`"
                            class="h-full w-full object-cover transition-transform duration-300"
                            loading="lazy"
                          />
                          <!-- Image overlay with info -->
                          <div
                            class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                          <!-- Full screen button -->
                          <button
                            @click="openImageFullscreen(image)"
                            class="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            type="button"
                          >
                            <svg
                              class="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                              />
                            </svg>
                          </button>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious
                      class="left-3 bg-white/90 hover:bg-white shadow-lg"
                    />
                    <CarouselNext
                      class="right-3 bg-white/90 hover:bg-white shadow-lg"
                    />
                  </Carousel>

                  <!-- Image Counter and Navigation -->
                  <div
                    class="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {{ (currentImageIndex || 0) + 1 }} /
                    {{ selectedProduct.images.length }}
                  </div>
                </div>

                <!-- Thumbnail Navigation (for 3+ images) -->
                <div
                  v-if="selectedProduct.images.length > 2"
                  class="flex gap-2 overflow-x-auto pb-2"
                >
                  <button
                    v-for="(image, index) in selectedProduct.images"
                    :key="`thumb-${index}`"
                    @click="setCurrentImage(index)"
                    :class="[
                      'flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                      (currentImageIndex || 0) === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100',
                    ]"
                    type="button"
                  >
                    <img
                      :src="`${backendUrl}${image}`"
                      :alt="`${selectedProduct.name} - Thumbnail ${index + 1}`"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>
                </div>

                <!-- Image Indicators (for 2-3 images) -->
                <div
                  v-else-if="selectedProduct.images.length > 1"
                  class="flex justify-center gap-2"
                >
                  <button
                    v-for="(_, index) in selectedProduct.images"
                    :key="`indicator-${index}`"
                    @click="setCurrentImage(index)"
                    :class="[
                      'w-2 h-2 rounded-full transition-all duration-200',
                      (currentImageIndex || 0) === index
                        ? 'bg-primary scale-125'
                        : 'bg-gray-300 hover:bg-gray-400',
                    ]"
                    type="button"
                  />
                </div>
              </div>
            </div>

            <!-- Product Info -->
            <div>
              <div class="flex items-start justify-between mb-3">
                <h2 class="text-2xl font-bold">{{ selectedProduct.name }}</h2>
                <div class="flex gap-2">
                  <Badge
                    :variant="
                      selectedProduct.status === 'active'
                        ? 'default'
                        : 'secondary'
                    "
                    class="capitalize"
                  >
                    {{ selectedProduct.status }}
                  </Badge>
                  <Badge
                    v-if="selectedProduct.featured"
                    variant="default"
                    class="bg-yellow-500"
                  >
                    Featured
                  </Badge>
                </div>
              </div>
              <div class="flex items-center gap-3 mb-4">
                <Badge variant="outline">{{
                  getCategoryLabel(selectedProduct.category)
                }}</Badge>
                <Badge v-if="selectedProduct.business" variant="secondary">
                  {{ selectedProduct.business.label }}
                </Badge>
                <div
                  class="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <CalendarIcon class="h-4 w-4" />
                  Created {{ formatDate(selectedProduct.createdAt) }}
                </div>
              </div>
            </div>

            <Separator />

            <!-- Product Description -->
            <div>
              <h3 class="font-semibold mb-3">Product Description</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ selectedProduct.description }}
              </p>
            </div>

            <Separator />

            <!-- Product Link -->
            <div v-if="selectedProduct.link">
              <h3 class="font-semibold mb-3">Product Link</h3>
              <div class="flex items-center gap-2">
                <a
                  :href="selectedProduct.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                >
                  {{ selectedProduct.link }}
                </a>
                <button
                  @click="copyToClipboard(selectedProduct.link)"
                  class="text-gray-500 hover:text-gray-700 text-xs"
                  type="button"
                >
                  Copy
                </button>
              </div>
            </div>

            <Separator />

            <!-- Product Tags -->
            <div v-if="selectedProduct.tags && selectedProduct.tags.length > 0">
              <h3 class="font-semibold mb-3">Tags</h3>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="tag in selectedProduct.tags"
                  :key="tag.id"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-md"
                >
                  <TagIcon class="h-3 w-3" />
                  {{ tag.name }}
                </div>
              </div>
            </div>

            <Separator />

            <!-- Product Statistics -->
            <div>
              <h3 class="font-semibold mb-3">Product Information</h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Status:</span>
                    <Badge
                      :variant="
                        selectedProduct.status === 'active'
                          ? 'default'
                          : 'secondary'
                      "
                      class="text-xs"
                    >
                      {{ selectedProduct.status }}
                    </Badge>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Category:</span>
                    <span class="text-sm">{{
                      getCategoryLabel(selectedProduct.category)
                    }}</span>
                  </div>
                  <div
                    v-if="selectedProduct.business"
                    class="flex justify-between"
                  >
                    <span class="text-sm text-muted-foreground">Business:</span>
                    <span class="text-sm">{{
                      selectedProduct.business.label
                    }}</span>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Featured:</span>
                    <span class="text-sm">{{
                      selectedProduct.featured ? "Yes" : "No"
                    }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-muted-foreground">Created:</span>
                    <span class="text-sm">{{
                      formatDate(selectedProduct.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Footer -->
        <DialogFooter class="px-6 py-4 border-t gap-2">
          <Button variant="outline" @click="showProductDetailDialog = false">
            Close
          </Button>
          <Button
            class="flex items-center gap-2"
            @click="editProduct(selectedProduct!)"
          >
            <PencilIcon class="h-4 w-4" />
            Edit Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add/Edit Product Dialog -->
    <Dialog v-model:open="showAddProductDialog" :modal="!isResettingForm">
      <DialogContent class="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader class="px-6 py-4 border-b">
          <DialogTitle>{{
            editingProduct ? "Edit Product" : "Add New Product"
          }}</DialogTitle>
          <DialogDescription>
            {{
              editingProduct
                ? "Update your product information."
                : "Fill in the form below to add a new product."
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <form @submit.prevent="saveProduct" class="space-y-6">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <Label for="productName">Product Name *</Label>
                <Input
                  id="productName"
                  v-model="productForm.name"
                  placeholder="Enter product name"
                  class="mt-1"
                  required
                />
              </div>

              <div>
                <Label for="productBusiness">Business *</Label>
                <Select v-model="productForm.businessId">
                  <SelectTrigger id="productBusiness" class="w-full mt-1">
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="business in businesses"
                      :key="business.value"
                      :value="business.value.toString()"
                    >
                      {{ business.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="productCategory">Category *</Label>
                <Select v-model="productForm.category">
                  <SelectTrigger id="productCategory" class="w-full mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="category in categories"
                      :key="category.value"
                      :value="category.value"
                    >
                      {{ category.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="productDescription">Description *</Label>
                <Textarea
                  id="productDescription"
                  v-model="productForm.description"
                  placeholder="Enter detailed product description"
                  class="mt-1"
                  rows="4"
                  required
                />
              </div>

              <div>
                <Label class="text-sm font-medium">
                  Product Images (Optional)
                </Label>
                <p class="text-xs text-muted-foreground mb-2">
                  Upload up to 5 images of your product (Max 5MB each)
                </p>
                <ImageUpload
                  :model-value="productForm.images || []"
                  @update:model-value="handleImageUpdate"
                  :max-files="5"
                  :max-file-size="5 * 1024 * 1024"
                  accept=".png,.jpg,.jpeg,.gif"
                  @error="handleImageError"
                />
              </div>

              <div>
                <Label for="productLink">Product Link (Optional)</Label>
                <Input
                  id="productLink"
                  v-model="productForm.link"
                  type="text"
                  placeholder="Enter product link (e.g., https://your-website.com/product)"
                  class="mt-1"
                />
                <p class="text-xs text-muted-foreground mt-1">
                  Add full URL to your product (website, online store, social
                  media, etc.)
                </p>
              </div>

              <div>
                <Label for="productTags">Tags</Label>
                <TagInput
                  id="productTags"
                  :model-value="productForm.tags"
                  @update:model-value="handleTagsUpdate"
                  :suggestions="tagSuggestions"
                  :max-tags="10"
                  placeholder="Add tags for product matching..."
                  help-text="Press Enter or comma to add tags. Tags help with product matching."
                  class="mt-1"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="productStatus">Status</Label>
                  <Select v-model="productForm.status">
                    <SelectTrigger id="productStatus" class="w-full mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div class="flex items-center justify-center">
                  <div class="flex items-center space-x-2">
                    <input
                      id="featured"
                      type="checkbox"
                      v-model="productForm.featured"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label for="featured">Featured product</Label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <DialogFooter class="px-6 py-4 border-t">
          <Button
            variant="outline"
            @click="cancelEdit"
            type="button"
            :disabled="isResettingForm"
          >
            Cancel
          </Button>
          <Button
            @click="saveProduct"
            type="submit"
            :disabled="!isFormValid || isSubmitting || isResettingForm"
          >
            {{ editingProduct ? "Update Product" : "Create Product" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{{ productToDelete?.name }}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2">
          <Button
            variant="outline"
            @click="showDeleteDialog = false"
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="confirmDelete"
            type="button"
            :disabled="isSubmitting"
          >
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Fullscreen Image Dialog -->
    <Dialog v-model:open="showImageFullscreen">
      <DialogContent
        class="max-w-[95vw] max-h-[95vh] p-0 bg-transparent border-0 shadow-none"
      >
        <div class="relative w-full h-full flex items-center justify-center">
          <img
            :src="fullscreenImageUrl"
            :alt="selectedProduct?.name || 'Product image'"
            class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            @click="closeImageFullscreen"
          />
          <button
            @click="closeImageFullscreen"
            class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
            type="button"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PackageIcon,
  SearchIcon,
  RefreshCcwIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  AlertCircleIcon,
  TagIcon,
  SlidersHorizontalIcon,
  ChevronDownIcon,
} from "lucide-vue-next";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { apiFetching } from "@/services/api-fetching";
import { toast } from "vue-sonner";

// Types
interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Business {
  value: number;
  label: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  images?: string[];
  status: "active" | "inactive";
  featured: boolean;
  slug: string;
  businessId: number;
  business?: Business;
  tags: Tag[];
  link?: string;
  createdAt: string;
  modifiedAt?: string;
}

interface Category {
  value: string;
  label: string;
}

// Reactive state
const showAddProductDialog = ref(false);
const showDeleteDialog = ref(false);
const showProductDetailDialog = ref(false);
const editingProduct = ref<Product | null>(null);
const selectedProduct = ref<Product | null>(null);
const productToDelete = ref<Product | null>(null);
const searchQuery = ref("");
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const showMobileFilters = ref(false);
const isResettingForm = ref(false);

// Image carousel state
const currentImageIndex = ref(0);
const showImageFullscreen = ref(false);
const fullscreenImageUrl = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(9);
const sortBy = ref("newest");

// const backendUrl = "http://localhost:3001";
const backendUrl = "https://api.myngo.my";

// Filters
const filters = ref({
  category: "all",
  status: "all",
  featured: "all",
  tag: "all",
});

// Categories
const categories = ref<Category[]>([]);

// Products data
const products = ref<Product[]>([]);

// Business data
const businesses = ref<Business[]>([]);

// Tags data
const allTags = ref<Tag[]>([]);
const tagSuggestions = ref<string[]>([]);

// Product form
const productForm = ref({
  name: "",
  description: "",
  category: "",
  images: [] as (File | string)[],
  status: "active" as "active" | "inactive",
  featured: false,
  tags: [] as string[],
  businessId: "",
  link: "",
});

// API Methods

const fetchProductCategories = async () => {
  try {
    const response = await apiFetching().get(
      "/lookup?lookup_group=product_category",
      true
    );

    if (response.success && response.data?.lookup_data) {
      categories.value = response.data.lookup_data.map((category: any) => ({
        value: category.value,
        label: category.title,
      }));
    } else {
      throw new Error(response.message || "Failed to fetch product categories");
    }
  } catch (err: any) {
    console.error("Error fetching product categories:", err);
    toast.error("Failed to load product categories. Please refresh the page.");
  }
};

const fetchProducts = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await apiFetching().get("/products", true);

    if (response.success && response.data?.products) {
      products.value = response.data.products;
    } else {
      throw new Error(response.message || "Failed to fetch products");
    }
  } catch (err: any) {
    console.error("Error fetching products:", err);
    error.value = err.message || "Failed to load products";
    toast.error("Failed to load products. Please try again.");
  } finally {
    isLoading.value = false;
  }
};

const fetchUserTags = async () => {
  try {
    const response = await apiFetching().get("/products/tags/all", true);

    if (response.success && response.data?.tags) {
      allTags.value = response.data.tags;
      tagSuggestions.value = response.data.tags.map((tag: Tag) => tag.name);
    }
  } catch (err: any) {
    console.error("Error fetching tags:", err);
    // Don't show error for tags as it's not critical
  }
};

const fetchBusinesses = async () => {
  try {
    const response = await apiFetching().get("/businesses", true);

    if (response.success && response.data?.businesses) {
      businesses.value = response.data.businesses.map((business: any) => ({
        value: business.id,
        label: business.name,
      }));
    } else {
      throw new Error(response.message || "Failed to fetch businesses");
    }
  } catch (err: any) {
    console.error("Error fetching businesses:", err);
    toast.error("Failed to load businesses. Please refresh the page.");
  }
};

const createProduct = async (productData: any) => {
  try {
    const response = await apiFetching().post("/products", productData, true);

    if (response.success && response.data?.product) {
      // Add the new product to the beginning of the list
      products.value.unshift(response.data.product);
      toast.success("Product created successfully!");

      // Refresh tags if new ones were added
      if (
        productData.tags &&
        Array.isArray(productData.tags) &&
        productData.tags.length > 0
      ) {
        // Refresh tags in background, don't await
        fetchUserTags().catch((err) =>
          console.warn("Could not refresh tags:", err)
        );
      }
      return response.data.product;
    } else {
      throw new Error(response.message || "Failed to create product");
    }
  } catch (err: any) {
    console.error("Error creating product:", err);
    const errorMessage =
      err.message || "Failed to create product. Please try again.";
    toast.error(errorMessage);
    throw err;
  }
};

const updateProduct = async (productId: number, productData: any) => {
  try {
    const response = await apiFetching().put(
      `/products/${productId}`,
      productData,
      true
    );

    if (response.success && response.data?.product) {
      const index = products.value.findIndex((p) => p.id === productId);
      if (index > -1) {
        products.value[index] = response.data.product;
      }
      toast.success("Product updated successfully!");

      // Refresh tags if new ones were added
      if (
        productData.tags &&
        Array.isArray(productData.tags) &&
        productData.tags.length > 0
      ) {
        // Refresh tags in background, don't await
        fetchUserTags().catch((err) =>
          console.warn("Could not refresh tags:", err)
        );
      }

      return response.data.product;
    } else {
      throw new Error(response.message || "Failed to update product");
    }
  } catch (err: any) {
    console.error("Error updating product:", err);
    const errorMessage =
      err.message || "Failed to update product. Please try again.";
    toast.error(errorMessage);
    throw err;
  }
};

const deleteProductApi = async (productId: number) => {
  try {
    const response = await apiFetching().delete(`/products/${productId}`, true);

    if (response.success) {
      const index = products.value.findIndex((p) => p.id === productId);
      if (index > -1) {
        products.value.splice(index, 1);
      }
      toast.success("Product deleted successfully!");

      // Reset current page if we're on a page that no longer exists
      const newTotalPages = Math.ceil(
        products.value.length / itemsPerPage.value
      );
      if (currentPage.value > newTotalPages && newTotalPages > 0) {
        currentPage.value = newTotalPages;
      }
    } else {
      throw new Error(response.message || "Failed to delete product");
    }
  } catch (err: any) {
    console.error("Error deleting product:", err);
    const errorMessage =
      err.message || "Failed to delete product. Please try again.";
    toast.error(errorMessage);
    throw err;
  }
};

const createProductWithFormData = async (formData: FormData) => {
  try {
    const response = await apiFetching().postFormData(
      "/products",
      formData,
      true
    );

    if (response.success && response.data?.product) {
      // Add the new product to the beginning of the list
      products.value.unshift(response.data.product);
      toast.success("Product created successfully!");

      // Refresh tags if new ones were added
      const tagsData = formData.get("tags");
      if (tagsData) {
        try {
          const tags = JSON.parse(tagsData as string);
          if (tags && Array.isArray(tags) && tags.length > 0) {
            // Refresh tags in background, don't await
            fetchUserTags().catch((err) =>
              console.warn("Could not refresh tags:", err)
            );
          }
        } catch (e) {
          console.warn("Could not parse tags for refresh:", e);
        }
      }
      return response.data.product;
    } else {
      throw new Error(response.message || "Failed to create product");
    }
  } catch (err: any) {
    console.error("Error creating product with images:", err);
    const errorMessage =
      err.message || "Failed to create product. Please try again.";
    toast.error(errorMessage);
    throw err;
  }
};

const updateProductWithFormData = async (
  productId: number,
  formData: FormData
) => {
  try {
    const response = await apiFetching().putFormData(
      `/products/${productId}`,
      formData,
      true
    );

    if (response.success && response.data?.product) {
      const index = products.value.findIndex((p) => p.id === productId);
      if (index > -1) {
        products.value[index] = response.data.product;
      }
      toast.success("Product updated successfully!");

      // Refresh tags if new ones were added
      const tagsData = formData.get("tags");
      if (tagsData) {
        try {
          const tags = JSON.parse(tagsData as string);
          if (tags && Array.isArray(tags) && tags.length > 0) {
            // Refresh tags in background, don't await
            fetchUserTags().catch((err) =>
              console.warn("Could not refresh tags:", err)
            );
          }
        } catch (e) {
          console.warn("Could not parse tags for refresh:", e);
        }
      }

      return response.data.product;
    } else {
      throw new Error(response.message || "Failed to update product");
    }
  } catch (err: any) {
    console.error("Error updating product with images:", err);
    const errorMessage =
      err.message || "Failed to update product. Please try again.";
    toast.error(errorMessage);
    throw err;
  }
};

// Computed properties
const filteredResults = computed(() => {
  let results = [...products.value];

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.link && product.link.toLowerCase().includes(query)) ||
        product.tags.some((tag) => tag.name.toLowerCase().includes(query))
    );
  }

  // Apply filters
  if (filters.value.category !== "all") {
    results = results.filter(
      (product) => product.category === filters.value.category
    );
  }

  if (filters.value.status !== "all") {
    results = results.filter(
      (product) => product.status === filters.value.status
    );
  }

  if (filters.value.featured !== "all") {
    const isFeatured = filters.value.featured === "true";
    results = results.filter((product) => product.featured === isFeatured);
  }

  if (filters.value.tag !== "all") {
    results = results.filter((product) =>
      product.tags.some((tag) => tag.name === filters.value.tag)
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case "newest":
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      results.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "category":
      results.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "status":
      results.sort((a, b) => a.status.localeCompare(b.status));
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
    filters.value.category !== "all" ||
    filters.value.status !== "all" ||
    filters.value.featured !== "all" ||
    filters.value.tag !== "all"
  );
});

const activeFiltersCount = computed(() => {
  let count = 0;
  if (filters.value.category !== "all") count++;
  if (filters.value.status !== "all") count++;
  if (filters.value.featured !== "all") count++;
  if (filters.value.tag !== "all") count++;
  return count;
});

const isFormValid = computed(() => {
  // Prevent computation during form reset
  if (isResettingForm.value) return false;

  try {
    return (
      productForm.value.name?.trim() !== "" &&
      productForm.value.category !== "" &&
      productForm.value.description?.trim() !== "" &&
      productForm.value.businessId !== ""
    );
  } catch (error) {
    console.warn("Error in form validation:", error);
    return false;
  }
});

// Helper functions
const getCategoryLabel = (value: string): string => {
  const category = categories.value.find((cat) => cat.value === value);
  return category ? category.label : value;
};

// Removed unused getBusinessName function - business name is already in product.business.label

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Search debouncing to prevent excessive updates
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Methods
const performSearch = () => {
  // Debounce search to avoid excessive filtering while typing
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  // The watcher will handle pagination reset, so we don't need to do it here
  searchTimeout = setTimeout(() => {
    // Search is handled by computed properties, no action needed
  }, 300);
};

const resetFilters = () => {
  searchQuery.value = "";
  filters.value = {
    category: "all",
    status: "all",
    featured: "all",
    tag: "all",
  };
  sortBy.value = "newest";
  currentPage.value = 1;
};

const viewProductDetail = (product: Product) => {
  selectedProduct.value = product;
  showProductDetailDialog.value = true;
};

const editProduct = (product: Product) => {
  editingProduct.value = product;
  productForm.value = {
    name: product.name,
    description: product.description,
    category: product.category,
    images: product.images || [],
    status: product.status,
    featured: product.featured,
    tags: product.tags?.map((tag) => tag.name) || [],
    businessId: product.businessId ? product.businessId.toString() : "",
    link: product.link || "",
  };

  showProductDetailDialog.value = false;
  showAddProductDialog.value = true;
};

const deleteProduct = (productId: number) => {
  const product = products.value.find((p) => p.id === productId);
  if (product) {
    productToDelete.value = product;
    showDeleteDialog.value = true;
  }
};

const confirmDelete = async () => {
  if (productToDelete.value && !isSubmitting.value) {
    try {
      isSubmitting.value = true;
      await deleteProductApi(productToDelete.value.id);
      showDeleteDialog.value = false;
      productToDelete.value = null;
    } catch (error) {
      // Error handling is done in the API method
    } finally {
      isSubmitting.value = false;
    }
  }
};

const saveProduct = async () => {
  if (!isFormValid.value || isSubmitting.value) {
    return;
  }

  try {
    isSubmitting.value = true;

    // Debug: Log the featured value
    console.log("Featured value before save:", productForm.value.featured);

    // Validate form data
    if (!productForm.value.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!productForm.value.businessId) {
      toast.error("Please select a business");
      return;
    }
    if (!productForm.value.category) {
      toast.error("Please select a category");
      return;
    }
    if (!productForm.value.description.trim()) {
      toast.error("Product description is required");
      return;
    }

    // Validate URL if provided
    if (productForm.value.link && productForm.value.link.trim()) {
      const trimmedLink = productForm.value.link.trim();

      try {
        // Try to create a URL object - this will validate the URL format
        let testUrl: URL;

        // If URL doesn't have protocol, add https://
        if (
          !trimmedLink.startsWith("http://") &&
          !trimmedLink.startsWith("https://")
        ) {
          testUrl = new URL("https://" + trimmedLink);
          productForm.value.link = "https://" + trimmedLink;
        } else {
          testUrl = new URL(trimmedLink);
          productForm.value.link = trimmedLink;
        }

        // Basic validation - must have a hostname
        if (!testUrl.hostname) {
          throw new Error("Invalid URL");
        }
      } catch (error) {
        toast.error("Please enter a valid URL for the product link");
        return;
      }
    }

    // Prepare tags array
    const validTags = productForm.value.tags
      .filter((tag) => tag && typeof tag === "string" && tag.trim().length > 0)
      .map((tag) => tag.trim());

    // Check if there are new file uploads
    const hasNewFiles = productForm.value.images?.some(
      (img) => img instanceof File
    );

    if (
      hasNewFiles ||
      (productForm.value.images && productForm.value.images.length > 0)
    ) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add form fields
      formData.append("name", productForm.value.name.trim());
      formData.append("description", productForm.value.description.trim());
      formData.append("category", productForm.value.category);
      formData.append("status", productForm.value.status);
      formData.append("featured", productForm.value.featured.toString());
      formData.append("businessId", productForm.value.businessId);
      formData.append("tags", JSON.stringify(validTags));

      // Add link if provided
      if (productForm.value.link && productForm.value.link.trim()) {
        formData.append("link", productForm.value.link.trim());
      }

      // Add images
      if (productForm.value.images) {
        productForm.value.images.forEach((item) => {
          if (item instanceof File) {
            formData.append("images", item);
          }
        });

        // Add existing image URLs
        const existingImages = productForm.value.images.filter(
          (img) => typeof img === "string"
        );
        if (existingImages.length > 0) {
          formData.append("existingImages", JSON.stringify(existingImages));
        }
      }

      if (editingProduct.value) {
        await updateProductWithFormData(editingProduct.value.id, formData);
      } else {
        await createProductWithFormData(formData);
      }
    } else {
      // Use regular JSON for requests without files
      const productData = {
        name: productForm.value.name.trim(),
        description: productForm.value.description.trim(),
        category: productForm.value.category,
        images: [],
        status: productForm.value.status,
        featured: productForm.value.featured,
        tags: validTags,
        businessId: parseInt(productForm.value.businessId),
        link:
          productForm.value.link && productForm.value.link.trim()
            ? productForm.value.link.trim()
            : null,
      };

      if (editingProduct.value) {
        await updateProduct(editingProduct.value.id, productData);
      } else {
        await createProduct(productData);
      }
    }

    await resetForm();
    showAddProductDialog.value = false;
  } catch (error) {
    console.error("Error saving product:", error);
    toast.error("Failed to save product. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = async () => {
  try {
    isResettingForm.value = true;

    editingProduct.value = null;

    // Wait for next tick to ensure reactivity has processed
    await nextTick();

    productForm.value = {
      name: "",
      description: "",
      category: "",
      images: [] as (File | string)[],
      status: "active" as "active" | "inactive",
      featured: false,
      tags: [] as string[],
      businessId: "",
      link: "",
    };

    // Wait another tick for form updates to complete
    await nextTick();
  } catch (error) {
    console.error("Error resetting form:", error);
  } finally {
    isResettingForm.value = false;
  }
};

const cancelEdit = async () => {
  try {
    await resetForm();
    showAddProductDialog.value = false;
  } catch (error) {
    console.error("Error canceling edit:", error);
    // Still close the dialog even if reset fails
    showAddProductDialog.value = false;
  }
};

// Handler methods
const handleImageUpdate = (files: (File | string)[]) => {
  try {
    productForm.value.images = files;
  } catch (error) {
    console.error("Error updating images:", error);
    toast.error("Failed to update images");
  }
};

const handleImageError = (message: string) => {
  toast.error(message);
};

const handleTagsUpdate = (tags: string[]) => {
  try {
    // Validate tags
    const validTags = tags
      .filter((tag) => tag && typeof tag === "string" && tag.trim().length > 0)
      .slice(0, 10); // Limit to 10 tags

    productForm.value.tags = validTags;
  } catch (error) {
    console.error("Error updating tags:", error);
    toast.error("Failed to update tags");
  }
};

const goToPage = (page: number) => {
  try {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
      currentPage.value = page;

      // Scroll to top on page change for better UX
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  } catch (error) {
    console.error("Error changing page:", error);
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    toast.error("Failed to copy link");
  }
};

// Image carousel functions
const setCurrentImage = (index: number) => {
  currentImageIndex.value = index;
};

const openImageFullscreen = (imageUrl: string) => {
  fullscreenImageUrl.value = imageUrl;
  showImageFullscreen.value = true;
};

const closeImageFullscreen = () => {
  showImageFullscreen.value = false;
  fullscreenImageUrl.value = "";
};

// Watchers

// Debug: Watch featured value changes
watch(
  () => productForm.value.featured,
  (newValue, oldValue) => {
    console.log("Featured value changed:", { from: oldValue, to: newValue });
  }
);

// Reset image index when product changes
watch(
  () => selectedProduct.value,
  () => {
    currentImageIndex.value = 0;
  }
);

watch(
  totalPages,
  (newTotalPages) => {
    // Ensure current page is within bounds when total pages change
    if (currentPage.value > newTotalPages && newTotalPages > 0) {
      currentPage.value = newTotalPages;
    } else if (newTotalPages === 0) {
      currentPage.value = 1;
    }
  },
  { immediate: true }
);

// Watch for search/filter changes to reset pagination
watch(
  [searchQuery, () => filters.value, sortBy],
  () => {
    // Reset to first page when search/filters change
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(async () => {
  try {
    // Load critical data first
    await Promise.all([
      fetchProducts(),
      fetchBusinesses(),
      fetchProductCategories(),
    ]);

    // Load tags in background as it's not critical
    fetchUserTags().catch((err) => console.warn("Could not load tags:", err));
  } catch (error) {
    console.error("Error during component initialization:", error);
    toast.error("Failed to initialize component. Please refresh the page.");
  }
});

// Cleanup on unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }
});
</script>
