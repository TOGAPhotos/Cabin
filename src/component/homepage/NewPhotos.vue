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
    <div class="flex flex-col gap-6">
      <div class="py-0">
        <h2 class="py-0">最新图片</h2>
        <ElButton type="text">
          <router-link to="/newPhotos">查看全部最新图片 &gt;</router-link>
        </ElButton>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PhotoCard v-for="photo in photoList" v-bind="photo" :key="photo.id" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
