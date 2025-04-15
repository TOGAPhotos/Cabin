<script setup lang="ts">
import { ElNotification } from "element-plus";
import { onMounted } from "vue";

import FirstScreen from "@/component/firstScreen/FirstScreen.vue";
import FirstScreenMobile from "@/component/firstScreen/FirstScreenMobile.vue";

import NewPhotos from "@/component/firstScreen/NewPhotos.vue";
import StatisticInfoBox from "@/component/firstScreen/StatisticInfoBox.vue";

import Device from "@/utils/device";
import ServerRequest from "@/utils/request";

import useUserInfoStore from "@/stores/userInfo";

const localUserInfo = useUserInfoStore();

const notamReq = new ServerRequest("GET", "/notam");
notamReq.success = () => {
  const notam = {
    title: notamReq.getData("title"),
    id: notamReq.getData("id"),
    content: notamReq.getData("content"),
  };
  if (notam.title === "NOTAM CLSD" || notam.id === localUserInfo.notam) {
    return;
  }
  ElNotification({
    title: notam.title,
    message: notam.content,
    offset: 64,
    duration: 5000,
    onClose: () => (localUserInfo.notam = notam.id),
  });
};

onMounted(() => {
  Promise.allSettled([notamReq.send()]);
});
</script>
<template>
  <div>
    <FirstScreen v-if="Device.isDesktop()" />
    <FirstScreenMobile v-else />
    <StatisticInfoBox />
    <NewPhotos />
  </div>
</template>

<style scoped>
@media only screen and (max-width: 701px) {
  .head-photo {
    width: 100%;
  }
  .top-side {
    width: 100%;
  }
}

@media only screen and (min-width: 701px) {
  .head-photo {
    width: 60%;
  }
  .top-side {
    width: 30%;
  }
}

.top {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
