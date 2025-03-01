<script setup lang="ts">
import {onMounted, ref} from "vue";
import ServerRequest from "@/utils/request";
import TransparentButton from "@/component/firstScreen/TransparentButton.vue";
import PhotoBox from "@/component/firstScreen/PhotoBox.vue"
import Carousel from "@/component/firstScreen/Carousel.vue";
import { DArrowLeft } from "@element-plus/icons-vue";
import type { AcceptPhoto } from "@/utils/type/photo";

const firstPageBlock = ref<HTMLElement | null>(null)
const nextScreenArrow = ref<HTMLElement | null>(null)

const headPhotoList = ref<AcceptPhoto[]>([])
const currentImgIndex = ref(2)

const headPhotoReq = new ServerRequest('GET', `/website`);
headPhotoReq.success = () => {
  headPhotoList.value = headPhotoReq.getData('randomPhotoList');
}

onMounted(()=>{
  if(firstPageBlock.value && nextScreenArrow.value){
    const blockBottom = firstPageBlock.value.getBoundingClientRect().bottom;
    const scrollTop = window.scrollY || window.pageYOffset;
    nextScreenArrow.value.addEventListener('click', () => {
      window.scrollTo({
        top: blockBottom + scrollTop,
        behavior: 'smooth'
      })
    })
  }
  headPhotoReq.send()
})
</script>

<template>
  <div class="first-screen-background" ref="firstPageBlock">
    <img src="@/assets/first-screen-bg.png" alt="" class="first-screen-bg">
    <div class="content-box first-screen-content">
      <div class="head-title head-title-container">
        <h3>加入TOGAPhotos</h3>
        <h3>与广大航空爱好者分享你的作品</h3>
        <TransparentButton :isWhite="true"></TransparentButton>
        <p class="copyright">PHOTO BY @SHAskylens</p>
      </div>
      <div class="head-photo-container" v-if="headPhotoList.length > 0">
        <div class="top-photo-container" >
          <PhotoBox :photoInfo="headPhotoList[0]"></PhotoBox>
        </div>
        <Carousel :photoList="headPhotoList.slice(1)"></Carousel>
      </div>
    </div>
    <div class="icon" ref="nextScreenArrow">
      <DArrowLeft />
    </div>
  </div>
</template>

<style scoped>
.first-screen-background{
  width: 100%;
  height: 100vh;
  background-color: #F7F8FA;
  font-size: 2rem;
  z-index: -1;
}
.first-screen-background::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0) 100%);
}
.first-screen-bg{
  width: 100%;
  height: 100%;
  object-fit: cover;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%);
  z-index: -1;
}
.first-screen-content{
  position: absolute;
  top: 0;
  left: 50%;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  transform: translate(-50%, 0);
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.head-title-container{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.2rem;
}
.head-title-container h3{
  color: #FFFFFF;
  font-weight: 700;
}
.copyright{
  position: absolute;
  bottom: -18vw;
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.3);
}
.head-photo-container{
  box-sizing: border-box;
  background: 
  linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%);
  border-radius: 8px;
  width: 55%;
  max-height: 70%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.top-photo-container{
  width: 100%;
  height: auto;
  min-height: 150px;
  margin-bottom: 1rem;
}
.icon{
  position:absolute;
  bottom: 3%;
  left: 50%;
  transform: translateX(-50%) rotate(-90deg);
  z-index: 1;
  color: rgba(0, 0, 0, 0.5);
  width: 1.8rem;
  animation: floating 2.5s ease-in-out infinite;
  cursor: pointer;
}
@keyframes floating {
  0% {
    transform: translateY(0) rotate(-90deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(0.5rem) rotate(-90deg);
    opacity: 0.2;
  }
  100% {
    transform: translateY(0) rotate(-90deg);
    opacity: 0.5;
  }
}
</style>