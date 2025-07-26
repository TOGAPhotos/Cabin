<script setup lang="ts"></script>

<template>
  <div
    class="px-4 py-4 flex gap-3 bg-white rounded-lg shadow-md text-shadow-text-primary"
  >
    <div class="max-md:pt-1 size-6 md:size-8">
      <slot name="icon" />
    </div>
    <div class="flex flex-col gap-1">
      <div class="text-lg font-bold">
        <slot name="title" />
      </div>
      <div v-if="$slots.content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
