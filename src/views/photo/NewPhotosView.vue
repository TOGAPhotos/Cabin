<script setup lang="ts">
import PhotoCard from "@/components/PhotoCard.vue";
import ServerRequest from "@/utils/request";
import type { AcceptPhoto } from "@/utils/type/photo";
import { onMounted, ref } from "vue";

const photoList = ref<AcceptPhoto[]>([]);
const loading = ref(true);

onMounted(async () => {
  const photoListReq = new ServerRequest("GET", "/photos?take=100");
  photoListReq.success = () => {
    photoList.value = photoListReq.getData() as AcceptPhoto[];
  };
  await photoListReq.send();
  loading.value = false;
});
</script>

<template>
  <div class="global-container py-10 flex flex-col gap-6">
    <div class="flex flex-col gap-2 max-lg:gap-4 text-toga-dark">
      <div class="flex flex-col gap-1 text-lg tracking-wide">
        <h2>最新图片</h2>
        <div class="flex flex-col gap-1 md:text-2xl">
          <div>浏览社区最新上传并通过审核的高质量航空摄影作品</div>
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="animate-pulse flex flex-col w-full h-full bg-toga-darker rounded-lg overflow-clip"
        >
          <div class="w-full aspect-[2/1] bg-gray-500/50"></div>
          <div class="h-full relative px-2 py-1.5">
            <div
              class="w-full h-full flex flex-col justify-between text-xs gap-1.5"
            >
              <div class="h-3 w-2/3 bg-gray-500/50 rounded-full"></div>
              <div class="flex gap-2 items-baseline justify-between">
                <div class="h-3 w-1/4 bg-gray-500/50 rounded-full"></div>
                <div class="h-3 w-1/3 bg-gray-500/50 rounded-full"></div>
              </div>
              <div class="flex gap-2 items-baseline justify-between">
                <div class="h-4 w-1/2 bg-gray-500/50 rounded-full"></div>
                <div class="h-3 w-1/3 bg-gray-500/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col gap-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PhotoCard
            v-for="photo in photoList"
            v-bind="photo"
            :key="photo.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
