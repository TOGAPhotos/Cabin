<script setup lang="ts">
import {onMounted, ref } from "vue";
import ServerRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";

import type { AcceptPhoto } from "@/utils/type/photo";

const photoList = ref<AcceptPhoto[]>([]);
const photoListReq = new ServerRequest('GET', "/website?type=photos");
photoListReq.success = () => photoList.value = photoListReq.getData()

onMounted(async () => {
    await photoListReq.send();
})
</script>

<template>
    <div class="content-box newphotos-box">
      <div class="content-box-title">
        <h2>最新图片</h2>
      </div>
      <div class="content-box-main newphotos-photolist">
        
        <Thumbnail v-for="photo in photoList" :key="photo.id"
                    class="gallery-photo"
                   :id="photo.id"
                   :reg="photo.ac_reg"
                   :airline="photo.airline_cn || photo.airline_en"
                   :username="photo.username"
                   :airType="photo.ac_type"
        />
      </div>
    </div>
</template>

<style scoped>
.newphotos-photolist{
    max-width: var(--max-width);
    padding: 2rem 0rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
</style>