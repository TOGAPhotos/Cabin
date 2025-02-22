<script setup lang="ts">
import {onMounted, ref} from "vue";
import ServerRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";
// import type {PhotoInfo} from "@/utils/type/photo";

const activeTabName = ref("first")
const headPhotoList = ref<AcceptPhoto[]>([])

const headPhotoReq = new ServerRequest('GET', `/website`);
headPhotoReq.success = () => {
  headPhotoList.value = headPhotoReq.getData( 'randomPhotoList');
  headPhotoList.value =  headPhotoList.value.splice(0,4)
}

onMounted(()=>headPhotoReq.send())

</script>

<template>
<div class="head-photo-box">
  <el-tabs v-model="activeTabName" class="tabs">
    <el-tab-pane label="随机图" name="first" class="tab">
      <Thumbnail
          class="thumbnail"
          v-for="img in headPhotoList" :key="img.id"
          :id="img.id"
          :reg="img.ac_reg"
          :airline="img.airline"
          :username="img.username"
          :airType="img.ac_type"
      />
    </el-tab-pane>
  </el-tabs>

</div>
</template>

<style scoped>

.head-photo-box {
  margin: 0 0 36px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.tabs{
  width: 100%;
}
.tab{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
@media only screen and (max-width: 701px) {
}

@media only screen and (min-width: 701px) {
  .head-photo-box .thumbnail{
    width: 48%;
  }
}

</style>