<script setup lang="ts">
import PhotoCard from "@/components/PhotoCard.vue";
import ServerRequest from "@/utils/request";
import type { AcceptPhoto } from "@/utils/type/photo";
import { onMounted, ref } from "vue";
const photoList = ref<AcceptPhoto[]>([]);
onMounted(async () => {
  const photoListReq = new ServerRequest("GET", "/photos?type=ScreenerChoice");
  photoListReq.success = () => {
    const d = photoListReq.getData() as AcceptPhoto[];
    photoList.value = d.slice(0, Math.min(d.length - (d.length % 4), 8));
  };
  await photoListReq.send();
});
</script>

<template>
  <div class="global-container" v-if="photoList.length >= 4">
    <div class="flex flex-col gap-8">
      <h2>编辑精选</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <PhotoCard v-for="photo in photoList" v-bind="photo" :key="photo.id" />
      </div>
    </div>
    <div class="pt-4">
      <ElButton type="text">
        <router-link to="/editorChoice">查看全部编辑精选 &gt;</router-link>
      </ElButton>
    </div>
  </div>
</template>

<style scoped></style>
