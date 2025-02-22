<script setup lang="ts">
import {type CSSProperties, onMounted, ref} from "vue";
import {STATIC_RESOURCE_URL} from "@/config";
import serverRequest from "@/utils/request";

const headPhotoList = ref<PhotoInfo[]>([])
const currentImgIndex = ref(2)

const headPhotoReq = new serverRequest('GET', `/website`);
headPhotoReq.success = () => {
  headPhotoList.value = headPhotoReq.getData('homepageInfo', 'randomPhotoList');
  console.log(headPhotoList.value)
}

onMounted(()=>{
  headPhotoReq.send()
})

function processHeadPhoto(imgId:number):CSSProperties{
  return {
    backgroundImage: `url(${STATIC_RESOURCE_URL}/photos/${imgId}.jpg)`,

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
  margin: 50px 0 36px 0;
}
 .img-box{
  width: 100%;
  height: 100%;
 }
 .el-carousel__item {
  height: 500px !important;
 }
@media only screen and (max-width: 701px) {
  .img{
    width: 80vw;
    /* height: 25vmin!important; */
  }
}

@media only screen and (min-width: 701px) {
  .img{
    height: 25vmin;
    width: 40vw;
    /* height: 400px !important; */
  }
}
.img{
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center center;
}
</style>