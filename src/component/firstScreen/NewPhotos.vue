<script setup lang="ts">
import ServerRequest from "@/utils/request";
import { onMounted, ref } from "vue";

import PhotoCard from "@/components/PhotoCard.vue";
import type { AcceptPhoto } from "@/utils/type/photo";

const photoList = ref<AcceptPhoto[]>([]);

onMounted(async () => {
  const photoListReq = new ServerRequest("GET", "/website?type=photos");
  photoListReq.success = () => {
    photoList.value = photoListReq.getData();
  };
  await photoListReq.send();
});
</script>

<template>
  <div class="global-container">
    <div class="flex flex-col gap-8">
      <h2>最新图片</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PhotoCard v-for="photo in photoList" v-bind="photo" :key="photo.id" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
