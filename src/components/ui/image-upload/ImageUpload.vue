<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <Label class="text-sm font-medium">
        Business Images
        <span class="text-muted-foreground ml-1">(Max 3 images)</span>
      </Label>
      <div class="text-xs text-muted-foreground">
        {{ files.length }}/{{ maxFiles }} images
      </div>
    </div>

    <!-- File Upload Area -->
    <div
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        isDragOver
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        files.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''
      ]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileSelect"
        :disabled="files.length >= maxFiles"
      />

      <div class="space-y-2">
        <UploadIcon class="mx-auto h-12 w-12 text-muted-foreground" />
        <div>
          <Button
            type="button"
            variant="outline"
            @click="triggerFileSelect"
            :disabled="files.length >= maxFiles"
          >
            <PlusIcon class="h-4 w-4 mr-2" />
            Choose Images
          </Button>
          <p class="text-sm text-muted-foreground mt-2">
            or drag and drop images here
          </p>
        </div>
        <p class="text-xs text-muted-foreground">
          PNG, JPG, GIF up to {{ formatFileSize(maxFileSize) }} each
        </p>
      </div>
    </div>

    <!-- File Preview Grid -->
    <div v-if="files.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="relative group border rounded-lg overflow-hidden bg-muted/50"
      >
        <!-- Image Preview -->
        <div class="aspect-video relative">
          <img
            :src="file.preview"
            :alt="`Preview ${index + 1}`"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>

        <!-- File Info -->
        <div class="p-3 space-y-1">
          <p class="text-sm font-medium truncate" :title="file.file?.name || file.url || ''">
            {{ file.file?.name || file.url }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ formatFileSize(file.file?.size || 0) }}
          </p>
        </div>

        <!-- Remove Button -->
        <Button
          type="button"
          variant="destructive"
          size="icon"
          class="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          @click="removeFile(index)"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>
    </div>

    <!-- Error Message -->
    <p v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { UploadIcon, PlusIcon, X } from 'lucide-vue-next'

interface ImageFile {
  file?: File
  url?: string
  preview: string
  isExisting: boolean
}

interface Props {
  modelValue?: (File | string)[]
  maxFiles?: number
  maxFileSize?: number
  accept?: string
}

interface Emits {
  (e: 'update:modelValue', files: (File | string)[]): void
  (e: 'error', error: string): void
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 3,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  accept: 'image/*'
})

const maxFiles = computed(() => props.maxFiles ?? 3)
const maxFileSize = computed(() => props.maxFileSize ?? 5 * 1024 * 1024)

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const files = ref<ImageFile[]>([])
const isDragOver = ref(false)
const error = ref('')

// Initialize files from modelValue on mount
const initializeFiles = () => {
  if (props.modelValue) {
    files.value = props.modelValue.map(item => {
      if (typeof item === 'string') {
        return {
          url: item,
          preview: item,
          isExisting: true
        }
      } else {
        return {
          file: item,
          preview: URL.createObjectURL(item),
          isExisting: false
        }
      }
    })
  } else {
    files.value = []
  }
}

// Initialize on mount
initializeFiles()

// Watch for external changes to modelValue (only when it's different from current state)
watch(
  () => props.modelValue,
  (newFiles) => {
    // Check if the new value is actually different from current state
    const currentFiles = files.value.map(f => f.isExisting ? f.url! : f.file!)
    const filesChanged = !newFiles || 
      newFiles.length !== currentFiles.length ||
      newFiles.some((file, index) => file !== currentFiles[index])
    
    if (filesChanged) {
      // Clear old object URLs to prevent memory leaks
      files.value.forEach(file => {
        if (!file.isExisting) {
          URL.revokeObjectURL(file.preview)
        }
      })
      
      initializeFiles()
    }
  }
)

// Helper function to emit files
const emitFiles = () => {
  const result: (File | string)[] = files.value.map(f => 
    f.isExisting ? f.url! : f.file!
  )
  emit('update:modelValue', result)
}

const triggerFileSelect = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = (newFiles: File[]) => {
  error.value = ''
  
  // Filter for image files only
  const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
  
  if (imageFiles.length !== newFiles.length) {
    error.value = 'Only image files are allowed'
    emit('error', 'Only image files are allowed')
    return
  }
  
  // Check file size
  const oversizedFiles = imageFiles.filter(file => file.size > maxFileSize.value)
  if (oversizedFiles.length > 0) {
    error.value = `Some files are too large. Maximum size is ${formatFileSize(maxFileSize.value)}`
    emit('error', error.value)
    return
  }
  
  // Check total file count
  const totalFiles = files.value.length + imageFiles.length
  if (totalFiles > maxFiles.value) {
    error.value = `Maximum ${maxFiles.value} images allowed`
    emit('error', error.value)
    return
  }
  
  // Create image files with previews
  const newImageFiles: ImageFile[] = imageFiles.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    isExisting: false
  }))
  
  files.value.push(...newImageFiles)
  emitFiles()
}

const removeFile = (index: number) => {
  // Revoke the preview URL to free memory (only for new files)
  if (!files.value[index].isExisting) {
    URL.revokeObjectURL(files.value[index].preview)
  }
  files.value.splice(index, 1)
  error.value = ''
  emitFiles()
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Cleanup previews when component is unmounted
import { onUnmounted } from 'vue'
onUnmounted(() => {
  files.value.forEach(file => {
    if (!file.isExisting) {
      URL.revokeObjectURL(file.preview)
    }
  })
})
</script> 