<script setup lang="ts">
// const { user } = defineProps<{ user: UserInfo }>();

// const headPhotoList = ref<AcceptPhoto[]>([]);
// onMounted(async () => {
//   const headPhotoReq = new ServerRequest("GET", `/website?type=random`);
//   headPhotoReq.success = () => {
//     headPhotoList.value = headPhotoReq.getData();
//   };
//   await headPhotoReq.send();
// });
</script>

<template>
  <div class="relative w-screen max-md:pt-18 mx-auto bg-toga overflow-clip">
    <div
      class="absolute z-20 max-md:h-1/2 h-1/3 left-1/2 -translate-x-1/2 max-md:top-16 top-0 w-full bg-gradient-to-b from-toga"
    />
    <div class="relative mx-auto max-w-[108rem] max-md:blur-[1px]">
      <div
        class="md:hidden absolute z-10 h-full w-2/3 left-0 top-0 md:translate-x-[133%] bg-gradient-to-r from-toga"
      />
      <div
        class="hidden md:block absolute z-10 h-full w-1/4 left-0 top-0 md:translate-x-[133%] bg-gradient-to-r from-toga"
      />
      <img
        class="md:hidden mx-auto w-full select-none"
        src="https://cos-0688-tp-cdn.794td.cn/photos/2359.jpg"
        alt="Boeing 777X - Shot by Baigiver-0764"
        draggable="false"
      />
      <img
        class="hidden md:block mx-auto w-full translate-x-1/3 select-none"
        src="https://cos-0688-tp-cdn.794td.cn/toga-banner-777x.jpg"
        alt="Boeing 777X - Shot by Baigiver-0764"
        draggable="false"
      />
      <div
        class="absolute z-10 h-full w-1/3 -right-0.5 top-0 translate-x-full bg-gradient-to-l from-toga"
      />
    </div>
    <div
      class="absolute z-30 top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/2 pt-16 w-full flex flex-col justify-center"
    >
      <div class="global-container flex">
        <div class="md:mt-16 py-8 flex flex-col gap-4 w-fit text-white">
          <h1>加入TOGAPhotos</h1>
          <h2>与广大航空爱好者分享你的作品</h2>
          <a
            href="/upload"
            class="md:backdrop-blur-xs w-fit text-lg px-7 py-2 border-1 border-white rounded-full text-white transition-all duration-250 hover:text-black hover:font-bold hover:bg-white"
            >现在上传</a
          >
          <small>封面摄影师 - @Baigiver-0764</small>
        </div>
      </div>
    </div>
    <div
      class="absolute z-20 h-2/5 left-1/2 -translate-x-1/2 bottom-0 w-full bg-gradient-to-t from-toga via-30% via-toga"
    />
  </div>
  <!--  <img
    class="w-full"
    src="https://cos-0688-tp-cdn.794td.cn/photos/2359.jpg"
    alt=""
  />
  <div class="z-99 content-box first-screen-content">
    <div class="head-title head-title-container">
      <h3>加入TOGAPhotos</h3>
      <h3>与广大航空爱好者分享你的作品</h3>
      <TransparentButton :isWhite="true"></TransparentButton>
      <p class="copyright">PHOTO BY @Baigiver-0764</p>
    </div>
    <div class="head-photo-container" v-if="headPhotoList.length > 0">
      <div class="top-photo-container">
        <PhotoBox :photoInfo="headPhotoList[0]"></PhotoBox>
      </div>
      <Carousel :photoList="headPhotoList.slice(1)"></Carousel>
    </div>
  </div>-->
</template>

<style scoped></style>
