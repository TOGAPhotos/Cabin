<script setup lang="ts">

import {onMounted, ref, inject, type Ref} from "vue";
import {ElNotification} from "element-plus";

import FirstScreen from "@/component/firstScreen/FirstScreen.vue";
import FirstScreenMobile from "@/component/firstScreen/FirstScreenMobile.vue";

import StatisticInfoBox from "@/component/firstScreen/StatisticInfoBox.vue";
import NewPhotos from "@/components/NewPhotos.vue";

import {BottomLoader} from '@/utils/bottom-loader';
import ServerRequest from "@/utils/request";
import Device from "@/utils/device";

import useUserInfoStore from "@/stores/userInfo";

import type {ThumbnailInfo} from "@/utils/type/photo";

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
  Promise.allSettled([
    photoListReq.send(),
    notamReq.send(),
  ])
})


</script>
<template>
  <div>
    <FirstScreen v-if="Device.isDesktop()" />
    <FirstScreenMobile v-else/>
    <StatisticInfoBox/>
    <NewPhotos />
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