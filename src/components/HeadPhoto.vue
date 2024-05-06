<script setup lang="ts">
import {type CSSProperties, onMounted, ref} from "vue";
import {staticResourceUrl} from "@/config";
import serverRequest from "@/utils/request";

const headPhotoList = ref<PhotoInfo[]>([])

const headPhotoReq = new serverRequest('GET', `/website`);
headPhotoReq.success = () => headPhotoList.value = headPhotoReq.getData('homepageInfo', 'randomPhotoList');

onMounted(()=>headPhotoReq.start())

function processHeadPhoto(imgId:number):CSSProperties{
  return {
    backgroundImage: `url(${staticResourceUrl}/photos/${imgId}.jpg)`,

  }
}
</script>

<template>
<div class="head-photo-box">
  <el-carousel type="card" class="head-photo" :autoplay="false" indicator-position="none">
    <el-carousel-item v-for="img in headPhotoList" :key="img.id">
      <a :href="'/photo/'+img.id">
        <div class="img" :style="processHeadPhoto(img.id)"></div>
      </a>
    </el-carousel-item>
  </el-carousel>
</div>
</template>

<style scoped>
.head-photo-box {
  margin: 0 0 36px 0;
}
@media only screen and (max-width: 701px) {
  .img{
    width: 80vw;
    height: 25vmin!important;
  }
}

@media only screen and (min-width: 701px) {
  .img{
    height: 25vmin!important;
  }
}
.img{
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

}
</style>