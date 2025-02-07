<script setup lang="ts">
import {onMounted, ref} from "vue";
import serverRequest from "@/utils/request";
import TransparentButton from "@/components/TransparentButton.vue";
import PhotoBox from "@/components/photo/PhotoBox.vue"
import Carousel from "@/components/photo/Carousel.vue";

const headPhotoList = ref<PhotoInfo[]>([])
const currentImgIndex = ref(2)

const headPhotoReq = new serverRequest('GET', `/website`);
headPhotoReq.success = () => {
  headPhotoList.value = headPhotoReq.getData('homepageInfo', 'randomPhotoList');
}

onMounted(()=>{
  headPhotoReq.send()
})
</script>

<template>
  <div class="first-screen-background">
    <div class="head-title head-title-container">
        <h3>加入TOGAPhotos</h3>
        <h3>与广大航空爱好者分享你的作品</h3>
        <TransparentButton :isWhite="true"></TransparentButton>
      </div>
    <div class="photo-container">
        <div class="photo-item" v-for="photoInfo in headPhotoList.slice(0, 4)" :key="photoInfo.id">
            <PhotoBox :photoInfo="photoInfo" :isMobile="true"></PhotoBox>
        </div>
    </div>
  </div>
</template>

<style scoped>
.first-screen-background{
  width: 100%;
  height: auto;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  font-size: 2rem;
  padding: 4.5rem 2rem;
}
.photo-container{
  /* background-color: red; */
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.photo-item{
    flex: 1 1 45%;
    min-width: 7.5rem;
    /* width: 45%; */
    max-width: 30rem;
}
@media (min-width: 768px) {
  .photo-item {
    flex: 1 1 22%; /* 设置项目宽度为22%，适合1*4布局 */
  }
}
.head-title-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem;
}
.head-title-container h3{
  color: #FFFFFF;
  font-size: 2rem;
  font-weight: 700;
}
@media (max-width: 768px) {
  .head-title-container h3 {
    font-size: 1.5rem;
  }
}
@media (max-width: 450px) {
  .head-title-container h3 {
    font-size: 1.3rem;
  }
}
@media (max-width: 390px) {
  .head-title-container h3 {
    font-size: 1.1rem;
  }
}
</style>