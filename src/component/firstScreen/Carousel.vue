<script setup lang="ts">
import PhotoBox from "@/component/firstScreen/PhotoBox.vue";
import type { AcceptPhoto } from "@/utils/type/photo";
import { ref } from "vue";
const props = defineProps<{
  photoList: AcceptPhoto[];
}>();

const container = ref<HTMLElement | null>(null);

const onMouseDown = (e: MouseEvent) => {};
</script>

<template>
  <div
    class="carousel-container"
    v-if="photoList.length > 1"
    ref="container"
    @mousedown="onMouseDown"
  >
    <div class="carousel-content">
      <div v-for="photoInfo in photoList" :key="photoInfo.id">
        <PhotoBox :photoInfo="photoInfo"></PhotoBox>
      </div>
      <div v-for="photoInfo in photoList" :key="photoInfo.id">
        <PhotoBox :photoInfo="photoInfo"></PhotoBox>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  height: auto;
  mask-image: linear-gradient(
    to left,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 2%,
    rgba(0, 0, 0, 1) 98%,
    rgba(0, 0, 0, 0) 100%
  );
}
.carousel-content {
  display: inline-flex;
  gap: 1rem;
  animation: scroll 25s linear infinite;
  animation-play-state: running;
}
.carousel-content:hover {
  animation-play-state: paused;
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
