<script setup lang="ts">
import Stats from "@/component/homepage/Stats.vue";
import HorizontalScroll from "@/components/HorizontalScroll.vue";
import PhotoCard from "@/components/PhotoCard.vue";
import ServerRequest from "@/utils/request";
import type { AcceptPhoto } from "@/utils/type/photo";
import { onMounted, ref } from "vue";

const headPhoto = ref<AcceptPhoto | null>(null);
const randomPhotos = ref<AcceptPhoto[]>([]);

onMounted(async () => {
  const randomPhotosReq = new ServerRequest("GET", `/website?type=random`);
  randomPhotosReq.success = () => {
    const photos = randomPhotosReq.getData();
    headPhoto.value = photos.shift();
    randomPhotos.value = photos;
  };
  await randomPhotosReq.send();
});
</script>

<template>
  <div class="global-container flex flex-col gap-6">
    <div class="grid lg:grid-cols-2 gap-4 max-lg:gap-8">
      <div class="shrink-0 flex flex-col justify-end gap-4 max-lg:gap-8">
        <div class="flex flex-col gap-2 max-lg:gap-4 text-toga-dark">
          <div class="flex flex-col gap-1 text-lg tracking-wide">
            <h1>TOGAPhotos</h1>
            <div class="flex flex-col gap-1 md:text-2xl">
              <div>是一个由航空爱好者发起和维护的图库项目</div>
              <div>我们诚挚的欢迎每一位新用户的到来</div>
              <div>你们的支持是图库继续发展的最大动力</div>
            </div>
          </div>
          <div
            class="flex gap-8 select-none *:w-fit *:md:text-lg *:px-5 *:md:px-7 *:py-1 *:border-1 *:border-toga *:rounded-full *:transition-all *:duration-250 *:hover:text-white *:hover:font-bold *:hover:bg-toga"
          >
            <a target="_blank" href="https://blog.togaphotos.com/">关于我们</a>
            <a target="_blank" href="https://guide.togaphotos.com/">上传指南</a>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:max-lg:grid-cols-4 gap-4">
          <Stats />
        </div>
      </div>
      <div class="w-full flex flex-col gap-4">
        <PhotoCard
          v-if="headPhoto"
          class="mt-auto w-full"
          v-bind="{ ...(headPhoto as AcceptPhoto), highQuality: true }"
        />
      </div>
    </div>
    <HorizontalScroll :bleeding="true" :autoScroll="true">
      <PhotoCard
        v-for="photo in randomPhotos"
        v-bind="photo"
        class="w-56.5 sm:w-60 lg:w-75"
      />
    </HorizontalScroll>
  </div>
</template>

<style scoped></style>
