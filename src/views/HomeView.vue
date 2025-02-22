<script setup lang="ts">

<<<<<<< HEAD
import {onMounted, ref} from "vue";
import {BottomLoader} from '@/utils/bottom-loader';
import ServerRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";
import {ElNotification} from "element-plus";
import StatisticInfoBox from "@/components/StatisticInfoBox.vue";
import HeadPhoto from "@/component/HeadPhoto.vue";
import Activity from "@/components/Activity.vue";
import type {ThumbnailInfo} from "@/utils/type/photo";
import useUserInfoStore from "@/stores/userInfo";
=======
import {onMounted, ref, inject, type Ref} from "vue";
import FirstScreen from "@/components/firstScreen/FirstScreen.vue";
import FirstScreenMobile from "@/components/firstScreen/FirstScreenMobile.vue";
import {BottomLoader} from '@/utils/bottomLoader';
import serverRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";
import {ElNotification} from "element-plus";
import StatisticInfoBox from "@/components/StatisticInfoBox.vue";
import NewPhotos from "@/components/NewPhotos.vue";

const screenWidth = inject("screenWidth") as Ref<number>;
>>>>>>> 2601dba578bd17b829cf21d7b0198add4980b953

const localUserInfo = useUserInfoStore();
const photoList = ref<ThumbnailInfo[]>([]);


const photoListReq = new ServerRequest('GET', "/photos?lastId=-1");
photoListReq.success = () => photoList.value = photoListReq.getData()

const notamReq = new ServerRequest('GET', "/notam");
notamReq.success = () => {
  const notam = {
    title: notamReq.getData('title'),
    id: notamReq.getData('id'),
    content: notamReq.getData('content'),
  }
  if (notam.title === "NOTAM CLSD" || notam.id === localUserInfo.notam) {
    return;
  }
  ElNotification({
    title: notam.title,
    message: notam.content,
    offset: 64,
    duration: 5000,
    onClose: () => localUserInfo.notam = notam.id
  })
}

const bottomLoad = new BottomLoader(async () => {
  if (!photoList.value) {
    return;
  }
  const lastImgId = photoList.value[photoList.value.length - 1]['id'];
  const appendListReq = new ServerRequest('GET', `/photos?lastId=${lastImgId}`,);
  appendListReq.success = () => photoList.value = photoList.value?.concat(appendListReq.getData())
  await appendListReq.send();
},4)

onMounted(() => {
  console.log('-----------------', screenWidth.value)
  Promise.allSettled([
    photoListReq.send(),
    notamReq.send(),
  ])
})


</script>
<template>
  <div>
<<<<<<< HEAD
    <div class="top">
      <HeadPhoto class="head-photo"/>
      <div class="top-side">
        <Activity/>
        <StatisticInfoBox/>
      </div>


    </div>

=======
    <FirstScreen v-if="screenWidth >= 1024" />
    <FirstScreenMobile v-else/>
    <!--    <Activity/>-->
    <StatisticInfoBox/>
    <NewPhotos />
>>>>>>> 2601dba578bd17b829cf21d7b0198add4980b953

    <!-- <div class="content-box">
      <div class="content-box-title">
        <h2>最新图片</h2>
      </div>
      <div class="content-box-main">
        <Thumbnail v-for="photo in photoList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.ac_reg"
                   :airline="photo.airline"
                   :username="photo.username"
                   :airType="photo.ac_type"
        />
      </div>
    </div> -->

  </div>
</template>

<style scoped>
@media only screen and (max-width: 701px) {
  .head-photo{
    width: 100%;
  }
  .top-side{
    width: 100%;
  }
}

@media only screen and (min-width: 701px) {
  .head-photo{
    width: 60%;
  }
  .top-side{
    width: 30%;
  }
}

.top{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

}
</style>