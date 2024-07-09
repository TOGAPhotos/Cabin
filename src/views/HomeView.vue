<script setup lang="ts">

import {onMounted, ref} from "vue";
import {BottomLoader} from '@/utils/bottomLoader';
import serverRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";
import {ElNotification} from "element-plus";
import StatisticInfoBox from "@/components/StatisticInfoBox.vue";
import HeadPhoto from "@/components/HeadPhoto.vue";
import Activity from "@/components/Activity.vue";
import type {PhotoInfo} from "@/utils/type/photo";

const photoList = ref<PhotoInfo[]>([]);


const photoListReq = new serverRequest('GET', "/photos?lastId=-1");
photoListReq.success = () => photoList.value = photoListReq.getData()

const notamReq = new serverRequest('GET', "/notam");
notamReq.success = () => {
  const notam = {
    title: notamReq.getData('title'),
    id: notamReq.getData('id'),
    content: notamReq.getData('content'),
  }
  const readNotam = sessionStorage.getItem('read_notam') || -1;
  if (notam.title === "NOTAM CLSD" || notam.id === Number(readNotam)) {
    return;
  }
  ElNotification({
    title: notam.title,
    message: notam.content,
    offset: 64,
    duration: 5000,
    onClose: () => sessionStorage.setItem('read_notam', `${notam.id}`)
  })
}

const bottomLoad = new BottomLoader(async () => {
  if (!photoList.value) {
    return;
  }
  const lastImgId = photoList.value[photoList.value.length - 1]['id'];
  const appendListReq = new serverRequest('GET', `/photos?lastId=${lastImgId}`,);
  appendListReq.success = () => photoList.value = photoList.value?.concat(appendListReq.getData())
  await appendListReq.send();
})

onMounted(() => {
  Promise.allSettled([
    photoListReq.send(),
    notamReq.send(),
  ])
})


</script>
<template>
  <div>
    <div class="top">
      <HeadPhoto class="head-photo"/>
      <div class="top-side">
        <Activity/>
        <StatisticInfoBox/>
      </div>


    </div>


    <div class="content-box">
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
    </div>
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