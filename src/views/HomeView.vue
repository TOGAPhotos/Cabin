<script setup lang="ts">

import {onMounted, ref} from "vue";
import {BottomLoader} from '@/utils/bottomLoader';
import serverRequest from "@/utils/request";
import Thumbnail from "@/components/Thumbnail.vue";
import {ElNotification} from "element-plus";
import StatisticInfoBox from "@/components/StatisticInfoBox.vue";
import HeadPhoto from "@/components/HeadPhoto.vue";

const photoList = ref<PhotoInfo[]>([]);


const photoListReq = new serverRequest('GET', "/photos/full?lastId=-1");
photoListReq.success = () => photoList.value = photoListReq.getData('data')

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
  const appendListReq = new serverRequest('GET', `/photos/full?lastId=${lastImgId}`,);
  appendListReq.success = () => photoList.value = photoList.value?.concat(appendListReq.getData('data'))
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
    <HeadPhoto/>
    <!--    <Activity/>-->
    <StatisticInfoBox/>

    <div class="content-box">
      <div class="content-box-title">
        <h2>最新图片</h2>
      </div>
      <div class="content-box-main">
        <Thumbnail v-for="photo in photoList" :key="photo.id"
                   :id="photo.id"
                   :reg="photo.reg"
                   :airline="photo.airline"
                   :username="photo.username"
                   :airType="photo.airtype"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>