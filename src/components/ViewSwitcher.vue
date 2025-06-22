<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { ChevronsUpDown, User, Users } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { isMobile } = useSidebar();

// Available views for users with operator privileges
const views = [
  {
    name: 'User',
    description: 'Personal dashboard and features',
    icon: User,
    path: '/user/dashboard',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    name: 'Operator',
    description: 'State administration tools',
    icon: Users,
    path: '/operator/dashboard',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
];

// Determine current view based on route
const currentView = computed(() => {
  if (route.path.startsWith('/operator/')) {
    return views[1]; // Operator view
  }
  return views[0]; // User view
});

// Only show if user has operator privileges
const showSwitcher = computed(() => {
  return authStore.user?.is_operator || authStore.getUser()?.is_operator;
});

const switchView = (view: typeof views[0]) => {
  if (view.path !== route.path) {
    router.push(view.path);
  }
};
</script>

<template>
  <SidebarMenu v-if="showSwitcher">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div 
              class="flex aspect-square size-8 items-center justify-center rounded-lg"
              :class="currentView.bgColor"
            >
              <component 
                :is="currentView.icon" 
                class="size-4"
                :class="currentView.color"
              />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">
                {{ currentView.name }} View
              </span>
              <span class="truncate text-xs text-muted-foreground">
                {{ currentView.description }}
              </span>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuItem
            v-for="view in views"
            :key="view.name"
            class="gap-2 p-2"
            @click="switchView(view)"
          >
            <div 
              class="flex size-6 items-center justify-center rounded-sm border"
              :class="view.bgColor"
            >
              <component 
                :is="view.icon" 
                class="size-4"
                :class="view.color"
              />
            </div>
            <div class="flex flex-col">
              <span class="font-medium">{{ view.name }}</span>
              <span class="text-xs text-muted-foreground">{{ view.description }}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template> 